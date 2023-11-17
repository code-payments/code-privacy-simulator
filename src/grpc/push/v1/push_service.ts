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
import _m0 from "protobufjs/minimal";
import { DataContainerId, Signature, SolanaAccountId } from "../../common/v1/model";

export const protobufPackage = "code.push.v1";

export enum TokenType {
  UNKNOWN = 0,
  /** FCM_ANDROID - FCM registration token for an Android device */
  FCM_ANDROID = 1,
  /** FCM_APNS - FCM registration token or an iOS device */
  FCM_APNS = 2,
  UNRECOGNIZED = -1,
}

export function tokenTypeFromJSON(object: any): TokenType {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return TokenType.UNKNOWN;
    case 1:
    case "FCM_ANDROID":
      return TokenType.FCM_ANDROID;
    case 2:
    case "FCM_APNS":
      return TokenType.FCM_APNS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenType.UNRECOGNIZED;
  }
}

export function tokenTypeToJSON(object: TokenType): string {
  switch (object) {
    case TokenType.UNKNOWN:
      return "UNKNOWN";
    case TokenType.FCM_ANDROID:
      return "FCM_ANDROID";
    case TokenType.FCM_APNS:
      return "FCM_APNS";
    case TokenType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface AddTokenRequest {
  /** The public key of the owner account that signed this request message. */
  ownerAccountId:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(AddTokenRequest) without this field set
   * using the private key of owner_account_id. This provides an authentication
   * mechanism to the RPC.
   */
  signature:
    | Signature
    | undefined;
  /** The data container where the push token will be stored. */
  containerId:
    | DataContainerId
    | undefined;
  /** The push token to store */
  pushToken: string;
  /** The type of push token */
  tokenType: TokenType;
}

export interface AddTokenResponse {
  result: AddTokenResponse_Result;
}

export enum AddTokenResponse_Result {
  OK = 0,
  /** INVALID_PUSH_TOKEN - The push token is invalid and wasn't stored. */
  INVALID_PUSH_TOKEN = 1,
  UNRECOGNIZED = -1,
}

export function addTokenResponse_ResultFromJSON(object: any): AddTokenResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return AddTokenResponse_Result.OK;
    case 1:
    case "INVALID_PUSH_TOKEN":
      return AddTokenResponse_Result.INVALID_PUSH_TOKEN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AddTokenResponse_Result.UNRECOGNIZED;
  }
}

export function addTokenResponse_ResultToJSON(object: AddTokenResponse_Result): string {
  switch (object) {
    case AddTokenResponse_Result.OK:
      return "OK";
    case AddTokenResponse_Result.INVALID_PUSH_TOKEN:
      return "INVALID_PUSH_TOKEN";
    case AddTokenResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseAddTokenRequest(): AddTokenRequest {
  return { ownerAccountId: undefined, signature: undefined, containerId: undefined, pushToken: "", tokenType: 0 };
}

export const AddTokenRequest = {
  encode(message: AddTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerAccountId !== undefined) {
      SolanaAccountId.encode(message.ownerAccountId, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    if (message.containerId !== undefined) {
      DataContainerId.encode(message.containerId, writer.uint32(26).fork()).ldelim();
    }
    if (message.pushToken !== "") {
      writer.uint32(34).string(message.pushToken);
    }
    if (message.tokenType !== 0) {
      writer.uint32(40).int32(message.tokenType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddTokenRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ownerAccountId = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.signature = Signature.decode(reader, reader.uint32());
          break;
        case 3:
          message.containerId = DataContainerId.decode(reader, reader.uint32());
          break;
        case 4:
          message.pushToken = reader.string();
          break;
        case 5:
          message.tokenType = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddTokenRequest {
    return {
      ownerAccountId: isSet(object.ownerAccountId) ? SolanaAccountId.fromJSON(object.ownerAccountId) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
      containerId: isSet(object.containerId) ? DataContainerId.fromJSON(object.containerId) : undefined,
      pushToken: isSet(object.pushToken) ? String(object.pushToken) : "",
      tokenType: isSet(object.tokenType) ? tokenTypeFromJSON(object.tokenType) : 0,
    };
  },

  toJSON(message: AddTokenRequest): unknown {
    const obj: any = {};
    message.ownerAccountId !== undefined &&
      (obj.ownerAccountId = message.ownerAccountId ? SolanaAccountId.toJSON(message.ownerAccountId) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    message.containerId !== undefined &&
      (obj.containerId = message.containerId ? DataContainerId.toJSON(message.containerId) : undefined);
    message.pushToken !== undefined && (obj.pushToken = message.pushToken);
    message.tokenType !== undefined && (obj.tokenType = tokenTypeToJSON(message.tokenType));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddTokenRequest>, I>>(object: I): AddTokenRequest {
    const message = createBaseAddTokenRequest();
    message.ownerAccountId = (object.ownerAccountId !== undefined && object.ownerAccountId !== null)
      ? SolanaAccountId.fromPartial(object.ownerAccountId)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    message.containerId = (object.containerId !== undefined && object.containerId !== null)
      ? DataContainerId.fromPartial(object.containerId)
      : undefined;
    message.pushToken = object.pushToken ?? "";
    message.tokenType = object.tokenType ?? 0;
    return message;
  },
};

function createBaseAddTokenResponse(): AddTokenResponse {
  return { result: 0 };
}

export const AddTokenResponse = {
  encode(message: AddTokenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddTokenResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddTokenResponse {
    return { result: isSet(object.result) ? addTokenResponse_ResultFromJSON(object.result) : 0 };
  },

  toJSON(message: AddTokenResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = addTokenResponse_ResultToJSON(message.result));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddTokenResponse>, I>>(object: I): AddTokenResponse {
    const message = createBaseAddTokenResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

export type PushService = typeof PushService;
export const PushService = {
  /**
   * AddToken stores a push token in a data container. The call is idempotent
   * and adding an existing valid token will not fail. Token types will be
   * validated against the user agent and any mismatches will result in an
   * INVALID_ARGUMENT status error.
   */
  addToken: {
    path: "/code.push.v1.Push/AddToken",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: AddTokenRequest) => Buffer.from(AddTokenRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => AddTokenRequest.decode(value),
    responseSerialize: (value: AddTokenResponse) => Buffer.from(AddTokenResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => AddTokenResponse.decode(value),
  },
} as const;

export interface PushServer extends UntypedServiceImplementation {
  /**
   * AddToken stores a push token in a data container. The call is idempotent
   * and adding an existing valid token will not fail. Token types will be
   * validated against the user agent and any mismatches will result in an
   * INVALID_ARGUMENT status error.
   */
  addToken: handleUnaryCall<AddTokenRequest, AddTokenResponse>;
}

export interface PushClient extends Client {
  /**
   * AddToken stores a push token in a data container. The call is idempotent
   * and adding an existing valid token will not fail. Token types will be
   * validated against the user agent and any mismatches will result in an
   * INVALID_ARGUMENT status error.
   */
  addToken(
    request: AddTokenRequest,
    callback: (error: ServiceError | null, response: AddTokenResponse) => void,
  ): ClientUnaryCall;
  addToken(
    request: AddTokenRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: AddTokenResponse) => void,
  ): ClientUnaryCall;
  addToken(
    request: AddTokenRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: AddTokenResponse) => void,
  ): ClientUnaryCall;
}

export const PushClient = makeGenericClientConstructor(PushService, "code.push.v1.Push") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): PushClient;
  service: typeof PushService;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
