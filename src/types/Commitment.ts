import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import * as program from '../programs/splitter/src/splitter';

const PREFIX_COMMITMENT_STATE = "commitment_state";
const PREFIX_COMMITMENT_VAULT = "commitment_vault";

export async function getCommitmentPda(pool: PublicKey, recentRoot: Buffer, transcript: Buffer, destination: PublicKey, amount: number) : Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(PREFIX_COMMITMENT_STATE),
      pool.toBuffer(),
      recentRoot,
      transcript,
      destination.toBuffer(),
      new BN(amount).toBuffer('le', 8)
    ],
    program.PROGRAM_ID
  )
}

export async function getCommitmentVaultPda(pool: PublicKey, commitment: PublicKey) : Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(PREFIX_COMMITMENT_VAULT),
      pool.toBuffer(),
      commitment.toBuffer(),
    ],
    program.PROGRAM_ID
  )
}