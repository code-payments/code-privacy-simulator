import { PublicKey, SystemProgram, SYSVAR_RECENT_BLOCKHASHES_PUBKEY, TransactionInstruction } from "@solana/web3.js";
import { Environment } from "../types/Environment";
import * as bs58 from "bs58";
import * as api from "../grpc/transaction/v2/transaction_service";
import { BN } from "bn.js";

export class NonceAccount {
    address: PublicKey;
    value: string;

    constructor(address: PublicKey, value: Uint8Array | number[] | string) {
        this.address = address;

        if (typeof value == "string") {
            this.value = value;
        } else {
            this.value = bs58.encode(value);
        }
    }

    static fromProto(data: api.NoncedTransactionMetadata): NonceAccount {
        return new NonceAccount(new PublicKey(data.nonce!.value), data.blockhash!.value);
    }

    getAdvanceNonceInstruction(env: Environment): TransactionInstruction {
        const instructionData = {
            keys: [{
                pubkey: this.address,
                isSigner: false,
                isWritable: true
            }, {
                pubkey: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
                isSigner: false,
                isWritable: false
            }, {
                pubkey: env.subsidizer,
                isSigner: true,
                isWritable: false
            }],
            programId: SystemProgram.programId,
            data: new BN(4).toArrayLike(Buffer, "le", 4)
        };
        return new TransactionInstruction(instructionData);
    }
}