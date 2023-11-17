import { PublicKey } from "@solana/web3.js"

export const Mint  = new PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6")

const decimals     = 5
const quarksPerKin = 10 ** decimals

export function FromQuarks(quarks: number) : number {
	return quarks / quarksPerKin;
}

export function ToQuarks(kin: number): number {
	return kin * quarksPerKin;
}