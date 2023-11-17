import BN from "bn.js";
import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as program from '../programs/timelock/src/timelock';
import { Environment } from "../types/Environment";
import { DefaultPath, Derive, FromQuarks, Path, sha256, ToQuarks } from "../utils";
import * as api from "../grpc/account/v1/account_service";
import * as common from "../grpc/common/v1/model";

// PDA parameters (do not change)
const version        = program.DataVersion.Version1,
      unlockDuration = 21, // 21 days
      prefixTimelock = "timelock_state",
      prefixVault    = "timelock_vault",
      unused         = PublicKey.default;

// Following grpc service definition
export enum AccountType {
    Unknown = 0,
    Primary,
    Incoming,
    Outgoing,
    Slot1, Slot2, Slot3, Slot4, Slot5, Slot6, Slot7,
}

// Following grpc service definition
export enum BalanceSource {
    // The account's balance could not be determined. This may be returned when
    // the data source is unstable and a reliable balance cannot be determined.
    Unknown = 0,

    // The account's balance was fetched directly from a finalized state on the
    // blockchain.
    Blockchain = 1,

    // The account's balance was calculated using cached values in Code. Accuracy
    // is only guaranteed when management_state is LOCKED.
    Cache = 2,
}

// Following grpc service definition
export enum ManagementState {
    // The state of the account is unknown. This may be returned when the
    // data source is unstable and a reliable state cannot be determined.
    Unknown = 0,

    // Code does not maintain a management state and won't move funds for this
    // account.
    None = 1,

    // The account is in the process of transitioning to the LOCKED state.
    Locking = 2,

    // The account's funds are locked and Code has co-signing authority.
    Locked = 3,

    // The account is in the process of transitioning to the UNLOCKED state.
    Unlocking = 4,

    // The account's funds are unlocked and Code no longer has co-signing
    // authority. The account must transition to the LOCKED state to have
    // management capabilities.
    Unlocked = 5,

    // The account is in the process of transitioning to the CLOSED state.
    Closing = 6,

    // The account has been closed and doesn't exist on the blockchain.
    // Subsequently, it also has a zero balance.
    Closed = 7,
}

export class TimelockAccount {
    owner: PublicKey;    // Parent account that derived this account
    authority: Keypair;  // Only the phone knows the private portion of the keypair.
    address: PublicKey;
    bump: number;
    vault: PublicKey;

    cachedBalance: bigint;
    balanceSource: BalanceSource;
    managementState: ManagementState;
    accountType: AccountType;
    derivationIndex : number;

    constructor(
        owner: PublicKey = unused,
        authority: Keypair = Keypair.generate(),
        address: PublicKey = unused,
        bump: number = 0,
        vault: PublicKey = unused,
        accountType: AccountType = AccountType.Unknown,
        derivationIndex : number = 0
    ) {
        this.owner = owner;
        this.address = address;
        this.bump = bump;
        this.vault = vault;
        this.authority = authority;
        this.accountType = accountType;
        this.derivationIndex = derivationIndex;

        this.cachedBalance = BigInt(0);
        this.balanceSource = BalanceSource.Unknown;
        this.managementState = ManagementState.Unknown;
    }

    getOwner() : PublicKey {
        // Returns the parent account that derived this account
        return this.owner;
    }

    getAuthority() : PublicKey {
        // Returns who gets to sign transactions for this account.
        return this.authority.publicKey;
    }

    getVault() {
        // Returns the location of the token account managed by this timelock
        return this.vault;
    }

    getDerivationIndex(): number {
        return this.derivationIndex;
    }

    getAccountType() : AccountType {
        return this.accountType;
    }

    getManagementState() : ManagementState {
        return this.managementState;
    }

    getBalanceSource() : BalanceSource {
        return this.balanceSource;
    }

    canUseForTransfer() : boolean {
        return true; // disabled for testing
        /*
        return this.managementState == ManagementState.LOCKED && 
        (
            this.balanceSource == BalanceSource.BLOCKCHAIN || 
            this.balanceSource == BalanceSource.CACHE
        );
        */
    }

    getCachedBalance(): bigint {
        return this.cachedBalance;
    }

    setCachedBalance(val: bigint) {
        this.cachedBalance = val;
    }

    updateFromServer(res: api.GetTokenAccountInfosResponse) {
        // Check if the server response includes this account.
        const vault = this.getVault().toBase58();
        const info = res.tokenAccountInfos[vault];
        if (info == undefined) {
            throw new Error(`Server did not return info for account "${vault}"`);
        }

        if (info.authority && Buffer.compare(info.authority.value, this.getAuthority().toBuffer())) {
            throw new Error(`Server returned info for account "${vault}" with incorrect authority`);
        }

        if (info.accountType as number != this.getAccountType()) {
            throw new Error(`Server returned info for account "${vault}" with incorrect account type`);
        }

        if (info.index != this.getDerivationIndex()) {
            throw new Error(`Server returned info for account "${vault}" with incorrect derivation index`);
        }

        // Update the account's balance and management state from the server.
        this.cachedBalance = BigInt(FromQuarks(info.balance));
        this.balanceSource = protoToBalanceSource(info.balanceSource);
        this.managementState = protoToManagementState(info.managementState);
    }

    getRevokeInstruction(env: Environment) : TransactionInstruction {
        return program.createRevokeLockWithAuthorityInstruction(
            {
                timelock: this.address,               // timelock state (PDA: prefix + mint + code + user)
                vault: this.vault,                    // timelock vault (PDA: prefix + timelock)
                timeAuthority: env.subsidizer,        // who has time authority
                payer: env.subsidizer,                // who pays for the rent on the timelock state and vault
            },
            {
                timelockBump: this.bump,
            }
        );
    }

    getDeactivateInstruction(env: Environment) : TransactionInstruction {
        return program.createDeactivateInstruction(
            {
                timelock: this.address,               // timelock state (PDA: prefix + mint + code + user)
                vaultOwner: this.getAuthority(),      // who has transfer authority
                payer: env.subsidizer,                // who pays for the rent on the timelock state and vault
            },
            {
                timelockBump: this.bump,
            }
        );
    }

    getWithdrawInstruction(env: Environment, destination: PublicKey) : TransactionInstruction {
        return program.createWithdrawInstruction(
            {
                timelock: this.address,               // timelock state (PDA: prefix + mint + code + user)
                vault: this.vault,                    // timelock vault (PDA: prefix + timelock)
                vaultOwner: this.getAuthority(),      // who has transfer authority
                destination: destination,             // the destination token account (must be owned by the destination authority)
                payer: env.subsidizer,                // who pays for the rent on the timelock state and vault
            },
            {
                timelockBump: this.bump,
            }
        );
    }

    getTransferInstruction(env: Environment, destination: PublicKey, amount: number) : TransactionInstruction {
        return program.createTransferWithAuthorityInstruction(
            {
                timelock: this.address,               // timelock state (PDA: prefix + mint + code + user)
                vault: this.vault,                    // timelock vault (PDA: prefix + timelock)
                vaultOwner: this.getAuthority(),      // who has transfer authority
                destination: destination,             // the destination token account (must be owned by the destination authority)
                timeAuthority: env.subsidizer,        // who has time authority
                payer: env.subsidizer,                // who pays for the rent on the timelock state and vault
            },
            {
                timelockBump: this.bump,
                amount: new BN(ToQuarks(amount)),
            }
        );
    }

    getCloseInstruction(env: Environment) : TransactionInstruction {
        return program.createCloseAccountsInstruction(
            {
                timelock: this.address,                // timelock state (PDA: prefix + mint + code + user)
                vault: this.vault,                     // timelock vault (PDA: prefix + timelock)
                closeAuthority: env.subsidizer,        // who has time authority
                payer: env.subsidizer,                 // who pays for the rent on the timelock state and vault
            },
            {
                timelockBump: this.bump,
            }
        );
    }

    getBurnDustInstruction(env: Environment, maxAmount: number) : TransactionInstruction {
        return program.createBurnDustWithAuthorityInstruction(
            {
                timelock: this.address,                // timelock state (PDA: prefix + mint + code + user)
                vault: this.vault,                     // timelock vault (PDA: prefix + timelock)
                vaultOwner: this.getAuthority(),       // who has transfer authority
                timeAuthority: env.subsidizer,         // who has time authority
                mint: env.mint,                        // the mint (for example, Kin)
                payer: env.subsidizer,                 // who pays for the rent on the timelock state and vault
            },
            {
                timelockBump: this.bump,
                maxAmount: new BN(ToQuarks(maxAmount)),
            }
        )
    }

    static async deriveFrom(
        env: Environment,
        index: number,
        accountType : AccountType = AccountType.Unknown
        ) : Promise<TimelockAccount> {

        // Primary accounts are handled slightly differently.
        if (accountType == AccountType.Primary) {
            return TimelockAccount.derivePrimary(env);
        }

        const owner = getKeypairForAccountType(AccountType.Primary, index, env.keyphrase);
        const authority = getKeypairForAccountType(accountType, index, env.keyphrase);

        const [address, bump] = await getTimelockStatePda(
            env.mint,
            env.subsidizer,
            authority.publicKey);

        const [vault] = await getTimelockVaultPda(address);

        return new TimelockAccount(owner.publicKey, authority, address, bump, vault, accountType, index);
    }

    static async derivePrimary(
        env: Environment,
    ) : Promise<TimelockAccount> {

        const keypair = getOwnerKeypair(env.keyphrase);
        const authority = keypair;

        const [address, bump] = await getTimelockStatePda(
            env.mint,
            env.subsidizer,
            authority.publicKey);

        const [vault] = await getTimelockVaultPda(address);

        return new TimelockAccount(keypair.publicKey, authority, address, bump, vault, AccountType.Primary);
    }

    static async deriveFromServer(
        env: Environment,
        info: api.TokenAccountInfo) : Promise<TimelockAccount> {

        const account = await TimelockAccount.deriveFrom(
            env, info.index, protoToAccountType(info.accountType));

        if (Buffer.compare(account.getAuthority().toBuffer(), info.authority?.value!) != 0) {
            throw new Error("The authority does not match the one on the server for the given index and account type");
        }

        if (Buffer.compare(account.getVault().toBuffer(), info.address?.value!) != 0) {
            throw new Error("The vault does not match the one on the server for the given index and account type");
        }

        account.cachedBalance = BigInt(FromQuarks(info.balance));
        account.balanceSource = protoToBalanceSource(info.balanceSource);
        account.managementState = protoToManagementState(info.managementState);

        return account;
    }
}

export async function getTimelockStatePda(mint: PublicKey, timeAuthority: PublicKey, owner: PublicKey) : Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(prefixTimelock),
      mint.toBuffer(),
      timeAuthority.toBuffer(),
      owner.toBuffer(),
      new BN(unlockDuration).toBuffer('le', 1),
    ],
    program.PROGRAM_ID
  )
}

export async function getTimelockVaultPda(timelock: PublicKey) : Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(prefixVault),
      timelock.toBuffer(),
      new BN(version).toBuffer('le', 1),
    ],
    program.PROGRAM_ID
  )
}


export function protoToManagementState(proto: api.TokenAccountInfo_ManagementState) : ManagementState {
    // We could just use a blind cast here, but this is safer.
    switch (proto) {
        case api.TokenAccountInfo_ManagementState.MANAGEMENT_STATE_UNKNOWN:
            return ManagementState.Unknown;
        case api.TokenAccountInfo_ManagementState.MANAGEMENT_STATE_NONE:
            return ManagementState.None;
        case api.TokenAccountInfo_ManagementState.MANAGEMENT_STATE_LOCKING:
            return ManagementState.Locking;
        case api.TokenAccountInfo_ManagementState.MANAGEMENT_STATE_LOCKED:
            return ManagementState.Locked;
        case api.TokenAccountInfo_ManagementState.MANAGEMENT_STATE_UNLOCKING:
            return ManagementState.Unlocking;
        case api.TokenAccountInfo_ManagementState.MANAGEMENT_STATE_UNLOCKED:
            return ManagementState.Unlocked;
        case api.TokenAccountInfo_ManagementState.MANAGEMENT_STATE_CLOSED:
            return ManagementState.Closed;
        case api.TokenAccountInfo_ManagementState.MANAGEMENT_STATE_CLOSING:
            return ManagementState.Closing;
        default:
            throw new Error(`Unknown management state: ${proto}`);
    }
}

export function protoToBalanceSource(proto: api.TokenAccountInfo_BalanceSource) : BalanceSource {
    // We could just use a blind cast here, but this is safer.
    switch (proto) {
        case api.TokenAccountInfo_BalanceSource.BALANCE_SOURCE_UNKNOWN:
            return BalanceSource.Unknown;
        case api.TokenAccountInfo_BalanceSource.BALANCE_SOURCE_BLOCKCHAIN:
            return BalanceSource.Blockchain;
        case api.TokenAccountInfo_BalanceSource.BALANCE_SOURCE_CACHE:
            return BalanceSource.Cache;
        default:
            throw new Error(`Unknown balance source: ${proto}`);
    }
}

export function protoToAccountType(proto: common.AccountType) : AccountType {
    // We could just use a blind cast here, but this is safer.
    switch (proto) {
        case common.AccountType.UNKNOWN:
            return AccountType.Unknown;
        case common.AccountType.PRIMARY:
            return AccountType.Primary;
        case common.AccountType.TEMPORARY_INCOMING:
            return AccountType.Incoming;
        case common.AccountType.TEMPORARY_OUTGOING:
            return AccountType.Outgoing;
        case common.AccountType.BUCKET_1_KIN:
            return AccountType.Slot1;
        case common.AccountType.BUCKET_10_KIN:
            return AccountType.Slot2;
        case common.AccountType.BUCKET_100_KIN:
            return AccountType.Slot3;
        case common.AccountType.BUCKET_1_000_KIN:
            return AccountType.Slot4;
        case common.AccountType.BUCKET_10_000_KIN:
            return AccountType.Slot5;
        case common.AccountType.BUCKET_100_000_KIN:
            return AccountType.Slot6;
        case common.AccountType.BUCKET_1_000_000_KIN:
            return AccountType.Slot7;
        default:
            throw new Error(`Unknown account type: ${proto}`);
    }
}

export function getOwnerKeypair(keyphrase: string) : Keypair {
    return getKeypairForAccountType(AccountType.Primary, 0, keyphrase);
}

export function getKeypairForAccountType(accountType: AccountType, index: number, keyphrase: string) : Keypair {
   const path = getDerivationPath(accountType, index);
   const descriptor = Derive.descriptorFromMnemonic(path, keyphrase);
   return descriptor.toKeypair();
}

export function getDerivationPath(accountType: AccountType, index: number) : Path {
    switch (accountType) {
        case AccountType.Primary:
            return DefaultPath;
        case AccountType.Slot1:
            return new Path("m/44'/501'/0'/0'/0'/1'");
        case AccountType.Slot2:
            return new Path("m/44'/501'/0'/0'/0'/10'");
        case AccountType.Slot3:
            return new Path("m/44'/501'/0'/0'/0'/100'");
        case AccountType.Slot4:
            return new Path("m/44'/501'/0'/0'/0'/1000'");
        case AccountType.Slot5:
            return new Path("m/44'/501'/0'/0'/0'/10000'");
        case AccountType.Slot6:
            return new Path("m/44'/501'/0'/0'/0'/100000'");
        case AccountType.Slot7:
            return new Path("m/44'/501'/0'/0'/0'/1000000'");
        case AccountType.Incoming:
            return new Path(`m/44'/501'/0'/0'/${index}'/2'`);
        case AccountType.Outgoing:
            return new Path(`m/44'/501'/0'/0'/${index}'/3'`);
        default:
            throw new Error(`Unknown account type: ${accountType}`);
    }
}