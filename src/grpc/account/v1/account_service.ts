/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  ChannelOptions,
  Client,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  AccountType,
  accountTypeFromJSON,
  accountTypeToJSON,
  IntentId,
  Signature,
  SolanaAccountId,
} from "../../common/v1/model";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "code.account.v1";

export interface GetTokenAccountInfosRequest {
  /**
   * The owner account, which can also be thought of as a parent account for this
   * RPC that links to one or more token accounts.
   */
  owner:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(GetTokenAccountInfosRequest) without this field set
   * using the private key of the owner account. This provides an authentication
   * mechanism to the RPC.
   */
  signature: Signature | undefined;
}

export interface GetTokenAccountInfosResponse {
  result: GetTokenAccountInfosResponse_Result;
  tokenAccountInfos: { [key: string]: TokenAccountInfo };
}

export enum GetTokenAccountInfosResponse_Result {
  OK = 0,
  NOT_FOUND = 1,
  UNRECOGNIZED = -1,
}

export function getTokenAccountInfosResponse_ResultFromJSON(object: any): GetTokenAccountInfosResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetTokenAccountInfosResponse_Result.OK;
    case 1:
    case "NOT_FOUND":
      return GetTokenAccountInfosResponse_Result.NOT_FOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetTokenAccountInfosResponse_Result.UNRECOGNIZED;
  }
}

export function getTokenAccountInfosResponse_ResultToJSON(object: GetTokenAccountInfosResponse_Result): string {
  switch (object) {
    case GetTokenAccountInfosResponse_Result.OK:
      return "OK";
    case GetTokenAccountInfosResponse_Result.NOT_FOUND:
      return "NOT_FOUND";
    case GetTokenAccountInfosResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetTokenAccountInfosResponse_TokenAccountInfosEntry {
  key: string;
  value: TokenAccountInfo | undefined;
}

export interface TokenAccountInfo {
  /** The token account's address */
  address:
    | SolanaAccountId
    | undefined;
  /**
   * The owner of the token account, which can also be thought of as a parent
   * account that links to one or more token accounts. This is provided when
   * available.
   */
  owner:
    | SolanaAccountId
    | undefined;
  /**
   * The token account's authority, which has access to moving funds for the
   * account. This can be the owner account under certain circumstances (eg.
   * ATA, primary account). This is provided when available.
   */
  authority:
    | SolanaAccountId
    | undefined;
  /** The type of token account, which infers its intended use. */
  accountType: AccountType;
  /**
   * The account's derivation index for applicable account types. When this field
   * doesn't apply, a zero value is provided.
   */
  index: number;
  /** The source of truth for the balance calculation. */
  balanceSource: TokenAccountInfo_BalanceSource;
  /**
   * The Kin balance in quarks, as observed by Code. This may not reflect the
   * value on the blockchain and could be non-zero even if the account hasn't
   * been created. Use balance_source to determine how this value was calculated.
   */
  balance: number;
  /** The state of the account as it pertains to Code's ability to manage funds. */
  managementState: TokenAccountInfo_ManagementState;
  /** The state of the account on the blockchain. */
  blockchainState: TokenAccountInfo_BlockchainState;
}

export enum TokenAccountInfo_BalanceSource {
  /**
   * BALANCE_SOURCE_UNKNOWN - The account's balance could not be determined. This may be returned when
   * the data source is unstable and a reliable balance cannot be determined.
   */
  BALANCE_SOURCE_UNKNOWN = 0,
  /**
   * BALANCE_SOURCE_BLOCKCHAIN - The account's balance was fetched directly from a finalized state on the
   * blockchain.
   */
  BALANCE_SOURCE_BLOCKCHAIN = 1,
  /**
   * BALANCE_SOURCE_CACHE - The account's balance was calculated using cached values in Code. Accuracy
   * is only guaranteed when management_state is LOCKED.
   */
  BALANCE_SOURCE_CACHE = 2,
  UNRECOGNIZED = -1,
}

export function tokenAccountInfo_BalanceSourceFromJSON(object: any): TokenAccountInfo_BalanceSource {
  switch (object) {
    case 0:
    case "BALANCE_SOURCE_UNKNOWN":
      return TokenAccountInfo_BalanceSource.BALANCE_SOURCE_UNKNOWN;
    case 1:
    case "BALANCE_SOURCE_BLOCKCHAIN":
      return TokenAccountInfo_BalanceSource.BALANCE_SOURCE_BLOCKCHAIN;
    case 2:
    case "BALANCE_SOURCE_CACHE":
      return TokenAccountInfo_BalanceSource.BALANCE_SOURCE_CACHE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenAccountInfo_BalanceSource.UNRECOGNIZED;
  }
}

export function tokenAccountInfo_BalanceSourceToJSON(object: TokenAccountInfo_BalanceSource): string {
  switch (object) {
    case TokenAccountInfo_BalanceSource.BALANCE_SOURCE_UNKNOWN:
      return "BALANCE_SOURCE_UNKNOWN";
    case TokenAccountInfo_BalanceSource.BALANCE_SOURCE_BLOCKCHAIN:
      return "BALANCE_SOURCE_BLOCKCHAIN";
    case TokenAccountInfo_BalanceSource.BALANCE_SOURCE_CACHE:
      return "BALANCE_SOURCE_CACHE";
    case TokenAccountInfo_BalanceSource.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum TokenAccountInfo_ManagementState {
  /**
   * MANAGEMENT_STATE_UNKNOWN - The state of the account is unknown. This may be returned when the
   * data source is unstable and a reliable state cannot be determined.
   */
  MANAGEMENT_STATE_UNKNOWN = 0,
  /**
   * MANAGEMENT_STATE_NONE - Code does not maintain a management state and won't move funds for this
   * account.
   */
  MANAGEMENT_STATE_NONE = 1,
  /** MANAGEMENT_STATE_LOCKING - The account is in the process of transitioning to the LOCKED state. */
  MANAGEMENT_STATE_LOCKING = 2,
  /** MANAGEMENT_STATE_LOCKED - The account's funds are locked and Code has co-signing authority. */
  MANAGEMENT_STATE_LOCKED = 3,
  /** MANAGEMENT_STATE_UNLOCKING - The account is in the process of transitioning to the UNLOCKED state. */
  MANAGEMENT_STATE_UNLOCKING = 4,
  /**
   * MANAGEMENT_STATE_UNLOCKED - The account's funds are unlocked and Code no longer has co-signing
   * authority. The account must transition to the LOCKED state to have
   * management capabilities.
   */
  MANAGEMENT_STATE_UNLOCKED = 5,
  /** MANAGEMENT_STATE_CLOSING - The account is in the process of transitioning to the CLOSED state. */
  MANAGEMENT_STATE_CLOSING = 6,
  /**
   * MANAGEMENT_STATE_CLOSED - The account has been closed and doesn't exist on the blockchain.
   * Subsequently, it also has a zero balance.
   */
  MANAGEMENT_STATE_CLOSED = 7,
  UNRECOGNIZED = -1,
}

export function tokenAccountInfo_ManagementStateFromJSON(object: any): TokenAccountInfo_ManagementState {
  switch (object) {
    case 0:
    case "MANAGEMENT_STATE_UNKNOWN":
      return TokenAccountInfo_ManagementState.MANAGEMENT_STATE_UNKNOWN;
    case 1:
    case "MANAGEMENT_STATE_NONE":
      return TokenAccountInfo_ManagementState.MANAGEMENT_STATE_NONE;
    case 2:
    case "MANAGEMENT_STATE_LOCKING":
      return TokenAccountInfo_ManagementState.MANAGEMENT_STATE_LOCKING;
    case 3:
    case "MANAGEMENT_STATE_LOCKED":
      return TokenAccountInfo_ManagementState.MANAGEMENT_STATE_LOCKED;
    case 4:
    case "MANAGEMENT_STATE_UNLOCKING":
      return TokenAccountInfo_ManagementState.MANAGEMENT_STATE_UNLOCKING;
    case 5:
    case "MANAGEMENT_STATE_UNLOCKED":
      return TokenAccountInfo_ManagementState.MANAGEMENT_STATE_UNLOCKED;
    case 6:
    case "MANAGEMENT_STATE_CLOSING":
      return TokenAccountInfo_ManagementState.MANAGEMENT_STATE_CLOSING;
    case 7:
    case "MANAGEMENT_STATE_CLOSED":
      return TokenAccountInfo_ManagementState.MANAGEMENT_STATE_CLOSED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenAccountInfo_ManagementState.UNRECOGNIZED;
  }
}

export function tokenAccountInfo_ManagementStateToJSON(object: TokenAccountInfo_ManagementState): string {
  switch (object) {
    case TokenAccountInfo_ManagementState.MANAGEMENT_STATE_UNKNOWN:
      return "MANAGEMENT_STATE_UNKNOWN";
    case TokenAccountInfo_ManagementState.MANAGEMENT_STATE_NONE:
      return "MANAGEMENT_STATE_NONE";
    case TokenAccountInfo_ManagementState.MANAGEMENT_STATE_LOCKING:
      return "MANAGEMENT_STATE_LOCKING";
    case TokenAccountInfo_ManagementState.MANAGEMENT_STATE_LOCKED:
      return "MANAGEMENT_STATE_LOCKED";
    case TokenAccountInfo_ManagementState.MANAGEMENT_STATE_UNLOCKING:
      return "MANAGEMENT_STATE_UNLOCKING";
    case TokenAccountInfo_ManagementState.MANAGEMENT_STATE_UNLOCKED:
      return "MANAGEMENT_STATE_UNLOCKED";
    case TokenAccountInfo_ManagementState.MANAGEMENT_STATE_CLOSING:
      return "MANAGEMENT_STATE_CLOSING";
    case TokenAccountInfo_ManagementState.MANAGEMENT_STATE_CLOSED:
      return "MANAGEMENT_STATE_CLOSED";
    case TokenAccountInfo_ManagementState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum TokenAccountInfo_BlockchainState {
  /**
   * BLOCKCHAIN_STATE_UNKNOWN - The state of the account is unknown. This may be returned when the
   * data source is unstable and a reliable state cannot be determined.
   */
  BLOCKCHAIN_STATE_UNKNOWN = 0,
  /** BLOCKCHAIN_STATE_DOES_NOT_EXIST - The account does not exist on the blockchain. */
  BLOCKCHAIN_STATE_DOES_NOT_EXIST = 1,
  /** BLOCKCHAIN_STATE_EXISTS - The account is created and exists on the blockchain. */
  BLOCKCHAIN_STATE_EXISTS = 2,
  UNRECOGNIZED = -1,
}

export function tokenAccountInfo_BlockchainStateFromJSON(object: any): TokenAccountInfo_BlockchainState {
  switch (object) {
    case 0:
    case "BLOCKCHAIN_STATE_UNKNOWN":
      return TokenAccountInfo_BlockchainState.BLOCKCHAIN_STATE_UNKNOWN;
    case 1:
    case "BLOCKCHAIN_STATE_DOES_NOT_EXIST":
      return TokenAccountInfo_BlockchainState.BLOCKCHAIN_STATE_DOES_NOT_EXIST;
    case 2:
    case "BLOCKCHAIN_STATE_EXISTS":
      return TokenAccountInfo_BlockchainState.BLOCKCHAIN_STATE_EXISTS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenAccountInfo_BlockchainState.UNRECOGNIZED;
  }
}

export function tokenAccountInfo_BlockchainStateToJSON(object: TokenAccountInfo_BlockchainState): string {
  switch (object) {
    case TokenAccountInfo_BlockchainState.BLOCKCHAIN_STATE_UNKNOWN:
      return "BLOCKCHAIN_STATE_UNKNOWN";
    case TokenAccountInfo_BlockchainState.BLOCKCHAIN_STATE_DOES_NOT_EXIST:
      return "BLOCKCHAIN_STATE_DOES_NOT_EXIST";
    case TokenAccountInfo_BlockchainState.BLOCKCHAIN_STATE_EXISTS:
      return "BLOCKCHAIN_STATE_EXISTS";
    case TokenAccountInfo_BlockchainState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetEventHistoryRequest {
  /** The owner account to get history for. */
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
  direction: GetEventHistoryRequest_Direction;
  /** The type of event(s) to return. */
  filter: GetEventHistoryRequest_Type;
  /**
   * The signature is of serialize(GetEventHistoryRequest) without this field set
   * using the private key of the owner account. This provides an authentication
   * mechanism to the RPC.
   */
  signature: Signature | undefined;
}

export enum GetEventHistoryRequest_Direction {
  /**
   * ASC - ASC direction returns all history items in ascending order from the
   * cursor.
   */
  ASC = 0,
  /**
   * DESC - DESC direction returns all history items in descending order before
   * the cursor.
   */
  DESC = 1,
  UNRECOGNIZED = -1,
}

export function getEventHistoryRequest_DirectionFromJSON(object: any): GetEventHistoryRequest_Direction {
  switch (object) {
    case 0:
    case "ASC":
      return GetEventHistoryRequest_Direction.ASC;
    case 1:
    case "DESC":
      return GetEventHistoryRequest_Direction.DESC;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetEventHistoryRequest_Direction.UNRECOGNIZED;
  }
}

export function getEventHistoryRequest_DirectionToJSON(object: GetEventHistoryRequest_Direction): string {
  switch (object) {
    case GetEventHistoryRequest_Direction.ASC:
      return "ASC";
    case GetEventHistoryRequest_Direction.DESC:
      return "DESC";
    case GetEventHistoryRequest_Direction.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum GetEventHistoryRequest_Type {
  ANY = 0,
  /** ONLY_INTENT_SIMULATION_EVENTS - Values [1, 4] are deprecated */
  ONLY_INTENT_SIMULATION_EVENTS = 5,
  UNRECOGNIZED = -1,
}

export function getEventHistoryRequest_TypeFromJSON(object: any): GetEventHistoryRequest_Type {
  switch (object) {
    case 0:
    case "ANY":
      return GetEventHistoryRequest_Type.ANY;
    case 5:
    case "ONLY_INTENT_SIMULATION_EVENTS":
      return GetEventHistoryRequest_Type.ONLY_INTENT_SIMULATION_EVENTS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetEventHistoryRequest_Type.UNRECOGNIZED;
  }
}

export function getEventHistoryRequest_TypeToJSON(object: GetEventHistoryRequest_Type): string {
  switch (object) {
    case GetEventHistoryRequest_Type.ANY:
      return "ANY";
    case GetEventHistoryRequest_Type.ONLY_INTENT_SIMULATION_EVENTS:
      return "ONLY_INTENT_SIMULATION_EVENTS";
    case GetEventHistoryRequest_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetEventHistoryResponse {
  result: GetEventHistoryResponse_Result;
  events: Event[];
}

export enum GetEventHistoryResponse_Result {
  OK = 0,
  NOT_FOUND = 1,
  UNRECOGNIZED = -1,
}

export function getEventHistoryResponse_ResultFromJSON(object: any): GetEventHistoryResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetEventHistoryResponse_Result.OK;
    case 1:
    case "NOT_FOUND":
      return GetEventHistoryResponse_Result.NOT_FOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetEventHistoryResponse_Result.UNRECOGNIZED;
  }
}

export function getEventHistoryResponse_ResultToJSON(object: GetEventHistoryResponse_Result): string {
  switch (object) {
    case GetEventHistoryResponse_Result.OK:
      return "OK";
    case GetEventHistoryResponse_Result.NOT_FOUND:
      return "NOT_FOUND";
    case GetEventHistoryResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Fields [1, 4] are deprecated */
export interface Event {
  intentSimulationEvent:
    | IntentSimulationEvent
    | undefined;
  /** The cursor position of this item. */
  cursor:
    | Cursor
    | undefined;
  /** The created time of the event */
  timestamp: Date | undefined;
}

/**
 * An event that gets sent when a new intent created has completed simulation.
 * If successful, the intent has been persisted by server and its actions will
 * be scheduled for submission to the blockchain.
 */
export interface IntentSimulationEvent {
  /** The new intent being created */
  intentId:
    | IntentId
    | undefined;
  /** Indicates whether the simulation failed */
  isError: boolean;
}

export interface Cursor {
  value: Buffer;
}

function createBaseGetTokenAccountInfosRequest(): GetTokenAccountInfosRequest {
  return { owner: undefined, signature: undefined };
}

export const GetTokenAccountInfosRequest = {
  encode(message: GetTokenAccountInfosRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.owner !== undefined) {
      SolanaAccountId.encode(message.owner, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTokenAccountInfosRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTokenAccountInfosRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.owner = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.signature = Signature.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTokenAccountInfosRequest {
    return {
      owner: isSet(object.owner) ? SolanaAccountId.fromJSON(object.owner) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
    };
  },

  toJSON(message: GetTokenAccountInfosRequest): unknown {
    const obj: any = {};
    message.owner !== undefined && (obj.owner = message.owner ? SolanaAccountId.toJSON(message.owner) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetTokenAccountInfosRequest>, I>>(object: I): GetTokenAccountInfosRequest {
    const message = createBaseGetTokenAccountInfosRequest();
    message.owner = (object.owner !== undefined && object.owner !== null)
      ? SolanaAccountId.fromPartial(object.owner)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    return message;
  },
};

function createBaseGetTokenAccountInfosResponse(): GetTokenAccountInfosResponse {
  return { result: 0, tokenAccountInfos: {} };
}

export const GetTokenAccountInfosResponse = {
  encode(message: GetTokenAccountInfosResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    Object.entries(message.tokenAccountInfos).forEach(([key, value]) => {
      GetTokenAccountInfosResponse_TokenAccountInfosEntry.encode({ key: key as any, value }, writer.uint32(18).fork())
        .ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTokenAccountInfosResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTokenAccountInfosResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          const entry2 = GetTokenAccountInfosResponse_TokenAccountInfosEntry.decode(reader, reader.uint32());
          if (entry2.value !== undefined) {
            message.tokenAccountInfos[entry2.key] = entry2.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTokenAccountInfosResponse {
    return {
      result: isSet(object.result) ? getTokenAccountInfosResponse_ResultFromJSON(object.result) : 0,
      tokenAccountInfos: isObject(object.tokenAccountInfos)
        ? Object.entries(object.tokenAccountInfos).reduce<{ [key: string]: TokenAccountInfo }>((acc, [key, value]) => {
          acc[key] = TokenAccountInfo.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: GetTokenAccountInfosResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getTokenAccountInfosResponse_ResultToJSON(message.result));
    obj.tokenAccountInfos = {};
    if (message.tokenAccountInfos) {
      Object.entries(message.tokenAccountInfos).forEach(([k, v]) => {
        obj.tokenAccountInfos[k] = TokenAccountInfo.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetTokenAccountInfosResponse>, I>>(object: I): GetTokenAccountInfosResponse {
    const message = createBaseGetTokenAccountInfosResponse();
    message.result = object.result ?? 0;
    message.tokenAccountInfos = Object.entries(object.tokenAccountInfos ?? {}).reduce<
      { [key: string]: TokenAccountInfo }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = TokenAccountInfo.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseGetTokenAccountInfosResponse_TokenAccountInfosEntry(): GetTokenAccountInfosResponse_TokenAccountInfosEntry {
  return { key: "", value: undefined };
}

export const GetTokenAccountInfosResponse_TokenAccountInfosEntry = {
  encode(
    message: GetTokenAccountInfosResponse_TokenAccountInfosEntry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      TokenAccountInfo.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTokenAccountInfosResponse_TokenAccountInfosEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTokenAccountInfosResponse_TokenAccountInfosEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = TokenAccountInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTokenAccountInfosResponse_TokenAccountInfosEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? TokenAccountInfo.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: GetTokenAccountInfosResponse_TokenAccountInfosEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value ? TokenAccountInfo.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetTokenAccountInfosResponse_TokenAccountInfosEntry>, I>>(
    object: I,
  ): GetTokenAccountInfosResponse_TokenAccountInfosEntry {
    const message = createBaseGetTokenAccountInfosResponse_TokenAccountInfosEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? TokenAccountInfo.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseTokenAccountInfo(): TokenAccountInfo {
  return {
    address: undefined,
    owner: undefined,
    authority: undefined,
    accountType: 0,
    index: 0,
    balanceSource: 0,
    balance: 0,
    managementState: 0,
    blockchainState: 0,
  };
}

export const TokenAccountInfo = {
  encode(message: TokenAccountInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== undefined) {
      SolanaAccountId.encode(message.address, writer.uint32(10).fork()).ldelim();
    }
    if (message.owner !== undefined) {
      SolanaAccountId.encode(message.owner, writer.uint32(18).fork()).ldelim();
    }
    if (message.authority !== undefined) {
      SolanaAccountId.encode(message.authority, writer.uint32(26).fork()).ldelim();
    }
    if (message.accountType !== 0) {
      writer.uint32(32).int32(message.accountType);
    }
    if (message.index !== 0) {
      writer.uint32(40).uint64(message.index);
    }
    if (message.balanceSource !== 0) {
      writer.uint32(48).int32(message.balanceSource);
    }
    if (message.balance !== 0) {
      writer.uint32(56).uint64(message.balance);
    }
    if (message.managementState !== 0) {
      writer.uint32(64).int32(message.managementState);
    }
    if (message.blockchainState !== 0) {
      writer.uint32(72).int32(message.blockchainState);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenAccountInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenAccountInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.owner = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 3:
          message.authority = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 4:
          message.accountType = reader.int32() as any;
          break;
        case 5:
          message.index = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.balanceSource = reader.int32() as any;
          break;
        case 7:
          message.balance = longToNumber(reader.uint64() as Long);
          break;
        case 8:
          message.managementState = reader.int32() as any;
          break;
        case 9:
          message.blockchainState = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenAccountInfo {
    return {
      address: isSet(object.address) ? SolanaAccountId.fromJSON(object.address) : undefined,
      owner: isSet(object.owner) ? SolanaAccountId.fromJSON(object.owner) : undefined,
      authority: isSet(object.authority) ? SolanaAccountId.fromJSON(object.authority) : undefined,
      accountType: isSet(object.accountType) ? accountTypeFromJSON(object.accountType) : 0,
      index: isSet(object.index) ? Number(object.index) : 0,
      balanceSource: isSet(object.balanceSource) ? tokenAccountInfo_BalanceSourceFromJSON(object.balanceSource) : 0,
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      managementState: isSet(object.managementState)
        ? tokenAccountInfo_ManagementStateFromJSON(object.managementState)
        : 0,
      blockchainState: isSet(object.blockchainState)
        ? tokenAccountInfo_BlockchainStateFromJSON(object.blockchainState)
        : 0,
    };
  },

  toJSON(message: TokenAccountInfo): unknown {
    const obj: any = {};
    message.address !== undefined &&
      (obj.address = message.address ? SolanaAccountId.toJSON(message.address) : undefined);
    message.owner !== undefined && (obj.owner = message.owner ? SolanaAccountId.toJSON(message.owner) : undefined);
    message.authority !== undefined &&
      (obj.authority = message.authority ? SolanaAccountId.toJSON(message.authority) : undefined);
    message.accountType !== undefined && (obj.accountType = accountTypeToJSON(message.accountType));
    message.index !== undefined && (obj.index = Math.round(message.index));
    message.balanceSource !== undefined &&
      (obj.balanceSource = tokenAccountInfo_BalanceSourceToJSON(message.balanceSource));
    message.balance !== undefined && (obj.balance = Math.round(message.balance));
    message.managementState !== undefined &&
      (obj.managementState = tokenAccountInfo_ManagementStateToJSON(message.managementState));
    message.blockchainState !== undefined &&
      (obj.blockchainState = tokenAccountInfo_BlockchainStateToJSON(message.blockchainState));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TokenAccountInfo>, I>>(object: I): TokenAccountInfo {
    const message = createBaseTokenAccountInfo();
    message.address = (object.address !== undefined && object.address !== null)
      ? SolanaAccountId.fromPartial(object.address)
      : undefined;
    message.owner = (object.owner !== undefined && object.owner !== null)
      ? SolanaAccountId.fromPartial(object.owner)
      : undefined;
    message.authority = (object.authority !== undefined && object.authority !== null)
      ? SolanaAccountId.fromPartial(object.authority)
      : undefined;
    message.accountType = object.accountType ?? 0;
    message.index = object.index ?? 0;
    message.balanceSource = object.balanceSource ?? 0;
    message.balance = object.balance ?? 0;
    message.managementState = object.managementState ?? 0;
    message.blockchainState = object.blockchainState ?? 0;
    return message;
  },
};

function createBaseGetEventHistoryRequest(): GetEventHistoryRequest {
  return { owner: undefined, cursor: undefined, pageSize: 0, direction: 0, filter: 0, signature: undefined };
}

export const GetEventHistoryRequest = {
  encode(message: GetEventHistoryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
    if (message.filter !== 0) {
      writer.uint32(40).int32(message.filter);
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetEventHistoryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetEventHistoryRequest();
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
          message.filter = reader.int32() as any;
          break;
        case 6:
          message.signature = Signature.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetEventHistoryRequest {
    return {
      owner: isSet(object.owner) ? SolanaAccountId.fromJSON(object.owner) : undefined,
      cursor: isSet(object.cursor) ? Cursor.fromJSON(object.cursor) : undefined,
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
      direction: isSet(object.direction) ? getEventHistoryRequest_DirectionFromJSON(object.direction) : 0,
      filter: isSet(object.filter) ? getEventHistoryRequest_TypeFromJSON(object.filter) : 0,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
    };
  },

  toJSON(message: GetEventHistoryRequest): unknown {
    const obj: any = {};
    message.owner !== undefined && (obj.owner = message.owner ? SolanaAccountId.toJSON(message.owner) : undefined);
    message.cursor !== undefined && (obj.cursor = message.cursor ? Cursor.toJSON(message.cursor) : undefined);
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    message.direction !== undefined && (obj.direction = getEventHistoryRequest_DirectionToJSON(message.direction));
    message.filter !== undefined && (obj.filter = getEventHistoryRequest_TypeToJSON(message.filter));
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetEventHistoryRequest>, I>>(object: I): GetEventHistoryRequest {
    const message = createBaseGetEventHistoryRequest();
    message.owner = (object.owner !== undefined && object.owner !== null)
      ? SolanaAccountId.fromPartial(object.owner)
      : undefined;
    message.cursor = (object.cursor !== undefined && object.cursor !== null)
      ? Cursor.fromPartial(object.cursor)
      : undefined;
    message.pageSize = object.pageSize ?? 0;
    message.direction = object.direction ?? 0;
    message.filter = object.filter ?? 0;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    return message;
  },
};

function createBaseGetEventHistoryResponse(): GetEventHistoryResponse {
  return { result: 0, events: [] };
}

export const GetEventHistoryResponse = {
  encode(message: GetEventHistoryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    for (const v of message.events) {
      Event.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetEventHistoryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetEventHistoryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.events.push(Event.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetEventHistoryResponse {
    return {
      result: isSet(object.result) ? getEventHistoryResponse_ResultFromJSON(object.result) : 0,
      events: Array.isArray(object?.events) ? object.events.map((e: any) => Event.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetEventHistoryResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getEventHistoryResponse_ResultToJSON(message.result));
    if (message.events) {
      obj.events = message.events.map((e) => e ? Event.toJSON(e) : undefined);
    } else {
      obj.events = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetEventHistoryResponse>, I>>(object: I): GetEventHistoryResponse {
    const message = createBaseGetEventHistoryResponse();
    message.result = object.result ?? 0;
    message.events = object.events?.map((e) => Event.fromPartial(e)) || [];
    return message;
  },
};

function createBaseEvent(): Event {
  return { intentSimulationEvent: undefined, cursor: undefined, timestamp: undefined };
}

export const Event = {
  encode(message: Event, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.intentSimulationEvent !== undefined) {
      IntentSimulationEvent.encode(message.intentSimulationEvent, writer.uint32(58).fork()).ldelim();
    }
    if (message.cursor !== undefined) {
      Cursor.encode(message.cursor, writer.uint32(42).fork()).ldelim();
    }
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Event {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 7:
          message.intentSimulationEvent = IntentSimulationEvent.decode(reader, reader.uint32());
          break;
        case 5:
          message.cursor = Cursor.decode(reader, reader.uint32());
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

  fromJSON(object: any): Event {
    return {
      intentSimulationEvent: isSet(object.intentSimulationEvent)
        ? IntentSimulationEvent.fromJSON(object.intentSimulationEvent)
        : undefined,
      cursor: isSet(object.cursor) ? Cursor.fromJSON(object.cursor) : undefined,
      timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined,
    };
  },

  toJSON(message: Event): unknown {
    const obj: any = {};
    message.intentSimulationEvent !== undefined && (obj.intentSimulationEvent = message.intentSimulationEvent
      ? IntentSimulationEvent.toJSON(message.intentSimulationEvent)
      : undefined);
    message.cursor !== undefined && (obj.cursor = message.cursor ? Cursor.toJSON(message.cursor) : undefined);
    message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Event>, I>>(object: I): Event {
    const message = createBaseEvent();
    message.intentSimulationEvent =
      (object.intentSimulationEvent !== undefined && object.intentSimulationEvent !== null)
        ? IntentSimulationEvent.fromPartial(object.intentSimulationEvent)
        : undefined;
    message.cursor = (object.cursor !== undefined && object.cursor !== null)
      ? Cursor.fromPartial(object.cursor)
      : undefined;
    message.timestamp = object.timestamp ?? undefined;
    return message;
  },
};

function createBaseIntentSimulationEvent(): IntentSimulationEvent {
  return { intentId: undefined, isError: false };
}

export const IntentSimulationEvent = {
  encode(message: IntentSimulationEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.intentId !== undefined) {
      IntentId.encode(message.intentId, writer.uint32(10).fork()).ldelim();
    }
    if (message.isError === true) {
      writer.uint32(16).bool(message.isError);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IntentSimulationEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIntentSimulationEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.intentId = IntentId.decode(reader, reader.uint32());
          break;
        case 2:
          message.isError = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IntentSimulationEvent {
    return {
      intentId: isSet(object.intentId) ? IntentId.fromJSON(object.intentId) : undefined,
      isError: isSet(object.isError) ? Boolean(object.isError) : false,
    };
  },

  toJSON(message: IntentSimulationEvent): unknown {
    const obj: any = {};
    message.intentId !== undefined && (obj.intentId = message.intentId ? IntentId.toJSON(message.intentId) : undefined);
    message.isError !== undefined && (obj.isError = message.isError);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IntentSimulationEvent>, I>>(object: I): IntentSimulationEvent {
    const message = createBaseIntentSimulationEvent();
    message.intentId = (object.intentId !== undefined && object.intentId !== null)
      ? IntentId.fromPartial(object.intentId)
      : undefined;
    message.isError = object.isError ?? false;
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

export type AccountService = typeof AccountService;
export const AccountService = {
  /**
   * GetTokenAccountInfos returns information about token accounts relevant to
   * the owner account.
   */
  getTokenAccountInfos: {
    path: "/code.account.v1.Account/GetTokenAccountInfos",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetTokenAccountInfosRequest) =>
      Buffer.from(GetTokenAccountInfosRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetTokenAccountInfosRequest.decode(value),
    responseSerialize: (value: GetTokenAccountInfosResponse) =>
      Buffer.from(GetTokenAccountInfosResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetTokenAccountInfosResponse.decode(value),
  },
  /** GetEventHistory returns the event history of a specified owner account. */
  getEventHistory: {
    path: "/code.account.v1.Account/GetEventHistory",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetEventHistoryRequest) => Buffer.from(GetEventHistoryRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetEventHistoryRequest.decode(value),
    responseSerialize: (value: GetEventHistoryResponse) => Buffer.from(GetEventHistoryResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetEventHistoryResponse.decode(value),
  },
} as const;

export interface AccountServer extends UntypedServiceImplementation {
  /**
   * GetTokenAccountInfos returns information about token accounts relevant to
   * the owner account.
   */
  getTokenAccountInfos: handleUnaryCall<GetTokenAccountInfosRequest, GetTokenAccountInfosResponse>;
  /** GetEventHistory returns the event history of a specified owner account. */
  getEventHistory: handleUnaryCall<GetEventHistoryRequest, GetEventHistoryResponse>;
}

export interface AccountClient extends Client {
  /**
   * GetTokenAccountInfos returns information about token accounts relevant to
   * the owner account.
   */
  getTokenAccountInfos(
    request: GetTokenAccountInfosRequest,
    callback: (error: ServiceError | null, response: GetTokenAccountInfosResponse) => void,
  ): ClientUnaryCall;
  getTokenAccountInfos(
    request: GetTokenAccountInfosRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetTokenAccountInfosResponse) => void,
  ): ClientUnaryCall;
  getTokenAccountInfos(
    request: GetTokenAccountInfosRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetTokenAccountInfosResponse) => void,
  ): ClientUnaryCall;
  /** GetEventHistory returns the event history of a specified owner account. */
  getEventHistory(
    request: GetEventHistoryRequest,
    callback: (error: ServiceError | null, response: GetEventHistoryResponse) => void,
  ): ClientUnaryCall;
  getEventHistory(
    request: GetEventHistoryRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetEventHistoryResponse) => void,
  ): ClientUnaryCall;
  getEventHistory(
    request: GetEventHistoryRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetEventHistoryResponse) => void,
  ): ClientUnaryCall;
}

export const AccountClient = makeGenericClientConstructor(AccountService, "code.account.v1.Account") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): AccountClient;
  service: typeof AccountService;
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
