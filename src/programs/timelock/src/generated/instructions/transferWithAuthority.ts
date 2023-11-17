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
 * @category TransferWithAuthority
 * @category generated
 */
export type TransferWithAuthorityInstructionArgs = {
  timelockBump: number
  amount: beet.bignum
}
/**
 * @category Instructions
 * @category TransferWithAuthority
 * @category generated
 */
const transferWithAuthorityStruct = new beet.BeetArgsStruct<
  TransferWithAuthorityInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['timelockBump', beet.u8],
    ['amount', beet.u64],
  ],
  'TransferWithAuthorityInstructionArgs'
)
/**
 * Accounts required by the _transferWithAuthority_ instruction
 * @category Instructions
 * @category TransferWithAuthority
 * @category generated
 */
export type TransferWithAuthorityInstructionAccounts = {
  timelock: web3.PublicKey
  vault: web3.PublicKey
  vaultOwner: web3.PublicKey
  timeAuthority: web3.PublicKey
  destination: web3.PublicKey
  payer: web3.PublicKey
}

const transferWithAuthorityInstructionDiscriminator = [
  68, 128, 222, 192, 129, 69, 71, 165,
]

/**
 * Creates a _TransferWithAuthority_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category TransferWithAuthority
 * @category generated
 */
export function createTransferWithAuthorityInstruction(
  accounts: TransferWithAuthorityInstructionAccounts,
  args: TransferWithAuthorityInstructionArgs
) {
  const { timelock, vault, vaultOwner, timeAuthority, destination, payer } =
    accounts

  const [data] = transferWithAuthorityStruct.serialize({
    instructionDiscriminator: transferWithAuthorityInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: timelock,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: vault,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: vaultOwner,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: timeAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: destination,
      isWritable: true,
      isSigner: false,
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
