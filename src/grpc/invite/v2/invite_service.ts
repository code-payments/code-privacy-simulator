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
import { PhoneNumber, UserId } from "../../common/v1/model";

export const protobufPackage = "code.invite.v2";

export enum InvitationStatus {
  /** NOT_INVITED - The phone number has never been invited. */
  NOT_INVITED = 0,
  /** INVITED - The phone number has been invited at least once. */
  INVITED = 1,
  /**
   * REGISTERED - The phone number has been invited and used the app at least once via a
   * phone verified account creation or login.
   */
  REGISTERED = 2,
  /** REVOKED - The phone number was invited, but revoked at a later time. */
  REVOKED = 3,
  UNRECOGNIZED = -1,
}

export function invitationStatusFromJSON(object: any): InvitationStatus {
  switch (object) {
    case 0:
    case "NOT_INVITED":
      return InvitationStatus.NOT_INVITED;
    case 1:
    case "INVITED":
      return InvitationStatus.INVITED;
    case 2:
    case "REGISTERED":
      return InvitationStatus.REGISTERED;
    case 3:
    case "REVOKED":
      return InvitationStatus.REVOKED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return InvitationStatus.UNRECOGNIZED;
  }
}

export function invitationStatusToJSON(object: InvitationStatus): string {
  switch (object) {
    case InvitationStatus.NOT_INVITED:
      return "NOT_INVITED";
    case InvitationStatus.INVITED:
      return "INVITED";
    case InvitationStatus.REGISTERED:
      return "REGISTERED";
    case InvitationStatus.REVOKED:
      return "REVOKED";
    case InvitationStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetInviteCountRequest {
  /** The user to query for their invite count */
  userId: UserId | undefined;
}

export interface GetInviteCountResponse {
  result: GetInviteCountResponse_Result;
  /** The number of invites the user is allowed to issue. */
  inviteCount: number;
}

export enum GetInviteCountResponse_Result {
  OK = 0,
  UNRECOGNIZED = -1,
}

export function getInviteCountResponse_ResultFromJSON(object: any): GetInviteCountResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetInviteCountResponse_Result.OK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetInviteCountResponse_Result.UNRECOGNIZED;
  }
}

export function getInviteCountResponse_ResultToJSON(object: GetInviteCountResponse_Result): string {
  switch (object) {
    case GetInviteCountResponse_Result.OK:
      return "OK";
    case GetInviteCountResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface InvitePhoneNumberRequest {
  /** The user sending the invite. */
  sender:
    | UserId
    | undefined;
  /** The phone number of the user receiving the invite. */
  receiver: PhoneNumber | undefined;
}

export interface InvitePhoneNumberResponse {
  result: InvitePhoneNumberResponse_Result;
}

export enum InvitePhoneNumberResponse_Result {
  OK = 0,
  /**
   * INVITE_COUNT_EXCEEDED - The sender exceeded their invite count and is restricted from issuing
   * further invites.
   */
  INVITE_COUNT_EXCEEDED = 1,
  /**
   * ALREADY_INVITED - The receiver phone number has already been invited. Regardless of who
   * invited it, the sender's invite count is not decremented when this is
   * returned.
   */
  ALREADY_INVITED = 2,
  /** SENDER_NOT_INVITED - The sender has not been invited. */
  SENDER_NOT_INVITED = 3,
  /** INVALID_RECEIVER_PHONE_NUMBER - The receiver phone number failed validation. */
  INVALID_RECEIVER_PHONE_NUMBER = 4,
  UNRECOGNIZED = -1,
}

export function invitePhoneNumberResponse_ResultFromJSON(object: any): InvitePhoneNumberResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return InvitePhoneNumberResponse_Result.OK;
    case 1:
    case "INVITE_COUNT_EXCEEDED":
      return InvitePhoneNumberResponse_Result.INVITE_COUNT_EXCEEDED;
    case 2:
    case "ALREADY_INVITED":
      return InvitePhoneNumberResponse_Result.ALREADY_INVITED;
    case 3:
    case "SENDER_NOT_INVITED":
      return InvitePhoneNumberResponse_Result.SENDER_NOT_INVITED;
    case 4:
    case "INVALID_RECEIVER_PHONE_NUMBER":
      return InvitePhoneNumberResponse_Result.INVALID_RECEIVER_PHONE_NUMBER;
    case -1:
    case "UNRECOGNIZED":
    default:
      return InvitePhoneNumberResponse_Result.UNRECOGNIZED;
  }
}

export function invitePhoneNumberResponse_ResultToJSON(object: InvitePhoneNumberResponse_Result): string {
  switch (object) {
    case InvitePhoneNumberResponse_Result.OK:
      return "OK";
    case InvitePhoneNumberResponse_Result.INVITE_COUNT_EXCEEDED:
      return "INVITE_COUNT_EXCEEDED";
    case InvitePhoneNumberResponse_Result.ALREADY_INVITED:
      return "ALREADY_INVITED";
    case InvitePhoneNumberResponse_Result.SENDER_NOT_INVITED:
      return "SENDER_NOT_INVITED";
    case InvitePhoneNumberResponse_Result.INVALID_RECEIVER_PHONE_NUMBER:
      return "INVALID_RECEIVER_PHONE_NUMBER";
    case InvitePhoneNumberResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetInvitationStatusRequest {
  /** The user being queried for their invitation status. */
  userId: UserId | undefined;
}

export interface GetInvitationStatusResponse {
  result: GetInvitationStatusResponse_Result;
  /** The user's invitation status */
  status: InvitationStatus;
}

export enum GetInvitationStatusResponse_Result {
  OK = 0,
  UNRECOGNIZED = -1,
}

export function getInvitationStatusResponse_ResultFromJSON(object: any): GetInvitationStatusResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetInvitationStatusResponse_Result.OK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetInvitationStatusResponse_Result.UNRECOGNIZED;
  }
}

export function getInvitationStatusResponse_ResultToJSON(object: GetInvitationStatusResponse_Result): string {
  switch (object) {
    case GetInvitationStatusResponse_Result.OK:
      return "OK";
    case GetInvitationStatusResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface PageToken {
  value: Buffer;
}

function createBaseGetInviteCountRequest(): GetInviteCountRequest {
  return { userId: undefined };
}

export const GetInviteCountRequest = {
  encode(message: GetInviteCountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== undefined) {
      UserId.encode(message.userId, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInviteCountRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInviteCountRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = UserId.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInviteCountRequest {
    return { userId: isSet(object.userId) ? UserId.fromJSON(object.userId) : undefined };
  },

  toJSON(message: GetInviteCountRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId ? UserId.toJSON(message.userId) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInviteCountRequest>, I>>(object: I): GetInviteCountRequest {
    const message = createBaseGetInviteCountRequest();
    message.userId = (object.userId !== undefined && object.userId !== null)
      ? UserId.fromPartial(object.userId)
      : undefined;
    return message;
  },
};

function createBaseGetInviteCountResponse(): GetInviteCountResponse {
  return { result: 0, inviteCount: 0 };
}

export const GetInviteCountResponse = {
  encode(message: GetInviteCountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    if (message.inviteCount !== 0) {
      writer.uint32(16).uint32(message.inviteCount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInviteCountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInviteCountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.inviteCount = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInviteCountResponse {
    return {
      result: isSet(object.result) ? getInviteCountResponse_ResultFromJSON(object.result) : 0,
      inviteCount: isSet(object.inviteCount) ? Number(object.inviteCount) : 0,
    };
  },

  toJSON(message: GetInviteCountResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getInviteCountResponse_ResultToJSON(message.result));
    message.inviteCount !== undefined && (obj.inviteCount = Math.round(message.inviteCount));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInviteCountResponse>, I>>(object: I): GetInviteCountResponse {
    const message = createBaseGetInviteCountResponse();
    message.result = object.result ?? 0;
    message.inviteCount = object.inviteCount ?? 0;
    return message;
  },
};

function createBaseInvitePhoneNumberRequest(): InvitePhoneNumberRequest {
  return { sender: undefined, receiver: undefined };
}

export const InvitePhoneNumberRequest = {
  encode(message: InvitePhoneNumberRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== undefined) {
      UserId.encode(message.sender, writer.uint32(10).fork()).ldelim();
    }
    if (message.receiver !== undefined) {
      PhoneNumber.encode(message.receiver, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InvitePhoneNumberRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInvitePhoneNumberRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = UserId.decode(reader, reader.uint32());
          break;
        case 2:
          message.receiver = PhoneNumber.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InvitePhoneNumberRequest {
    return {
      sender: isSet(object.sender) ? UserId.fromJSON(object.sender) : undefined,
      receiver: isSet(object.receiver) ? PhoneNumber.fromJSON(object.receiver) : undefined,
    };
  },

  toJSON(message: InvitePhoneNumberRequest): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender ? UserId.toJSON(message.sender) : undefined);
    message.receiver !== undefined &&
      (obj.receiver = message.receiver ? PhoneNumber.toJSON(message.receiver) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InvitePhoneNumberRequest>, I>>(object: I): InvitePhoneNumberRequest {
    const message = createBaseInvitePhoneNumberRequest();
    message.sender = (object.sender !== undefined && object.sender !== null)
      ? UserId.fromPartial(object.sender)
      : undefined;
    message.receiver = (object.receiver !== undefined && object.receiver !== null)
      ? PhoneNumber.fromPartial(object.receiver)
      : undefined;
    return message;
  },
};

function createBaseInvitePhoneNumberResponse(): InvitePhoneNumberResponse {
  return { result: 0 };
}

export const InvitePhoneNumberResponse = {
  encode(message: InvitePhoneNumberResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InvitePhoneNumberResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInvitePhoneNumberResponse();
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

  fromJSON(object: any): InvitePhoneNumberResponse {
    return { result: isSet(object.result) ? invitePhoneNumberResponse_ResultFromJSON(object.result) : 0 };
  },

  toJSON(message: InvitePhoneNumberResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = invitePhoneNumberResponse_ResultToJSON(message.result));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InvitePhoneNumberResponse>, I>>(object: I): InvitePhoneNumberResponse {
    const message = createBaseInvitePhoneNumberResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

function createBaseGetInvitationStatusRequest(): GetInvitationStatusRequest {
  return { userId: undefined };
}

export const GetInvitationStatusRequest = {
  encode(message: GetInvitationStatusRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== undefined) {
      UserId.encode(message.userId, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInvitationStatusRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInvitationStatusRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = UserId.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInvitationStatusRequest {
    return { userId: isSet(object.userId) ? UserId.fromJSON(object.userId) : undefined };
  },

  toJSON(message: GetInvitationStatusRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId ? UserId.toJSON(message.userId) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInvitationStatusRequest>, I>>(object: I): GetInvitationStatusRequest {
    const message = createBaseGetInvitationStatusRequest();
    message.userId = (object.userId !== undefined && object.userId !== null)
      ? UserId.fromPartial(object.userId)
      : undefined;
    return message;
  },
};

function createBaseGetInvitationStatusResponse(): GetInvitationStatusResponse {
  return { result: 0, status: 0 };
}

export const GetInvitationStatusResponse = {
  encode(message: GetInvitationStatusResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    if (message.status !== 0) {
      writer.uint32(16).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInvitationStatusResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInvitationStatusResponse();
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

  fromJSON(object: any): GetInvitationStatusResponse {
    return {
      result: isSet(object.result) ? getInvitationStatusResponse_ResultFromJSON(object.result) : 0,
      status: isSet(object.status) ? invitationStatusFromJSON(object.status) : 0,
    };
  },

  toJSON(message: GetInvitationStatusResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getInvitationStatusResponse_ResultToJSON(message.result));
    message.status !== undefined && (obj.status = invitationStatusToJSON(message.status));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInvitationStatusResponse>, I>>(object: I): GetInvitationStatusResponse {
    const message = createBaseGetInvitationStatusResponse();
    message.result = object.result ?? 0;
    message.status = object.status ?? 0;
    return message;
  },
};

function createBasePageToken(): PageToken {
  return { value: Buffer.alloc(0) };
}

export const PageToken = {
  encode(message: PageToken, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value.length !== 0) {
      writer.uint32(10).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PageToken {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePageToken();
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

  fromJSON(object: any): PageToken {
    return { value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0) };
  },

  toJSON(message: PageToken): unknown {
    const obj: any = {};
    message.value !== undefined &&
      (obj.value = base64FromBytes(message.value !== undefined ? message.value : Buffer.alloc(0)));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PageToken>, I>>(object: I): PageToken {
    const message = createBasePageToken();
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

export type InviteService = typeof InviteService;
export const InviteService = {
  /** Gets the number of invites that a user can send out. */
  getInviteCount: {
    path: "/code.invite.v2.Invite/GetInviteCount",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetInviteCountRequest) => Buffer.from(GetInviteCountRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetInviteCountRequest.decode(value),
    responseSerialize: (value: GetInviteCountResponse) => Buffer.from(GetInviteCountResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetInviteCountResponse.decode(value),
  },
  /**
   * Invites someone to join via their phone number. A phone number can only
   * be invited once by a unique user. This is to avoid having a phone number
   * consuming more than one invite count globally.
   */
  invitePhoneNumber: {
    path: "/code.invite.v2.Invite/InvitePhoneNumber",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: InvitePhoneNumberRequest) => Buffer.from(InvitePhoneNumberRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => InvitePhoneNumberRequest.decode(value),
    responseSerialize: (value: InvitePhoneNumberResponse) =>
      Buffer.from(InvitePhoneNumberResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => InvitePhoneNumberResponse.decode(value),
  },
  /** Gets a phone number's invitation status. */
  getInvitationStatus: {
    path: "/code.invite.v2.Invite/GetInvitationStatus",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetInvitationStatusRequest) =>
      Buffer.from(GetInvitationStatusRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetInvitationStatusRequest.decode(value),
    responseSerialize: (value: GetInvitationStatusResponse) =>
      Buffer.from(GetInvitationStatusResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetInvitationStatusResponse.decode(value),
  },
} as const;

export interface InviteServer extends UntypedServiceImplementation {
  /** Gets the number of invites that a user can send out. */
  getInviteCount: handleUnaryCall<GetInviteCountRequest, GetInviteCountResponse>;
  /**
   * Invites someone to join via their phone number. A phone number can only
   * be invited once by a unique user. This is to avoid having a phone number
   * consuming more than one invite count globally.
   */
  invitePhoneNumber: handleUnaryCall<InvitePhoneNumberRequest, InvitePhoneNumberResponse>;
  /** Gets a phone number's invitation status. */
  getInvitationStatus: handleUnaryCall<GetInvitationStatusRequest, GetInvitationStatusResponse>;
}

export interface InviteClient extends Client {
  /** Gets the number of invites that a user can send out. */
  getInviteCount(
    request: GetInviteCountRequest,
    callback: (error: ServiceError | null, response: GetInviteCountResponse) => void,
  ): ClientUnaryCall;
  getInviteCount(
    request: GetInviteCountRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetInviteCountResponse) => void,
  ): ClientUnaryCall;
  getInviteCount(
    request: GetInviteCountRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetInviteCountResponse) => void,
  ): ClientUnaryCall;
  /**
   * Invites someone to join via their phone number. A phone number can only
   * be invited once by a unique user. This is to avoid having a phone number
   * consuming more than one invite count globally.
   */
  invitePhoneNumber(
    request: InvitePhoneNumberRequest,
    callback: (error: ServiceError | null, response: InvitePhoneNumberResponse) => void,
  ): ClientUnaryCall;
  invitePhoneNumber(
    request: InvitePhoneNumberRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: InvitePhoneNumberResponse) => void,
  ): ClientUnaryCall;
  invitePhoneNumber(
    request: InvitePhoneNumberRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: InvitePhoneNumberResponse) => void,
  ): ClientUnaryCall;
  /** Gets a phone number's invitation status. */
  getInvitationStatus(
    request: GetInvitationStatusRequest,
    callback: (error: ServiceError | null, response: GetInvitationStatusResponse) => void,
  ): ClientUnaryCall;
  getInvitationStatus(
    request: GetInvitationStatusRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetInvitationStatusResponse) => void,
  ): ClientUnaryCall;
  getInvitationStatus(
    request: GetInvitationStatusRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetInvitationStatusResponse) => void,
  ): ClientUnaryCall;
}

export const InviteClient = makeGenericClientConstructor(InviteService, "code.invite.v2.Invite") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): InviteClient;
  service: typeof InviteService;
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
