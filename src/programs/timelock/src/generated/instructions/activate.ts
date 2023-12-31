/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category Activate
 * @category generated
 */
export type ActivateInstructionArgs = {
  timelockBump: number
}
/**
 * @category Instructions
 * @category Activate
 * @category generated
 */
const activateStruct = new beet.BeetArgsStruct<
  ActivateInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['timelockBump', beet.u8],
  ],
  'ActivateInstructionArgs'
)
/**
 * Accounts required by the _activate_ instruction
 * @category Instructions
 * @category Activate
 * @category generated
 */
export type ActivateInstructionAccounts = {
  timelock: web3.PublicKey
  vaultOwner: web3.PublicKey
  payer: web3.PublicKey
}

const activateInstructionDiscriminator = [194, 203, 35, 100, 151, 55, 170, 82]

/**
 * Creates a _Activate_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Activate
 * @category generated
 */
export function createActivateInstruction(
  accounts: ActivateInstructionAccounts,
  args: ActivateInstructionArgs
) {
  const { timelock, vaultOwner, payer } = accounts

  const [data] = activateStruct.serialize({
    instructionDiscriminator: activateInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: timelock,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: vaultOwner,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: payer,
      isWritable: true,
      isSigner: true,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey(
      'time2Z2SCnn3qYg3ULKVtdkh8YmZ5jFdKicnA1W2YnJ'
    ),
    keys,
    data,
  })
  return ix
}
