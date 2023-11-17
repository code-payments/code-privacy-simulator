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
import { DataContainerId, PhoneNumber, Signature, SolanaAccountId, UserId } from "../../common/v1/model";
import { PhoneLinkingToken } from "../../phone/v1/phone_verification_service";

export const protobufPackage = "code.user.v1";

export interface LinkAccountRequest {
  /** The public key of the owner account that will be linked to a user. */
  ownerAccountId:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(LinkAccountRequest) without this field set
   * using the private key of owner_account_id. This validates that the client
   * actually owns the account.
   */
  signature:
    | Signature
    | undefined;
  /**
   * A token received after successfully verifying a phone number via a
   * SMS code using the phone verification service.
   */
  phone: PhoneLinkingToken | undefined;
}

export interface LinkAccountResponse {
  result: LinkAccountResponse_Result;
  /** The user that was linked to the owner account */
  user:
    | User
    | undefined;
  /** The data container where the user can store a copy of their data */
  dataContainerId:
    | DataContainerId
    | undefined;
  /** Metadata that corresponds to a phone-based identifying feature. */
  phone: PhoneMetadata | undefined;
}

export enum LinkAccountResponse_Result {
  OK = 0,
  /**
   * INVALID_TOKEN - The provided token is invalid. A token may be invalid for a number of
   * reasons including: it's already been used, has been modified by the
   * client or has expired.
   */
  INVALID_TOKEN = 1,
  /**
   * RATE_LIMITED - The client is rate limited (eg. by IP, user ID, etc). The client should
   * retry at a later time.
   */
  RATE_LIMITED = 2,
  UNRECOGNIZED = -1,
}

export function linkAccountResponse_ResultFromJSON(object: any): LinkAccountResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return LinkAccountResponse_Result.OK;
    case 1:
    case "INVALID_TOKEN":
      return LinkAccountResponse_Result.INVALID_TOKEN;
    case 2:
    case "RATE_LIMITED":
      return LinkAccountResponse_Result.RATE_LIMITED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return LinkAccountResponse_Result.UNRECOGNIZED;
  }
}

export function linkAccountResponse_ResultToJSON(object: LinkAccountResponse_Result): string {
  switch (object) {
    case LinkAccountResponse_Result.OK:
      return "OK";
    case LinkAccountResponse_Result.INVALID_TOKEN:
      return "INVALID_TOKEN";
    case LinkAccountResponse_Result.RATE_LIMITED:
      return "RATE_LIMITED";
    case LinkAccountResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface UnlinkAccountRequest {
  /** The public key of the owner account that will be unliked. */
  ownerAccountId:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(UnlinkAccountRequest) without this field set
   * using the private key of owner_account_id. This provides an authentication
   * mechanism to the RPC.
   */
  signature:
    | Signature
    | undefined;
  /**
   * The phone number associated with the owner account. Remote send features
   * will be disabled on success.
   */
  phoneNumber: PhoneNumber | undefined;
}

export interface UnlinkAccountResponse {
  result: UnlinkAccountResponse_Result;
}

export enum UnlinkAccountResponse_Result {
  OK = 0,
  /**
   * NEVER_ASSOCIATED - The client attempted to unlink an owner account or identifying feature
   * that never had a valid association.
   */
  NEVER_ASSOCIATED = 1,
  UNRECOGNIZED = -1,
}

export function unlinkAccountResponse_ResultFromJSON(object: any): UnlinkAccountResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return UnlinkAccountResponse_Result.OK;
    case 1:
    case "NEVER_ASSOCIATED":
      return UnlinkAccountResponse_Result.NEVER_ASSOCIATED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UnlinkAccountResponse_Result.UNRECOGNIZED;
  }
}

export function unlinkAccountResponse_ResultToJSON(object: UnlinkAccountResponse_Result): string {
  switch (object) {
    case UnlinkAccountResponse_Result.OK:
      return "OK";
    case UnlinkAccountResponse_Result.NEVER_ASSOCIATED:
      return "NEVER_ASSOCIATED";
    case UnlinkAccountResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetUserRequest {
  /** The public key of the owner account that signed this request message. */
  ownerAccountId:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(GetUserRequest) without this field set
   * using the private key of owner_account_id. This provides an authentication
   * mechanism to the RPC.
   */
  signature: Signature | undefined;
  phoneNumber: PhoneNumber | undefined;
}

export interface GetUserResponse {
  result: GetUserResponse_Result;
  /** The user associated with the identifier */
  user:
    | User
    | undefined;
  /** The data container where the user can store a copy of their data */
  dataContainerId:
    | DataContainerId
    | undefined;
  /** Metadata that corresponds to a phone-based identifying feature. */
  phone: PhoneMetadata | undefined;
}

export enum GetUserResponse_Result {
  OK = 0,
  /** NOT_FOUND - The user doesn't exist */
  NOT_FOUND = 1,
  UNRECOGNIZED = -1,
}

export function getUserResponse_ResultFromJSON(object: any): GetUserResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetUserResponse_Result.OK;
    case 1:
    case "NOT_FOUND":
      return GetUserResponse_Result.NOT_FOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetUserResponse_Result.UNRECOGNIZED;
  }
}

export function getUserResponse_ResultToJSON(object: GetUserResponse_Result): string {
  switch (object) {
    case GetUserResponse_Result.OK:
      return "OK";
    case GetUserResponse_Result.NOT_FOUND:
      return "NOT_FOUND";
    case GetUserResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** User is the highest order of a form of identity. */
export interface User {
  /** The user's ID */
  id:
    | UserId
    | undefined;
  /** The identifying features that are associated with the user */
  view: View | undefined;
}

/**
 * View is a well-defined set of identifying features. It is contrained to having
 * exactly one feature set at a time, for now.
 */
export interface View {
  /**
   * The phone number associated with a user.
   *
   * Note: This field is mandatory as of right now, since it's the only one
   *       supported to date.
   */
  phoneNumber: PhoneNumber | undefined;
}

export interface PhoneMetadata {
  /**
   * State that determines whether a phone number is linked to the owner
   * account. A phone number is linked if we can treat it as an alias.
   * This is notably different from association, which answers the question
   * of whether the number was linked at any point in time.
   */
  isLinked: boolean;
}

function createBaseLinkAccountRequest(): LinkAccountRequest {
  return { ownerAccountId: undefined, signature: undefined, phone: undefined };
}

export const LinkAccountRequest = {
  encode(message: LinkAccountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerAccountId !== undefined) {
      SolanaAccountId.encode(message.ownerAccountId, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    if (message.phone !== undefined) {
      PhoneLinkingToken.encode(message.phone, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LinkAccountRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLinkAccountRequest();
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
          message.phone = PhoneLinkingToken.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LinkAccountRequest {
    return {
      ownerAccountId: isSet(object.ownerAccountId) ? SolanaAccountId.fromJSON(object.ownerAccountId) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
      phone: isSet(object.phone) ? PhoneLinkingToken.fromJSON(object.phone) : undefined,
    };
  },

  toJSON(message: LinkAccountRequest): unknown {
    const obj: any = {};
    message.ownerAccountId !== undefined &&
      (obj.ownerAccountId = message.ownerAccountId ? SolanaAccountId.toJSON(message.ownerAccountId) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    message.phone !== undefined && (obj.phone = message.phone ? PhoneLinkingToken.toJSON(message.phone) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LinkAccountRequest>, I>>(object: I): LinkAccountRequest {
    const message = createBaseLinkAccountRequest();
    message.ownerAccountId = (object.ownerAccountId !== undefined && object.ownerAccountId !== null)
      ? SolanaAccountId.fromPartial(object.ownerAccountId)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    message.phone = (object.phone !== undefined && object.phone !== null)
      ? PhoneLinkingToken.fromPartial(object.phone)
      : undefined;
    return message;
  },
};

function createBaseLinkAccountResponse(): LinkAccountResponse {
  return { result: 0, user: undefined, dataContainerId: undefined, phone: undefined };
}

export const LinkAccountResponse = {
  encode(message: LinkAccountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    if (message.user !== undefined) {
      User.encode(message.user, writer.uint32(18).fork()).ldelim();
    }
    if (message.dataContainerId !== undefined) {
      DataContainerId.encode(message.dataContainerId, writer.uint32(26).fork()).ldelim();
    }
    if (message.phone !== undefined) {
      PhoneMetadata.encode(message.phone, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LinkAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLinkAccountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.user = User.decode(reader, reader.uint32());
          break;
        case 3:
          message.dataContainerId = DataContainerId.decode(reader, reader.uint32());
          break;
        case 5:
          message.phone = PhoneMetadata.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LinkAccountResponse {
    return {
      result: isSet(object.result) ? linkAccountResponse_ResultFromJSON(object.result) : 0,
      user: isSet(object.user) ? User.fromJSON(object.user) : undefined,
      dataContainerId: isSet(object.dataContainerId) ? DataContainerId.fromJSON(object.dataContainerId) : undefined,
      phone: isSet(object.phone) ? PhoneMetadata.fromJSON(object.phone) : undefined,
    };
  },

  toJSON(message: LinkAccountResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = linkAccountResponse_ResultToJSON(message.result));
    message.user !== undefined && (obj.user = message.user ? User.toJSON(message.user) : undefined);
    message.dataContainerId !== undefined &&
      (obj.dataContainerId = message.dataContainerId ? DataContainerId.toJSON(message.dataContainerId) : undefined);
    message.phone !== undefined && (obj.phone = message.phone ? PhoneMetadata.toJSON(message.phone) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LinkAccountResponse>, I>>(object: I): LinkAccountResponse {
    const message = createBaseLinkAccountResponse();
    message.result = object.result ?? 0;
    message.user = (object.user !== undefined && object.user !== null) ? User.fromPartial(object.user) : undefined;
    message.dataContainerId = (object.dataContainerId !== undefined && object.dataContainerId !== null)
      ? DataContainerId.fromPartial(object.dataContainerId)
      : undefined;
    message.phone = (object.phone !== undefined && object.phone !== null)
      ? PhoneMetadata.fromPartial(object.phone)
      : undefined;
    return message;
  },
};

function createBaseUnlinkAccountRequest(): UnlinkAccountRequest {
  return { ownerAccountId: undefined, signature: undefined, phoneNumber: undefined };
}

export const UnlinkAccountRequest = {
  encode(message: UnlinkAccountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerAccountId !== undefined) {
      SolanaAccountId.encode(message.ownerAccountId, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    if (message.phoneNumber !== undefined) {
      PhoneNumber.encode(message.phoneNumber, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnlinkAccountRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnlinkAccountRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ownerAccountId = SolanaAccountId.decode(reader, reader.uint32());
          break;
        case 2:
          message.signature = Signature.decode(reader, reader.uint32());
          break;
        case 4:
          message.phoneNumber = PhoneNumber.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnlinkAccountRequest {
    return {
      ownerAccountId: isSet(object.ownerAccountId) ? SolanaAccountId.fromJSON(object.ownerAccountId) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
      phoneNumber: isSet(object.phoneNumber) ? PhoneNumber.fromJSON(object.phoneNumber) : undefined,
    };
  },

  toJSON(message: UnlinkAccountRequest): unknown {
    const obj: any = {};
    message.ownerAccountId !== undefined &&
      (obj.ownerAccountId = message.ownerAccountId ? SolanaAccountId.toJSON(message.ownerAccountId) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    message.phoneNumber !== undefined &&
      (obj.phoneNumber = message.phoneNumber ? PhoneNumber.toJSON(message.phoneNumber) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnlinkAccountRequest>, I>>(object: I): UnlinkAccountRequest {
    const message = createBaseUnlinkAccountRequest();
    message.ownerAccountId = (object.ownerAccountId !== undefined && object.ownerAccountId !== null)
      ? SolanaAccountId.fromPartial(object.ownerAccountId)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    message.phoneNumber = (object.phoneNumber !== undefined && object.phoneNumber !== null)
      ? PhoneNumber.fromPartial(object.phoneNumber)
      : undefined;
    return message;
  },
};

function createBaseUnlinkAccountResponse(): UnlinkAccountResponse {
  return { result: 0 };
}

export const UnlinkAccountResponse = {
  encode(message: UnlinkAccountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnlinkAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnlinkAccountResponse();
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

  fromJSON(object: any): UnlinkAccountResponse {
    return { result: isSet(object.result) ? unlinkAccountResponse_ResultFromJSON(object.result) : 0 };
  },

  toJSON(message: UnlinkAccountResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = unlinkAccountResponse_ResultToJSON(message.result));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnlinkAccountResponse>, I>>(object: I): UnlinkAccountResponse {
    const message = createBaseUnlinkAccountResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

function createBaseGetUserRequest(): GetUserRequest {
  return { ownerAccountId: undefined, signature: undefined, phoneNumber: undefined };
}

export const GetUserRequest = {
  encode(message: GetUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerAccountId !== undefined) {
      SolanaAccountId.encode(message.ownerAccountId, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    if (message.phoneNumber !== undefined) {
      PhoneNumber.encode(message.phoneNumber, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserRequest();
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
          message.phoneNumber = PhoneNumber.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserRequest {
    return {
      ownerAccountId: isSet(object.ownerAccountId) ? SolanaAccountId.fromJSON(object.ownerAccountId) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
      phoneNumber: isSet(object.phoneNumber) ? PhoneNumber.fromJSON(object.phoneNumber) : undefined,
    };
  },

  toJSON(message: GetUserRequest): unknown {
    const obj: any = {};
    message.ownerAccountId !== undefined &&
      (obj.ownerAccountId = message.ownerAccountId ? SolanaAccountId.toJSON(message.ownerAccountId) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    message.phoneNumber !== undefined &&
      (obj.phoneNumber = message.phoneNumber ? PhoneNumber.toJSON(message.phoneNumber) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserRequest>, I>>(object: I): GetUserRequest {
    const message = createBaseGetUserRequest();
    message.ownerAccountId = (object.ownerAccountId !== undefined && object.ownerAccountId !== null)
      ? SolanaAccountId.fromPartial(object.ownerAccountId)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    message.phoneNumber = (object.phoneNumber !== undefined && object.phoneNumber !== null)
      ? PhoneNumber.fromPartial(object.phoneNumber)
      : undefined;
    return message;
  },
};

function createBaseGetUserResponse(): GetUserResponse {
  return { result: 0, user: undefined, dataContainerId: undefined, phone: undefined };
}

export const GetUserResponse = {
  encode(message: GetUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    if (message.user !== undefined) {
      User.encode(message.user, writer.uint32(18).fork()).ldelim();
    }
    if (message.dataContainerId !== undefined) {
      DataContainerId.encode(message.dataContainerId, writer.uint32(26).fork()).ldelim();
    }
    if (message.phone !== undefined) {
      PhoneMetadata.encode(message.phone, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.user = User.decode(reader, reader.uint32());
          break;
        case 3:
          message.dataContainerId = DataContainerId.decode(reader, reader.uint32());
          break;
        case 5:
          message.phone = PhoneMetadata.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserResponse {
    return {
      result: isSet(object.result) ? getUserResponse_ResultFromJSON(object.result) : 0,
      user: isSet(object.user) ? User.fromJSON(object.user) : undefined,
      dataContainerId: isSet(object.dataContainerId) ? DataContainerId.fromJSON(object.dataContainerId) : undefined,
      phone: isSet(object.phone) ? PhoneMetadata.fromJSON(object.phone) : undefined,
    };
  },

  toJSON(message: GetUserResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getUserResponse_ResultToJSON(message.result));
    message.user !== undefined && (obj.user = message.user ? User.toJSON(message.user) : undefined);
    message.dataContainerId !== undefined &&
      (obj.dataContainerId = message.dataContainerId ? DataContainerId.toJSON(message.dataContainerId) : undefined);
    message.phone !== undefined && (obj.phone = message.phone ? PhoneMetadata.toJSON(message.phone) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserResponse>, I>>(object: I): GetUserResponse {
    const message = createBaseGetUserResponse();
    message.result = object.result ?? 0;
    message.user = (object.user !== undefined && object.user !== null) ? User.fromPartial(object.user) : undefined;
    message.dataContainerId = (object.dataContainerId !== undefined && object.dataContainerId !== null)
      ? DataContainerId.fromPartial(object.dataContainerId)
      : undefined;
    message.phone = (object.phone !== undefined && object.phone !== null)
      ? PhoneMetadata.fromPartial(object.phone)
      : undefined;
    return message;
  },
};

function createBaseUser(): User {
  return { id: undefined, view: undefined };
}

export const User = {
  encode(message: User, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== undefined) {
      UserId.encode(message.id, writer.uint32(10).fork()).ldelim();
    }
    if (message.view !== undefined) {
      View.encode(message.view, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): User {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = UserId.decode(reader, reader.uint32());
          break;
        case 2:
          message.view = View.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): User {
    return {
      id: isSet(object.id) ? UserId.fromJSON(object.id) : undefined,
      view: isSet(object.view) ? View.fromJSON(object.view) : undefined,
    };
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id ? UserId.toJSON(message.id) : undefined);
    message.view !== undefined && (obj.view = message.view ? View.toJSON(message.view) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<User>, I>>(object: I): User {
    const message = createBaseUser();
    message.id = (object.id !== undefined && object.id !== null) ? UserId.fromPartial(object.id) : undefined;
    message.view = (object.view !== undefined && object.view !== null) ? View.fromPartial(object.view) : undefined;
    return message;
  },
};

function createBaseView(): View {
  return { phoneNumber: undefined };
}

export const View = {
  encode(message: View, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.phoneNumber !== undefined) {
      PhoneNumber.encode(message.phoneNumber, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): View {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseView();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.phoneNumber = PhoneNumber.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): View {
    return { phoneNumber: isSet(object.phoneNumber) ? PhoneNumber.fromJSON(object.phoneNumber) : undefined };
  },

  toJSON(message: View): unknown {
    const obj: any = {};
    message.phoneNumber !== undefined &&
      (obj.phoneNumber = message.phoneNumber ? PhoneNumber.toJSON(message.phoneNumber) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<View>, I>>(object: I): View {
    const message = createBaseView();
    message.phoneNumber = (object.phoneNumber !== undefined && object.phoneNumber !== null)
      ? PhoneNumber.fromPartial(object.phoneNumber)
      : undefined;
    return message;
  },
};

function createBasePhoneMetadata(): PhoneMetadata {
  return { isLinked: false };
}

export const PhoneMetadata = {
  encode(message: PhoneMetadata, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isLinked === true) {
      writer.uint32(8).bool(message.isLinked);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PhoneMetadata {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePhoneMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isLinked = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PhoneMetadata {
    return { isLinked: isSet(object.isLinked) ? Boolean(object.isLinked) : false };
  },

  toJSON(message: PhoneMetadata): unknown {
    const obj: any = {};
    message.isLinked !== undefined && (obj.isLinked = message.isLinked);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PhoneMetadata>, I>>(object: I): PhoneMetadata {
    const message = createBasePhoneMetadata();
    message.isLinked = object.isLinked ?? false;
    return message;
  },
};

export type IdentityService = typeof IdentityService;
export const IdentityService = {
  /**
   * LinkAccount links an owner account to:
   *   * the user identified and authenticated by a one-time use token
   *   * any identifying features that support remote send
   * Notably, this RPC has the following side effects:
   *   * A new user is automatically created if one doesn't exist.
   *   * Server will create a new data container for at least every unique
   *     owner account linked to the user.
   *   * Previous links to identifying features that support remote send are
   *     invalidated. Relinking must occur to restore previous state.
   */
  linkAccount: {
    path: "/code.user.v1.Identity/LinkAccount",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: LinkAccountRequest) => Buffer.from(LinkAccountRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => LinkAccountRequest.decode(value),
    responseSerialize: (value: LinkAccountResponse) => Buffer.from(LinkAccountResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => LinkAccountResponse.decode(value),
  },
  /**
   * UnlinkAccount removes links from an owner account. It will NOT remove
   * existing associations between users, owner accounts and identifying
   * features. Currently, the RPC will remove:
   *   * remote send features for any applicable identifying features
   * The following associations will remain intact to ensure owner accounts
   * can continue to be used with a consistent login experience:
   *   * the user continues to be associated to existing owner accounts and
   *     identifying features
   *   * identifying features whose remote send was disabled continue to be
   *     associated with the owner account
   *
   * Client can continue mainting their current login session. Their current
   * user and data container will remain the same.
   *
   * The call is guaranteed to be idempotent. It will not fail if the link is
   * already removed by either a previous call to this RPC or by a more recent
   * call to LinkAccount. A failure will only occur if the link between a user
   * and the owner accout or identifying feature never existed.
   */
  unlinkAccount: {
    path: "/code.user.v1.Identity/UnlinkAccount",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UnlinkAccountRequest) => Buffer.from(UnlinkAccountRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UnlinkAccountRequest.decode(value),
    responseSerialize: (value: UnlinkAccountResponse) => Buffer.from(UnlinkAccountResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UnlinkAccountResponse.decode(value),
  },
  /** GetUser gets user information given a user identifier and an owner account. */
  getUser: {
    path: "/code.user.v1.Identity/GetUser",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetUserRequest) => Buffer.from(GetUserRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetUserRequest.decode(value),
    responseSerialize: (value: GetUserResponse) => Buffer.from(GetUserResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetUserResponse.decode(value),
  },
} as const;

export interface IdentityServer extends UntypedServiceImplementation {
  /**
   * LinkAccount links an owner account to:
   *   * the user identified and authenticated by a one-time use token
   *   * any identifying features that support remote send
   * Notably, this RPC has the following side effects:
   *   * A new user is automatically created if one doesn't exist.
   *   * Server will create a new data container for at least every unique
   *     owner account linked to the user.
   *   * Previous links to identifying features that support remote send are
   *     invalidated. Relinking must occur to restore previous state.
   */
  linkAccount: handleUnaryCall<LinkAccountRequest, LinkAccountResponse>;
  /**
   * UnlinkAccount removes links from an owner account. It will NOT remove
   * existing associations between users, owner accounts and identifying
   * features. Currently, the RPC will remove:
   *   * remote send features for any applicable identifying features
   * The following associations will remain intact to ensure owner accounts
   * can continue to be used with a consistent login experience:
   *   * the user continues to be associated to existing owner accounts and
   *     identifying features
   *   * identifying features whose remote send was disabled continue to be
   *     associated with the owner account
   *
   * Client can continue mainting their current login session. Their current
   * user and data container will remain the same.
   *
   * The call is guaranteed to be idempotent. It will not fail if the link is
   * already removed by either a previous call to this RPC or by a more recent
   * call to LinkAccount. A failure will only occur if the link between a user
   * and the owner accout or identifying feature never existed.
   */
  unlinkAccount: handleUnaryCall<UnlinkAccountRequest, UnlinkAccountResponse>;
  /** GetUser gets user information given a user identifier and an owner account. */
  getUser: handleUnaryCall<GetUserRequest, GetUserResponse>;
}

export interface IdentityClient extends Client {
  /**
   * LinkAccount links an owner account to:
   *   * the user identified and authenticated by a one-time use token
   *   * any identifying features that support remote send
   * Notably, this RPC has the following side effects:
   *   * A new user is automatically created if one doesn't exist.
   *   * Server will create a new data container for at least every unique
   *     owner account linked to the user.
   *   * Previous links to identifying features that support remote send are
   *     invalidated. Relinking must occur to restore previous state.
   */
  linkAccount(
    request: LinkAccountRequest,
    callback: (error: ServiceError | null, response: LinkAccountResponse) => void,
  ): ClientUnaryCall;
  linkAccount(
    request: LinkAccountRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: LinkAccountResponse) => void,
  ): ClientUnaryCall;
  linkAccount(
    request: LinkAccountRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: LinkAccountResponse) => void,
  ): ClientUnaryCall;
  /**
   * UnlinkAccount removes links from an owner account. It will NOT remove
   * existing associations between users, owner accounts and identifying
   * features. Currently, the RPC will remove:
   *   * remote send features for any applicable identifying features
   * The following associations will remain intact to ensure owner accounts
   * can continue to be used with a consistent login experience:
   *   * the user continues to be associated to existing owner accounts and
   *     identifying features
   *   * identifying features whose remote send was disabled continue to be
   *     associated with the owner account
   *
   * Client can continue mainting their current login session. Their current
   * user and data container will remain the same.
   *
   * The call is guaranteed to be idempotent. It will not fail if the link is
   * already removed by either a previous call to this RPC or by a more recent
   * call to LinkAccount. A failure will only occur if the link between a user
   * and the owner accout or identifying feature never existed.
   */
  unlinkAccount(
    request: UnlinkAccountRequest,
    callback: (error: ServiceError | null, response: UnlinkAccountResponse) => void,
  ): ClientUnaryCall;
  unlinkAccount(
    request: UnlinkAccountRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: UnlinkAccountResponse) => void,
  ): ClientUnaryCall;
  unlinkAccount(
    request: UnlinkAccountRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UnlinkAccountResponse) => void,
  ): ClientUnaryCall;
  /** GetUser gets user information given a user identifier and an owner account. */
  getUser(
    request: GetUserRequest,
    callback: (error: ServiceError | null, response: GetUserResponse) => void,
  ): ClientUnaryCall;
  getUser(
    request: GetUserRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetUserResponse) => void,
  ): ClientUnaryCall;
  getUser(
    request: GetUserRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetUserResponse) => void,
  ): ClientUnaryCall;
}

export const IdentityClient = makeGenericClientConstructor(IdentityService, "code.user.v1.Identity") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): IdentityClient;
  service: typeof IdentityService;
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
