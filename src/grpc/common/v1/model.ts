/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "code.common.v1";

/** Reference: https://docs.solana.com/apps/jsonrpc-api#configuring-state-commitment */
export enum Commitment {
  PROCESSED = 0,
  CONFIRMED = 1,
  FINALIZED = 3,
  UNRECOGNIZED = -1,
}

export function commitmentFromJSON(object: any): Commitment {
  switch (object) {
    case 0:
    case "PROCESSED":
      return Commitment.PROCESSED;
    case 1:
    case "CONFIRMED":
      return Commitment.CONFIRMED;
    case 3:
    case "FINALIZED":
      return Commitment.FINALIZED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Commitment.UNRECOGNIZED;
  }
}

export function commitmentToJSON(object: Commitment): string {
  switch (object) {
    case Commitment.PROCESSED:
      return "PROCESSED";
    case Commitment.CONFIRMED:
      return "CONFIRMED";
    case Commitment.FINALIZED:
      return "FINALIZED";
    case Commitment.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum AccountType {
  UNKNOWN = 0,
  PRIMARY = 1,
  TEMPORARY_INCOMING = 2,
  TEMPORARY_OUTGOING = 3,
  BUCKET_1_KIN = 4,
  BUCKET_10_KIN = 5,
  BUCKET_100_KIN = 6,
  BUCKET_1_000_KIN = 7,
  BUCKET_10_000_KIN = 8,
  BUCKET_100_000_KIN = 9,
  BUCKET_1_000_000_KIN = 10,
  UNRECOGNIZED = -1,
}

export function accountTypeFromJSON(object: any): AccountType {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return AccountType.UNKNOWN;
    case 1:
    case "PRIMARY":
      return AccountType.PRIMARY;
    case 2:
    case "TEMPORARY_INCOMING":
      return AccountType.TEMPORARY_INCOMING;
    case 3:
    case "TEMPORARY_OUTGOING":
      return AccountType.TEMPORARY_OUTGOING;
    case 4:
    case "BUCKET_1_KIN":
      return AccountType.BUCKET_1_KIN;
    case 5:
    case "BUCKET_10_KIN":
      return AccountType.BUCKET_10_KIN;
    case 6:
    case "BUCKET_100_KIN":
      return AccountType.BUCKET_100_KIN;
    case 7:
    case "BUCKET_1_000_KIN":
      return AccountType.BUCKET_1_000_KIN;
    case 8:
    case "BUCKET_10_000_KIN":
      return AccountType.BUCKET_10_000_KIN;
    case 9:
    case "BUCKET_100_000_KIN":
      return AccountType.BUCKET_100_000_KIN;
    case 10:
    case "BUCKET_1_000_000_KIN":
      return AccountType.BUCKET_1_000_000_KIN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AccountType.UNRECOGNIZED;
  }
}

export function accountTypeToJSON(object: AccountType): string {
  switch (object) {
    case AccountType.UNKNOWN:
      return "UNKNOWN";
    case AccountType.PRIMARY:
      return "PRIMARY";
    case AccountType.TEMPORARY_INCOMING:
      return "TEMPORARY_INCOMING";
    case AccountType.TEMPORARY_OUTGOING:
      return "TEMPORARY_OUTGOING";
    case AccountType.BUCKET_1_KIN:
      return "BUCKET_1_KIN";
    case AccountType.BUCKET_10_KIN:
      return "BUCKET_10_KIN";
    case AccountType.BUCKET_100_KIN:
      return "BUCKET_100_KIN";
    case AccountType.BUCKET_1_000_KIN:
      return "BUCKET_1_000_KIN";
    case AccountType.BUCKET_10_000_KIN:
      return "BUCKET_10_000_KIN";
    case AccountType.BUCKET_100_000_KIN:
      return "BUCKET_100_000_KIN";
    case AccountType.BUCKET_1_000_000_KIN:
      return "BUCKET_1_000_000_KIN";
    case AccountType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Signature represents a raw binary Ed25519 signature. */
export interface Signature {
  value: Buffer;
}

export interface Locale {
  /** The ISO 639 alpha-2 language code. */
  language: string;
  /** ISO 3166 alpha-2 country code. */
  country: string;
}

export interface Region {
  /** ISO 3166 alpha-2 country code. */
  value: string;
}

export interface SolanaAccountId {
  value: Buffer;
}

export interface TransactionId {
  /**
   * Value is either a 32-byte transaction hash, or a 64-byte transaction signature.
   * Values that are neither 32 nor 64 bytes are considered invalid.
   */
  value: Buffer;
}

export interface Blockhash {
  value: Buffer;
}

export interface TransactionSignature {
  value: Buffer;
}

export interface Transaction {
  /** Maximum size taken from: https://github.com/solana-labs/solana/blob/39b3ac6a8d29e14faa1de73d8b46d390ad41797b/code/src/packet.rs#L9-L13 */
  value: Buffer;
}

export interface TransactionError {
  reason: TransactionError_Reason;
  /**
   * If the transaction failed due to an instruction, the
   * instruction_index will be >= 0, corresponding to the
   * instruction that failed the transaction.
   *
   * Otherwise, the instruction_index will be negative.
   */
  instructionIndex: number;
  /**
   * Raw is the raw error returned from the underlying RPC
   * mechanisms with Solana. There are no stability guarantees
   * for the contents of this field.
   */
  raw: Buffer;
}

export enum TransactionError_Reason {
  NONE = 0,
  /**
   * UNKNOWN - The error could not be mapped by the service.
   *
   * In this situation, the error may be propagated out
   * of band (i.e. via error status), or be looked up using
   * low level RPCs.
   */
  UNKNOWN = 1,
  /** UNAUTHORIZED - The transaction was missing a required signature. */
  UNAUTHORIZED = 2,
  /**
   * BAD_NONCE - Corresponds to an invalid sequence number in stellar,
   * or a bad / expired blockhash in solana.
   */
  BAD_NONCE = 3,
  /** INSUFFICIENT_FUNDS - Source did not have sufficient kin. */
  INSUFFICIENT_FUNDS = 4,
  /**
   * INVALID_ACCOUNT - Indicates one of the accounts in the transaction is
   * invalid. Some possible reasons are be:
   *
   *   1. Account does not exist
   *   2. Account exists, but is not a token account
   *   3. Account exists, but is for the wrong token.
   */
  INVALID_ACCOUNT = 5,
  UNRECOGNIZED = -1,
}

export function transactionError_ReasonFromJSON(object: any): TransactionError_Reason {
  switch (object) {
    case 0:
    case "NONE":
      return TransactionError_Reason.NONE;
    case 1:
    case "UNKNOWN":
      return TransactionError_Reason.UNKNOWN;
    case 2:
    case "UNAUTHORIZED":
      return TransactionError_Reason.UNAUTHORIZED;
    case 3:
    case "BAD_NONCE":
      return TransactionError_Reason.BAD_NONCE;
    case 4:
    case "INSUFFICIENT_FUNDS":
      return TransactionError_Reason.INSUFFICIENT_FUNDS;
    case 5:
    case "INVALID_ACCOUNT":
      return TransactionError_Reason.INVALID_ACCOUNT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TransactionError_Reason.UNRECOGNIZED;
  }
}

export function transactionError_ReasonToJSON(object: TransactionError_Reason): string {
  switch (object) {
    case TransactionError_Reason.NONE:
      return "NONE";
    case TransactionError_Reason.UNKNOWN:
      return "UNKNOWN";
    case TransactionError_Reason.UNAUTHORIZED:
      return "UNAUTHORIZED";
    case TransactionError_Reason.BAD_NONCE:
      return "BAD_NONCE";
    case TransactionError_Reason.INSUFFICIENT_FUNDS:
      return "INSUFFICIENT_FUNDS";
    case TransactionError_Reason.INVALID_ACCOUNT:
      return "INVALID_ACCOUNT";
    case TransactionError_Reason.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Payment {
  source: SolanaAccountId | undefined;
  destination:
    | SolanaAccountId
    | undefined;
  /** Amount in quarks */
  amount: number;
  /** The index of the transfer within the transaction. */
  index: number;
  /**
   * ISO 4217 alpha-3 currency code.
   * The fiat currency to use for calculating the booking cost. This might
   * also include non-fiat currency types in the future.
   */
  exchangeCurrency: string;
  /**
   * Optional region, which specifies the country flag where exchange_currency
   * is being used
   */
  region:
    | Region
    | undefined;
  /**
   * The agreed upon exchange rate between the wallet holders. This might not
   * be the same as the actual exchange rate at the timestamp.
   */
  exchangeRate: number;
  /** The agreed upon transfer amount, in the currency the payment was made in. */
  nativeAmount: number;
  /** Status of the payment */
  state: Payment_State;
  intentId:
    | IntentId
    | undefined;
  /** Is the payment part of a withdrawal? */
  isWithdrawal: boolean;
}

export enum Payment_State {
  /** UNKNOWN - The payment has been submitted to the network. */
  UNKNOWN = 0,
  /** PROCESSED - The payment has been processed by the node, but not the network. */
  PROCESSED = 1,
  /** CONFIRMED - The payment has been confirmed by the network. */
  CONFIRMED = 2,
  /** FINALIZED - The payment is considered finalized */
  FINALIZED = 3,
  /** FAILED - The payment has failed on the network. */
  FAILED = 4,
  UNRECOGNIZED = -1,
}

export function payment_StateFromJSON(object: any): Payment_State {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return Payment_State.UNKNOWN;
    case 1:
    case "PROCESSED":
      return Payment_State.PROCESSED;
    case 2:
    case "CONFIRMED":
      return Payment_State.CONFIRMED;
    case 3:
    case "FINALIZED":
      return Payment_State.FINALIZED;
    case 4:
    case "FAILED":
      return Payment_State.FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Payment_State.UNRECOGNIZED;
  }
}

export function payment_StateToJSON(object: Payment_State): string {
  switch (object) {
    case Payment_State.UNKNOWN:
      return "UNKNOWN";
    case Payment_State.PROCESSED:
      return "PROCESSED";
    case Payment_State.CONFIRMED:
      return "CONFIRMED";
    case Payment_State.FINALIZED:
      return "FINALIZED";
    case Payment_State.FAILED:
      return "FAILED";
    case Payment_State.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface PhoneNumber {
  /** E.164 phone number value. Regex provided by Twilio here: https://www.twilio.com/docs/glossary/what-e164#regex-matching-for-e164 */
  value: string;
}

/** UserId is a globally unique identifier for a user from the identity service. */
export interface UserId {
  value: Buffer;
}

/**
 * DataContainerId is a globally unique identifier for a container where a user
 * can store a copy of their data.
 */
export interface DataContainerId {
  value: Buffer;
}

/**
 * The client-side generated ID that maps to an intent that defines a contract.
 * Clients can treat this as a deduplication ID. The server guarantees idempotency
 * and will treat equal IDs as the same transaction.
 */
export interface IntentId {
  value: Buffer;
}

export interface Hash {
  value: Buffer;
}

function createBaseSignature(): Signature {
  return { value: Buffer.alloc(0) };
}

export const Signature = {
  encode(message: Signature, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Signature {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignature();
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

  fromJSON(object: any): Signature {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: Signature): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Signature>, I>>(object: I): Signature {
    const message = createBaseSignature();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseLocale(): Locale {
  return { language: "", country: "" };
}

export const Locale = {
  encode(message: Locale, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.language !== "") {
      writer.uint32(10).string(message.language);
    }
    if (message.country !== "") {
      writer.uint32(18).string(message.country);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Locale {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLocale();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.language = reader.string();
          break;
        case 2:
          message.country = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Locale {
    return {
      language: isSet(object.language) ? String(object.language) : "",
      country: isSet(object.country) ? String(object.country) : "",
    };
  },

  toJSON(message: Locale): unknown {
    const obj: any = {};
    message.language !== undefined && (obj.language = message.language);
    message.country !== undefined && (obj.country = message.country);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Locale>, I>>(object: I): Locale {
    const message = createBaseLocale();
    message.language = object.language ?? "";
    message.country = object.country ?? "";
    return message;
  },
};

function createBaseRegion(): Region {
  return { value: "" };
}

export const Region = {
  encode(message: Region, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== "") {
      writer.uint32(10).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Region {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Region {
    return { value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: Region): unknown {
    const obj: any = {};
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Region>, I>>(object: I): Region {
    const message = createBaseRegion();
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseSolanaAccountId(): SolanaAccountId {
  return { value: Buffer.alloc(0) };
}

export const SolanaAccountId = {
  encode(message: SolanaAccountId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SolanaAccountId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSolanaAccountId();
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

  fromJSON(object: any): SolanaAccountId {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: SolanaAccountId): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SolanaAccountId>, I>>(object: I): SolanaAccountId {
    const message = createBaseSolanaAccountId();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseTransactionId(): TransactionId {
  return { value: Buffer.alloc(0) };
}

export const TransactionId = {
  encode(message: TransactionId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionId();
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

  fromJSON(object: any): TransactionId {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: TransactionId): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TransactionId>, I>>(object: I): TransactionId {
    const message = createBaseTransactionId();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseBlockhash(): Blockhash {
  return { value: Buffer.alloc(0) };
}

export const Blockhash = {
  encode(message: Blockhash, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Blockhash {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBlockhash();
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

  fromJSON(object: any): Blockhash {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: Blockhash): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Blockhash>, I>>(object: I): Blockhash {
    const message = createBaseBlockhash();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseTransactionSignature(): TransactionSignature {
  return { value: Buffer.alloc(0) };
}

export const TransactionSignature = {
  encode(message: TransactionSignature, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionSignature {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionSignature();
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

  fromJSON(object: any): TransactionSignature {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: TransactionSignature): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TransactionSignature>, I>>(object: I): TransactionSignature {
    const message = createBaseTransactionSignature();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseTransaction(): Transaction {
  return { value: Buffer.alloc(0) };
}

export const Transaction = {
  encode(message: Transaction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Transaction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransaction();
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

  fromJSON(object: any): Transaction {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: Transaction): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Transaction>, I>>(object: I): Transaction {
    const message = createBaseTransaction();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseTransactionError(): TransactionError {
  return { reason: 0, instructionIndex: 0, raw: Buffer.alloc(0) };
}

export const TransactionError = {
  encode(message: TransactionError, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reason !== 0) {
      writer.uint32(8).int32(message.reason);
    }
    if (message.instructionIndex !== 0) {
      writer.uint32(16).int32(message.instructionIndex);
    }
    if (message.raw.length !== 0) {
      writer.uint32(26).bytes(message.raw);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionError {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionError();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reason = reader.int32() as any;
          break;
        case 2:
          message.instructionIndex = reader.int32();
          break;
        case 3:
          message.raw = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionError {
    return {
      reason: isSet(object.reason) ? transactionError_ReasonFromJSON(object.reason) : 0,
      instructionIndex: isSet(object.instructionIndex) ? Number(object.instructionIndex) : 0,
      raw: isSet(object.raw) ? Buffer.from(bytesFromBase64(object.raw)) : Buffer.alloc(0),
    };
  },

  toJSON(message: TransactionError): unknown {
    const obj: any = {};
    message.reason !== undefined && (obj.reason = transactionError_ReasonToJSON(message.reason));
    message.instructionIndex !== undefined && (obj.instructionIndex = Math.round(message.instructionIndex));
    message.raw !== undefined && (obj.raw = base64FromBytes(message.raw !== undefined ? message.raw : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TransactionError>, I>>(object: I): TransactionError {
    const message = createBaseTransactionError();
    message.reason = object.reason ?? 0;
    message.instructionIndex = object.instructionIndex ?? 0;
    message.raw = object.raw ?? Buffer.alloc(0);
    return message;
  },
};

function createBasePayment(): Payment {
  return {
    source: undefined,
    destination: undefined,
    amount: 0,
    index: 0,
    exchangeCurrency: "",
    region: undefined,
    exchangeRate: 0,
    nativeAmount: 0,
    state: 0,
    intentId: undefined,
    isWithdrawal: false,
  };
}

export const Payment = {
  encode(message: Payment, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.source !== undefined) {
      SolanaAccountId.encode(message.source, writer.uint32(10).fork()).ldelim();
    }
    if (message.destination !== undefined) {
      SolanaAccountId.encode(message.destination, writer.uint32(18).fork()).ldelim();
    }
    if (message.amount !== 0) {
      writer.uint32(24).int64(message.amount);
    }
    if (message.index !== 0) {
      writer.uint32(32).uint32(message.index);
    }
    if (message.exchangeCurrency !== "") {
      writer.uint32(42).string(message.exchangeCurrency);
    }
    if (message.region !== undefined) {
      Region.encode(message.region, writer.uint32(82).fork()).ldelim();
    }
    if (message.exchangeRate !== 0) {
      writer.uint32(49).double(message.exchangeRate);
    }
    if (message.nativeAmount !== 0) {
      writer.uint32(57).double(message.nativeAmount);
    }
    if (message.state !== 0) {
      writer.uint32(64).int32(message.state);
    }
    if (message.intentId !== undefined) {
      IntentId.encode(message.intentId, writer.uint32(74).fork()).ldelim();
    }
    if (message.isWithdrawal === true) {
      writer.uint32(88).bool(message.isWithdrawal);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Payment {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePayment();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.source = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.destination = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.amount = longToNumber(reader.int64() as Long);
          break;
        case 4:
          message.index = reader.uint32();
          break;
        case 5:
          message.exchangeCurrency = reader.string();
          break;
        case 10:
          message.region = Region.decode(reader, reader.uint32());
          break;
        case 6:
          message.exchangeRate = reader.double();
          break;
        case 7:
          message.nativeAmount = reader.double();
          break;
        case 8:
          message.state = reader.int32() as any;
          break;
        case 9:
          message.intentId = IntentId.decode(reader, reader.uint32());
          break;
        case 11:
          message.isWithdrawal = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Payment {
    return {
      source: isSet(object.source) ? SolanaAccountId.fromJSON(object.source) : undefined,
      destination: isSet(object.destination) ? SolanaAccountId.fromJSON(object.destination) : undefined,
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      index: isSet(object.index) ? Number(object.index) : 0,
      exchangeCurrency: isSet(object.exchangeCurrency) ? String(object.exchangeCurrency) : "",
      region: isSet(object.region) ? Region.fromJSON(object.region) : undefined,
      exchangeRate: isSet(object.exchangeRate) ? Number(object.exchangeRate) : 0,
      nativeAmount: isSet(object.nativeAmount) ? Number(object.nativeAmount) : 0,
      state: isSet(object.state) ? payment_StateFromJSON(object.state) : 0,
      intentId: isSet(object.intentId) ? IntentId.fromJSON(object.intentId) : undefined,
      isWithdrawal: isSet(object.isWithdrawal) ? Boolean(object.isWithdrawal) : false,
    };
  },

  toJSON(message: Payment): unknown {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source ? SolanaAccountId.toJSON(message.source) : undefined);
    message.destination !== undefined &&
      (obj.destination = message.destination ? SolanaAccountId.toJSON(message.destination) : undefined);
    message.amount !== undefined && (obj.amount = Math.round(message.amount));
    message.index !== undefined && (obj.index = Math.round(message.index));
    message.exchangeCurrency !== undefined && (obj.exchangeCurrency = message.exchangeCurrency);
    message.region !== undefined && (obj.region = message.region ? Region.toJSON(message.region) : undefined);
    message.exchangeRate !== undefined && (obj.exchangeRate = message.exchangeRate);
    message.nativeAmount !== undefined && (obj.nativeAmount = message.nativeAmount);
    message.state !== undefined && (obj.state = payment_StateToJSON(message.state));
    message.intentId !== undefined && (obj.intentId = message.intentId ? IntentId.toJSON(message.intentId) : undefined);
    message.isWithdrawal !== undefined && (obj.isWithdrawal = message.isWithdrawal);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Payment>, I>>(object: I): Payment {
    const message = createBasePayment();
    message.source = (object.source !== undefined && object.source !== null)
      ? SolanaAccountId.fromPartial(object.source)
      : undefined;
    message.destination = (object.destination !== undefined && object.destination !== null)
      ? SolanaAccountId.fromPartial(object.destination)
      : undefined;
    message.amount = object.amount ?? 0;
    message.index = object.index ?? 0;
    message.exchangeCurrency = object.exchangeCurrency ?? "";
    message.region = (object.region !== undefined && object.region !== null)
      ? Region.fromPartial(object.region)
      : undefined;
    message.exchangeRate = object.exchangeRate ?? 0;
    message.nativeAmount = object.nativeAmount ?? 0;
    message.state = object.state ?? 0;
    message.intentId = (object.intentId !== undefined && object.intentId !== null)
      ? IntentId.fromPartial(object.intentId)
      : undefined;
    message.isWithdrawal = object.isWithdrawal ?? false;
    return message;
  },
};

function createBasePhoneNumber(): PhoneNumber {
  return { value: "" };
}

export const PhoneNumber = {
  encode(message: PhoneNumber, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== "") {
      writer.uint32(10).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PhoneNumber {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePhoneNumber();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PhoneNumber {
    return { value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: PhoneNumber): unknown {
    const obj: any = {};
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PhoneNumber>, I>>(object: I): PhoneNumber {
    const message = createBasePhoneNumber();
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseUserId(): UserId {
  return { value: Buffer.alloc(0) };
}

export const UserId = {
  encode(message: UserId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserId();
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

  fromJSON(object: any): UserId {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: UserId): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserId>, I>>(object: I): UserId {
    const message = createBaseUserId();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseDataContainerId(): DataContainerId {
  return { value: Buffer.alloc(0) };
}

export const DataContainerId = {
  encode(message: DataContainerId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataContainerId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDataContainerId();
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

  fromJSON(object: any): DataContainerId {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: DataContainerId): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DataContainerId>, I>>(object: I): DataContainerId {
    const message = createBaseDataContainerId();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseIntentId(): IntentId {
  return { value: Buffer.alloc(0) };
}

export const IntentId = {
  encode(message: IntentId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IntentId {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIntentId();
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

  fromJSON(object: any): IntentId {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: IntentId): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IntentId>, I>>(object: I): IntentId {
    const message = createBaseIntentId();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseHash(): Hash {
  return { value: Buffer.alloc(0) };
}

export const Hash = {
  encode(message: Hash, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Hash {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHash();
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

  fromJSON(object: any): Hash {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: Hash): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Hash>, I>>(object: I): Hash {
    const message = createBaseHash();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
