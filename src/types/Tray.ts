import * as ed25519 from '@noble/ed25519';
import * as api from "../grpc/account/v1/account_service";

import { Keypair } from "@solana/web3.js";
import { AccountType, TimelockAccount } from "../accounts/TimelockAccount";
import { Action, CloseDormantAccountAction, OpenAccountAction } from "./Action";
import { Environment } from "./Environment";
import { SlotCount } from './Denomination';
import { Path } from '../utils';

export class Tray {
    env: Environment;
    incomingIndex: number;
    outgoingIndex: number;

    primary?: TimelockAccount;
    slots: TimelockAccount[];
    incoming: TimelockAccount[];
    outgoing: TimelockAccount[];

    constructor(env: Environment) {
        this.env = env;
        this.incomingIndex = 0;
        this.outgoingIndex = 0;

        this.slots = [];
        this.incoming = [];
        this.outgoing = [];
    }

    isInitialized() : boolean { 
        return this.primary != undefined && 
            this.slots.length > 0 && 
            this.incoming.length > 0 && 
            this.outgoing.length > 0;
    }

    async initialize(lastIncoming: number = 0, lastOutgoing: number = 0) : Promise<Action[]>{
        const env = this.getEnvironment();

        this.primary = await TimelockAccount.derivePrimary(env);

        for (let i = 0; i < SlotCount; i++) {
            const slot = (i + 4) as AccountType;
            const account = await TimelockAccount.deriveFrom(env, 0, slot);
            this.slots.push(account);
        }

        this.incomingIndex = lastIncoming;
        this.outgoingIndex = lastOutgoing;

        this.incoming.push(await TimelockAccount.deriveFrom(env, this.incomingIndex, AccountType.Incoming));
        this.outgoing.push(await TimelockAccount.deriveFrom(env, this.outgoingIndex, AccountType.Outgoing));

        // Matching what the server expects as far as order goes
        // https://github.com/code-wallet/code-server/blob/f3adf528501ba7dd6f691dd3abe2ff6170f7d5a6/pkg/wallet/server/transaction/v2/intent_handler.go#L91
        const all = [
            ...this.getAllIncomingAccounts(),
            ...this.getAllOutgoingAccounts(),
            ...this.getAllOrganizerAccounts(),
        ];

        // All accounts get a close dormant action, except the primary
        return [
            new OpenAccountAction(this.primary),
            ...all.map(account => [
                new OpenAccountAction(account),
                new CloseDormantAccountAction(account, this.primary!.getVault())
            ]).reduce((a, b) => a.concat(b), [])
        ];
    }

    getIncomingIndex() : number {
        return this.incomingIndex;
    }

    getOutgoingIndex() : number {
        return this.outgoingIndex;
    }

    getEnvironment() : Environment {
        return this.env;
    }

    getPrimaryTimelockAccount() : TimelockAccount {
        if (!this.isInitialized()) {
            throw new Error("State is not initialized");
        }
        return this.primary!;
    }

    getCurrentIncomingAccount() : TimelockAccount {
        if (!this.isInitialized()) {
            throw new Error("State is not initialized");
        }
        return this.incoming[this.incoming.length - 1];
    }

    getCurrentOutgoingAccount() : TimelockAccount {
        if (!this.isInitialized()) {
            throw new Error("State is not initialized");
        }
        // TODO: change this back to the last account once prettyPrint is fixed
        return this.outgoing[this.outgoing.length - 1];
    }

    getAllOrganizerAccounts() : TimelockAccount[] {
        if (!this.isInitialized()) {
            throw new Error("State is not initialized");
        }
        return this.slots;
    }

    getAllIncomingAccounts() : TimelockAccount[] {
        if (!this.isInitialized()) {
            throw new Error("State is not initialized");
        }
        return this.incoming;
    }

    getAllOutgoingAccounts() : TimelockAccount[] {
        if (!this.isInitialized()) {
            throw new Error("State is not initialized");
        }
        return this.outgoing;
    }

    getAllAccounts() : TimelockAccount[] {
        if (!this.isInitialized()) {
            throw new Error("State is not initialized");
        }
        return [
            this.primary!,
            ...this.incoming,
            ...this.outgoing,
            ...this.slots,
        ];
    }

    async newIncomingAccount() : Promise<TimelockAccount> {
        this.incomingIndex++;
        const account = await TimelockAccount.deriveFrom(this.env, this.incomingIndex, AccountType.Incoming);
        this.incoming.push(account);
        return account;
    }

    async newOutgoingAccount() : Promise<TimelockAccount> {
        this.outgoingIndex++;
        const account = await TimelockAccount.deriveFrom(this.env, this.outgoingIndex, AccountType.Outgoing);
        this.outgoing.push(account);
        return account;
    }

    async updateFromServer(res: api.GetTokenAccountInfosResponse) : Promise<void> {
        if (!this.isInitialized()) {
            throw new Error("State is not initialized, did you call initialize() first?");
        }

        if (res.result != api.GetTokenAccountInfosResponse_Result.OK) {
            throw new Error("Server response was not OK, cannot update state.");
        }

        const all = this.getAllAccounts();

        // Update the state of all accounts
        for (const account of all) {

            try {
                // This will throw an error if the account is not found, which is
                // what we want. If the server doesn't know about an account in our
                // state, and we have initialized, then something has gone wrong.
                account.updateFromServer(res);
            } catch (e) {
                console.warn(`Account ${account.address.toBase58()} not returned by server.`);
                //console.log(e);
            }
        }

        // Create accounts that the server knows about but we don't, for
        // example, if there is an older temporary account that still has funds
        // in it.
        for (const address of Object.keys(res.tokenAccountInfos)) {
            // Ignore the accounts that we just updated
            const found = all.find(a => a.getVault().toBase58() == address);
            if (found) {
                continue;
            }

            const info = res.tokenAccountInfos[address];
            if (info.accountType as number == AccountType.Incoming ||
                info.accountType as number == AccountType.Outgoing) {

                const account = await TimelockAccount.deriveFromServer(this.env, info);

                if (info.accountType as number == AccountType.Incoming) {
                    if (info.index > this.incomingIndex) {
                        this.incoming.push(account);
                    } else {
                        this.incoming.unshift(account); // insert at the beginning
                    }
                    continue;
                }

                if (info.accountType as number == AccountType.Outgoing) {
                    if (info.index > this.outgoingIndex) {
                        this.outgoing.push(account);
                    } else {
                        this.outgoing.unshift(account); // insert at the beginning
                    }
                    continue;
                }

                throw new Error(`Unexpected account type provided by server: ${info.accountType}, info: ${JSON.stringify(info)}`);
            }
        }
    }
}

export async function getAccountInfoRequestProto(owner: Keypair): Promise<api.GetTokenAccountInfosRequest> {
    const req = {
        owner: { value: owner.publicKey.toBuffer() },
    } as api.GetTokenAccountInfosRequest;

    const buf = api.GetTokenAccountInfosRequest.encode(req).finish();
    const sig = await ed25519.sign(buf, owner.secretKey.subarray(0, 32));
    req.signature = { value: Buffer.from(sig) };

    return api.GetTokenAccountInfosRequest.fromJSON(req);
}
