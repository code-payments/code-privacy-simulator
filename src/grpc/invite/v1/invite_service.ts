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

export const protobufPackage = "code.invite.v1";

export interface GetInviteCodesRequest {
  /** The email of the user sending the invites. */
  inviterEmail: string;
}

export interface GetInviteCodesResponse {
  inviteCodes: string[];
}

export interface MarkSentRequest {
  /** The email of the user who sent the invite. */
  inviterEmail: string;
  inviteCode: string;
}

export interface MarkSentResponse {
  result: MarkSentResponse_Result;
}

export enum MarkSentResponse_Result {
  OK = 0,
  /** NOT_FOUND - Indicates that the invite code does not exist. */
  NOT_FOUND = 1,
  /** INVALID_EMAIL - Indicates that the email provided is not the issuer of the invite code. */
  INVALID_EMAIL = 2,
  UNRECOGNIZED = -1,
}

export function markSentResponse_ResultFromJSON(object: any): MarkSentResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return MarkSentResponse_Result.OK;
    case 1:
    case "NOT_FOUND":
      return MarkSentResponse_Result.NOT_FOUND;
    case 2:
    case "INVALID_EMAIL":
      return MarkSentResponse_Result.INVALID_EMAIL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MarkSentResponse_Result.UNRECOGNIZED;
  }
}

export function markSentResponse_ResultToJSON(object: MarkSentResponse_Result): string {
  switch (object) {
    case MarkSentResponse_Result.OK:
      return "OK";
    case MarkSentResponse_Result.NOT_FOUND:
      return "NOT_FOUND";
    case MarkSentResponse_Result.INVALID_EMAIL:
      return "INVALID_EMAIL";
    case MarkSentResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseGetInviteCodesRequest(): GetInviteCodesRequest {
  return { inviterEmail: "" };
}

export const GetInviteCodesRequest = {
  encode(message: GetInviteCodesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.inviterEmail !== "") {
      writer.uint32(10).string(message.inviterEmail);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInviteCodesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInviteCodesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.inviterEmail = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInviteCodesRequest {
    return { inviterEmail: isSet(object.inviterEmail) ? String(object.inviterEmail) : "" };
  },

  toJSON(message: GetInviteCodesRequest): unknown {
    const obj: any = {};
    message.inviterEmail !== undefined && (obj.inviterEmail = message.inviterEmail);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInviteCodesRequest>, I>>(object: I): GetInviteCodesRequest {
    const message = createBaseGetInviteCodesRequest();
    message.inviterEmail = object.inviterEmail ?? "";
    return message;
  },
};

function createBaseGetInviteCodesResponse(): GetInviteCodesResponse {
  return { inviteCodes: [] };
}

export const GetInviteCodesResponse = {
  encode(message: GetInviteCodesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.inviteCodes) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInviteCodesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInviteCodesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.inviteCodes.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInviteCodesResponse {
    return { inviteCodes: Array.isArray(object?.inviteCodes) ? object.inviteCodes.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetInviteCodesResponse): unknown {
    const obj: any = {};
    if (message.inviteCodes) {
      obj.inviteCodes = message.inviteCodes.map((e) => e);
    } else {
      obj.inviteCodes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInviteCodesResponse>, I>>(object: I): GetInviteCodesResponse {
    const message = createBaseGetInviteCodesResponse();
    message.inviteCodes = object.inviteCodes?.map((e) => e) || [];
    return message;
  },
};

function createBaseMarkSentRequest(): MarkSentRequest {
  return { inviterEmail: "", inviteCode: "" };
}

export const MarkSentRequest = {
  encode(message: MarkSentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.inviterEmail !== "") {
      writer.uint32(10).string(message.inviterEmail);
    }
    if (message.inviteCode !== "") {
      writer.uint32(18).string(message.inviteCode);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MarkSentRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMarkSentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.inviterEmail = reader.string();
          break;
        case 2:
          message.inviteCode = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MarkSentRequest {
    return {
      inviterEmail: isSet(object.inviterEmail) ? String(object.inviterEmail) : "",
      inviteCode: isSet(object.inviteCode) ? String(object.inviteCode) : "",
    };
  },

  toJSON(message: MarkSentRequest): unknown {
    const obj: any = {};
    message.inviterEmail !== undefined && (obj.inviterEmail = message.inviterEmail);
    message.inviteCode !== undefined && (obj.inviteCode = message.inviteCode);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MarkSentRequest>, I>>(object: I): MarkSentRequest {
    const message = createBaseMarkSentRequest();
    message.inviterEmail = object.inviterEmail ?? "";
    message.inviteCode = object.inviteCode ?? "";
    return message;
  },
};

function createBaseMarkSentResponse(): MarkSentResponse {
  return { result: 0 };
}

export const MarkSentResponse = {
  encode(message: MarkSentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MarkSentResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMarkSentResponse();
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

  fromJSON(object: any): MarkSentResponse {
    return { result: isSet(object.result) ? markSentResponse_ResultFromJSON(object.result) : 0 };
  },

  toJSON(message: MarkSentResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = markSentResponse_ResultToJSON(message.result));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MarkSentResponse>, I>>(object: I): MarkSentResponse {
    const message = createBaseMarkSentResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

export type InviteService = typeof InviteService;
export const InviteService = {
  /**
   * GetInviteCodes returns all the unsent one-time-use invite codes that are
   * available to a user.
   */
  getInviteCodes: {
    path: "/code.invite.v1.Invite/GetInviteCodes",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetInviteCodesRequest) => Buffer.from(GetInviteCodesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetInviteCodesRequest.decode(value),
    responseSerialize: (value: GetInviteCodesResponse) => Buffer.from(GetInviteCodesResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetInviteCodesResponse.decode(value),
  },
  /** MarkSent marks an invite code as sent. MarkSent is idempotent. */
  markSent: {
    path: "/code.invite.v1.Invite/MarkSent",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: MarkSentRequest) => Buffer.from(MarkSentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => MarkSentRequest.decode(value),
    responseSerialize: (value: MarkSentResponse) => Buffer.from(MarkSentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => MarkSentResponse.decode(value),
  },
} as const;

export interface InviteServer extends UntypedServiceImplementation {
  /**
   * GetInviteCodes returns all the unsent one-time-use invite codes that are
   * available to a user.
   */
  getInviteCodes: handleUnaryCall<GetInviteCodesRequest, GetInviteCodesResponse>;
  /** MarkSent marks an invite code as sent. MarkSent is idempotent. */
  markSent: handleUnaryCall<MarkSentRequest, MarkSentResponse>;
}

export interface InviteClient extends Client {
  /**
   * GetInviteCodes returns all the unsent one-time-use invite codes that are
   * available to a user.
   */
  getInviteCodes(
    request: GetInviteCodesRequest,
    callback: (error: ServiceError | null, response: GetInviteCodesResponse) => void,
  ): ClientUnaryCall;
  getInviteCodes(
    request: GetInviteCodesRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetInviteCodesResponse) => void,
  ): ClientUnaryCall;
  getInviteCodes(
    request: GetInviteCodesRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetInviteCodesResponse) => void,
  ): ClientUnaryCall;
  /** MarkSent marks an invite code as sent. MarkSent is idempotent. */
  markSent(
    request: MarkSentRequest,
    callback: (error: ServiceError | null, response: MarkSentResponse) => void,
  ): ClientUnaryCall;
  markSent(
    request: MarkSentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: MarkSentResponse) => void,
  ): ClientUnaryCall;
  markSent(
    request: MarkSentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: MarkSentResponse) => void,
  ): ClientUnaryCall;
}

export const InviteClient = makeGenericClientConstructor(InviteService, "code.invite.v1.Invite") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): InviteClient;
  service: typeof InviteService;
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
