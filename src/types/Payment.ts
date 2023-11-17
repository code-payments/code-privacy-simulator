import { PublicKey } from "@solana/web3.js";
import { ExchangeData } from "../grpc/transaction/v2/transaction_service";

// Details for a transfer of tokens. A payment can also be a deposit or
// withdrawal. This data should be provided by the server
export interface Payment {
    amount: bigint,
    address: PublicKey,
    metadata?: ExchangeData,
}
