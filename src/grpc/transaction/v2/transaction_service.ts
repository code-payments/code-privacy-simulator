/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  ChannelOptions,
  Client,
  ClientDuplexStream,
  ClientUnaryCall,
  handleBidiStreamingCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata as Metadata1,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  AccountType,
  accountTypeFromJSON,
  accountTypeToJSON,
  Blockhash,
  Hash,
  IntentId,
  Signature,
  SolanaAccountId,
  Transaction,
} from "../../common/v1/model";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "code.transaction.v2";

export interface SubmitIntentRequest {
  submitActions: SubmitIntentRequest_SubmitActions | undefined;
  submitSignatures: SubmitIntentRequest_SubmitSignatures | undefined;
}

export interface SubmitIntentRequest_SubmitActions {
  /**
   * The globally unique client generated intent ID. Use the original intent
   * ID when operating on actions that mutate the intent.
   */
  id:
    | IntentId
    | undefined;
  /** The verified owner account public key */
  owner:
    | SolanaAccountId
    | undefined;
  /** Additional metadata that describes the high-level intention */
  metadata:
    | Metadata
    | undefined;
  /** The set of all ordered actions required to fulfill the intent */
  actions: Action[];
  /**
   * The signature is of serialize(SubmitActions) without this field set using the
   * private key of the owner account. This provides an authentication mechanism
   * to the RPC.
   */
  signature: Signature | undefined;
}

export interface SubmitIntentRequest_SubmitSignatures {
  /**
   * The set of all signatures for each transaction requiring signature from the
   * authority accounts.
   */
  signatures: Signature[];
}

export interface SubmitIntentResponse {
  serverParameters: SubmitIntentResponse_ServerParameters | undefined;
  success: SubmitIntentResponse_Success | undefined;
  error: SubmitIntentResponse_Error | undefined;
}

export interface SubmitIntentResponse_ServerParameters {
  /**
   * The set of all server paremeters required to fill missing transaction
   * details. Server guarantees to provide a message for each client action
   * in an order consistent with the received action list.
   */
  serverParameters: ServerParameter[];
}

export interface SubmitIntentResponse_Success {
  code: SubmitIntentResponse_Success_Code;
}

export enum SubmitIntentResponse_Success_Code {
  /** OK - The intent was successfully created and is now scheduled. */
  OK = 0,
  /** NOOP - The intent was a no-op. Clients may proceed and assume success. */
  NOOP = 1,
  UNRECOGNIZED = -1,
}

export function submitIntentResponse_Success_CodeFromJSON(object: any): SubmitIntentResponse_Success_Code {
  switch (object) {
    case 0:
    case "OK":
      return SubmitIntentResponse_Success_Code.OK;
    case 1:
    case "NOOP":
      return SubmitIntentResponse_Success_Code.NOOP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SubmitIntentResponse_Success_Code.UNRECOGNIZED;
  }
}

export function submitIntentResponse_Success_CodeToJSON(object: SubmitIntentResponse_Success_Code): string {
  switch (object) {
    case SubmitIntentResponse_Success_Code.OK:
      return "OK";
    case SubmitIntentResponse_Success_Code.NOOP:
      return "NOOP";
    case SubmitIntentResponse_Success_Code.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface SubmitIntentResponse_Error {
  code: SubmitIntentResponse_Error_Code;
  errorDetails: ErrorDetails[];
}

export enum SubmitIntentResponse_Error_Code {
  /** DENIED - Denied by a guard (spam, money laundering, etc) */
  DENIED = 0,
  /** INVALID_INTENT - The intent is invalid. */
  INVALID_INTENT = 1,
  /** SIGNATURE_ERROR - There is an issue with provided signatures. */
  SIGNATURE_ERROR = 2,
  UNRECOGNIZED = -1,
}

export function submitIntentResponse_Error_CodeFromJSON(object: any): SubmitIntentResponse_Error_Code {
  switch (object) {
    case 0:
    case "DENIED":
      return SubmitIntentResponse_Error_Code.DENIED;
    case 1:
    case "INVALID_INTENT":
      return SubmitIntentResponse_Error_Code.INVALID_INTENT;
    case 2:
    case "SIGNATURE_ERROR":
      return SubmitIntentResponse_Error_Code.SIGNATURE_ERROR;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SubmitIntentResponse_Error_Code.UNRECOGNIZED;
  }
}

export function submitIntentResponse_Error_CodeToJSON(object: SubmitIntentResponse_Error_Code): string {
  switch (object) {
    case SubmitIntentResponse_Error_Code.DENIED:
      return "DENIED";
    case SubmitIntentResponse_Error_Code.INVALID_INTENT:
      return "INVALID_INTENT";
    case SubmitIntentResponse_Error_Code.SIGNATURE_ERROR:
      return "SIGNATURE_ERROR";
    case SubmitIntentResponse_Error_Code.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetPrivacyUpgradeStatusRequest {
  /** The intent ID */
  intentId:
    | IntentId
    | undefined;
  /** The action ID for private transaction */
  actionId: number;
}

export interface GetPrivacyUpgradeStatusResponse {
  result: GetPrivacyUpgradeStatusResponse_Result;
  status: GetPrivacyUpgradeStatusResponse_Status;
}

export enum GetPrivacyUpgradeStatusResponse_Result {
  OK = 0,
  /** INTENT_NOT_FOUND - The provided intent ID doesn't exist */
  INTENT_NOT_FOUND = 1,
  /** ACTION_NOT_FOUND - The provided action ID doesn't exist */
  ACTION_NOT_FOUND = 2,
  /** INVALID_ACTION - The provided action doesn't map to a private transaction */
  INVALID_ACTION = 3,
  UNRECOGNIZED = -1,
}

export function getPrivacyUpgradeStatusResponse_ResultFromJSON(object: any): GetPrivacyUpgradeStatusResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetPrivacyUpgradeStatusResponse_Result.OK;
    case 1:
    case "INTENT_NOT_FOUND":
      return GetPrivacyUpgradeStatusResponse_Result.INTENT_NOT_FOUND;
    case 2:
    case "ACTION_NOT_FOUND":
      return GetPrivacyUpgradeStatusResponse_Result.ACTION_NOT_FOUND;
    case 3:
    case "INVALID_ACTION":
      return GetPrivacyUpgradeStatusResponse_Result.INVALID_ACTION;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetPrivacyUpgradeStatusResponse_Result.UNRECOGNIZED;
  }
}

export function getPrivacyUpgradeStatusResponse_ResultToJSON(object: GetPrivacyUpgradeStatusResponse_Result): string {
  switch (object) {
    case GetPrivacyUpgradeStatusResponse_Result.OK:
      return "OK";
    case GetPrivacyUpgradeStatusResponse_Result.INTENT_NOT_FOUND:
      return "INTENT_NOT_FOUND";
    case GetPrivacyUpgradeStatusResponse_Result.ACTION_NOT_FOUND:
      return "ACTION_NOT_FOUND";
    case GetPrivacyUpgradeStatusResponse_Result.INVALID_ACTION:
      return "INVALID_ACTION";
    case GetPrivacyUpgradeStatusResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum GetPrivacyUpgradeStatusResponse_Status {
  UNKNOWN = 0,
  /**
   * TEMPORARY_TRANSACTION_FINALIZED - The transaction for the temporary private transaction was submitted and
   * finalized. The opportunity to upgrade was missed.
   */
  TEMPORARY_TRANSACTION_FINALIZED = 1,
  /**
   * WAITING_FOR_NEXT_BLOCK - The next block of transactions hasn't been created. Wait and try again
   * later.
   */
  WAITING_FOR_NEXT_BLOCK = 2,
  /** READY_FOR_UPGRADE - The transaction can be upgraded to permanent privacy */
  READY_FOR_UPGRADE = 3,
  /** ALREADY_UPGRADED - The transaction has already been upgraded */
  ALREADY_UPGRADED = 4,
  UNRECOGNIZED = -1,
}

export function getPrivacyUpgradeStatusResponse_StatusFromJSON(object: any): GetPrivacyUpgradeStatusResponse_Status {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return GetPrivacyUpgradeStatusResponse_Status.UNKNOWN;
    case 1:
    case "TEMPORARY_TRANSACTION_FINALIZED":
      return GetPrivacyUpgradeStatusResponse_Status.TEMPORARY_TRANSACTION_FINALIZED;
    case 2:
    case "WAITING_FOR_NEXT_BLOCK":
      return GetPrivacyUpgradeStatusResponse_Status.WAITING_FOR_NEXT_BLOCK;
    case 3:
    case "READY_FOR_UPGRADE":
      return GetPrivacyUpgradeStatusResponse_Status.READY_FOR_UPGRADE;
    case 4:
    case "ALREADY_UPGRADED":
      return GetPrivacyUpgradeStatusResponse_Status.ALREADY_UPGRADED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetPrivacyUpgradeStatusResponse_Status.UNRECOGNIZED;
  }
}

export function getPrivacyUpgradeStatusResponse_StatusToJSON(object: GetPrivacyUpgradeStatusResponse_Status): string {
  switch (object) {
    case GetPrivacyUpgradeStatusResponse_Status.UNKNOWN:
      return "UNKNOWN";
    case GetPrivacyUpgradeStatusResponse_Status.TEMPORARY_TRANSACTION_FINALIZED:
      return "TEMPORARY_TRANSACTION_FINALIZED";
    case GetPrivacyUpgradeStatusResponse_Status.WAITING_FOR_NEXT_BLOCK:
      return "WAITING_FOR_NEXT_BLOCK";
    case GetPrivacyUpgradeStatusResponse_Status.READY_FOR_UPGRADE:
      return "READY_FOR_UPGRADE";
    case GetPrivacyUpgradeStatusResponse_Status.ALREADY_UPGRADED:
      return "ALREADY_UPGRADED";
    case GetPrivacyUpgradeStatusResponse_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetPrioritizedIntentsForPrivacyUpgradeRequest {
  /** The owner account to query against for upgradeable intents. */
  owner:
    | SolanaAccountId
    | undefined;
  /** The maximum number of intents to return in the response. Default is 10. */
  limit: number;
  /**
   * The signature is of serialize(GetPrioritizedIntentsForPrivacyUpgradeRequest)
   * without this field set using the private key of the owner account. This
   * provides an authentication mechanism to the RPC.
   */
  signature: Signature | undefined;
}

export interface GetPrioritizedIntentsForPrivacyUpgradeResponse {
  result: GetPrioritizedIntentsForPrivacyUpgradeResponse_Result;
  /** Ordered from highest to lowest priority */
  items: UpgradeableIntent[];
}

export enum GetPrioritizedIntentsForPrivacyUpgradeResponse_Result {
  OK = 0,
  NOT_FOUND = 1,
  UNRECOGNIZED = -1,
}

export function getPrioritizedIntentsForPrivacyUpgradeResponse_ResultFromJSON(
  object: any,
): GetPrioritizedIntentsForPrivacyUpgradeResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetPrioritizedIntentsForPrivacyUpgradeResponse_Result.OK;
    case 1:
    case "NOT_FOUND":
      return GetPrioritizedIntentsForPrivacyUpgradeResponse_Result.NOT_FOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetPrioritizedIntentsForPrivacyUpgradeResponse_Result.UNRECOGNIZED;
  }
}

export function getPrioritizedIntentsForPrivacyUpgradeResponse_ResultToJSON(
  object: GetPrioritizedIntentsForPrivacyUpgradeResponse_Result,
): string {
  switch (object) {
    case GetPrioritizedIntentsForPrivacyUpgradeResponse_Result.OK:
      return "OK";
    case GetPrioritizedIntentsForPrivacyUpgradeResponse_Result.NOT_FOUND:
      return "NOT_FOUND";
    case GetPrioritizedIntentsForPrivacyUpgradeResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetLimitsRequest {
  /**
   * The owner account whose limits will be calculated. Any other owner accounts
   * linked with the same identity of the owner will also be applied.
   */
  owner:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(GetLimitsRequest) without this field set
   * using the private key of the owner account. This provides an authentication
   * mechanism to the RPC.
   */
  signature:
    | Signature
    | undefined;
  /**
   * All transactions starting at this time will be incorporated into the consumed
   * limit calculation. Clients should set this to the start of the current day in
   * the client's current time zone (because server has no knowledge of this atm).
   */
  consumedSince: Date | undefined;
}

export interface GetLimitsResponse {
  result: GetLimitsResponse_Result;
  /** Remaining send limits keyed by currency */
  remainingSendLimitsByCurrency: { [key: string]: RemainingSendLimit };
}

export enum GetLimitsResponse_Result {
  OK = 0,
  UNRECOGNIZED = -1,
}

export function getLimitsResponse_ResultFromJSON(object: any): GetLimitsResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetLimitsResponse_Result.OK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetLimitsResponse_Result.UNRECOGNIZED;
  }
}

export function getLimitsResponse_ResultToJSON(object: GetLimitsResponse_Result): string {
  switch (object) {
    case GetLimitsResponse_Result.OK:
      return "OK";
    case GetLimitsResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetLimitsResponse_RemainingSendLimitsByCurrencyEntry {
  key: string;
  value: RemainingSendLimit | undefined;
}

export interface GetPaymentHistoryRequest {
  /** The owner account to get payment history for */
  owner:
    | SolanaAccountId
    | undefined;
  /** An optional history cursor indicating where in the history to resume from. */
  cursor:
    | Cursor
    | undefined;
  /** The number of results to return per request. Default is 100. */
  pageSize: number;
  /** The order in which to return history items from the cursor. */
  direction: GetPaymentHistoryRequest_Direction;
  /**
   * The signature is of serialize(GetPaymentHistoryRequest) without this field set
   * using the private key of the owner account. This provides an authentication
   * mechanism to the RPC.
   */
  signature: Signature | undefined;
}

export enum GetPaymentHistoryRequest_Direction {
  /** ASC - ASC direction returns all history items in ascending order. */
  ASC = 0,
  /** DESC - DESC direction returns all history items in descending order. */
  DESC = 1,
  UNRECOGNIZED = -1,
}

export function getPaymentHistoryRequest_DirectionFromJSON(object: any): GetPaymentHistoryRequest_Direction {
  switch (object) {
    case 0:
    case "ASC":
      return GetPaymentHistoryRequest_Direction.ASC;
    case 1:
    case "DESC":
      return GetPaymentHistoryRequest_Direction.DESC;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetPaymentHistoryRequest_Direction.UNRECOGNIZED;
  }
}

export function getPaymentHistoryRequest_DirectionToJSON(object: GetPaymentHistoryRequest_Direction): string {
  switch (object) {
    case GetPaymentHistoryRequest_Direction.ASC:
      return "ASC";
    case GetPaymentHistoryRequest_Direction.DESC:
      return "DESC";
    case GetPaymentHistoryRequest_Direction.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetPaymentHistoryResponse {
  result: GetPaymentHistoryResponse_Result;
  items: PaymentHistoryItem[];
}

export enum GetPaymentHistoryResponse_Result {
  OK = 0,
  NOT_FOUND = 1,
  UNRECOGNIZED = -1,
}

export function getPaymentHistoryResponse_ResultFromJSON(object: any): GetPaymentHistoryResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetPaymentHistoryResponse_Result.OK;
    case 1:
    case "NOT_FOUND":
      return GetPaymentHistoryResponse_Result.NOT_FOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetPaymentHistoryResponse_Result.UNRECOGNIZED;
  }
}

export function getPaymentHistoryResponse_ResultToJSON(object: GetPaymentHistoryResponse_Result): string {
  switch (object) {
    case GetPaymentHistoryResponse_Result.OK:
      return "OK";
    case GetPaymentHistoryResponse_Result.NOT_FOUND:
      return "NOT_FOUND";
    case GetPaymentHistoryResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Metadata describes the high-level details of an intent */
export interface Metadata {
  openAccounts: OpenAccountsMetadata | undefined;
  sendPayment: SendPaymentMetadata | undefined;
  receivePayments: ReceivePaymentsMetadata | undefined;
  upgradePrivacy: UpgradePrivacyMetadata | undefined;
}

/**
 * Open a set of accounts. Currently, clients should only use this for new users
 * to open all required accounts up front (buckets, incoming, and outgoing).
 *
 * Action Spec:
 *
 * actions = [OpenAccountAction(PRIMARY)]
 * for account in [TEMPORARY_INCOMING, TEMPORARY_OUTGOING, BUCKET_1_KIN, ... , BUCKET_1_000_000_KIN]
 *   actions.push_back(OpenAccountAction(account))
 *   actions.push_back(CloseDormantAccount(account))
 */
export interface OpenAccountsMetadata {
}

/**
 * Sends a payment to a destination account with initial temporary privacy. Clients
 * should also reorganize their bucket accounts and rotate their temporary outgoing
 * account.
 *
 * Action Spec:
 *
 * actions = [
 *   // Section 1: Transfer ExchangeData.Quarks from BUCKET_X_KIN accounts to TEMPORARY_OUTGOING account with reogranizations
 *
 *   TemporaryPrivacyExchangeAction(BUCKET_X_KIN, BUCKET_X_KIN, multiple * bucketSize),
 *   TemporaryPrivacyTransferAction(BUCKET_X_KIN, TEMPORARY_OUTGOING[index], multiple * bucketSize),
 *   ...,
 *   TemporaryPrivacyExchangeAction(BUCKET_X_KIN, BUCKET_X_KIN, multiple * bucketSize),
 *   TemporaryPrivacyTransferAction(BUCKET_X_KIN, TEMPORARY_OUTGOING[index], multiple * bucketSize),
 *
 *   // Section 2: Rotate TEMPORARY_OUTGOING account
 *
 *   // Below must appear last in this exact order
 *   NoPrivacyWithdrawAction(TEMPORARY_OUTGOING[index], destination, ExchangeData.Quarks),
 *   OpenAccountAction(TEMPORARY_OUTGOING[index + 1])
 *   CloseDormantAccount(TEMPORARY_OUTGOING[index + 1]),
 * ]
 */
export interface SendPaymentMetadata {
  /** The destination token account to send funds to */
  destination:
    | SolanaAccountId
    | undefined;
  /** The exchange data of total funds being sent to the destination */
  exchangeData:
    | ExchangeData
    | undefined;
  /**
   * Is the payment a withdrawal? For destinations that are not Code accounts,
   * this must be set to true.
   */
  isWithdrawal: boolean;
}

/**
 * Receive all funds from a temporary incoming account with initial temporary privacy.
 * Clients should also reorganize their bucket accounts and rotate their temporary
 * incoming account.
 * Action Spec:
 *
 * actions = [
 *   // Section 1: Transfer Quarks from TEMPORARY_INCOMING account to BUCKET_X_KIN accounts with reorganizations
 *
 *   TemporaryPrivacyTransferAction(TEMPORARY_INCOMING[index], BUCKET_X_KIN, multiple * bucketSize),
 *   TemporaryPrivacyExchangeAction(BUCKET_X_KIN, BUCKET_X_KIN, multiple * bucketSize),
 *   ...,
 *   TemporaryPrivacyTransferAction(TEMPORARY_INCOMING[index], BUCKET_X_KIN, multiple * bucketSize),
 *   TemporaryPrivacyExchangeAction(BUCKET_X_KIN, BUCKET_X_KIN, multiple * bucketSize),
 *
 *   // Section 2: Rotate TEMPORARY_INCOMING account
 *
 *   // Below must appear last in this exact order
 *   CloseEmptyAccountAction(TEMPORARY_INCOMING[index]),
 *   OpenAccountAction(TEMPORARY_INCOMING[index + 1])
 *   CloseDormantAccount(TEMPORARY_INCOMING[index + 1]),
 * ]
 */
export interface ReceivePaymentsMetadata {
  /** The temporary incoming account to receive funds from */
  source:
    | SolanaAccountId
    | undefined;
  /** The exact amount of Kin in quarks being received */
  quarks: number;
  /**
   * Is the receipt of funds from a deposti? If true, the source account must
   * be the primary account. Otherwise, it must be from a temporary incoming
   * account.
   */
  isDeposit: boolean;
}

/** Upgrade existing private transactions from temporary to permanent privacy. */
export interface UpgradePrivacyMetadata {
}

/**
 * Action is a well-defined, ordered and small set of transactions for a unit of work
 * that the client wants to perform on the blockchain. Clients provide parameters known
 * to them in the action.
 */
export interface Action {
  /**
   * The ID of this action, which is unique within an intent. It must match
   * the index of the action's location in the SubmitAction's actions field.
   */
  id: number;
  openAccount: OpenAccountAction | undefined;
  closeEmptyAccount: CloseEmptyAccountAction | undefined;
  closeDormantAccount:
    | CloseDormantAccountAction
    | undefined;
  /** NoPrivacyTransferAction        no_privacy_transfer = 5; */
  noPrivacyWithdraw: NoPrivacyWithdrawAction | undefined;
  temporaryPrivacyTransfer: TemporaryPrivacyTransferAction | undefined;
  temporaryPrivacyExchange: TemporaryPrivacyExchangeAction | undefined;
  permanentPrivacyUpgrade: PermanentPrivacyUpgradeAction | undefined;
}

/**
 * Transaction 1
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. timelock::Initialize
 *  Client Signature Required: No
 *
 * All OpenAccountActions for non-primary accounts must be followed with an associated
 * CloseDormantAccountAction to enable server to perform cleanup.
 */
export interface OpenAccountAction {
  /** The type of account, which will dictate its intended use */
  accountType: AccountType;
  /**
   * The verified parent owner account public key. This field is duplicated from
   * SubmitIntent.SubmitActions to capture the value in authority_signature.
   */
  owner:
    | SolanaAccountId
    | undefined;
  /**
   * The index used to for accounts that are derived from owner. Ignore this for
   * the primary account.
   */
  index: number;
  /** The public key of the private key that has authority over the opened token account */
  authority:
    | SolanaAccountId
    | undefined;
  /** The token account being opened */
  token:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(OpenAccountAction) without this field set
   * using the private key of the authority account. This provides a proof
   * of authorization to link authority to owner.
   */
  authoritySignature: Signature | undefined;
}

/**
 * Transaction 1
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. timelock::BurnDustWithAuthority (max 1 Kin)
 *    3. timelock::CloseAccounts
 *  Client Signature Required: Yes
 */
export interface CloseEmptyAccountAction {
  /** The type of account being closed */
  accountType: AccountType;
  /**
   * The public key of the private key that has authority over the token account
   * that should be closed
   */
  authority:
    | SolanaAccountId
    | undefined;
  /** The token account being closed */
  token: SolanaAccountId | undefined;
}

/**
 * Transaction 1
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. memo::Memo
 *    3. timelock::RevokeLockWithAuthority
 *    4. timelock::DeactivateLock
 *    5. timelock::Withdraw (token -> primary)
 *    6. timelock::CloseAccounts
 *  Client Signature Required: Yes
 */
export interface CloseDormantAccountAction {
  /** The type of account being closed */
  accountType: AccountType;
  /**
   * The public key of the private key that has authority over the token account
   * that should be closed
   */
  authority:
    | SolanaAccountId
    | undefined;
  /** The token account being closed */
  token:
    | SolanaAccountId
    | undefined;
  /** The destination where funds are withdrawn to */
  destination: SolanaAccountId | undefined;
}

/**
 * Transaction 1
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. memo::Memo
 *    3. timelock::TransferWithAuthority (source -> destination)
 *  Client Signature Required: Yes
 *
 * Note: Currently no use cases for this action
 */
export interface NoPrivacyTransferAction {
  /** The public key of the private key that has authority over source */
  authority:
    | SolanaAccountId
    | undefined;
  /** The source account where funds are transferred from */
  source:
    | SolanaAccountId
    | undefined;
  /** The destination account where funds are transferred to */
  destination:
    | SolanaAccountId
    | undefined;
  /** The Kin quark amount to transfer */
  amount: number;
}

/**
 * Transaction 1
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. memo::Memo
 *    3. timelock::RevokeLockWithAuthority
 *    4. timelock::DeactivateLock
 *    5. timelock::Withdraw (source -> destination)
 *    6. timelock::CloseAccounts
 *  Client Signature Required: Yes
 */
export interface NoPrivacyWithdrawAction {
  /** The public key of the private key that has authority over source */
  authority:
    | SolanaAccountId
    | undefined;
  /** The source account where funds are transferred from */
  source:
    | SolanaAccountId
    | undefined;
  /** The destination account where funds are transferred to */
  destination:
    | SolanaAccountId
    | undefined;
  /** The intended Kin quark amount to withdraw */
  amount: number;
  /**
   * Whether the account is closed afterwards. This is always true, since there
   * are no current se cases to leave it open.
   */
  shouldClose: boolean;
}

/**
 * Transaction 1
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. memo::Memo
 *    3. splitter::TransferWithCommitment (treasury -> destination)
 *  Client Signature Required: No
 *
 * Transaction 2
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. memo::Memo
 *    3. timelock::TransferWithAuthority (source -> commitment)
 *  Client Signature Required: Yes
 */
export interface TemporaryPrivacyTransferAction {
  /** The public key of the private key that has authority over source */
  authority:
    | SolanaAccountId
    | undefined;
  /** The source account where funds are transferred from */
  source:
    | SolanaAccountId
    | undefined;
  /** The destination account where funds are transferred to */
  destination:
    | SolanaAccountId
    | undefined;
  /** The Kin quark amount to transfer */
  amount: number;
}

/**
 * Transaction 1
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. memo::Memo
 *    3. splitter::TransferWithCommitment (treasury -> destination)
 *  Client Signature Required: No
 *
 * Transaction 2
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. memo::Memo
 *    3. timelock::TransferWithAuthority (source -> commitment)
 *  Client Signature Required: Yes
 */
export interface TemporaryPrivacyExchangeAction {
  /** The public key of the private key that has authority over source */
  authority:
    | SolanaAccountId
    | undefined;
  /** The source account where funds are exchanged from */
  source:
    | SolanaAccountId
    | undefined;
  /** The destination account where funds are exchanged to */
  destination:
    | SolanaAccountId
    | undefined;
  /** The Kin quark amount to exchange */
  amount: number;
}

/**
 * Transaction 1
 *  Instructions:
 *    1. system::AdvanceNonce
 *    2. memo::Memo
 *    3. timelock::TransferWithAuthority (source -> different commitment)
 *  Client Signature Required: Yes
 */
export interface PermanentPrivacyUpgradeAction {
  /** The action ID of the temporary private transfer or exchange to upgrade */
  actionId: number;
}

/**
 * ServerParameter are a set of parameters known and returned by server that
 * enables clients to complete transaction construction. Any necessary proofs,
 * which are required to be locally verifiable, are also provided to ensure
 * safe use in the event of a malicious server.
 */
export interface ServerParameter {
  /** The action the server parameters belong to */
  actionId: number;
  /**
   * The set of nonces used for the action. Server will only provide values
   * for transactions requiring client signatures.
   */
  nonces: NoncedTransactionMetadata[];
  openAccount: OpenAccountServerParameter | undefined;
  closeEmptyAccount: CloseEmptyAccountServerParameter | undefined;
  closeDormantAccount:
    | CloseDormantAccountServerParameter
    | undefined;
  /** NoPrivacyTransferServerParameter        no_privacy_transfer = 6; */
  noPrivacyWithdraw: NoPrivacyWithdrawServerParameter | undefined;
  temporaryPrivacyTransfer: TemporaryPrivacyTransferServerParameter | undefined;
  temporaryPrivacyExchange: TemporaryPrivacyExchangeServerParameter | undefined;
  permanentPrivacyUpgrade: PermanentPrivacyUpgradeServerParameter | undefined;
}

export interface NoncedTransactionMetadata {
  /** The nonce account to use in the system::AdvanceNonce instruction */
  nonce:
    | SolanaAccountId
    | undefined;
  /** The blockhash to set in the transaction */
  blockhash: Blockhash | undefined;
}

/** There are no transactions requiring client signatures */
export interface OpenAccountServerParameter {
}

/** There are no action-specific server parameters */
export interface CloseEmptyAccountServerParameter {
}

/** There are no action-specific server parameters */
export interface CloseDormantAccountServerParameter {
}

/** There are no action-specific server parameters */
export interface NoPrivacyTransferServerParameter {
}

/** There are no action-specific server parameters */
export interface NoPrivacyWithdrawServerParameter {
}

export interface TemporaryPrivacyTransferServerParameter {
  /** The treasury that will be used to split payments and provide a level of privacy */
  treasury:
    | SolanaAccountId
    | undefined;
  /** A recent root server observed from the treasury */
  recentRoot: Hash | undefined;
}

export interface TemporaryPrivacyExchangeServerParameter {
  /** The treasury that will be used to split payments and provide a level of privacy */
  treasury:
    | SolanaAccountId
    | undefined;
  /** A recent root server observed from the treasury */
  recentRoot: Hash | undefined;
}

export interface PermanentPrivacyUpgradeServerParameter {
  /** The new commitment that is being paid */
  newCommitment:
    | SolanaAccountId
    | undefined;
  /**
   * The new commitment account's transcript. This is purely needed by client
   * to validate merkle_root with commitment PDA logic.
   */
  newCommitmentTranscript:
    | Hash
    | undefined;
  /**
   * The new commitment account's destination. This is purely needed by client
   * to validate merkle_root with commitment PDA logic.
   */
  newCommitmentDestination:
    | SolanaAccountId
    | undefined;
  /**
   * The new commitment account's payment amount. This is purely needed by client
   * to validate merkle_root with commitment PDA logic.
   */
  newCommitmentAmount: number;
  /** The merkle root, which was the recent root used in the new commitment account */
  merkleRoot:
    | Hash
    | undefined;
  /**
   * The merkle proof that validates the original commitment occurred prior to
   * the new commitment server is asking client to pay
   */
  merkleProof: Hash[];
}

export interface ErrorDetails {
  reasonString: ReasonStringErrorDetails | undefined;
  invalidSignature: InvalidSignatureErrorDetails | undefined;
}

export interface ReasonStringErrorDetails {
  /** Human readable string indicating the failure. */
  reason: string;
}

export interface InvalidSignatureErrorDetails {
  /** The action whose signature mismatched */
  actionId: number;
  /** The transaction the server expected to have signed. */
  expectedTransaction:
    | Transaction
    | undefined;
  /** The signature that was provided by the client. */
  providedSignature: Signature | undefined;
}

/** UpgradeableIntent is an intent whose actions can be upgraded. */
export interface UpgradeableIntent {
  /** The intent ID */
  id:
    | IntentId
    | undefined;
  /** The set of private actions that can be upgraded */
  actions: UpgradeableIntent_UpgradeablePrivateAction[];
  /** The treasury used for payments */
  treasury:
    | SolanaAccountId
    | undefined;
  /** The recent root observed at the time of intent creation */
  recentRoot: Hash | undefined;
}

export interface UpgradeableIntent_UpgradeablePrivateAction {
  /**
   * The transaction blob that was signed by the client. Clients *MUST* use
   * the source and destination account in the timelock::TransferWithAuthority
   * instruction to validate all fields provided by server by locally computing
   * the expected addresses.
   */
  transactionBlob:
    | Transaction
    | undefined;
  /**
   * The client's signature for the transaction. Clients *MUST* use this to
   * locally validate the transaction blob provided by server.
   */
  clientSignature:
    | Signature
    | undefined;
  /** The action ID of this transaction */
  actionId: number;
  /** The source account's type, which hints how to efficiently derive source */
  sourceAccountType: AccountType;
  /** The source account's derivation index, which hints how to efficiently derive source */
  sourceDerivationIndex: number;
  /** The original destination account that was paid by the treasury */
  originalDestination:
    | SolanaAccountId
    | undefined;
  /** The original quark amount for the action */
  originalAmount: number;
}

export interface PaymentHistoryItem {
  /** The cursor position of this item. */
  cursor:
    | Cursor
    | undefined;
  /** Exchange data related to the payment */
  exchangeData:
    | ExchangeData
    | undefined;
  /** Is this payment a send or receive? */
  paymentType: PaymentHistoryItem_PaymentType;
  /** If the payment was a SEND, was it a withdraw? */
  isWithdraw: boolean;
  /** If the payment was a RECEIVE, was it a deposit? */
  isDeposit: boolean;
  /** The timestamp of the payment */
  timestamp: Date | undefined;
}

export enum PaymentHistoryItem_PaymentType {
  UNKNOWN = 0,
  SEND = 1,
  RECEIVE = 2,
  UNRECOGNIZED = -1,
}

export function paymentHistoryItem_PaymentTypeFromJSON(object: any): PaymentHistoryItem_PaymentType {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return PaymentHistoryItem_PaymentType.UNKNOWN;
    case 1:
    case "SEND":
      return PaymentHistoryItem_PaymentType.SEND;
    case 2:
    case "RECEIVE":
      return PaymentHistoryItem_PaymentType.RECEIVE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PaymentHistoryItem_PaymentType.UNRECOGNIZED;
  }
}

export function paymentHistoryItem_PaymentTypeToJSON(object: PaymentHistoryItem_PaymentType): string {
  switch (object) {
    case PaymentHistoryItem_PaymentType.UNKNOWN:
      return "UNKNOWN";
    case PaymentHistoryItem_PaymentType.SEND:
      return "SEND";
    case PaymentHistoryItem_PaymentType.RECEIVE:
      return "RECEIVE";
    case PaymentHistoryItem_PaymentType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** ExchangeData defines an amount of Kin with currency exchange data */
export interface ExchangeData {
  /** ISO 4217 alpha-3 currency code. */
  currency: string;
  /**
   * The agreed upon exchange rate. This might not be the same as the
   * actual exchange rate at the time of intent or fund transfer.
   */
  exchangeRate: number;
  /**
   * The agreed upon transfer amount in the currency the payment was made
   * in.
   */
  nativeAmount: number;
  /**
   * The exact amount of quarks to send. This will be used as the source of
   * truth for validating transaction transfer amounts.
   */
  quarks: number;
}

export interface RemainingSendLimit {
  /** Remaining limit to apply on the next transaction */
  nextTransaction: number;
}

export interface Cursor {
  value: Buffer;
}

function createBaseSubmitIntentRequest(): SubmitIntentRequest {
  return { submitActions: undefined, submitSignatures: undefined };
}

export const SubmitIntentRequest = {
  encode(message: SubmitIntentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.submitActions !== undefined) {
      SubmitIntentRequest_SubmitActions.encode(message.submitActions, writer.uint32(10).fork()).ldelim();
    }
    if (message.submitSignatures !== undefined) {
      SubmitIntentRequest_SubmitSignatures.encode(message.submitSignatures, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubmitIntentRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitIntentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.submitActions = SubmitIntentRequest_SubmitActions.decode(reader, reader.uint32());
          break;
        case 2:
          message.submitSignatures = SubmitIntentRequest_SubmitSignatures.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitIntentRequest {
    return {
      submitActions: isSet(object.submitActions)
        ? SubmitIntentRequest_SubmitActions.fromJSON(object.submitActions)
        : undefined,
      submitSignatures: isSet(object.submitSignatures)
        ? SubmitIntentRequest_SubmitSignatures.fromJSON(object.submitSignatures)
        : undefined,
    };
  },

  toJSON(message: SubmitIntentRequest): unknown {
    const obj: any = {};
    message.submitActions !== undefined && (obj.submitActions = message.submitActions
      ? SubmitIntentRequest_SubmitActions.toJSON(message.submitActions)
      : undefined);
    message.submitSignatures !== undefined && (obj.submitSignatures = message.submitSignatures
      ? SubmitIntentRequest_SubmitSignatures.toJSON(message.submitSignatures)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SubmitIntentRequest>, I>>(object: I): SubmitIntentRequest {
    const message = createBaseSubmitIntentRequest();
    message.submitActions = (object.submitActions !== undefined && object.submitActions !== null)
      ? SubmitIntentRequest_SubmitActions.fromPartial(object.submitActions)
      : undefined;
    message.submitSignatures = (object.submitSignatures !== undefined && object.submitSignatures !== null)
      ? SubmitIntentRequest_SubmitSignatures.fromPartial(object.submitSignatures)
      : undefined;
    return message;
  },
};

function createBaseSubmitIntentRequest_SubmitActions(): SubmitIntentRequest_SubmitActions {
  return { id: undefined, owner: undefined, metadata: undefined, actions: [], signature: undefined };
}

export const SubmitIntentRequest_SubmitActions = {
  encode(message: SubmitIntentRequest_SubmitActions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined) {
      IntentId.encode(message.id, writer.uint32(10).fork()).ldelim();
    }
    if (message.owner !== undefined) {
      SolanaAccountId.encode(message.owner, writer.uint32(18).fork()).ldelim();
    }
    if (message.metadata !== undefined) {
      Metadata.encode(message.metadata, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.actions) {
      Action.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubmitIntentRequest_SubmitActions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitIntentRequest_SubmitActions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = IntentId.decode(reader, reader.uint32());
          break;
        case 2:
          message.owner = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.metadata = Metadata.decode(reader, reader.uint32());
          break;
        case 4:
          message.actions.push(Action.decode(reader, reader.uint32()));
          break;
        case 5:
          message.signature = Signature.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitIntentRequest_SubmitActions {
    return {
      id: isSet(object.id) ? IntentId.fromJSON(object.id) : undefined,
      owner: isSet(object.owner) ? SolanaAccountId.fromJSON(object.owner) : undefined,
      metadata: isSet(object.metadata) ? Metadata.fromJSON(object.metadata) : undefined,
      actions: Array.isArray(object?.actions) ? object.actions.map((e: any) => Action.fromJSON(e)) : [],
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
    };
  },

  toJSON(message: SubmitIntentRequest_SubmitActions): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id ? IntentId.toJSON(message.id) : undefined);
    message.owner !== undefined && (obj.owner = message.owner ? SolanaAccountId.toJSON(message.owner) : undefined);
    message.metadata !== undefined && (obj.metadata = message.metadata ? Metadata.toJSON(message.metadata) : undefined);
    if (message.actions) {
      obj.actions = message.actions.map((e) => e ? Action.toJSON(e) : undefined);
    } else {
      obj.actions = [];
    }
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SubmitIntentRequest_SubmitActions>, I>>(
    object: I,
  ): SubmitIntentRequest_SubmitActions {
    const message = createBaseSubmitIntentRequest_SubmitActions();
    message.id = (object.id !== undefined && object.id !== null) ? IntentId.fromPartial(object.id) : undefined;
    message.owner = (object.owner !== undefined && object.owner !== null)
      ? SolanaAccountId.fromPartial(object.owner)
      : undefined;
    message.metadata = (object.metadata !== undefined && object.metadata !== null)
      ? Metadata.fromPartial(object.metadata)
      : undefined;
    message.actions = object.actions?.map((e) => Action.fromPartial(e)) || [];
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    return message;
  },
};

function createBaseSubmitIntentRequest_SubmitSignatures(): SubmitIntentRequest_SubmitSignatures {
  return { signatures: [] };
}

export const SubmitIntentRequest_SubmitSignatures = {
  encode(message: SubmitIntentRequest_SubmitSignatures, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.signatures) {
      Signature.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubmitIntentRequest_SubmitSignatures {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitIntentRequest_SubmitSignatures();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(Signature.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitIntentRequest_SubmitSignatures {
    return {
      signatures: Array.isArray(object?.signatures) ? object.signatures.map((e: any) => Signature.fromJSON(e)) : [],
    };
  },

  toJSON(message: SubmitIntentRequest_SubmitSignatures): unknown {
    const obj: any = {};
    if (message.signatures) {
      obj.signatures = message.signatures.map((e) => e ? Signature.toJSON(e) : undefined);
    } else {
      obj.signatures = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SubmitIntentRequest_SubmitSignatures>, I>>(
    object: I,
  ): SubmitIntentRequest_SubmitSignatures {
    const message = createBaseSubmitIntentRequest_SubmitSignatures();
    message.signatures = object.signatures?.map((e) => Signature.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSubmitIntentResponse(): SubmitIntentResponse {
  return { serverParameters: undefined, success: undefined, error: undefined };
}

export const SubmitIntentResponse = {
  encode(message: SubmitIntentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serverParameters !== undefined) {
      SubmitIntentResponse_ServerParameters.encode(message.serverParameters, writer.uint32(10).fork()).ldelim();
    }
    if (message.success !== undefined) {
      SubmitIntentResponse_Success.encode(message.success, writer.uint32(18).fork()).ldelim();
    }
    if (message.error !== undefined) {
      SubmitIntentResponse_Error.encode(message.error, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubmitIntentResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitIntentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serverParameters = SubmitIntentResponse_ServerParameters.decode(reader, reader.uint32());
          break;
        case 2:
          message.success = SubmitIntentResponse_Success.decode(reader, reader.uint32());
          break;
        case 3:
          message.error = SubmitIntentResponse_Error.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitIntentResponse {
    return {
      serverParameters: isSet(object.serverParameters)
        ? SubmitIntentResponse_ServerParameters.fromJSON(object.serverParameters)
        : undefined,
      success: isSet(object.success) ? SubmitIntentResponse_Success.fromJSON(object.success) : undefined,
      error: isSet(object.error) ? SubmitIntentResponse_Error.fromJSON(object.error) : undefined,
    };
  },

  toJSON(message: SubmitIntentResponse): unknown {
    const obj: any = {};
    message.serverParameters !== undefined && (obj.serverParameters = message.serverParameters
      ? SubmitIntentResponse_ServerParameters.toJSON(message.serverParameters)
      : undefined);
    message.success !== undefined &&
      (obj.success = message.success ? SubmitIntentResponse_Success.toJSON(message.success) : undefined);
    message.error !== undefined &&
      (obj.error = message.error ? SubmitIntentResponse_Error.toJSON(message.error) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SubmitIntentResponse>, I>>(object: I): SubmitIntentResponse {
    const message = createBaseSubmitIntentResponse();
    message.serverParameters = (object.serverParameters !== undefined && object.serverParameters !== null)
      ? SubmitIntentResponse_ServerParameters.fromPartial(object.serverParameters)
      : undefined;
    message.success = (object.success !== undefined && object.success !== null)
      ? SubmitIntentResponse_Success.fromPartial(object.success)
      : undefined;
    message.error = (object.error !== undefined && object.error !== null)
      ? SubmitIntentResponse_Error.fromPartial(object.error)
      : undefined;
    return message;
  },
};

function createBaseSubmitIntentResponse_ServerParameters(): SubmitIntentResponse_ServerParameters {
  return { serverParameters: [] };
}

export const SubmitIntentResponse_ServerParameters = {
  encode(message: SubmitIntentResponse_ServerParameters, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.serverParameters) {
      ServerParameter.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubmitIntentResponse_ServerParameters {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitIntentResponse_ServerParameters();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serverParameters.push(ServerParameter.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitIntentResponse_ServerParameters {
    return {
      serverParameters: Array.isArray(object?.serverParameters)
        ? object.serverParameters.map((e: any) => ServerParameter.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SubmitIntentResponse_ServerParameters): unknown {
    const obj: any = {};
    if (message.serverParameters) {
      obj.serverParameters = message.serverParameters.map((e) => e ? ServerParameter.toJSON(e) : undefined);
    } else {
      obj.serverParameters = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SubmitIntentResponse_ServerParameters>, I>>(
    object: I,
  ): SubmitIntentResponse_ServerParameters {
    const message = createBaseSubmitIntentResponse_ServerParameters();
    message.serverParameters = object.serverParameters?.map((e) => ServerParameter.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSubmitIntentResponse_Success(): SubmitIntentResponse_Success {
  return { code: 0 };
}

export const SubmitIntentResponse_Success = {
  encode(message: SubmitIntentResponse_Success, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubmitIntentResponse_Success {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitIntentResponse_Success();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.code = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitIntentResponse_Success {
    return { code: isSet(object.code) ? submitIntentResponse_Success_CodeFromJSON(object.code) : 0 };
  },

  toJSON(message: SubmitIntentResponse_Success): unknown {
    const obj: any = {};
    message.code !== undefined && (obj.code = submitIntentResponse_Success_CodeToJSON(message.code));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SubmitIntentResponse_Success>, I>>(object: I): SubmitIntentResponse_Success {
    const message = createBaseSubmitIntentResponse_Success();
    message.code = object.code ?? 0;
    return message;
  },
};

function createBaseSubmitIntentResponse_Error(): SubmitIntentResponse_Error {
  return { code: 0, errorDetails: [] };
}

export const SubmitIntentResponse_Error = {
  encode(message: SubmitIntentResponse_Error, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    for (const v of message.errorDetails) {
      ErrorDetails.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubmitIntentResponse_Error {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitIntentResponse_Error();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.code = reader.int32() as any;
          break;
        case 2:
          message.errorDetails.push(ErrorDetails.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitIntentResponse_Error {
    return {
      code: isSet(object.code) ? submitIntentResponse_Error_CodeFromJSON(object.code) : 0,
      errorDetails: Array.isArray(object?.errorDetails)
        ? object.errorDetails.map((e: any) => ErrorDetails.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SubmitIntentResponse_Error): unknown {
    const obj: any = {};
    message.code !== undefined && (obj.code = submitIntentResponse_Error_CodeToJSON(message.code));
    if (message.errorDetails) {
      obj.errorDetails = message.errorDetails.map((e) => e ? ErrorDetails.toJSON(e) : undefined);
    } else {
      obj.errorDetails = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SubmitIntentResponse_Error>, I>>(object: I): SubmitIntentResponse_Error {
    const message = createBaseSubmitIntentResponse_Error();
    message.code = object.code ?? 0;
    message.errorDetails = object.errorDetails?.map((e) => ErrorDetails.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetPrivacyUpgradeStatusRequest(): GetPrivacyUpgradeStatusRequest {
  return { intentId: undefined, actionId: 0 };
}

export const GetPrivacyUpgradeStatusRequest = {
  encode(message: GetPrivacyUpgradeStatusRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.intentId !== undefined) {
      IntentId.encode(message.intentId, writer.uint32(10).fork()).ldelim();
    }
    if (message.actionId !== 0) {
      writer.uint32(16).uint32(message.actionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPrivacyUpgradeStatusRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPrivacyUpgradeStatusRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.intentId = IntentId.decode(reader, reader.uint32());
          break;
        case 2:
          message.actionId = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPrivacyUpgradeStatusRequest {
    return {
      intentId: isSet(object.intentId) ? IntentId.fromJSON(object.intentId) : undefined,
      actionId: isSet(object.actionId) ? Number(object.actionId) : 0,
    };
  },

  toJSON(message: GetPrivacyUpgradeStatusRequest): unknown {
    const obj: any = {};
    message.intentId !== undefined && (obj.intentId = message.intentId ? IntentId.toJSON(message.intentId) : undefined);
    message.actionId !== undefined && (obj.actionId = Math.round(message.actionId));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetPrivacyUpgradeStatusRequest>, I>>(
    object: I,
  ): GetPrivacyUpgradeStatusRequest {
    const message = createBaseGetPrivacyUpgradeStatusRequest();
    message.intentId = (object.intentId !== undefined && object.intentId !== null)
      ? IntentId.fromPartial(object.intentId)
      : undefined;
    message.actionId = object.actionId ?? 0;
    return message;
  },
};

function createBaseGetPrivacyUpgradeStatusResponse(): GetPrivacyUpgradeStatusResponse {
  return { result: 0, status: 0 };
}

export const GetPrivacyUpgradeStatusResponse = {
  encode(message: GetPrivacyUpgradeStatusResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    if (message.status !== 0) {
      writer.uint32(16).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPrivacyUpgradeStatusResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPrivacyUpgradeStatusResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.status = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPrivacyUpgradeStatusResponse {
    return {
      result: isSet(object.result) ? getPrivacyUpgradeStatusResponse_ResultFromJSON(object.result) : 0,
      status: isSet(object.status) ? getPrivacyUpgradeStatusResponse_StatusFromJSON(object.status) : 0,
    };
  },

  toJSON(message: GetPrivacyUpgradeStatusResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getPrivacyUpgradeStatusResponse_ResultToJSON(message.result));
    message.status !== undefined && (obj.status = getPrivacyUpgradeStatusResponse_StatusToJSON(message.status));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetPrivacyUpgradeStatusResponse>, I>>(
    object: I,
  ): GetPrivacyUpgradeStatusResponse {
    const message = createBaseGetPrivacyUpgradeStatusResponse();
    message.result = object.result ?? 0;
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseGetPrioritizedIntentsForPrivacyUpgradeRequest(): GetPrioritizedIntentsForPrivacyUpgradeRequest {
  return { owner: undefined, limit: 0, signature: undefined };
}

export const GetPrioritizedIntentsForPrivacyUpgradeRequest = {
  encode(message: GetPrioritizedIntentsForPrivacyUpgradeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.owner !== undefined) {
      SolanaAccountId.encode(message.owner, writer.uint32(10).fork()).ldelim();
    }
    if (message.limit !== 0) {
      writer.uint32(16).uint32(message.limit);
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPrioritizedIntentsForPrivacyUpgradeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPrioritizedIntentsForPrivacyUpgradeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.owner = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.limit = reader.uint32();
          break;
        case 3:
          message.signature = Signature.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPrioritizedIntentsForPrivacyUpgradeRequest {
    return {
      owner: isSet(object.owner) ? SolanaAccountId.fromJSON(object.owner) : undefined,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
    };
  },

  toJSON(message: GetPrioritizedIntentsForPrivacyUpgradeRequest): unknown {
    const obj: any = {};
    message.owner !== undefined && (obj.owner = message.owner ? SolanaAccountId.toJSON(message.owner) : undefined);
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetPrioritizedIntentsForPrivacyUpgradeRequest>, I>>(
    object: I,
  ): GetPrioritizedIntentsForPrivacyUpgradeRequest {
    const message = createBaseGetPrioritizedIntentsForPrivacyUpgradeRequest();
    message.owner = (object.owner !== undefined && object.owner !== null)
      ? SolanaAccountId.fromPartial(object.owner)
      : undefined;
    message.limit = object.limit ?? 0;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    return message;
  },
};

function createBaseGetPrioritizedIntentsForPrivacyUpgradeResponse(): GetPrioritizedIntentsForPrivacyUpgradeResponse {
  return { result: 0, items: [] };
}

export const GetPrioritizedIntentsForPrivacyUpgradeResponse = {
  encode(
    message: GetPrioritizedIntentsForPrivacyUpgradeResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    for (const v of message.items) {
      UpgradeableIntent.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPrioritizedIntentsForPrivacyUpgradeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPrioritizedIntentsForPrivacyUpgradeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.items.push(UpgradeableIntent.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPrioritizedIntentsForPrivacyUpgradeResponse {
    return {
      result: isSet(object.result) ? getPrioritizedIntentsForPrivacyUpgradeResponse_ResultFromJSON(object.result) : 0,
      items: Array.isArray(object?.items) ? object.items.map((e: any) => UpgradeableIntent.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetPrioritizedIntentsForPrivacyUpgradeResponse): unknown {
    const obj: any = {};
    message.result !== undefined &&
      (obj.result = getPrioritizedIntentsForPrivacyUpgradeResponse_ResultToJSON(message.result));
    if (message.items) {
      obj.items = message.items.map((e) => e ? UpgradeableIntent.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetPrioritizedIntentsForPrivacyUpgradeResponse>, I>>(
    object: I,
  ): GetPrioritizedIntentsForPrivacyUpgradeResponse {
    const message = createBaseGetPrioritizedIntentsForPrivacyUpgradeResponse();
    message.result = object.result ?? 0;
    message.items = object.items?.map((e) => UpgradeableIntent.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetLimitsRequest(): GetLimitsRequest {
  return { owner: undefined, signature: undefined, consumedSince: undefined };
}

export const GetLimitsRequest = {
  encode(message: GetLimitsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.owner !== undefined) {
      SolanaAccountId.encode(message.owner, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    if (message.consumedSince !== undefined) {
      Timestamp.encode(toTimestamp(message.consumedSince), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLimitsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLimitsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.owner = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.signature = Signature.decode(reader, reader.uint32());
          break;
        case 3:
          message.consumedSince = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLimitsRequest {
    return {
      owner: isSet(object.owner) ? SolanaAccountId.fromJSON(object.owner) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
      consumedSince: isSet(object.consumedSince) ? fromJsonTimestamp(object.consumedSince) : undefined,
    };
  },

  toJSON(message: GetLimitsRequest): unknown {
    const obj: any = {};
    message.owner !== undefined && (obj.owner = message.owner ? SolanaAccountId.toJSON(message.owner) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    message.consumedSince !== undefined && (obj.consumedSince = message.consumedSince.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetLimitsRequest>, I>>(object: I): GetLimitsRequest {
    const message = createBaseGetLimitsRequest();
    message.owner = (object.owner !== undefined && object.owner !== null)
      ? SolanaAccountId.fromPartial(object.owner)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    message.consumedSince = object.consumedSince ?? undefined;
    return message;
  },
};

function createBaseGetLimitsResponse(): GetLimitsResponse {
  return { result: 0, remainingSendLimitsByCurrency: {} };
}

export const GetLimitsResponse = {
  encode(message: GetLimitsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    Object.entries(message.remainingSendLimitsByCurrency).forEach(([key, value]) => {
      GetLimitsResponse_RemainingSendLimitsByCurrencyEntry.encode({ key: key as any, value }, writer.uint32(18).fork())
        .ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLimitsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLimitsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          const entry2 = GetLimitsResponse_RemainingSendLimitsByCurrencyEntry.decode(reader, reader.uint32());
          if (entry2.value !== undefined) {
            message.remainingSendLimitsByCurrency[entry2.key] = entry2.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLimitsResponse {
    return {
      result: isSet(object.result) ? getLimitsResponse_ResultFromJSON(object.result) : 0,
      remainingSendLimitsByCurrency: isObject(object.remainingSendLimitsByCurrency)
        ? Object.entries(object.remainingSendLimitsByCurrency).reduce<{ [key: string]: RemainingSendLimit }>(
          (acc, [key, value]) => {
            acc[key] = RemainingSendLimit.fromJSON(value);
            return acc;
          },
          {},
        )
        : {},
    };
  },

  toJSON(message: GetLimitsResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getLimitsResponse_ResultToJSON(message.result));
    obj.remainingSendLimitsByCurrency = {};
    if (message.remainingSendLimitsByCurrency) {
      Object.entries(message.remainingSendLimitsByCurrency).forEach(([k, v]) => {
        obj.remainingSendLimitsByCurrency[k] = RemainingSendLimit.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetLimitsResponse>, I>>(object: I): GetLimitsResponse {
    const message = createBaseGetLimitsResponse();
    message.result = object.result ?? 0;
    message.remainingSendLimitsByCurrency = Object.entries(object.remainingSendLimitsByCurrency ?? {}).reduce<
      { [key: string]: RemainingSendLimit }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = RemainingSendLimit.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseGetLimitsResponse_RemainingSendLimitsByCurrencyEntry(): GetLimitsResponse_RemainingSendLimitsByCurrencyEntry {
  return { key: "", value: undefined };
}

export const GetLimitsResponse_RemainingSendLimitsByCurrencyEntry = {
  encode(
    message: GetLimitsResponse_RemainingSendLimitsByCurrencyEntry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      RemainingSendLimit.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLimitsResponse_RemainingSendLimitsByCurrencyEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLimitsResponse_RemainingSendLimitsByCurrencyEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = RemainingSendLimit.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLimitsResponse_RemainingSendLimitsByCurrencyEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? RemainingSendLimit.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: GetLimitsResponse_RemainingSendLimitsByCurrencyEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value ? RemainingSendLimit.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetLimitsResponse_RemainingSendLimitsByCurrencyEntry>, I>>(
    object: I,
  ): GetLimitsResponse_RemainingSendLimitsByCurrencyEntry {
    const message = createBaseGetLimitsResponse_RemainingSendLimitsByCurrencyEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? RemainingSendLimit.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseGetPaymentHistoryRequest(): GetPaymentHistoryRequest {
  return { owner: undefined, cursor: undefined, pageSize: 0, direction: 0, signature: undefined };
}

export const GetPaymentHistoryRequest = {
  encode(message: GetPaymentHistoryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.owner !== undefined) {
      SolanaAccountId.encode(message.owner, writer.uint32(10).fork()).ldelim();
    }
    if (message.cursor !== undefined) {
      Cursor.encode(message.cursor, writer.uint32(18).fork()).ldelim();
    }
    if (message.pageSize !== 0) {
      writer.uint32(24).uint32(message.pageSize);
    }
    if (message.direction !== 0) {
      writer.uint32(32).int32(message.direction);
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPaymentHistoryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPaymentHistoryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.owner = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.cursor = Cursor.decode(reader, reader.uint32());
          break;
        case 3:
          message.pageSize = reader.uint32();
          break;
        case 4:
          message.direction = reader.int32() as any;
          break;
        case 5:
          message.signature = Signature.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPaymentHistoryRequest {
    return {
      owner: isSet(object.owner) ? SolanaAccountId.fromJSON(object.owner) : undefined,
      cursor: isSet(object.cursor) ? Cursor.fromJSON(object.cursor) : undefined,
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
      direction: isSet(object.direction) ? getPaymentHistoryRequest_DirectionFromJSON(object.direction) : 0,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
    };
  },

  toJSON(message: GetPaymentHistoryRequest): unknown {
    const obj: any = {};
    message.owner !== undefined && (obj.owner = message.owner ? SolanaAccountId.toJSON(message.owner) : undefined);
    message.cursor !== undefined && (obj.cursor = message.cursor ? Cursor.toJSON(message.cursor) : undefined);
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    message.direction !== undefined && (obj.direction = getPaymentHistoryRequest_DirectionToJSON(message.direction));
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetPaymentHistoryRequest>, I>>(object: I): GetPaymentHistoryRequest {
    const message = createBaseGetPaymentHistoryRequest();
    message.owner = (object.owner !== undefined && object.owner !== null)
      ? SolanaAccountId.fromPartial(object.owner)
      : undefined;
    message.cursor = (object.cursor !== undefined && object.cursor !== null)
      ? Cursor.fromPartial(object.cursor)
      : undefined;
    message.pageSize = object.pageSize ?? 0;
    message.direction = object.direction ?? 0;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    return message;
  },
};

function createBaseGetPaymentHistoryResponse(): GetPaymentHistoryResponse {
  return { result: 0, items: [] };
}

export const GetPaymentHistoryResponse = {
  encode(message: GetPaymentHistoryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    for (const v of message.items) {
      PaymentHistoryItem.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPaymentHistoryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPaymentHistoryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.items.push(PaymentHistoryItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPaymentHistoryResponse {
    return {
      result: isSet(object.result) ? getPaymentHistoryResponse_ResultFromJSON(object.result) : 0,
      items: Array.isArray(object?.items) ? object.items.map((e: any) => PaymentHistoryItem.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetPaymentHistoryResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getPaymentHistoryResponse_ResultToJSON(message.result));
    if (message.items) {
      obj.items = message.items.map((e) => e ? PaymentHistoryItem.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetPaymentHistoryResponse>, I>>(object: I): GetPaymentHistoryResponse {
    const message = createBaseGetPaymentHistoryResponse();
    message.result = object.result ?? 0;
    message.items = object.items?.map((e) => PaymentHistoryItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMetadata(): Metadata {
  return { openAccounts: undefined, sendPayment: undefined, receivePayments: undefined, upgradePrivacy: undefined };
}

export const Metadata = {
  encode(message: Metadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.openAccounts !== undefined) {
      OpenAccountsMetadata.encode(message.openAccounts, writer.uint32(10).fork()).ldelim();
    }
    if (message.sendPayment !== undefined) {
      SendPaymentMetadata.encode(message.sendPayment, writer.uint32(18).fork()).ldelim();
    }
    if (message.receivePayments !== undefined) {
      ReceivePaymentsMetadata.encode(message.receivePayments, writer.uint32(26).fork()).ldelim();
    }
    if (message.upgradePrivacy !== undefined) {
      UpgradePrivacyMetadata.encode(message.upgradePrivacy, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Metadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.openAccounts = OpenAccountsMetadata.decode(reader, reader.uint32());
          break;
        case 2:
          message.sendPayment = SendPaymentMetadata.decode(reader, reader.uint32());
          break;
        case 3:
          message.receivePayments = ReceivePaymentsMetadata.decode(reader, reader.uint32());
          break;
        case 4:
          message.upgradePrivacy = UpgradePrivacyMetadata.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Metadata {
    return {
      openAccounts: isSet(object.openAccounts) ? OpenAccountsMetadata.fromJSON(object.openAccounts) : undefined,
      sendPayment: isSet(object.sendPayment) ? SendPaymentMetadata.fromJSON(object.sendPayment) : undefined,
      receivePayments: isSet(object.receivePayments)
        ? ReceivePaymentsMetadata.fromJSON(object.receivePayments)
        : undefined,
      upgradePrivacy: isSet(object.upgradePrivacy) ? UpgradePrivacyMetadata.fromJSON(object.upgradePrivacy) : undefined,
    };
  },

  toJSON(message: Metadata): unknown {
    const obj: any = {};
    message.openAccounts !== undefined &&
      (obj.openAccounts = message.openAccounts ? OpenAccountsMetadata.toJSON(message.openAccounts) : undefined);
    message.sendPayment !== undefined &&
      (obj.sendPayment = message.sendPayment ? SendPaymentMetadata.toJSON(message.sendPayment) : undefined);
    message.receivePayments !== undefined && (obj.receivePayments = message.receivePayments
      ? ReceivePaymentsMetadata.toJSON(message.receivePayments)
      : undefined);
    message.upgradePrivacy !== undefined &&
      (obj.upgradePrivacy = message.upgradePrivacy ? UpgradePrivacyMetadata.toJSON(message.upgradePrivacy) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Metadata>, I>>(object: I): Metadata {
    const message = createBaseMetadata();
    message.openAccounts = (object.openAccounts !== undefined && object.openAccounts !== null)
      ? OpenAccountsMetadata.fromPartial(object.openAccounts)
      : undefined;
    message.sendPayment = (object.sendPayment !== undefined && object.sendPayment !== null)
      ? SendPaymentMetadata.fromPartial(object.sendPayment)
      : undefined;
    message.receivePayments = (object.receivePayments !== undefined && object.receivePayments !== null)
      ? ReceivePaymentsMetadata.fromPartial(object.receivePayments)
      : undefined;
    message.upgradePrivacy = (object.upgradePrivacy !== undefined && object.upgradePrivacy !== null)
      ? UpgradePrivacyMetadata.fromPartial(object.upgradePrivacy)
      : undefined;
    return message;
  },
};

function createBaseOpenAccountsMetadata(): OpenAccountsMetadata {
  return {};
}

export const OpenAccountsMetadata = {
  encode(_: OpenAccountsMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OpenAccountsMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOpenAccountsMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): OpenAccountsMetadata {
    return {};
  },

  toJSON(_: OpenAccountsMetadata): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<OpenAccountsMetadata>, I>>(_: I): OpenAccountsMetadata {
    const message = createBaseOpenAccountsMetadata();
    return message;
  },
};

function createBaseSendPaymentMetadata(): SendPaymentMetadata {
  return { destination: undefined, exchangeData: undefined, isWithdrawal: false };
}

export const SendPaymentMetadata = {
  encode(message: SendPaymentMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.destination !== undefined) {
      SolanaAccountId.encode(message.destination, writer.uint32(10).fork()).ldelim();
    }
    if (message.exchangeData !== undefined) {
      ExchangeData.encode(message.exchangeData, writer.uint32(18).fork()).ldelim();
    }
    if (message.isWithdrawal === true) {
      writer.uint32(24).bool(message.isWithdrawal);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendPaymentMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendPaymentMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.destination = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.exchangeData = ExchangeData.decode(reader, reader.uint32());
          break;
        case 3:
          message.isWithdrawal = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendPaymentMetadata {
    return {
      destination: isSet(object.destination) ? SolanaAccountId.fromJSON(object.destination) : undefined,
      exchangeData: isSet(object.exchangeData) ? ExchangeData.fromJSON(object.exchangeData) : undefined,
      isWithdrawal: isSet(object.isWithdrawal) ? Boolean(object.isWithdrawal) : false,
    };
  },

  toJSON(message: SendPaymentMetadata): unknown {
    const obj: any = {};
    message.destination !== undefined &&
      (obj.destination = message.destination ? SolanaAccountId.toJSON(message.destination) : undefined);
    message.exchangeData !== undefined &&
      (obj.exchangeData = message.exchangeData ? ExchangeData.toJSON(message.exchangeData) : undefined);
    message.isWithdrawal !== undefined && (obj.isWithdrawal = message.isWithdrawal);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SendPaymentMetadata>, I>>(object: I): SendPaymentMetadata {
    const message = createBaseSendPaymentMetadata();
    message.destination = (object.destination !== undefined && object.destination !== null)
      ? SolanaAccountId.fromPartial(object.destination)
      : undefined;
    message.exchangeData = (object.exchangeData !== undefined && object.exchangeData !== null)
      ? ExchangeData.fromPartial(object.exchangeData)
      : undefined;
    message.isWithdrawal = object.isWithdrawal ?? false;
    return message;
  },
};

function createBaseReceivePaymentsMetadata(): ReceivePaymentsMetadata {
  return { source: undefined, quarks: 0, isDeposit: false };
}

export const ReceivePaymentsMetadata = {
  encode(message: ReceivePaymentsMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.source !== undefined) {
      SolanaAccountId.encode(message.source, writer.uint32(10).fork()).ldelim();
    }
    if (message.quarks !== 0) {
      writer.uint32(16).uint64(message.quarks);
    }
    if (message.isDeposit === true) {
      writer.uint32(24).bool(message.isDeposit);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReceivePaymentsMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReceivePaymentsMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.source = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.quarks = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.isDeposit = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReceivePaymentsMetadata {
    return {
      source: isSet(object.source) ? SolanaAccountId.fromJSON(object.source) : undefined,
      quarks: isSet(object.quarks) ? Number(object.quarks) : 0,
      isDeposit: isSet(object.isDeposit) ? Boolean(object.isDeposit) : false,
    };
  },

  toJSON(message: ReceivePaymentsMetadata): unknown {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source ? SolanaAccountId.toJSON(message.source) : undefined);
    message.quarks !== undefined && (obj.quarks = Math.round(message.quarks));
    message.isDeposit !== undefined && (obj.isDeposit = message.isDeposit);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ReceivePaymentsMetadata>, I>>(object: I): ReceivePaymentsMetadata {
    const message = createBaseReceivePaymentsMetadata();
    message.source = (object.source !== undefined && object.source !== null)
      ? SolanaAccountId.fromPartial(object.source)
      : undefined;
    message.quarks = object.quarks ?? 0;
    message.isDeposit = object.isDeposit ?? false;
    return message;
  },
};

function createBaseUpgradePrivacyMetadata(): UpgradePrivacyMetadata {
  return {};
}

export const UpgradePrivacyMetadata = {
  encode(_: UpgradePrivacyMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpgradePrivacyMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpgradePrivacyMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpgradePrivacyMetadata {
    return {};
  },

  toJSON(_: UpgradePrivacyMetadata): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpgradePrivacyMetadata>, I>>(_: I): UpgradePrivacyMetadata {
    const message = createBaseUpgradePrivacyMetadata();
    return message;
  },
};

function createBaseAction(): Action {
  return {
    id: 0,
    openAccount: undefined,
    closeEmptyAccount: undefined,
    closeDormantAccount: undefined,
    noPrivacyWithdraw: undefined,
    temporaryPrivacyTransfer: undefined,
    temporaryPrivacyExchange: undefined,
    permanentPrivacyUpgrade: undefined,
  };
}

export const Action = {
  encode(message: Action, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.openAccount !== undefined) {
      OpenAccountAction.encode(message.openAccount, writer.uint32(18).fork()).ldelim();
    }
    if (message.closeEmptyAccount !== undefined) {
      CloseEmptyAccountAction.encode(message.closeEmptyAccount, writer.uint32(26).fork()).ldelim();
    }
    if (message.closeDormantAccount !== undefined) {
      CloseDormantAccountAction.encode(message.closeDormantAccount, writer.uint32(34).fork()).ldelim();
    }
    if (message.noPrivacyWithdraw !== undefined) {
      NoPrivacyWithdrawAction.encode(message.noPrivacyWithdraw, writer.uint32(50).fork()).ldelim();
    }
    if (message.temporaryPrivacyTransfer !== undefined) {
      TemporaryPrivacyTransferAction.encode(message.temporaryPrivacyTransfer, writer.uint32(58).fork()).ldelim();
    }
    if (message.temporaryPrivacyExchange !== undefined) {
      TemporaryPrivacyExchangeAction.encode(message.temporaryPrivacyExchange, writer.uint32(66).fork()).ldelim();
    }
    if (message.permanentPrivacyUpgrade !== undefined) {
      PermanentPrivacyUpgradeAction.encode(message.permanentPrivacyUpgrade, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Action {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        case 2:
          message.openAccount = OpenAccountAction.decode(reader, reader.uint32());
          break;
        case 3:
          message.closeEmptyAccount = CloseEmptyAccountAction.decode(reader, reader.uint32());
          break;
        case 4:
          message.closeDormantAccount = CloseDormantAccountAction.decode(reader, reader.uint32());
          break;
        case 6:
          message.noPrivacyWithdraw = NoPrivacyWithdrawAction.decode(reader, reader.uint32());
          break;
        case 7:
          message.temporaryPrivacyTransfer = TemporaryPrivacyTransferAction.decode(reader, reader.uint32());
          break;
        case 8:
          message.temporaryPrivacyExchange = TemporaryPrivacyExchangeAction.decode(reader, reader.uint32());
          break;
        case 9:
          message.permanentPrivacyUpgrade = PermanentPrivacyUpgradeAction.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Action {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      openAccount: isSet(object.openAccount) ? OpenAccountAction.fromJSON(object.openAccount) : undefined,
      closeEmptyAccount: isSet(object.closeEmptyAccount)
        ? CloseEmptyAccountAction.fromJSON(object.closeEmptyAccount)
        : undefined,
      closeDormantAccount: isSet(object.closeDormantAccount)
        ? CloseDormantAccountAction.fromJSON(object.closeDormantAccount)
        : undefined,
      noPrivacyWithdraw: isSet(object.noPrivacyWithdraw)
        ? NoPrivacyWithdrawAction.fromJSON(object.noPrivacyWithdraw)
        : undefined,
      temporaryPrivacyTransfer: isSet(object.temporaryPrivacyTransfer)
        ? TemporaryPrivacyTransferAction.fromJSON(object.temporaryPrivacyTransfer)
        : undefined,
      temporaryPrivacyExchange: isSet(object.temporaryPrivacyExchange)
        ? TemporaryPrivacyExchangeAction.fromJSON(object.temporaryPrivacyExchange)
        : undefined,
      permanentPrivacyUpgrade: isSet(object.permanentPrivacyUpgrade)
        ? PermanentPrivacyUpgradeAction.fromJSON(object.permanentPrivacyUpgrade)
        : undefined,
    };
  },

  toJSON(message: Action): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.openAccount !== undefined &&
      (obj.openAccount = message.openAccount ? OpenAccountAction.toJSON(message.openAccount) : undefined);
    message.closeEmptyAccount !== undefined && (obj.closeEmptyAccount = message.closeEmptyAccount
      ? CloseEmptyAccountAction.toJSON(message.closeEmptyAccount)
      : undefined);
    message.closeDormantAccount !== undefined && (obj.closeDormantAccount = message.closeDormantAccount
      ? CloseDormantAccountAction.toJSON(message.closeDormantAccount)
      : undefined);
    message.noPrivacyWithdraw !== undefined && (obj.noPrivacyWithdraw = message.noPrivacyWithdraw
      ? NoPrivacyWithdrawAction.toJSON(message.noPrivacyWithdraw)
      : undefined);
    message.temporaryPrivacyTransfer !== undefined && (obj.temporaryPrivacyTransfer = message.temporaryPrivacyTransfer
      ? TemporaryPrivacyTransferAction.toJSON(message.temporaryPrivacyTransfer)
      : undefined);
    message.temporaryPrivacyExchange !== undefined && (obj.temporaryPrivacyExchange = message.temporaryPrivacyExchange
      ? TemporaryPrivacyExchangeAction.toJSON(message.temporaryPrivacyExchange)
      : undefined);
    message.permanentPrivacyUpgrade !== undefined && (obj.permanentPrivacyUpgrade = message.permanentPrivacyUpgrade
      ? PermanentPrivacyUpgradeAction.toJSON(message.permanentPrivacyUpgrade)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Action>, I>>(object: I): Action {
    const message = createBaseAction();
    message.id = object.id ?? 0;
    message.openAccount = (object.openAccount !== undefined && object.openAccount !== null)
      ? OpenAccountAction.fromPartial(object.openAccount)
      : undefined;
    message.closeEmptyAccount = (object.closeEmptyAccount !== undefined && object.closeEmptyAccount !== null)
      ? CloseEmptyAccountAction.fromPartial(object.closeEmptyAccount)
      : undefined;
    message.closeDormantAccount = (object.closeDormantAccount !== undefined && object.closeDormantAccount !== null)
      ? CloseDormantAccountAction.fromPartial(object.closeDormantAccount)
      : undefined;
    message.noPrivacyWithdraw = (object.noPrivacyWithdraw !== undefined && object.noPrivacyWithdraw !== null)
      ? NoPrivacyWithdrawAction.fromPartial(object.noPrivacyWithdraw)
      : undefined;
    message.temporaryPrivacyTransfer =
      (object.temporaryPrivacyTransfer !== undefined && object.temporaryPrivacyTransfer !== null)
        ? TemporaryPrivacyTransferAction.fromPartial(object.temporaryPrivacyTransfer)
        : undefined;
    message.temporaryPrivacyExchange =
      (object.temporaryPrivacyExchange !== undefined && object.temporaryPrivacyExchange !== null)
        ? TemporaryPrivacyExchangeAction.fromPartial(object.temporaryPrivacyExchange)
        : undefined;
    message.permanentPrivacyUpgrade =
      (object.permanentPrivacyUpgrade !== undefined && object.permanentPrivacyUpgrade !== null)
        ? PermanentPrivacyUpgradeAction.fromPartial(object.permanentPrivacyUpgrade)
        : undefined;
    return message;
  },
};

function createBaseOpenAccountAction(): OpenAccountAction {
  return {
    accountType: 0,
    owner: undefined,
    index: 0,
    authority: undefined,
    token: undefined,
    authoritySignature: undefined,
  };
}

export const OpenAccountAction = {
  encode(message: OpenAccountAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountType !== 0) {
      writer.uint32(8).int32(message.accountType);
    }
    if (message.owner !== undefined) {
      SolanaAccountId.encode(message.owner, writer.uint32(18).fork()).ldelim();
    }
    if (message.index !== 0) {
      writer.uint32(24).uint64(message.index);
    }
    if (message.authority !== undefined) {
      SolanaAccountId.encode(message.authority, writer.uint32(34).fork()).ldelim();
    }
    if (message.token !== undefined) {
      SolanaAccountId.encode(message.token, writer.uint32(42).fork()).ldelim();
    }
    if (message.authoritySignature !== undefined) {
      Signature.encode(message.authoritySignature, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OpenAccountAction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOpenAccountAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountType = reader.int32() as any;
          break;
        case 2:
          message.owner = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.index = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.authority = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 5:
          message.token = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 6:
          message.authoritySignature = Signature.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OpenAccountAction {
    return {
      accountType: isSet(object.accountType) ? accountTypeFromJSON(object.accountType) : 0,
      owner: isSet(object.owner) ? SolanaAccountId.fromJSON(object.owner) : undefined,
      index: isSet(object.index) ? Number(object.index) : 0,
      authority: isSet(object.authority) ? SolanaAccountId.fromJSON(object.authority) : undefined,
      token: isSet(object.token) ? SolanaAccountId.fromJSON(object.token) : undefined,
      authoritySignature: isSet(object.authoritySignature) ? Signature.fromJSON(object.authoritySignature) : undefined,
    };
  },

  toJSON(message: OpenAccountAction): unknown {
    const obj: any = {};
    message.accountType !== undefined && (obj.accountType = accountTypeToJSON(message.accountType));
    message.owner !== undefined && (obj.owner = message.owner ? SolanaAccountId.toJSON(message.owner) : undefined);
    message.index !== undefined && (obj.index = Math.round(message.index));
    message.authority !== undefined &&
      (obj.authority = message.authority ? SolanaAccountId.toJSON(message.authority) : undefined);
    message.token !== undefined && (obj.token = message.token ? SolanaAccountId.toJSON(message.token) : undefined);
    message.authoritySignature !== undefined &&
      (obj.authoritySignature = message.authoritySignature ? Signature.toJSON(message.authoritySignature) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<OpenAccountAction>, I>>(object: I): OpenAccountAction {
    const message = createBaseOpenAccountAction();
    message.accountType = object.accountType ?? 0;
    message.owner = (object.owner !== undefined && object.owner !== null)
      ? SolanaAccountId.fromPartial(object.owner)
      : undefined;
    message.index = object.index ?? 0;
    message.authority = (object.authority !== undefined && object.authority !== null)
      ? SolanaAccountId.fromPartial(object.authority)
      : undefined;
    message.token = (object.token !== undefined && object.token !== null)
      ? SolanaAccountId.fromPartial(object.token)
      : undefined;
    message.authoritySignature = (object.authoritySignature !== undefined && object.authoritySignature !== null)
      ? Signature.fromPartial(object.authoritySignature)
      : undefined;
    return message;
  },
};

function createBaseCloseEmptyAccountAction(): CloseEmptyAccountAction {
  return { accountType: 0, authority: undefined, token: undefined };
}

export const CloseEmptyAccountAction = {
  encode(message: CloseEmptyAccountAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountType !== 0) {
      writer.uint32(8).int32(message.accountType);
    }
    if (message.authority !== undefined) {
      SolanaAccountId.encode(message.authority, writer.uint32(18).fork()).ldelim();
    }
    if (message.token !== undefined) {
      SolanaAccountId.encode(message.token, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CloseEmptyAccountAction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCloseEmptyAccountAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountType = reader.int32() as any;
          break;
        case 2:
          message.authority = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.token = SolanaAccountId.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CloseEmptyAccountAction {
    return {
      accountType: isSet(object.accountType) ? accountTypeFromJSON(object.accountType) : 0,
      authority: isSet(object.authority) ? SolanaAccountId.fromJSON(object.authority) : undefined,
      token: isSet(object.token) ? SolanaAccountId.fromJSON(object.token) : undefined,
    };
  },

  toJSON(message: CloseEmptyAccountAction): unknown {
    const obj: any = {};
    message.accountType !== undefined && (obj.accountType = accountTypeToJSON(message.accountType));
    message.authority !== undefined &&
      (obj.authority = message.authority ? SolanaAccountId.toJSON(message.authority) : undefined);
    message.token !== undefined && (obj.token = message.token ? SolanaAccountId.toJSON(message.token) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CloseEmptyAccountAction>, I>>(object: I): CloseEmptyAccountAction {
    const message = createBaseCloseEmptyAccountAction();
    message.accountType = object.accountType ?? 0;
    message.authority = (object.authority !== undefined && object.authority !== null)
      ? SolanaAccountId.fromPartial(object.authority)
      : undefined;
    message.token = (object.token !== undefined && object.token !== null)
      ? SolanaAccountId.fromPartial(object.token)
      : undefined;
    return message;
  },
};

function createBaseCloseDormantAccountAction(): CloseDormantAccountAction {
  return { accountType: 0, authority: undefined, token: undefined, destination: undefined };
}

export const CloseDormantAccountAction = {
  encode(message: CloseDormantAccountAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountType !== 0) {
      writer.uint32(8).int32(message.accountType);
    }
    if (message.authority !== undefined) {
      SolanaAccountId.encode(message.authority, writer.uint32(18).fork()).ldelim();
    }
    if (message.token !== undefined) {
      SolanaAccountId.encode(message.token, writer.uint32(26).fork()).ldelim();
    }
    if (message.destination !== undefined) {
      SolanaAccountId.encode(message.destination, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CloseDormantAccountAction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCloseDormantAccountAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountType = reader.int32() as any;
          break;
        case 2:
          message.authority = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.token = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 4:
          message.destination = SolanaAccountId.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CloseDormantAccountAction {
    return {
      accountType: isSet(object.accountType) ? accountTypeFromJSON(object.accountType) : 0,
      authority: isSet(object.authority) ? SolanaAccountId.fromJSON(object.authority) : undefined,
      token: isSet(object.token) ? SolanaAccountId.fromJSON(object.token) : undefined,
      destination: isSet(object.destination) ? SolanaAccountId.fromJSON(object.destination) : undefined,
    };
  },

  toJSON(message: CloseDormantAccountAction): unknown {
    const obj: any = {};
    message.accountType !== undefined && (obj.accountType = accountTypeToJSON(message.accountType));
    message.authority !== undefined &&
      (obj.authority = message.authority ? SolanaAccountId.toJSON(message.authority) : undefined);
    message.token !== undefined && (obj.token = message.token ? SolanaAccountId.toJSON(message.token) : undefined);
    message.destination !== undefined &&
      (obj.destination = message.destination ? SolanaAccountId.toJSON(message.destination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CloseDormantAccountAction>, I>>(object: I): CloseDormantAccountAction {
    const message = createBaseCloseDormantAccountAction();
    message.accountType = object.accountType ?? 0;
    message.authority = (object.authority !== undefined && object.authority !== null)
      ? SolanaAccountId.fromPartial(object.authority)
      : undefined;
    message.token = (object.token !== undefined && object.token !== null)
      ? SolanaAccountId.fromPartial(object.token)
      : undefined;
    message.destination = (object.destination !== undefined && object.destination !== null)
      ? SolanaAccountId.fromPartial(object.destination)
      : undefined;
    return message;
  },
};

function createBaseNoPrivacyTransferAction(): NoPrivacyTransferAction {
  return { authority: undefined, source: undefined, destination: undefined, amount: 0 };
}

export const NoPrivacyTransferAction = {
  encode(message: NoPrivacyTransferAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authority !== undefined) {
      SolanaAccountId.encode(message.authority, writer.uint32(10).fork()).ldelim();
    }
    if (message.source !== undefined) {
      SolanaAccountId.encode(message.source, writer.uint32(18).fork()).ldelim();
    }
    if (message.destination !== undefined) {
      SolanaAccountId.encode(message.destination, writer.uint32(26).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(32).uint64(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NoPrivacyTransferAction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNoPrivacyTransferAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.source = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.destination = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 4:
          message.amount = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NoPrivacyTransferAction {
    return {
      authority: isSet(object.authority) ? SolanaAccountId.fromJSON(object.authority) : undefined,
      source: isSet(object.source) ? SolanaAccountId.fromJSON(object.source) : undefined,
      destination: isSet(object.destination) ? SolanaAccountId.fromJSON(object.destination) : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
    };
  },

  toJSON(message: NoPrivacyTransferAction): unknown {
    const obj: any = {};
    message.authority !== undefined &&
      (obj.authority = message.authority ? SolanaAccountId.toJSON(message.authority) : undefined);
    message.source !== undefined && (obj.source = message.source ? SolanaAccountId.toJSON(message.source) : undefined);
    message.destination !== undefined &&
      (obj.destination = message.destination ? SolanaAccountId.toJSON(message.destination) : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NoPrivacyTransferAction>, I>>(object: I): NoPrivacyTransferAction {
    const message = createBaseNoPrivacyTransferAction();
    message.authority = (object.authority !== undefined && object.authority !== null)
      ? SolanaAccountId.fromPartial(object.authority)
      : undefined;
    message.source = (object.source !== undefined && object.source !== null)
      ? SolanaAccountId.fromPartial(object.source)
      : undefined;
    message.destination = (object.destination !== undefined && object.destination !== null)
      ? SolanaAccountId.fromPartial(object.destination)
      : undefined;
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBaseNoPrivacyWithdrawAction(): NoPrivacyWithdrawAction {
  return { authority: undefined, source: undefined, destination: undefined, amount: 0, shouldClose: false };
}

export const NoPrivacyWithdrawAction = {
  encode(message: NoPrivacyWithdrawAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authority !== undefined) {
      SolanaAccountId.encode(message.authority, writer.uint32(10).fork()).ldelim();
    }
    if (message.source !== undefined) {
      SolanaAccountId.encode(message.source, writer.uint32(18).fork()).ldelim();
    }
    if (message.destination !== undefined) {
      SolanaAccountId.encode(message.destination, writer.uint32(26).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(32).uint64(message.amount);
    }
    if (message.shouldClose === true) {
      writer.uint32(40).bool(message.shouldClose);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NoPrivacyWithdrawAction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNoPrivacyWithdrawAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.source = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.destination = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 4:
          message.amount = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.shouldClose = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NoPrivacyWithdrawAction {
    return {
      authority: isSet(object.authority) ? SolanaAccountId.fromJSON(object.authority) : undefined,
      source: isSet(object.source) ? SolanaAccountId.fromJSON(object.source) : undefined,
      destination: isSet(object.destination) ? SolanaAccountId.fromJSON(object.destination) : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      shouldClose: isSet(object.shouldClose) ? Boolean(object.shouldClose) : false,
    };
  },

  toJSON(message: NoPrivacyWithdrawAction): unknown {
    const obj: any = {};
    message.authority !== undefined &&
      (obj.authority = message.authority ? SolanaAccountId.toJSON(message.authority) : undefined);
    message.source !== undefined && (obj.source = message.source ? SolanaAccountId.toJSON(message.source) : undefined);
    message.destination !== undefined &&
      (obj.destination = message.destination ? SolanaAccountId.toJSON(message.destination) : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    message.shouldClose !== undefined && (obj.shouldClose = message.shouldClose);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NoPrivacyWithdrawAction>, I>>(object: I): NoPrivacyWithdrawAction {
    const message = createBaseNoPrivacyWithdrawAction();
    message.authority = (object.authority !== undefined && object.authority !== null)
      ? SolanaAccountId.fromPartial(object.authority)
      : undefined;
    message.source = (object.source !== undefined && object.source !== null)
      ? SolanaAccountId.fromPartial(object.source)
      : undefined;
    message.destination = (object.destination !== undefined && object.destination !== null)
      ? SolanaAccountId.fromPartial(object.destination)
      : undefined;
    message.amount = object.amount ?? 0;
    message.shouldClose = object.shouldClose ?? false;
    return message;
  },
};

function createBaseTemporaryPrivacyTransferAction(): TemporaryPrivacyTransferAction {
  return { authority: undefined, source: undefined, destination: undefined, amount: 0 };
}

export const TemporaryPrivacyTransferAction = {
  encode(message: TemporaryPrivacyTransferAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authority !== undefined) {
      SolanaAccountId.encode(message.authority, writer.uint32(10).fork()).ldelim();
    }
    if (message.source !== undefined) {
      SolanaAccountId.encode(message.source, writer.uint32(18).fork()).ldelim();
    }
    if (message.destination !== undefined) {
      SolanaAccountId.encode(message.destination, writer.uint32(26).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(32).uint64(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TemporaryPrivacyTransferAction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTemporaryPrivacyTransferAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.source = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.destination = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 4:
          message.amount = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TemporaryPrivacyTransferAction {
    return {
      authority: isSet(object.authority) ? SolanaAccountId.fromJSON(object.authority) : undefined,
      source: isSet(object.source) ? SolanaAccountId.fromJSON(object.source) : undefined,
      destination: isSet(object.destination) ? SolanaAccountId.fromJSON(object.destination) : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
    };
  },

  toJSON(message: TemporaryPrivacyTransferAction): unknown {
    const obj: any = {};
    message.authority !== undefined &&
      (obj.authority = message.authority ? SolanaAccountId.toJSON(message.authority) : undefined);
    message.source !== undefined && (obj.source = message.source ? SolanaAccountId.toJSON(message.source) : undefined);
    message.destination !== undefined &&
      (obj.destination = message.destination ? SolanaAccountId.toJSON(message.destination) : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TemporaryPrivacyTransferAction>, I>>(
    object: I,
  ): TemporaryPrivacyTransferAction {
    const message = createBaseTemporaryPrivacyTransferAction();
    message.authority = (object.authority !== undefined && object.authority !== null)
      ? SolanaAccountId.fromPartial(object.authority)
      : undefined;
    message.source = (object.source !== undefined && object.source !== null)
      ? SolanaAccountId.fromPartial(object.source)
      : undefined;
    message.destination = (object.destination !== undefined && object.destination !== null)
      ? SolanaAccountId.fromPartial(object.destination)
      : undefined;
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBaseTemporaryPrivacyExchangeAction(): TemporaryPrivacyExchangeAction {
  return { authority: undefined, source: undefined, destination: undefined, amount: 0 };
}

export const TemporaryPrivacyExchangeAction = {
  encode(message: TemporaryPrivacyExchangeAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authority !== undefined) {
      SolanaAccountId.encode(message.authority, writer.uint32(10).fork()).ldelim();
    }
    if (message.source !== undefined) {
      SolanaAccountId.encode(message.source, writer.uint32(18).fork()).ldelim();
    }
    if (message.destination !== undefined) {
      SolanaAccountId.encode(message.destination, writer.uint32(26).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(32).uint64(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TemporaryPrivacyExchangeAction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTemporaryPrivacyExchangeAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.source = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.destination = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 4:
          message.amount = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TemporaryPrivacyExchangeAction {
    return {
      authority: isSet(object.authority) ? SolanaAccountId.fromJSON(object.authority) : undefined,
      source: isSet(object.source) ? SolanaAccountId.fromJSON(object.source) : undefined,
      destination: isSet(object.destination) ? SolanaAccountId.fromJSON(object.destination) : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
    };
  },

  toJSON(message: TemporaryPrivacyExchangeAction): unknown {
    const obj: any = {};
    message.authority !== undefined &&
      (obj.authority = message.authority ? SolanaAccountId.toJSON(message.authority) : undefined);
    message.source !== undefined && (obj.source = message.source ? SolanaAccountId.toJSON(message.source) : undefined);
    message.destination !== undefined &&
      (obj.destination = message.destination ? SolanaAccountId.toJSON(message.destination) : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TemporaryPrivacyExchangeAction>, I>>(
    object: I,
  ): TemporaryPrivacyExchangeAction {
    const message = createBaseTemporaryPrivacyExchangeAction();
    message.authority = (object.authority !== undefined && object.authority !== null)
      ? SolanaAccountId.fromPartial(object.authority)
      : undefined;
    message.source = (object.source !== undefined && object.source !== null)
      ? SolanaAccountId.fromPartial(object.source)
      : undefined;
    message.destination = (object.destination !== undefined && object.destination !== null)
      ? SolanaAccountId.fromPartial(object.destination)
      : undefined;
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBasePermanentPrivacyUpgradeAction(): PermanentPrivacyUpgradeAction {
  return { actionId: 0 };
}

export const PermanentPrivacyUpgradeAction = {
  encode(message: PermanentPrivacyUpgradeAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.actionId !== 0) {
      writer.uint32(8).uint32(message.actionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PermanentPrivacyUpgradeAction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePermanentPrivacyUpgradeAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.actionId = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PermanentPrivacyUpgradeAction {
    return { actionId: isSet(object.actionId) ? Number(object.actionId) : 0 };
  },

  toJSON(message: PermanentPrivacyUpgradeAction): unknown {
    const obj: any = {};
    message.actionId !== undefined && (obj.actionId = Math.round(message.actionId));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PermanentPrivacyUpgradeAction>, I>>(
    object: I,
  ): PermanentPrivacyUpgradeAction {
    const message = createBasePermanentPrivacyUpgradeAction();
    message.actionId = object.actionId ?? 0;
    return message;
  },
};

function createBaseServerParameter(): ServerParameter {
  return {
    actionId: 0,
    nonces: [],
    openAccount: undefined,
    closeEmptyAccount: undefined,
    closeDormantAccount: undefined,
    noPrivacyWithdraw: undefined,
    temporaryPrivacyTransfer: undefined,
    temporaryPrivacyExchange: undefined,
    permanentPrivacyUpgrade: undefined,
  };
}

export const ServerParameter = {
  encode(message: ServerParameter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.actionId !== 0) {
      writer.uint32(8).uint32(message.actionId);
    }
    for (const v of message.nonces) {
      NoncedTransactionMetadata.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.openAccount !== undefined) {
      OpenAccountServerParameter.encode(message.openAccount, writer.uint32(26).fork()).ldelim();
    }
    if (message.closeEmptyAccount !== undefined) {
      CloseEmptyAccountServerParameter.encode(message.closeEmptyAccount, writer.uint32(34).fork()).ldelim();
    }
    if (message.closeDormantAccount !== undefined) {
      CloseDormantAccountServerParameter.encode(message.closeDormantAccount, writer.uint32(42).fork()).ldelim();
    }
    if (message.noPrivacyWithdraw !== undefined) {
      NoPrivacyWithdrawServerParameter.encode(message.noPrivacyWithdraw, writer.uint32(58).fork()).ldelim();
    }
    if (message.temporaryPrivacyTransfer !== undefined) {
      TemporaryPrivacyTransferServerParameter.encode(message.temporaryPrivacyTransfer, writer.uint32(66).fork())
        .ldelim();
    }
    if (message.temporaryPrivacyExchange !== undefined) {
      TemporaryPrivacyExchangeServerParameter.encode(message.temporaryPrivacyExchange, writer.uint32(74).fork())
        .ldelim();
    }
    if (message.permanentPrivacyUpgrade !== undefined) {
      PermanentPrivacyUpgradeServerParameter.encode(message.permanentPrivacyUpgrade, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerParameter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerParameter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.actionId = reader.uint32();
          break;
        case 2:
          message.nonces.push(NoncedTransactionMetadata.decode(reader, reader.uint32()));
          break;
        case 3:
          message.openAccount = OpenAccountServerParameter.decode(reader, reader.uint32());
          break;
        case 4:
          message.closeEmptyAccount = CloseEmptyAccountServerParameter.decode(reader, reader.uint32());
          break;
        case 5:
          message.closeDormantAccount = CloseDormantAccountServerParameter.decode(reader, reader.uint32());
          break;
        case 7:
          message.noPrivacyWithdraw = NoPrivacyWithdrawServerParameter.decode(reader, reader.uint32());
          break;
        case 8:
          message.temporaryPrivacyTransfer = TemporaryPrivacyTransferServerParameter.decode(reader, reader.uint32());
          break;
        case 9:
          message.temporaryPrivacyExchange = TemporaryPrivacyExchangeServerParameter.decode(reader, reader.uint32());
          break;
        case 10:
          message.permanentPrivacyUpgrade = PermanentPrivacyUpgradeServerParameter.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ServerParameter {
    return {
      actionId: isSet(object.actionId) ? Number(object.actionId) : 0,
      nonces: Array.isArray(object?.nonces) ? object.nonces.map((e: any) => NoncedTransactionMetadata.fromJSON(e)) : [],
      openAccount: isSet(object.openAccount) ? OpenAccountServerParameter.fromJSON(object.openAccount) : undefined,
      closeEmptyAccount: isSet(object.closeEmptyAccount)
        ? CloseEmptyAccountServerParameter.fromJSON(object.closeEmptyAccount)
        : undefined,
      closeDormantAccount: isSet(object.closeDormantAccount)
        ? CloseDormantAccountServerParameter.fromJSON(object.closeDormantAccount)
        : undefined,
      noPrivacyWithdraw: isSet(object.noPrivacyWithdraw)
        ? NoPrivacyWithdrawServerParameter.fromJSON(object.noPrivacyWithdraw)
        : undefined,
      temporaryPrivacyTransfer: isSet(object.temporaryPrivacyTransfer)
        ? TemporaryPrivacyTransferServerParameter.fromJSON(object.temporaryPrivacyTransfer)
        : undefined,
      temporaryPrivacyExchange: isSet(object.temporaryPrivacyExchange)
        ? TemporaryPrivacyExchangeServerParameter.fromJSON(object.temporaryPrivacyExchange)
        : undefined,
      permanentPrivacyUpgrade: isSet(object.permanentPrivacyUpgrade)
        ? PermanentPrivacyUpgradeServerParameter.fromJSON(object.permanentPrivacyUpgrade)
        : undefined,
    };
  },

  toJSON(message: ServerParameter): unknown {
    const obj: any = {};
    message.actionId !== undefined && (obj.actionId = Math.round(message.actionId));
    if (message.nonces) {
      obj.nonces = message.nonces.map((e) => e ? NoncedTransactionMetadata.toJSON(e) : undefined);
    } else {
      obj.nonces = [];
    }
    message.openAccount !== undefined &&
      (obj.openAccount = message.openAccount ? OpenAccountServerParameter.toJSON(message.openAccount) : undefined);
    message.closeEmptyAccount !== undefined && (obj.closeEmptyAccount = message.closeEmptyAccount
      ? CloseEmptyAccountServerParameter.toJSON(message.closeEmptyAccount)
      : undefined);
    message.closeDormantAccount !== undefined && (obj.closeDormantAccount = message.closeDormantAccount
      ? CloseDormantAccountServerParameter.toJSON(message.closeDormantAccount)
      : undefined);
    message.noPrivacyWithdraw !== undefined && (obj.noPrivacyWithdraw = message.noPrivacyWithdraw
      ? NoPrivacyWithdrawServerParameter.toJSON(message.noPrivacyWithdraw)
      : undefined);
    message.temporaryPrivacyTransfer !== undefined && (obj.temporaryPrivacyTransfer = message.temporaryPrivacyTransfer
      ? TemporaryPrivacyTransferServerParameter.toJSON(message.temporaryPrivacyTransfer)
      : undefined);
    message.temporaryPrivacyExchange !== undefined && (obj.temporaryPrivacyExchange = message.temporaryPrivacyExchange
      ? TemporaryPrivacyExchangeServerParameter.toJSON(message.temporaryPrivacyExchange)
      : undefined);
    message.permanentPrivacyUpgrade !== undefined && (obj.permanentPrivacyUpgrade = message.permanentPrivacyUpgrade
      ? PermanentPrivacyUpgradeServerParameter.toJSON(message.permanentPrivacyUpgrade)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ServerParameter>, I>>(object: I): ServerParameter {
    const message = createBaseServerParameter();
    message.actionId = object.actionId ?? 0;
    message.nonces = object.nonces?.map((e) => NoncedTransactionMetadata.fromPartial(e)) || [];
    message.openAccount = (object.openAccount !== undefined && object.openAccount !== null)
      ? OpenAccountServerParameter.fromPartial(object.openAccount)
      : undefined;
    message.closeEmptyAccount = (object.closeEmptyAccount !== undefined && object.closeEmptyAccount !== null)
      ? CloseEmptyAccountServerParameter.fromPartial(object.closeEmptyAccount)
      : undefined;
    message.closeDormantAccount = (object.closeDormantAccount !== undefined && object.closeDormantAccount !== null)
      ? CloseDormantAccountServerParameter.fromPartial(object.closeDormantAccount)
      : undefined;
    message.noPrivacyWithdraw = (object.noPrivacyWithdraw !== undefined && object.noPrivacyWithdraw !== null)
      ? NoPrivacyWithdrawServerParameter.fromPartial(object.noPrivacyWithdraw)
      : undefined;
    message.temporaryPrivacyTransfer =
      (object.temporaryPrivacyTransfer !== undefined && object.temporaryPrivacyTransfer !== null)
        ? TemporaryPrivacyTransferServerParameter.fromPartial(object.temporaryPrivacyTransfer)
        : undefined;
    message.temporaryPrivacyExchange =
      (object.temporaryPrivacyExchange !== undefined && object.temporaryPrivacyExchange !== null)
        ? TemporaryPrivacyExchangeServerParameter.fromPartial(object.temporaryPrivacyExchange)
        : undefined;
    message.permanentPrivacyUpgrade =
      (object.permanentPrivacyUpgrade !== undefined && object.permanentPrivacyUpgrade !== null)
        ? PermanentPrivacyUpgradeServerParameter.fromPartial(object.permanentPrivacyUpgrade)
        : undefined;
    return message;
  },
};

function createBaseNoncedTransactionMetadata(): NoncedTransactionMetadata {
  return { nonce: undefined, blockhash: undefined };
}

export const NoncedTransactionMetadata = {
  encode(message: NoncedTransactionMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nonce !== undefined) {
      SolanaAccountId.encode(message.nonce, writer.uint32(10).fork()).ldelim();
    }
    if (message.blockhash !== undefined) {
      Blockhash.encode(message.blockhash, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NoncedTransactionMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNoncedTransactionMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nonce = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.blockhash = Blockhash.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NoncedTransactionMetadata {
    return {
      nonce: isSet(object.nonce) ? SolanaAccountId.fromJSON(object.nonce) : undefined,
      blockhash: isSet(object.blockhash) ? Blockhash.fromJSON(object.blockhash) : undefined,
    };
  },

  toJSON(message: NoncedTransactionMetadata): unknown {
    const obj: any = {};
    message.nonce !== undefined && (obj.nonce = message.nonce ? SolanaAccountId.toJSON(message.nonce) : undefined);
    message.blockhash !== undefined &&
      (obj.blockhash = message.blockhash ? Blockhash.toJSON(message.blockhash) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NoncedTransactionMetadata>, I>>(object: I): NoncedTransactionMetadata {
    const message = createBaseNoncedTransactionMetadata();
    message.nonce = (object.nonce !== undefined && object.nonce !== null)
      ? SolanaAccountId.fromPartial(object.nonce)
      : undefined;
    message.blockhash = (object.blockhash !== undefined && object.blockhash !== null)
      ? Blockhash.fromPartial(object.blockhash)
      : undefined;
    return message;
  },
};

function createBaseOpenAccountServerParameter(): OpenAccountServerParameter {
  return {};
}

export const OpenAccountServerParameter = {
  encode(_: OpenAccountServerParameter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OpenAccountServerParameter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOpenAccountServerParameter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): OpenAccountServerParameter {
    return {};
  },

  toJSON(_: OpenAccountServerParameter): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<OpenAccountServerParameter>, I>>(_: I): OpenAccountServerParameter {
    const message = createBaseOpenAccountServerParameter();
    return message;
  },
};

function createBaseCloseEmptyAccountServerParameter(): CloseEmptyAccountServerParameter {
  return {};
}

export const CloseEmptyAccountServerParameter = {
  encode(_: CloseEmptyAccountServerParameter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CloseEmptyAccountServerParameter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCloseEmptyAccountServerParameter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): CloseEmptyAccountServerParameter {
    return {};
  },

  toJSON(_: CloseEmptyAccountServerParameter): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CloseEmptyAccountServerParameter>, I>>(
    _: I,
  ): CloseEmptyAccountServerParameter {
    const message = createBaseCloseEmptyAccountServerParameter();
    return message;
  },
};

function createBaseCloseDormantAccountServerParameter(): CloseDormantAccountServerParameter {
  return {};
}

export const CloseDormantAccountServerParameter = {
  encode(_: CloseDormantAccountServerParameter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CloseDormantAccountServerParameter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCloseDormantAccountServerParameter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): CloseDormantAccountServerParameter {
    return {};
  },

  toJSON(_: CloseDormantAccountServerParameter): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CloseDormantAccountServerParameter>, I>>(
    _: I,
  ): CloseDormantAccountServerParameter {
    const message = createBaseCloseDormantAccountServerParameter();
    return message;
  },
};

function createBaseNoPrivacyTransferServerParameter(): NoPrivacyTransferServerParameter {
  return {};
}

export const NoPrivacyTransferServerParameter = {
  encode(_: NoPrivacyTransferServerParameter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NoPrivacyTransferServerParameter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNoPrivacyTransferServerParameter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): NoPrivacyTransferServerParameter {
    return {};
  },

  toJSON(_: NoPrivacyTransferServerParameter): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NoPrivacyTransferServerParameter>, I>>(
    _: I,
  ): NoPrivacyTransferServerParameter {
    const message = createBaseNoPrivacyTransferServerParameter();
    return message;
  },
};

function createBaseNoPrivacyWithdrawServerParameter(): NoPrivacyWithdrawServerParameter {
  return {};
}

export const NoPrivacyWithdrawServerParameter = {
  encode(_: NoPrivacyWithdrawServerParameter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NoPrivacyWithdrawServerParameter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNoPrivacyWithdrawServerParameter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): NoPrivacyWithdrawServerParameter {
    return {};
  },

  toJSON(_: NoPrivacyWithdrawServerParameter): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NoPrivacyWithdrawServerParameter>, I>>(
    _: I,
  ): NoPrivacyWithdrawServerParameter {
    const message = createBaseNoPrivacyWithdrawServerParameter();
    return message;
  },
};

function createBaseTemporaryPrivacyTransferServerParameter(): TemporaryPrivacyTransferServerParameter {
  return { treasury: undefined, recentRoot: undefined };
}

export const TemporaryPrivacyTransferServerParameter = {
  encode(message: TemporaryPrivacyTransferServerParameter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.treasury !== undefined) {
      SolanaAccountId.encode(message.treasury, writer.uint32(10).fork()).ldelim();
    }
    if (message.recentRoot !== undefined) {
      Hash.encode(message.recentRoot, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TemporaryPrivacyTransferServerParameter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTemporaryPrivacyTransferServerParameter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.treasury = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.recentRoot = Hash.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TemporaryPrivacyTransferServerParameter {
    return {
      treasury: isSet(object.treasury) ? SolanaAccountId.fromJSON(object.treasury) : undefined,
      recentRoot: isSet(object.recentRoot) ? Hash.fromJSON(object.recentRoot) : undefined,
    };
  },

  toJSON(message: TemporaryPrivacyTransferServerParameter): unknown {
    const obj: any = {};
    message.treasury !== undefined &&
      (obj.treasury = message.treasury ? SolanaAccountId.toJSON(message.treasury) : undefined);
    message.recentRoot !== undefined &&
      (obj.recentRoot = message.recentRoot ? Hash.toJSON(message.recentRoot) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TemporaryPrivacyTransferServerParameter>, I>>(
    object: I,
  ): TemporaryPrivacyTransferServerParameter {
    const message = createBaseTemporaryPrivacyTransferServerParameter();
    message.treasury = (object.treasury !== undefined && object.treasury !== null)
      ? SolanaAccountId.fromPartial(object.treasury)
      : undefined;
    message.recentRoot = (object.recentRoot !== undefined && object.recentRoot !== null)
      ? Hash.fromPartial(object.recentRoot)
      : undefined;
    return message;
  },
};

function createBaseTemporaryPrivacyExchangeServerParameter(): TemporaryPrivacyExchangeServerParameter {
  return { treasury: undefined, recentRoot: undefined };
}

export const TemporaryPrivacyExchangeServerParameter = {
  encode(message: TemporaryPrivacyExchangeServerParameter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.treasury !== undefined) {
      SolanaAccountId.encode(message.treasury, writer.uint32(10).fork()).ldelim();
    }
    if (message.recentRoot !== undefined) {
      Hash.encode(message.recentRoot, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TemporaryPrivacyExchangeServerParameter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTemporaryPrivacyExchangeServerParameter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.treasury = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.recentRoot = Hash.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TemporaryPrivacyExchangeServerParameter {
    return {
      treasury: isSet(object.treasury) ? SolanaAccountId.fromJSON(object.treasury) : undefined,
      recentRoot: isSet(object.recentRoot) ? Hash.fromJSON(object.recentRoot) : undefined,
    };
  },

  toJSON(message: TemporaryPrivacyExchangeServerParameter): unknown {
    const obj: any = {};
    message.treasury !== undefined &&
      (obj.treasury = message.treasury ? SolanaAccountId.toJSON(message.treasury) : undefined);
    message.recentRoot !== undefined &&
      (obj.recentRoot = message.recentRoot ? Hash.toJSON(message.recentRoot) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TemporaryPrivacyExchangeServerParameter>, I>>(
    object: I,
  ): TemporaryPrivacyExchangeServerParameter {
    const message = createBaseTemporaryPrivacyExchangeServerParameter();
    message.treasury = (object.treasury !== undefined && object.treasury !== null)
      ? SolanaAccountId.fromPartial(object.treasury)
      : undefined;
    message.recentRoot = (object.recentRoot !== undefined && object.recentRoot !== null)
      ? Hash.fromPartial(object.recentRoot)
      : undefined;
    return message;
  },
};

function createBasePermanentPrivacyUpgradeServerParameter(): PermanentPrivacyUpgradeServerParameter {
  return {
    newCommitment: undefined,
    newCommitmentTranscript: undefined,
    newCommitmentDestination: undefined,
    newCommitmentAmount: 0,
    merkleRoot: undefined,
    merkleProof: [],
  };
}

export const PermanentPrivacyUpgradeServerParameter = {
  encode(message: PermanentPrivacyUpgradeServerParameter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.newCommitment !== undefined) {
      SolanaAccountId.encode(message.newCommitment, writer.uint32(10).fork()).ldelim();
    }
    if (message.newCommitmentTranscript !== undefined) {
      Hash.encode(message.newCommitmentTranscript, writer.uint32(18).fork()).ldelim();
    }
    if (message.newCommitmentDestination !== undefined) {
      SolanaAccountId.encode(message.newCommitmentDestination, writer.uint32(26).fork()).ldelim();
    }
    if (message.newCommitmentAmount !== 0) {
      writer.uint32(32).uint64(message.newCommitmentAmount);
    }
    if (message.merkleRoot !== undefined) {
      Hash.encode(message.merkleRoot, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.merkleProof) {
      Hash.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PermanentPrivacyUpgradeServerParameter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePermanentPrivacyUpgradeServerParameter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.newCommitment = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.newCommitmentTranscript = Hash.decode(reader, reader.uint32());
          break;
        case 3:
          message.newCommitmentDestination = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 4:
          message.newCommitmentAmount = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.merkleRoot = Hash.decode(reader, reader.uint32());
          break;
        case 6:
          message.merkleProof.push(Hash.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PermanentPrivacyUpgradeServerParameter {
    return {
      newCommitment: isSet(object.newCommitment) ? SolanaAccountId.fromJSON(object.newCommitment) : undefined,
      newCommitmentTranscript: isSet(object.newCommitmentTranscript)
        ? Hash.fromJSON(object.newCommitmentTranscript)
        : undefined,
      newCommitmentDestination: isSet(object.newCommitmentDestination)
        ? SolanaAccountId.fromJSON(object.newCommitmentDestination)
        : undefined,
      newCommitmentAmount: isSet(object.newCommitmentAmount) ? Number(object.newCommitmentAmount) : 0,
      merkleRoot: isSet(object.merkleRoot) ? Hash.fromJSON(object.merkleRoot) : undefined,
      merkleProof: Array.isArray(object?.merkleProof) ? object.merkleProof.map((e: any) => Hash.fromJSON(e)) : [],
    };
  },

  toJSON(message: PermanentPrivacyUpgradeServerParameter): unknown {
    const obj: any = {};
    message.newCommitment !== undefined &&
      (obj.newCommitment = message.newCommitment ? SolanaAccountId.toJSON(message.newCommitment) : undefined);
    message.newCommitmentTranscript !== undefined && (obj.newCommitmentTranscript = message.newCommitmentTranscript
      ? Hash.toJSON(message.newCommitmentTranscript)
      : undefined);
    message.newCommitmentDestination !== undefined && (obj.newCommitmentDestination = message.newCommitmentDestination
      ? SolanaAccountId.toJSON(message.newCommitmentDestination)
      : undefined);
    message.newCommitmentAmount !== undefined && (obj.newCommitmentAmount = Math.round(message.newCommitmentAmount));
    message.merkleRoot !== undefined &&
      (obj.merkleRoot = message.merkleRoot ? Hash.toJSON(message.merkleRoot) : undefined);
    if (message.merkleProof) {
      obj.merkleProof = message.merkleProof.map((e) => e ? Hash.toJSON(e) : undefined);
    } else {
      obj.merkleProof = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PermanentPrivacyUpgradeServerParameter>, I>>(
    object: I,
  ): PermanentPrivacyUpgradeServerParameter {
    const message = createBasePermanentPrivacyUpgradeServerParameter();
    message.newCommitment = (object.newCommitment !== undefined && object.newCommitment !== null)
      ? SolanaAccountId.fromPartial(object.newCommitment)
      : undefined;
    message.newCommitmentTranscript =
      (object.newCommitmentTranscript !== undefined && object.newCommitmentTranscript !== null)
        ? Hash.fromPartial(object.newCommitmentTranscript)
        : undefined;
    message.newCommitmentDestination =
      (object.newCommitmentDestination !== undefined && object.newCommitmentDestination !== null)
        ? SolanaAccountId.fromPartial(object.newCommitmentDestination)
        : undefined;
    message.newCommitmentAmount = object.newCommitmentAmount ?? 0;
    message.merkleRoot = (object.merkleRoot !== undefined && object.merkleRoot !== null)
      ? Hash.fromPartial(object.merkleRoot)
      : undefined;
    message.merkleProof = object.merkleProof?.map((e) => Hash.fromPartial(e)) || [];
    return message;
  },
};

function createBaseErrorDetails(): ErrorDetails {
  return { reasonString: undefined, invalidSignature: undefined };
}

export const ErrorDetails = {
  encode(message: ErrorDetails, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reasonString !== undefined) {
      ReasonStringErrorDetails.encode(message.reasonString, writer.uint32(10).fork()).ldelim();
    }
    if (message.invalidSignature !== undefined) {
      InvalidSignatureErrorDetails.encode(message.invalidSignature, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ErrorDetails {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseErrorDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reasonString = ReasonStringErrorDetails.decode(reader, reader.uint32());
          break;
        case 2:
          message.invalidSignature = InvalidSignatureErrorDetails.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ErrorDetails {
    return {
      reasonString: isSet(object.reasonString) ? ReasonStringErrorDetails.fromJSON(object.reasonString) : undefined,
      invalidSignature: isSet(object.invalidSignature)
        ? InvalidSignatureErrorDetails.fromJSON(object.invalidSignature)
        : undefined,
    };
  },

  toJSON(message: ErrorDetails): unknown {
    const obj: any = {};
    message.reasonString !== undefined &&
      (obj.reasonString = message.reasonString ? ReasonStringErrorDetails.toJSON(message.reasonString) : undefined);
    message.invalidSignature !== undefined && (obj.invalidSignature = message.invalidSignature
      ? InvalidSignatureErrorDetails.toJSON(message.invalidSignature)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ErrorDetails>, I>>(object: I): ErrorDetails {
    const message = createBaseErrorDetails();
    message.reasonString = (object.reasonString !== undefined && object.reasonString !== null)
      ? ReasonStringErrorDetails.fromPartial(object.reasonString)
      : undefined;
    message.invalidSignature = (object.invalidSignature !== undefined && object.invalidSignature !== null)
      ? InvalidSignatureErrorDetails.fromPartial(object.invalidSignature)
      : undefined;
    return message;
  },
};

function createBaseReasonStringErrorDetails(): ReasonStringErrorDetails {
  return { reason: "" };
}

export const ReasonStringErrorDetails = {
  encode(message: ReasonStringErrorDetails, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reason !== "") {
      writer.uint32(10).string(message.reason);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReasonStringErrorDetails {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReasonStringErrorDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reason = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReasonStringErrorDetails {
    return { reason: isSet(object.reason) ? String(object.reason) : "" };
  },

  toJSON(message: ReasonStringErrorDetails): unknown {
    const obj: any = {};
    message.reason !== undefined && (obj.reason = message.reason);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ReasonStringErrorDetails>, I>>(object: I): ReasonStringErrorDetails {
    const message = createBaseReasonStringErrorDetails();
    message.reason = object.reason ?? "";
    return message;
  },
};

function createBaseInvalidSignatureErrorDetails(): InvalidSignatureErrorDetails {
  return { actionId: 0, expectedTransaction: undefined, providedSignature: undefined };
}

export const InvalidSignatureErrorDetails = {
  encode(message: InvalidSignatureErrorDetails, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.actionId !== 0) {
      writer.uint32(8).uint32(message.actionId);
    }
    if (message.expectedTransaction !== undefined) {
      Transaction.encode(message.expectedTransaction, writer.uint32(18).fork()).ldelim();
    }
    if (message.providedSignature !== undefined) {
      Signature.encode(message.providedSignature, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InvalidSignatureErrorDetails {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInvalidSignatureErrorDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.actionId = reader.uint32();
          break;
        case 2:
          message.expectedTransaction = Transaction.decode(reader, reader.uint32());
          break;
        case 3:
          message.providedSignature = Signature.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InvalidSignatureErrorDetails {
    return {
      actionId: isSet(object.actionId) ? Number(object.actionId) : 0,
      expectedTransaction: isSet(object.expectedTransaction)
        ? Transaction.fromJSON(object.expectedTransaction)
        : undefined,
      providedSignature: isSet(object.providedSignature) ? Signature.fromJSON(object.providedSignature) : undefined,
    };
  },

  toJSON(message: InvalidSignatureErrorDetails): unknown {
    const obj: any = {};
    message.actionId !== undefined && (obj.actionId = Math.round(message.actionId));
    message.expectedTransaction !== undefined && (obj.expectedTransaction = message.expectedTransaction
      ? Transaction.toJSON(message.expectedTransaction)
      : undefined);
    message.providedSignature !== undefined &&
      (obj.providedSignature = message.providedSignature ? Signature.toJSON(message.providedSignature) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InvalidSignatureErrorDetails>, I>>(object: I): InvalidSignatureErrorDetails {
    const message = createBaseInvalidSignatureErrorDetails();
    message.actionId = object.actionId ?? 0;
    message.expectedTransaction = (object.expectedTransaction !== undefined && object.expectedTransaction !== null)
      ? Transaction.fromPartial(object.expectedTransaction)
      : undefined;
    message.providedSignature = (object.providedSignature !== undefined && object.providedSignature !== null)
      ? Signature.fromPartial(object.providedSignature)
      : undefined;
    return message;
  },
};

function createBaseUpgradeableIntent(): UpgradeableIntent {
  return { id: undefined, actions: [], treasury: undefined, recentRoot: undefined };
}

export const UpgradeableIntent = {
  encode(message: UpgradeableIntent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined) {
      IntentId.encode(message.id, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.actions) {
      UpgradeableIntent_UpgradeablePrivateAction.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.treasury !== undefined) {
      SolanaAccountId.encode(message.treasury, writer.uint32(26).fork()).ldelim();
    }
    if (message.recentRoot !== undefined) {
      Hash.encode(message.recentRoot, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpgradeableIntent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpgradeableIntent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = IntentId.decode(reader, reader.uint32());
          break;
        case 2:
          message.actions.push(UpgradeableIntent_UpgradeablePrivateAction.decode(reader, reader.uint32()));
          break;
        case 3:
          message.treasury = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 4:
          message.recentRoot = Hash.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpgradeableIntent {
    return {
      id: isSet(object.id) ? IntentId.fromJSON(object.id) : undefined,
      actions: Array.isArray(object?.actions)
        ? object.actions.map((e: any) => UpgradeableIntent_UpgradeablePrivateAction.fromJSON(e))
        : [],
      treasury: isSet(object.treasury) ? SolanaAccountId.fromJSON(object.treasury) : undefined,
      recentRoot: isSet(object.recentRoot) ? Hash.fromJSON(object.recentRoot) : undefined,
    };
  },

  toJSON(message: UpgradeableIntent): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id ? IntentId.toJSON(message.id) : undefined);
    if (message.actions) {
      obj.actions = message.actions.map((e) => e ? UpgradeableIntent_UpgradeablePrivateAction.toJSON(e) : undefined);
    } else {
      obj.actions = [];
    }
    message.treasury !== undefined &&
      (obj.treasury = message.treasury ? SolanaAccountId.toJSON(message.treasury) : undefined);
    message.recentRoot !== undefined &&
      (obj.recentRoot = message.recentRoot ? Hash.toJSON(message.recentRoot) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpgradeableIntent>, I>>(object: I): UpgradeableIntent {
    const message = createBaseUpgradeableIntent();
    message.id = (object.id !== undefined && object.id !== null) ? IntentId.fromPartial(object.id) : undefined;
    message.actions = object.actions?.map((e) => UpgradeableIntent_UpgradeablePrivateAction.fromPartial(e)) || [];
    message.treasury = (object.treasury !== undefined && object.treasury !== null)
      ? SolanaAccountId.fromPartial(object.treasury)
      : undefined;
    message.recentRoot = (object.recentRoot !== undefined && object.recentRoot !== null)
      ? Hash.fromPartial(object.recentRoot)
      : undefined;
    return message;
  },
};

function createBaseUpgradeableIntent_UpgradeablePrivateAction(): UpgradeableIntent_UpgradeablePrivateAction {
  return {
    transactionBlob: undefined,
    clientSignature: undefined,
    actionId: 0,
    sourceAccountType: 0,
    sourceDerivationIndex: 0,
    originalDestination: undefined,
    originalAmount: 0,
  };
}

export const UpgradeableIntent_UpgradeablePrivateAction = {
  encode(message: UpgradeableIntent_UpgradeablePrivateAction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transactionBlob !== undefined) {
      Transaction.encode(message.transactionBlob, writer.uint32(10).fork()).ldelim();
    }
    if (message.clientSignature !== undefined) {
      Signature.encode(message.clientSignature, writer.uint32(18).fork()).ldelim();
    }
    if (message.actionId !== 0) {
      writer.uint32(24).uint32(message.actionId);
    }
    if (message.sourceAccountType !== 0) {
      writer.uint32(32).int32(message.sourceAccountType);
    }
    if (message.sourceDerivationIndex !== 0) {
      writer.uint32(40).uint64(message.sourceDerivationIndex);
    }
    if (message.originalDestination !== undefined) {
      SolanaAccountId.encode(message.originalDestination, writer.uint32(50).fork()).ldelim();
    }
    if (message.originalAmount !== 0) {
      writer.uint32(56).uint64(message.originalAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpgradeableIntent_UpgradeablePrivateAction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpgradeableIntent_UpgradeablePrivateAction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionBlob = Transaction.decode(reader, reader.uint32());
          break;
        case 2:
          message.clientSignature = Signature.decode(reader, reader.uint32());
          break;
        case 3:
          message.actionId = reader.uint32();
          break;
        case 4:
          message.sourceAccountType = reader.int32() as any;
          break;
        case 5:
          message.sourceDerivationIndex = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.originalDestination = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 7:
          message.originalAmount = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpgradeableIntent_UpgradeablePrivateAction {
    return {
      transactionBlob: isSet(object.transactionBlob) ? Transaction.fromJSON(object.transactionBlob) : undefined,
      clientSignature: isSet(object.clientSignature) ? Signature.fromJSON(object.clientSignature) : undefined,
      actionId: isSet(object.actionId) ? Number(object.actionId) : 0,
      sourceAccountType: isSet(object.sourceAccountType) ? accountTypeFromJSON(object.sourceAccountType) : 0,
      sourceDerivationIndex: isSet(object.sourceDerivationIndex) ? Number(object.sourceDerivationIndex) : 0,
      originalDestination: isSet(object.originalDestination)
        ? SolanaAccountId.fromJSON(object.originalDestination)
        : undefined,
      originalAmount: isSet(object.originalAmount) ? Number(object.originalAmount) : 0,
    };
  },

  toJSON(message: UpgradeableIntent_UpgradeablePrivateAction): unknown {
    const obj: any = {};
    message.transactionBlob !== undefined &&
      (obj.transactionBlob = message.transactionBlob ? Transaction.toJSON(message.transactionBlob) : undefined);
    message.clientSignature !== undefined &&
      (obj.clientSignature = message.clientSignature ? Signature.toJSON(message.clientSignature) : undefined);
    message.actionId !== undefined && (obj.actionId = Math.round(message.actionId));
    message.sourceAccountType !== undefined && (obj.sourceAccountType = accountTypeToJSON(message.sourceAccountType));
    message.sourceDerivationIndex !== undefined &&
      (obj.sourceDerivationIndex = Math.round(message.sourceDerivationIndex));
    message.originalDestination !== undefined && (obj.originalDestination = message.originalDestination
      ? SolanaAccountId.toJSON(message.originalDestination)
      : undefined);
    message.originalAmount !== undefined && (obj.originalAmount = Math.round(message.originalAmount));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpgradeableIntent_UpgradeablePrivateAction>, I>>(
    object: I,
  ): UpgradeableIntent_UpgradeablePrivateAction {
    const message = createBaseUpgradeableIntent_UpgradeablePrivateAction();
    message.transactionBlob = (object.transactionBlob !== undefined && object.transactionBlob !== null)
      ? Transaction.fromPartial(object.transactionBlob)
      : undefined;
    message.clientSignature = (object.clientSignature !== undefined && object.clientSignature !== null)
      ? Signature.fromPartial(object.clientSignature)
      : undefined;
    message.actionId = object.actionId ?? 0;
    message.sourceAccountType = object.sourceAccountType ?? 0;
    message.sourceDerivationIndex = object.sourceDerivationIndex ?? 0;
    message.originalDestination = (object.originalDestination !== undefined && object.originalDestination !== null)
      ? SolanaAccountId.fromPartial(object.originalDestination)
      : undefined;
    message.originalAmount = object.originalAmount ?? 0;
    return message;
  },
};

function createBasePaymentHistoryItem(): PaymentHistoryItem {
  return {
    cursor: undefined,
    exchangeData: undefined,
    paymentType: 0,
    isWithdraw: false,
    isDeposit: false,
    timestamp: undefined,
  };
}

export const PaymentHistoryItem = {
  encode(message: PaymentHistoryItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cursor !== undefined) {
      Cursor.encode(message.cursor, writer.uint32(10).fork()).ldelim();
    }
    if (message.exchangeData !== undefined) {
      ExchangeData.encode(message.exchangeData, writer.uint32(18).fork()).ldelim();
    }
    if (message.paymentType !== 0) {
      writer.uint32(24).int32(message.paymentType);
    }
    if (message.isWithdraw === true) {
      writer.uint32(32).bool(message.isWithdraw);
    }
    if (message.isDeposit === true) {
      writer.uint32(40).bool(message.isDeposit);
    }
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PaymentHistoryItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePaymentHistoryItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cursor = Cursor.decode(reader, reader.uint32());
          break;
        case 2:
          message.exchangeData = ExchangeData.decode(reader, reader.uint32());
          break;
        case 3:
          message.paymentType = reader.int32() as any;
          break;
        case 4:
          message.isWithdraw = reader.bool();
          break;
        case 5:
          message.isDeposit = reader.bool();
          break;
        case 6:
          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PaymentHistoryItem {
    return {
      cursor: isSet(object.cursor) ? Cursor.fromJSON(object.cursor) : undefined,
      exchangeData: isSet(object.exchangeData) ? ExchangeData.fromJSON(object.exchangeData) : undefined,
      paymentType: isSet(object.paymentType) ? paymentHistoryItem_PaymentTypeFromJSON(object.paymentType) : 0,
      isWithdraw: isSet(object.isWithdraw) ? Boolean(object.isWithdraw) : false,
      isDeposit: isSet(object.isDeposit) ? Boolean(object.isDeposit) : false,
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
    };
  },

  toJSON(message: PaymentHistoryItem): unknown {
    const obj: any = {};
    message.cursor !== undefined && (obj.cursor = message.cursor ? Cursor.toJSON(message.cursor) : undefined);
    message.exchangeData !== undefined &&
      (obj.exchangeData = message.exchangeData ? ExchangeData.toJSON(message.exchangeData) : undefined);
    message.paymentType !== undefined && (obj.paymentType = paymentHistoryItem_PaymentTypeToJSON(message.paymentType));
    message.isWithdraw !== undefined && (obj.isWithdraw = message.isWithdraw);
    message.isDeposit !== undefined && (obj.isDeposit = message.isDeposit);
    message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PaymentHistoryItem>, I>>(object: I): PaymentHistoryItem {
    const message = createBasePaymentHistoryItem();
    message.cursor = (object.cursor !== undefined && object.cursor !== null)
      ? Cursor.fromPartial(object.cursor)
      : undefined;
    message.exchangeData = (object.exchangeData !== undefined && object.exchangeData !== null)
      ? ExchangeData.fromPartial(object.exchangeData)
      : undefined;
    message.paymentType = object.paymentType ?? 0;
    message.isWithdraw = object.isWithdraw ?? false;
    message.isDeposit = object.isDeposit ?? false;
    message.timestamp = object.timestamp ?? undefined;
    return message;
  },
};

function createBaseExchangeData(): ExchangeData {
  return { currency: "", exchangeRate: 0, nativeAmount: 0, quarks: 0 };
}

export const ExchangeData = {
  encode(message: ExchangeData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.currency !== "") {
      writer.uint32(10).string(message.currency);
    }
    if (message.exchangeRate !== 0) {
      writer.uint32(17).double(message.exchangeRate);
    }
    if (message.nativeAmount !== 0) {
      writer.uint32(25).double(message.nativeAmount);
    }
    if (message.quarks !== 0) {
      writer.uint32(32).uint64(message.quarks);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExchangeData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExchangeData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.currency = reader.string();
          break;
        case 2:
          message.exchangeRate = reader.double();
          break;
        case 3:
          message.nativeAmount = reader.double();
          break;
        case 4:
          message.quarks = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExchangeData {
    return {
      currency: isSet(object.currency) ? String(object.currency) : "",
      exchangeRate: isSet(object.exchangeRate) ? Number(object.exchangeRate) : 0,
      nativeAmount: isSet(object.nativeAmount) ? Number(object.nativeAmount) : 0,
      quarks: isSet(object.quarks) ? Number(object.quarks) : 0,
    };
  },

  toJSON(message: ExchangeData): unknown {
    const obj: any = {};
    message.currency !== undefined && (obj.currency = message.currency);
    message.exchangeRate !== undefined && (obj.exchangeRate = message.exchangeRate);
    message.nativeAmount !== undefined && (obj.nativeAmount = message.nativeAmount);
    message.quarks !== undefined && (obj.quarks = Math.round(message.quarks));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ExchangeData>, I>>(object: I): ExchangeData {
    const message = createBaseExchangeData();
    message.currency = object.currency ?? "";
    message.exchangeRate = object.exchangeRate ?? 0;
    message.nativeAmount = object.nativeAmount ?? 0;
    message.quarks = object.quarks ?? 0;
    return message;
  },
};

function createBaseRemainingSendLimit(): RemainingSendLimit {
  return { nextTransaction: 0 };
}

export const RemainingSendLimit = {
  encode(message: RemainingSendLimit, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nextTransaction !== 0) {
      writer.uint32(13).float(message.nextTransaction);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemainingSendLimit {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemainingSendLimit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nextTransaction = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemainingSendLimit {
    return { nextTransaction: isSet(object.nextTransaction) ? Number(object.nextTransaction) : 0 };
  },

  toJSON(message: RemainingSendLimit): unknown {
    const obj: any = {};
    message.nextTransaction !== undefined && (obj.nextTransaction = message.nextTransaction);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemainingSendLimit>, I>>(object: I): RemainingSendLimit {
    const message = createBaseRemainingSendLimit();
    message.nextTransaction = object.nextTransaction ?? 0;
    return message;
  },
};

function createBaseCursor(): Cursor {
  return { value: Buffer.alloc(0) };
}

export const Cursor = {
  encode(message: Cursor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Cursor {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCursor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Cursor {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: Cursor): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Cursor>, I>>(object: I): Cursor {
    const message = createBaseCursor();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

export type TransactionService = typeof TransactionService;
export const TransactionService = {
  /**
   * SubmitIntent is the mechanism for client and server to agree upon a set of
   * transactions to execute on the blockchain.
   *
   * Transactions are never exchanged between client and server. Instead, the
   * required accounts and arguments for instructions known to each actor are
   * exchanged to allow independent and local transaction construction.
   *
   * Client and server are expected to fully validate the intent. Proofs will
   * be provided for any parameter requiring one. Signatures should only be
   * generated after approval of all transactions.
   *
   * This RPC is not a traditional streaming endpoint. It bundles two unary calls
   * to enable DB-level transaction semantics.
   *
   * The high-level happy path flow for the RPC is as follows:
   *   1.  Client initiates a stream and sends SubmitIntentRequest.SubmitActions
   *   2.  Server validates the intent, its actions and metadata
   *   3a. If there are transactions requiring the user's signature, then server
   *       returns SubmitIntentResponse.ServerParameters
   *   3b. Otherwise, server returns SubmitIntentResponse.Success and closes the
   *       stream
   *   4.  For each transaction requiring the user's signature, the client locally
   *       constructs it, performs validation and collects the signature
   *   5.  Client sends SubmitIntentRequest.SubmitSignatures with the signature
   *       list generated from 4
   *   6.  Server validates all signatures are submitted and are the expected values
   *       using locally constructed transactions.
   *   7.  Server returns SubmitIntentResponse.Success and closes the stream
   * In the error case:
   *   * Server will return SubmitIntentResponse.Error and close the stream
   *   * Client will close the stream
   */
  submitIntent: {
    path: "/code.transaction.v2.Transaction/SubmitIntent",
    requestStream: true,
    responseStream: true,
    requestSerialize: (value: SubmitIntentRequest) => Buffer.from(SubmitIntentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SubmitIntentRequest.decode(value),
    responseSerialize: (value: SubmitIntentResponse) => Buffer.from(SubmitIntentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SubmitIntentResponse.decode(value),
  },
  /**
   * GetPrivacyUpgradeStatus gets the status of a private transaction and the
   * ability to upgrade it to permanent privacy.
   */
  getPrivacyUpgradeStatus: {
    path: "/code.transaction.v2.Transaction/GetPrivacyUpgradeStatus",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetPrivacyUpgradeStatusRequest) =>
      Buffer.from(GetPrivacyUpgradeStatusRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetPrivacyUpgradeStatusRequest.decode(value),
    responseSerialize: (value: GetPrivacyUpgradeStatusResponse) =>
      Buffer.from(GetPrivacyUpgradeStatusResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetPrivacyUpgradeStatusResponse.decode(value),
  },
  /**
   * GetPrioritizedIntentsForPrivacyUpgrade allows clients to get private
   * intent actions that can be upgraded in a secure and verifiable manner.
   */
  getPrioritizedIntentsForPrivacyUpgrade: {
    path: "/code.transaction.v2.Transaction/GetPrioritizedIntentsForPrivacyUpgrade",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetPrioritizedIntentsForPrivacyUpgradeRequest) =>
      Buffer.from(GetPrioritizedIntentsForPrivacyUpgradeRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetPrioritizedIntentsForPrivacyUpgradeRequest.decode(value),
    responseSerialize: (value: GetPrioritizedIntentsForPrivacyUpgradeResponse) =>
      Buffer.from(GetPrioritizedIntentsForPrivacyUpgradeResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetPrioritizedIntentsForPrivacyUpgradeResponse.decode(value),
  },
  /**
   * GetLimits gets limits for SendPayment intents for an owner account in an
   * identity-aware manner
   */
  getLimits: {
    path: "/code.transaction.v2.Transaction/GetLimits",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetLimitsRequest) => Buffer.from(GetLimitsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetLimitsRequest.decode(value),
    responseSerialize: (value: GetLimitsResponse) => Buffer.from(GetLimitsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetLimitsResponse.decode(value),
  },
  /** GetPaymentHistory gets an owner account's payment history inferred from intents */
  getPaymentHistory: {
    path: "/code.transaction.v2.Transaction/GetPaymentHistory",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetPaymentHistoryRequest) => Buffer.from(GetPaymentHistoryRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetPaymentHistoryRequest.decode(value),
    responseSerialize: (value: GetPaymentHistoryResponse) =>
      Buffer.from(GetPaymentHistoryResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetPaymentHistoryResponse.decode(value),
  },
} as const;

export interface TransactionServer extends UntypedServiceImplementation {
  /**
   * SubmitIntent is the mechanism for client and server to agree upon a set of
   * transactions to execute on the blockchain.
   *
   * Transactions are never exchanged between client and server. Instead, the
   * required accounts and arguments for instructions known to each actor are
   * exchanged to allow independent and local transaction construction.
   *
   * Client and server are expected to fully validate the intent. Proofs will
   * be provided for any parameter requiring one. Signatures should only be
   * generated after approval of all transactions.
   *
   * This RPC is not a traditional streaming endpoint. It bundles two unary calls
   * to enable DB-level transaction semantics.
   *
   * The high-level happy path flow for the RPC is as follows:
   *   1.  Client initiates a stream and sends SubmitIntentRequest.SubmitActions
   *   2.  Server validates the intent, its actions and metadata
   *   3a. If there are transactions requiring the user's signature, then server
   *       returns SubmitIntentResponse.ServerParameters
   *   3b. Otherwise, server returns SubmitIntentResponse.Success and closes the
   *       stream
   *   4.  For each transaction requiring the user's signature, the client locally
   *       constructs it, performs validation and collects the signature
   *   5.  Client sends SubmitIntentRequest.SubmitSignatures with the signature
   *       list generated from 4
   *   6.  Server validates all signatures are submitted and are the expected values
   *       using locally constructed transactions.
   *   7.  Server returns SubmitIntentResponse.Success and closes the stream
   * In the error case:
   *   * Server will return SubmitIntentResponse.Error and close the stream
   *   * Client will close the stream
   */
  submitIntent: handleBidiStreamingCall<SubmitIntentRequest, SubmitIntentResponse>;
  /**
   * GetPrivacyUpgradeStatus gets the status of a private transaction and the
   * ability to upgrade it to permanent privacy.
   */
  getPrivacyUpgradeStatus: handleUnaryCall<GetPrivacyUpgradeStatusRequest, GetPrivacyUpgradeStatusResponse>;
  /**
   * GetPrioritizedIntentsForPrivacyUpgrade allows clients to get private
   * intent actions that can be upgraded in a secure and verifiable manner.
   */
  getPrioritizedIntentsForPrivacyUpgrade: handleUnaryCall<
    GetPrioritizedIntentsForPrivacyUpgradeRequest,
    GetPrioritizedIntentsForPrivacyUpgradeResponse
  >;
  /**
   * GetLimits gets limits for SendPayment intents for an owner account in an
   * identity-aware manner
   */
  getLimits: handleUnaryCall<GetLimitsRequest, GetLimitsResponse>;
  /** GetPaymentHistory gets an owner account's payment history inferred from intents */
  getPaymentHistory: handleUnaryCall<GetPaymentHistoryRequest, GetPaymentHistoryResponse>;
}

export interface TransactionClient extends Client {
  /**
   * SubmitIntent is the mechanism for client and server to agree upon a set of
   * transactions to execute on the blockchain.
   *
   * Transactions are never exchanged between client and server. Instead, the
   * required accounts and arguments for instructions known to each actor are
   * exchanged to allow independent and local transaction construction.
   *
   * Client and server are expected to fully validate the intent. Proofs will
   * be provided for any parameter requiring one. Signatures should only be
   * generated after approval of all transactions.
   *
   * This RPC is not a traditional streaming endpoint. It bundles two unary calls
   * to enable DB-level transaction semantics.
   *
   * The high-level happy path flow for the RPC is as follows:
   *   1.  Client initiates a stream and sends SubmitIntentRequest.SubmitActions
   *   2.  Server validates the intent, its actions and metadata
   *   3a. If there are transactions requiring the user's signature, then server
   *       returns SubmitIntentResponse.ServerParameters
   *   3b. Otherwise, server returns SubmitIntentResponse.Success and closes the
   *       stream
   *   4.  For each transaction requiring the user's signature, the client locally
   *       constructs it, performs validation and collects the signature
   *   5.  Client sends SubmitIntentRequest.SubmitSignatures with the signature
   *       list generated from 4
   *   6.  Server validates all signatures are submitted and are the expected values
   *       using locally constructed transactions.
   *   7.  Server returns SubmitIntentResponse.Success and closes the stream
   * In the error case:
   *   * Server will return SubmitIntentResponse.Error and close the stream
   *   * Client will close the stream
   */
  submitIntent(): ClientDuplexStream<SubmitIntentRequest, SubmitIntentResponse>;
  submitIntent(options: Partial<CallOptions>): ClientDuplexStream<SubmitIntentRequest, SubmitIntentResponse>;
  submitIntent(
    metadata: Metadata1,
    options?: Partial<CallOptions>,
  ): ClientDuplexStream<SubmitIntentRequest, SubmitIntentResponse>;
  /**
   * GetPrivacyUpgradeStatus gets the status of a private transaction and the
   * ability to upgrade it to permanent privacy.
   */
  getPrivacyUpgradeStatus(
    request: GetPrivacyUpgradeStatusRequest,
    callback: (error: ServiceError | null, response: GetPrivacyUpgradeStatusResponse) => void,
  ): ClientUnaryCall;
  getPrivacyUpgradeStatus(
    request: GetPrivacyUpgradeStatusRequest,
    metadata: Metadata1,
    callback: (error: ServiceError | null, response: GetPrivacyUpgradeStatusResponse) => void,
  ): ClientUnaryCall;
  getPrivacyUpgradeStatus(
    request: GetPrivacyUpgradeStatusRequest,
    metadata: Metadata1,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetPrivacyUpgradeStatusResponse) => void,
  ): ClientUnaryCall;
  /**
   * GetPrioritizedIntentsForPrivacyUpgrade allows clients to get private
   * intent actions that can be upgraded in a secure and verifiable manner.
   */
  getPrioritizedIntentsForPrivacyUpgrade(
    request: GetPrioritizedIntentsForPrivacyUpgradeRequest,
    callback: (error: ServiceError | null, response: GetPrioritizedIntentsForPrivacyUpgradeResponse) => void,
  ): ClientUnaryCall;
  getPrioritizedIntentsForPrivacyUpgrade(
    request: GetPrioritizedIntentsForPrivacyUpgradeRequest,
    metadata: Metadata1,
    callback: (error: ServiceError | null, response: GetPrioritizedIntentsForPrivacyUpgradeResponse) => void,
  ): ClientUnaryCall;
  getPrioritizedIntentsForPrivacyUpgrade(
    request: GetPrioritizedIntentsForPrivacyUpgradeRequest,
    metadata: Metadata1,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetPrioritizedIntentsForPrivacyUpgradeResponse) => void,
  ): ClientUnaryCall;
  /**
   * GetLimits gets limits for SendPayment intents for an owner account in an
   * identity-aware manner
   */
  getLimits(
    request: GetLimitsRequest,
    callback: (error: ServiceError | null, response: GetLimitsResponse) => void,
  ): ClientUnaryCall;
  getLimits(
    request: GetLimitsRequest,
    metadata: Metadata1,
    callback: (error: ServiceError | null, response: GetLimitsResponse) => void,
  ): ClientUnaryCall;
  getLimits(
    request: GetLimitsRequest,
    metadata: Metadata1,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetLimitsResponse) => void,
  ): ClientUnaryCall;
  /** GetPaymentHistory gets an owner account's payment history inferred from intents */
  getPaymentHistory(
    request: GetPaymentHistoryRequest,
    callback: (error: ServiceError | null, response: GetPaymentHistoryResponse) => void,
  ): ClientUnaryCall;
  getPaymentHistory(
    request: GetPaymentHistoryRequest,
    metadata: Metadata1,
    callback: (error: ServiceError | null, response: GetPaymentHistoryResponse) => void,
  ): ClientUnaryCall;
  getPaymentHistory(
    request: GetPaymentHistoryRequest,
    metadata: Metadata1,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetPaymentHistoryResponse) => void,
  ): ClientUnaryCall;
}

export const TransactionClient = makeGenericClientConstructor(
  TransactionService,
  "code.transaction.v2.Transaction",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): TransactionClient;
  service: typeof TransactionService;
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
