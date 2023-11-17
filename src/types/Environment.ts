import { PublicKey } from "@solana/web3.js";

export interface Environment {
    mint: PublicKey;
    subsidizer: PublicKey;

    phoneNumber: string;
    keyphrase: string;
}