import * as ed25519 from '@noble/ed25519';
import bs58 from 'bs58';

import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { NonceAccount } from "../accounts/NonceAccount";
import { protoToAccountType, TimelockAccount } from "../accounts/TimelockAccount";
import { Environment } from "./Environment";
import { getCommitmentPda, getCommitmentVaultPda } from "./Commitment";
import { getKREMemoInstruction, compileMessage, signTransaction } from '../utils';
import { ToQuarks, sha256, FromQuarks } from '../utils';

import * as api from "../grpc/transaction/v2/transaction_service";

const DefaultUpgradeReqLimit = 1;

export enum ActionType {
    Unknown = 0,
    OpenAccountAction,
    CloseEmptyAccountAction,
    CloseDormantAccountAction,
    NoPrivacyWithdrawAction,
    TemporaryPrivacyTransferAction,
    TemporaryPrivacyExchangeAction,
    PermanentPrivacyUpgradeAction
}

export const TransactionFeeByActionType: Map<ActionType, number> = new Map([
    [ActionType.Unknown, Number.POSITIVE_INFINITY],
    [ActionType.OpenAccountAction,                   5_000],
    [ActionType.CloseEmptyAccountAction,            10_000],
    [ActionType.CloseDormantAccountAction,          10_000],
    [ActionType.NoPrivacyWithdrawAction,            10_000],
    [ActionType.TemporaryPrivacyTransferAction,      5_000], // (Assuming an upgrade follows)
    [ActionType.TemporaryPrivacyExchangeAction,      5_000], // (Assuming an upgrade follows)
    [ActionType.PermanentPrivacyUpgradeAction,      10_000],
]);

export const TransactionCountByActionType: Map<ActionType, number> = new Map([
    [ActionType.Unknown, Number.POSITIVE_INFINITY],
    [ActionType.OpenAccountAction,                       1],
    [ActionType.CloseEmptyAccountAction,                 1],
    [ActionType.CloseDormantAccountAction,               1],
    [ActionType.NoPrivacyWithdrawAction,                 1],
    [ActionType.TemporaryPrivacyTransferAction,          2], // AmCondMb + Mb
    [ActionType.TemporaryPrivacyExchangeAction,          2], // AmCondMb + Mb
    [ActionType.PermanentPrivacyUpgradeAction,           1],
]);

export const SignatureCountByActionType: Map<ActionType, number> = new Map([
    [ActionType.Unknown, Number.POSITIVE_INFINITY],
    [ActionType.OpenAccountAction,                       1], // Subsidizer only
    [ActionType.CloseEmptyAccountAction,                 2],
    [ActionType.CloseDormantAccountAction,               2],
    [ActionType.NoPrivacyWithdrawAction,                 2],
    [ActionType.TemporaryPrivacyTransferAction,          2],
    [ActionType.TemporaryPrivacyExchangeAction,          2],
    [ActionType.PermanentPrivacyUpgradeAction,           2],
]);

export interface Action {
    getType(): ActionType;
    setId(val: number):void;
    getId(): number;

    getNonceRequirement(): number;
    setNonces(list: NonceAccount[]): void;

    toProto(): Promise<api.Action>;
    updateFromServerResponse(params: api.ServerParameter) : Promise<void>;

    getTransaction(env: Environment): Promise<Transaction>;
    getSignatures(env: Environment): Promise<Uint8Array[]>;
}

export class BaseAction implements Action {
    id: number;
    nonces: NonceAccount[];

    constructor() {
        this.id = -1;
        this.nonces = [];
    }

    getType(): ActionType {
        throw new Error("Method not implemented on abstract class.");
    }

    setId(val: number) {
        this.id = val;
    }

    getId(): number {
        return this.id;
    }

    getNonceRequirement(): number {
        return 1;
    }

    setNonces(list: NonceAccount[]): void {
        this.nonces = [...list];
    }

    async setNonceFromServerResponse(params: api.ServerParameter): Promise<void> {
        // Set the nonce accounts for this action
        if (this.getNonceRequirement() > 0) {
            const nonces = params.nonces.map((nonce) => NonceAccount.fromProto(nonce));

            // Verify that this action has been provided the expected number of
            // nonces. Not all actions require the same amount of nonces.
            if (this.getNonceRequirement() != nonces.length) {
                new Error("Unexpected number of nonces");
            }

            // Set durable nonce values
            this.setNonces(nonces);
        }
    }

    async toProto(): Promise<api.Action> {
        throw new Error("Method not implemented on abstract class.");
    }

    async updateFromServerResponse(params: api.ServerParameter): Promise<void> {
        throw new Error("Method not implemented on abstract class.");
    }

    async getTransaction(env: Environment): Promise<Transaction> {
        throw new Error("Method not implemented on abstract class.");
    }

    async getSignatures(env: Environment): Promise<Uint8Array[]> {
        throw new Error("Method not implemented on abstract class.");
    }
}

export class OpenAccountAction extends BaseAction implements Action {
    account: TimelockAccount;

    constructor(account: TimelockAccount) {
        super();
        this.account = account;
    }

    getType(): ActionType {
        return ActionType.OpenAccountAction;
    }

    getNonceRequirement(): number {
        // Technically, this action does require a nonce, but the client does
        // not build the transaction.
        return 0;
    }

    async getTransaction(): Promise<Transaction> {
        // The client does not need to create this transaction. It will be
        // created by the server.
        throw new Error("Method not implemented.");
    }

    async getSignatures(): Promise<Uint8Array[]> {
        // The client does not need to sign this transaction. It will be signed
        // by the server.
        return [];
    }

    async updateFromServerResponse(params: api.ServerParameter): Promise<void> {
        // No-op
    }

    async toProto() : Promise<api.Action> {
        const openAccount = api.OpenAccountAction.fromJSON({
                accountType: this.account.accountType as number,
                owner: { value: this.account.getOwner().toBuffer(), },
                authority: { value: this.account.getAuthority().toBuffer(), },
                token: { value: this.account.getVault().toBuffer(), },
                index: this.account.getDerivationIndex(),
            } as api.OpenAccountAction
        );

        const buf = api.OpenAccountAction.encode(openAccount).finish();
        const sig = await ed25519.sign(buf, this.account.authority.secretKey.subarray(0, 32));

        // Verify the signature
        if (!await ed25519.verify(sig, buf, this.account.getAuthority().toBuffer())){
            throw new Error("Signature verification failed");
        }

        return api.Action.fromJSON({
            openAccount: {
                ...openAccount,
                authoritySignature: { value: Buffer.from(sig) },
            },
            id: this.getId()
        })
    }
}

export class CloseDormantAccountAction extends BaseAction implements Action {
    account: TimelockAccount;
    destinationTokenAccount: PublicKey;

    constructor(account: TimelockAccount, tokenAccount: PublicKey) {
        super();
        this.account = account;
        this.destinationTokenAccount = tokenAccount;
    }

    getType(): ActionType {
        return ActionType.CloseDormantAccountAction;
    }

    async updateFromServerResponse(params: api.ServerParameter): Promise<void> {
        this.setNonceFromServerResponse(params);
    }

    async getTransaction(env: Environment): Promise<Transaction> {
        const nonce = this.nonces[0];
        if (nonce == undefined) {
            throw new Error("Nonce is undefined");
        }

        const account = this.account;
        const ix = [
            nonce.getAdvanceNonceInstruction(env),
            getKREMemoInstruction(),
            account.getRevokeInstruction(env),
            account.getDeactivateInstruction(env),
            account.getWithdrawInstruction(env, this.destinationTokenAccount),
            account.getCloseInstruction(env),
        ];

        const tx = new Transaction();
        tx.add(...ix);
        tx.recentBlockhash = nonce.value;
        tx.feePayer = env.subsidizer;

        return tx;
    }

    async getSignatures(env: Environment): Promise<Uint8Array[]> {
        const tx = await this.getTransaction(env);
        const sig = await signTransaction(tx, this.account.authority);
        return [sig];
    }

    async toProto() : Promise<api.Action> {
        const closeDormantAccount = {
            accountType: this.account.accountType as number,
            authority: { value: this.account.getAuthority().toBuffer(), },
            token: { value: this.account.getVault().toBuffer(), },  
            destination: { value: this.destinationTokenAccount.toBuffer(), },
        } as api.CloseDormantAccountAction;

        return api.Action.fromJSON({ closeDormantAccount, id: this.getId() });
    }
}

export class CloseEmptyAccountAction extends BaseAction implements Action {
    account: TimelockAccount;
    maxDustAmount: number;

    constructor(account: TimelockAccount, maxDustAmount: number) {
        super();
        this.account = account;
        this.maxDustAmount = maxDustAmount;
    }

    getType(): ActionType {
        return ActionType.CloseEmptyAccountAction;
    }

    async updateFromServerResponse(params: api.ServerParameter): Promise<void> {
        this.setNonceFromServerResponse(params);
    }

    async getTransaction(env: Environment): Promise<Transaction> {
        const nonce = this.nonces[0];
        if (nonce == undefined) {
            throw new Error("Nonce is undefined");
        }

        const account = this.account;
        const ix = [
            nonce.getAdvanceNonceInstruction(env),
            account.getBurnDustInstruction(env, this.maxDustAmount),
            account.getCloseInstruction(env),
        ];

        const tx = new Transaction();
        tx.add(...ix);
        tx.recentBlockhash = nonce.value;
        tx.feePayer = env.subsidizer;

        return tx;
    }

    async getSignatures(env: Environment): Promise<Uint8Array[]> {
        const tx = await this.getTransaction(env);
        const sig = await signTransaction(tx, this.account.authority);
        return [sig];
    }

    async toProto() : Promise<api.Action> {
        const closeEmptyAccount = {
            accountType: this.account.accountType as number,
            authority: { value: this.account.getAuthority().toBuffer(), },
            token: { value: this.account.getVault().toBuffer(), },  
        } as api.CloseEmptyAccountAction;

        return api.Action.fromJSON({ closeEmptyAccount, id: this.getId() });
    }
}

export class NoPrivacyWithdrawAction extends CloseDormantAccountAction implements Action {
    amount: number;

    constructor(account: TimelockAccount, tokenAccount: PublicKey, amount: number) {
        super(account, tokenAccount);

        this.amount = amount;
    }

    getType(): ActionType {
        return ActionType.NoPrivacyWithdrawAction;
    }

    async toProto() : Promise<api.Action> {
        const noPrivacyWithdraw = {
            authority: { value: this.account.getAuthority().toBuffer(), },
            source: { value: this.account.getVault().toBuffer(), },  
            destination: { value: this.destinationTokenAccount.toBuffer(), },
            amount: ToQuarks(this.amount),
            shouldClose: true,
        } as api.NoPrivacyWithdrawAction;

        return api.Action.fromJSON({ noPrivacyWithdraw, id: this.getId() });
    }
}

export class TemporaryPrivacyTransferAction extends BaseAction implements Action {
    account: TimelockAccount;     // The source of funds.
    destination: PublicKey;       // The recipient of the payment.
    amount: number;               // The transfer amount.

    timestamp : number;           // The timestamp of the payment.

    intentId?: Buffer;            // A random nonce for the transaction. It is 
                                  // used to ensure the transcript hash cannot
                                  // be guessed unless you know this number.

    transcript?: Buffer;          // A hash of the payment transcript. It is 
                                  // computed from the *private* payment intent
                                  // details (the source, destination, amount,
                                  // timestamp, seed, rendezvous, exchange rate,
                                  // currency, etc.)

    treasury?: PublicKey;         // The treasury account that will be used.

    recentRoot?: PublicKey;       // A previous recent merkle root (unrelated to 
                                  // this action). Sort of similar to Solana's
                                  // recent blockhash with respect to its purpose.
                                  // This value serves as an anchor point on PDAs
                                  // associated with this payment.

    commitment?: PublicKey;       // A PDA that includes the transcript hash,
                                  // the destination, and the amount. But
                                  // critically, not the source address.

    commitmentVault?: PublicKey;  // A PDA to a token account that can only be
                                  // opened if the `Mb` transaction is played out.

    commitmentVaultBump?: number; // Bump for the commitmentVault account.

    
    constructor(
        source: TimelockAccount,
        destination: PublicKey,
        amount: number) {
        super();

        // You may also want to pass in the transcript or its hash. We're
        // keeping it simple here and this action will generate it for us.

        this.account = source;
        this.destination = destination;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    getType(): ActionType {
        return ActionType.TemporaryPrivacyTransferAction;
    }

    async handleServerResponse(treasury: Buffer, recentRoot: Buffer) : Promise<void> {
        this.treasury = new PublicKey(treasury);
        this.recentRoot = new PublicKey(recentRoot);

        // Get a hash of the *private* details of this move action
        const transcript = this.getTranscriptHash();

        // This PDA will be used to form the "condition for the cheque"
        const [commitment, ] = await getCommitmentPda(
            this.treasury,
            this.recentRoot.toBuffer(),
            transcript,
            this.destination,
            ToQuarks(this.amount),
        )

        // Where the funds will be sent to after the server has paid the
        // destination
        const [vault, vaultBump] = await getCommitmentVaultPda(
            this.treasury,
            commitment,
        )

        // We will need these values later to upgrade to a V2 transaction.
        this.commitment = commitment;
        this.commitmentVault = vault;
        this.commitmentVaultBump = vaultBump;
    }

    async updateFromServerResponse(data: api.ServerParameter): Promise<void> {
        await this.setNonceFromServerResponse(data);

        const params = data.temporaryPrivacyTransfer;
        if (params == undefined) {
            console.log(data);
            throw new Error("Invalid server response");
        }
        
        const { recentRoot, treasury } = params;
        if (recentRoot == undefined || treasury == undefined) {
            throw new Error("Invalid server response");
        }

        await this.handleServerResponse(treasury.value, recentRoot.value);
    }

    getTranscript() : string {
        // Generate a string of the payment intent that can be used to generate
        // a hash of the intent.

        const intentId = this.intentId;
        if (intentId == undefined) {
            throw new Error("IntentId is undefined");
        }

        // Matching the transcript format in the server.
        // https://github.com/code-wallet/code-server/blob/fa24f591a98c2a2f7686faa8f5e907442c533785/pkg/wallet/server/transaction/v2/action_handler.go#L970
        const transcript = [
            `receipt[${bs58.encode(intentId)}, ${this.getId()}]: `,
            `transfer ${ToQuarks(this.amount)} quarks `,
            `from ${this.account.vault.toBase58()} to ${this.destination.toBase58()}`,
        ];

        return transcript.join('');
    }

    getTranscriptHash() : Buffer {
        return sha256(Buffer.from(this.getTranscript()));
    }

    async getTransaction(env: Environment): Promise<Transaction> {
        // This is the conditional transaction that is used if we cannot upgrade to a V2 transaction.
        // AKA: the "Alice side" of the payment intent.

        const nonce = this.nonces[0];
        if (nonce == undefined) {
            throw new Error("Nonce is undefined");
        }

        if (this.commitmentVault == undefined) {
            throw new Error("Commitment vault is undefined. Have you called updateFromServerResponse()?");
        }

        // Create the conditional payment transaction
        const account = this.account;
        const ix = [
            nonce.getAdvanceNonceInstruction(env),
            getKREMemoInstruction(),

            // Note we're singing a TX that sends funds to a PDA account that
            // doesn't exist yet.
            // 
            // Important: The only way to create this destination account it is
            // for the server to generate a proof that it has indeed paid the
            // desired amount to the destination address. This is what makes
            // this transaction conditional.
            account.getTransferInstruction(env, this.commitmentVault, this.amount),
        ];

        const tx = new Transaction();
        tx.add(...ix);
        tx.recentBlockhash = nonce.value;
        tx.feePayer = env.subsidizer;

        return tx;
    }

    async getSignatures(env: Environment): Promise<Uint8Array[]> {
        const tx = await this.getTransaction(env);
        const sig = await signTransaction(tx, this.account.authority);
        return [sig];
    }

    async toProto() : Promise<api.Action> {
        const temporaryPrivacyTransfer = {
            authority: { value: this.account.getAuthority().toBuffer(), },
            source: { value: this.account.getVault().toBuffer(), },  
            destination: { value: this.destination.toBuffer(), },
            amount: ToQuarks(this.amount),
        } as api.TemporaryPrivacyTransferAction;

        return api.Action.fromJSON({ temporaryPrivacyTransfer, id: this.getId() });
    }
}

export class TemporaryPrivacyExchangeAction extends TemporaryPrivacyTransferAction implements Action {
    // Identical to the TemporaryPrivacyTransferAction except for the proto message

    getType(): ActionType {
        return ActionType.TemporaryPrivacyExchangeAction;   
    }

    async toProto() : Promise<api.Action> {
        const temporaryPrivacyExchange = {
            authority: { value: this.account.getAuthority().toBuffer(), },
            source: { value: this.account.getVault().toBuffer(), },  
            destination: { value: this.destination.toBuffer(), },
            amount: ToQuarks(this.amount),
        } as api.TemporaryPrivacyExchangeAction;

        return api.Action.fromJSON({ temporaryPrivacyExchange, id: this.getId() });
    }

    async updateFromServerResponse(data: api.ServerParameter): Promise<void> {
        await this.setNonceFromServerResponse(data);

        const params = data.temporaryPrivacyExchange;
        if (params == undefined) {
            console.log(data);
            throw new Error("Invalid server response");
        }
        
        const { recentRoot, treasury } = params;
        if (recentRoot == undefined || treasury == undefined) {
            throw new Error("Invalid server response");
        }

        await this.handleServerResponse(treasury.value, recentRoot.value);
    }
}


export class PermanentPrivacyUpgradeAction extends BaseAction implements Action {
    temporaryTransfer: TemporaryPrivacyTransferAction | TemporaryPrivacyExchangeAction;

    merkleRoot?: Buffer;                    // The merkle root of the commitment tree.
    merkleProof?: Buffer[];                 // A proof that the on-chain program has paid 
                                            // the original destination and the amount 
                                            // specified in the temporaryTransfer.

    newCommitment?: PublicKey;              // A right-most leaf node for a "block" in the tree
    newCommitmentVault?: PublicKey;         // The a PDA created for a "block" of commitments
    newCommitmentVaultBump?: number;

    newCommitmentTranscript?: Buffer;       // A hash of a completely unrelated transcript that
                                            // serves as an anchor point for this action. It is
                                            // used to validate that the server provided
                                            // newCommitment value is not malicious.

    newCommitmentAmount?: number;           // An amount that is unrelated to the
                                            // amount in the original action. This
                                            // is strictly used to validate the the
                                            // newCommitment is not malicious.

    newCommitmentDestination?: PublicKey;   // A destination that is unrelated to the 
                                            // destination in the original action. This
                                            // is strictly used to validate the the
                                            // newCommitment is not malicious.

    constructor(original: TemporaryPrivacyTransferAction | TemporaryPrivacyExchangeAction) {
        super();
        this.temporaryTransfer = original;
    }

    getType(): ActionType {
        return ActionType.PermanentPrivacyUpgradeAction;
    }

    static async fromUpgradeIntent(
        env: Environment,
        intent: api.UpgradeableIntent,
        actionIndex: number
    ) : Promise<PermanentPrivacyUpgradeAction> {

        // The data for the action we're trying to re-create
        const { 
            source, destination, amount, data, tx, blockhash, sig 
        } = await PermanentPrivacyUpgradeAction.parseUpgradeIntentProto(env, intent, actionIndex);

        const action = new TemporaryPrivacyTransferAction(source, destination, amount);
        action.setId(data.actionId);
        action.intentId = intent.id?.value

        // Recreating the server response that would have completed the action
        await action.updateFromServerResponse({
            actionId: data.actionId,
            nonces: [{
                nonce: { value: tx.instructions[0].keys[0].pubkey.toBuffer(), },
                blockhash: { value: bs58.decode(blockhash), },
            }],
            temporaryPrivacyTransfer: {
                treasury: intent.treasury,
                recentRoot: intent.recentRoot,
            },
        } as api.ServerParameter);
        
        // Next, we're going to reconstruct the transaction and validate
        // that the serialized message is the same.

        const localTx = await action.getTransaction(env);
        const localSig = await action.getSignatures(env);
        const localMsg = compileMessage(localTx);

        if (Buffer.compare(tx.serializeMessage(), localMsg.serialize()) != 0) {
            throw new Error("Invalid server response, transactionBlob does not match local transaction");
        }

        if (Buffer.compare(sig, localSig[0]) != 0) {
            throw new Error("Invalid server response, clientSignature does not match local signature");
        }

        return new PermanentPrivacyUpgradeAction(action);
    }

    static async parseUpgradeIntentProto(env: Environment, intent: api.UpgradeableIntent, actionIndex: number) {
        const data = intent.actions[actionIndex];

        const tx = Transaction.from(data.transactionBlob!.value);
        const sig = data.clientSignature!.value;
        const blockhash : string = tx.recentBlockhash!;

        if (data.sourceAccountType <= 0) {
            throw new Error("Invalid server response, sourceAccountType is unknown");
        }

        // Reconstruct the source account from the index and account type
        const sourceAccountType = protoToAccountType(data.sourceAccountType);
        const sourceDerivationIndex = data.sourceDerivationIndex;
        const source = await TimelockAccount.deriveFrom(env, sourceDerivationIndex, sourceAccountType);

        if (Buffer.compare(
            source.authority.publicKey.toBuffer(),
            tx.signatures[1].publicKey.toBuffer()) != 0) {
            throw new Error("Invalid server response, source signature address does not match derived address");
        }

        // At this point we know that our private keypair derived an account
        // address, at some point in the past, that signed the transaction and
        // we know that the signatures are valid. 
        const destination = new PublicKey(data.originalDestination?.value!);
        const amount = FromQuarks(data.originalAmount)

        return {
            source, destination, amount, data, tx, blockhash, sig 
        };
    }

    isValid() : boolean {
        // This function is used to verify a merkle proof. It returns true if
        // the temporary commitment hash can be proven to be a part of the
        // Merkle tree defined by the root hash. 
        
        // The proof is an array of sibling hashes, where each pair of leaves and
        // each pair of pre-images are assumed to be sorted. 

        if (this.merkleProof == undefined || this.merkleRoot == undefined) {
            throw new Error("Merkle proof is undefined. Have you called updateFromServerResponse()?");
        }
        if (this.temporaryTransfer.commitment == undefined) {
            throw new Error("Commitment is undefined. Is the temporary transfer action valid?");
        }

        const leaf = this.temporaryTransfer.commitment.toBuffer();
        const proof = this.merkleProof;
        const root = this.merkleRoot;

        let computed_hash = sha256(leaf);
        for (let proof_element of proof) {
            if (Buffer.compare(computed_hash, proof_element) <= 0) {
                // Hash(current computed hash + current element of the proof)
                computed_hash = sha256(Buffer.concat([computed_hash, proof_element]));
            } else {
                // Hash(current element of the proof + current computed hash)
                computed_hash = sha256(Buffer.concat([proof_element, computed_hash]));
            }
            //console.log(`verify(): Computed hash: ${computed_hash.toString('hex')}`);
        }

        // Check if the computed hash (root) is equal to the provided root
        return Buffer.compare(computed_hash, root) == 0;
    }

    async updateFromServerResponse(data: api.ServerParameter): Promise<void> {
        const params = data.permanentPrivacyUpgrade;
        if (params == undefined) {
            throw new Error("Invalid server response");
        }

        if (this.temporaryTransfer.treasury == undefined) {
            throw new Error("Treasury is undefined. Is the temporary transfer action valid?");
        }

        // Important: this transaction reuses the *same* durable nonce address
        // and value as the original AmCondMb transaction.
        this.setNonces(this.temporaryTransfer.nonces);

        // Pull out the parameters from the server response
        const { 
            merkleRoot,
            merkleProof,
            newCommitment,
            newCommitmentDestination,
            newCommitmentTranscript,
        } = params;

        // Check if we got any undefined values from the server.
        if (merkleRoot == undefined ||
            merkleProof == undefined ||
            newCommitment == undefined ||
            newCommitmentDestination == undefined ||
            newCommitmentTranscript == undefined) {
            throw new Error("Invalid server response");
        }

        this.merkleRoot = merkleRoot.value;
        this.merkleProof = merkleProof.map((x) => x.value);
        this.newCommitment = new PublicKey(newCommitment.value);
        this.newCommitmentAmount = params.newCommitmentAmount;
        this.newCommitmentDestination = new PublicKey(newCommitmentDestination.value);
        this.newCommitmentTranscript = newCommitmentTranscript.value;

        // Check if the provided commitment is tied to the given merkle root
        // (and thus the proof)
        const [commitment, ] = await getCommitmentPda(
            this.temporaryTransfer.treasury,
            this.merkleRoot,
            this.newCommitmentTranscript,
            this.newCommitmentDestination,
            this.newCommitmentAmount,
        )
        if (this.newCommitment?.equals(commitment) == false) {
            throw new Error("Invalid server response, the generated commitment does not match the server response");
        }

        // Check if the merkle proof itself is valid
        if (!this.isValid()) {
            throw new Error("Merkle proof is invalid. Is the server response correct?");
        }

        // If the proof is valid, we can upgrade the transaction to a V2
        // transaction. This will allow us to send the funds to a common
        // block vault rather than a PDA account that is tied to the
        // original Mb transaction.

        // We will need these values later to upgrade to a V2 transaction.
        const [vault, vaultBump] = await getCommitmentVaultPda(
            this.temporaryTransfer.treasury,
            this.newCommitment
        );

        this.newCommitmentVault = vault;
        this.newCommitmentVaultBump = vaultBump;
    }

    async getTransaction(env: Environment): Promise<Transaction> {
        const nonce = this.nonces[0];
        if (nonce == undefined) {
            throw new Error("Nonce is undefined");
        }

        if (this.newCommitmentVault == undefined) {
            throw new Error("Commitment vault is undefined. Have you called updateFromServerResponse()?");
        }

        // Create the conditional payment transaction
        const account = this.temporaryTransfer.account;
        const ix = [
            nonce.getAdvanceNonceInstruction(env),
            getKREMemoInstruction(),
            account.getTransferInstruction(env, this.newCommitmentVault, this.temporaryTransfer.amount),
        ];

        const tx = new Transaction();
        tx.add(...ix);
        tx.recentBlockhash = nonce.value;
        tx.feePayer = env.subsidizer;

        return tx;
    }

    async getSignatures(env: Environment): Promise<Uint8Array[]> {
        const tx = await this.getTransaction(env);
        const sig = await signTransaction(tx, this.temporaryTransfer.account.authority);
        return [sig];
    }

    async toProto() : Promise<api.Action> {
        const permanentPrivacyUpgrade = {
            actionId: this.temporaryTransfer.getId(),
        } as api.PermanentPrivacyUpgradeAction;

        return api.Action.fromJSON({ permanentPrivacyUpgrade, id: this.getId() });
    }
}

export async function getUpgradeReqProto(owner: Keypair, limit: number = DefaultUpgradeReqLimit)
    : Promise<api.GetPrioritizedIntentsForPrivacyUpgradeRequest> {

    const req = {
        owner: { value: owner.publicKey.toBuffer() },
        limit,
    } as api.GetPrioritizedIntentsForPrivacyUpgradeRequest;

    const buf = api.GetPrioritizedIntentsForPrivacyUpgradeRequest.encode(req).finish();
    const sig = await ed25519.sign(buf, owner.secretKey.subarray(0, 32));
    req.signature = { value: Buffer.from(sig) };

    return api.GetPrioritizedIntentsForPrivacyUpgradeRequest.fromJSON(req);
}
