/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category RevokeLockWithTimeout
 * @category generated
 */
export type RevokeLockWithTimeoutInstructionArgs = {
  timelockBump: number
}
/**
 * @category Instructions
 * @category RevokeLockWithTimeout
 * @category generated
 */
const revokeLockWithTimeoutStruct = new beet.BeetArgsStruct<
  RevokeLockWithTimeoutInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['timelockBump', beet.u8],
  ],
  'RevokeLockWithTimeoutInstructionArgs'
)
/**
 * Accounts required by the _revokeLockWithTimeout_ instruction
 * @category Instructions
 * @category RevokeLockWithTimeout
 * @category generated
 */
export type RevokeLockWithTimeoutInstructionAccounts = {
  timelock: web3.PublicKey
  vault: web3.PublicKey
  vaultOwner: web3.PublicKey
  payer: web3.PublicKey
}

const revokeLockWithTimeoutInstructionDiscriminator = [
  19, 131, 47, 77, 60, 188, 120, 124,
]

/**
 * Creates a _RevokeLockWithTimeout_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category RevokeLockWithTimeout
 * @category generated
 */
export function createRevokeLockWithTimeoutInstruction(
  accounts: RevokeLockWithTimeoutInstructionAccounts,
  args: RevokeLockWithTimeoutInstructionArgs
) {
  const { timelock, vault, vaultOwner, payer } = accounts

  const [data] = revokeLockWithTimeoutStruct.serialize({
    instructionDiscriminator: revokeLockWithTimeoutInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: timelock,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: vault,
      isWritable: false,
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
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
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
