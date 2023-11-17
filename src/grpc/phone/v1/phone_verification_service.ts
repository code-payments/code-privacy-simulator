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
import { PhoneNumber, Signature, SolanaAccountId } from "../../common/v1/model";

export const protobufPackage = "code.phone.v1";

export interface SendVerificationCodeRequest {
  /** The phone number to send a verification code over SMS to. */
  phoneNumber: PhoneNumber | undefined;
}

export interface SendVerificationCodeResponse {
  result: SendVerificationCodeResponse_Result;
}

export enum SendVerificationCodeResponse_Result {
  OK = 0,
  /**
   * NOT_INVITED - The phone number is not invited and cannot use Code. The SMS will not
   * be sent until the user is invited. This result is only valid during
   * the invitation stage of the application and won't apply after general
   * public release.
   */
  NOT_INVITED = 1,
  /**
   * RATE_LIMITED - SMS is rate limited (eg. by IP, phone number, etc) and was not sent.
   * These will be set generously such that real users won't actually hit
   * the limits.
   */
  RATE_LIMITED = 2,
  /** INVALID_PHONE_NUMBER - The phone number is not real because it fails Twilio lookup. */
  INVALID_PHONE_NUMBER = 3,
  /**
   * UNSUPPORTED_PHONE_TYPE - The phone number is valid, but it maps to an unsupported type of phone
   * like a landline.
   */
  UNSUPPORTED_PHONE_TYPE = 4,
  UNRECOGNIZED = -1,
}

export function sendVerificationCodeResponse_ResultFromJSON(object: any): SendVerificationCodeResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return SendVerificationCodeResponse_Result.OK;
    case 1:
    case "NOT_INVITED":
      return SendVerificationCodeResponse_Result.NOT_INVITED;
    case 2:
    case "RATE_LIMITED":
      return SendVerificationCodeResponse_Result.RATE_LIMITED;
    case 3:
    case "INVALID_PHONE_NUMBER":
      return SendVerificationCodeResponse_Result.INVALID_PHONE_NUMBER;
    case 4:
    case "UNSUPPORTED_PHONE_TYPE":
      return SendVerificationCodeResponse_Result.UNSUPPORTED_PHONE_TYPE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SendVerificationCodeResponse_Result.UNRECOGNIZED;
  }
}

export function sendVerificationCodeResponse_ResultToJSON(object: SendVerificationCodeResponse_Result): string {
  switch (object) {
    case SendVerificationCodeResponse_Result.OK:
      return "OK";
    case SendVerificationCodeResponse_Result.NOT_INVITED:
      return "NOT_INVITED";
    case SendVerificationCodeResponse_Result.RATE_LIMITED:
      return "RATE_LIMITED";
    case SendVerificationCodeResponse_Result.INVALID_PHONE_NUMBER:
      return "INVALID_PHONE_NUMBER";
    case SendVerificationCodeResponse_Result.UNSUPPORTED_PHONE_TYPE:
      return "UNSUPPORTED_PHONE_TYPE";
    case SendVerificationCodeResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface CheckVerificationCodeRequest {
  /** The phone number being verified. */
  phoneNumber:
    | PhoneNumber
    | undefined;
  /** The verification code received via SMS. */
  code: VerificationCode | undefined;
}

export interface CheckVerificationCodeResponse {
  result: CheckVerificationCodeResponse_Result;
  /**
   * The token used to associate an owner account to a user using the verified
   * phone number.
   */
  linkingToken: PhoneLinkingToken | undefined;
}

export enum CheckVerificationCodeResponse_Result {
  OK = 0,
  /**
   * INVALID_CODE - The provided verification code is invalid. The user may retry
   * enterring the code if this is received. When max attempts are
   * received, NO_VERIFICATION will be returned.
   */
  INVALID_CODE = 1,
  /**
   * NO_VERIFICATION - There is no verification in progress for the phone number. Several
   * reasons this can occur include a verification being expired or having
   * reached a maximum check threshold. The client must initiate a new
   * verification using SendVerificationCode.
   */
  NO_VERIFICATION = 2,
  /**
   * RATE_LIMITED - The call is rate limited (eg. by IP, phone number, etc). The code is
   * not verified.
   */
  RATE_LIMITED = 3,
  UNRECOGNIZED = -1,
}

export function checkVerificationCodeResponse_ResultFromJSON(object: any): CheckVerificationCodeResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return CheckVerificationCodeResponse_Result.OK;
    case 1:
    case "INVALID_CODE":
      return CheckVerificationCodeResponse_Result.INVALID_CODE;
    case 2:
    case "NO_VERIFICATION":
      return CheckVerificationCodeResponse_Result.NO_VERIFICATION;
    case 3:
    case "RATE_LIMITED":
      return CheckVerificationCodeResponse_Result.RATE_LIMITED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CheckVerificationCodeResponse_Result.UNRECOGNIZED;
  }
}

export function checkVerificationCodeResponse_ResultToJSON(object: CheckVerificationCodeResponse_Result): string {
  switch (object) {
    case CheckVerificationCodeResponse_Result.OK:
      return "OK";
    case CheckVerificationCodeResponse_Result.INVALID_CODE:
      return "INVALID_CODE";
    case CheckVerificationCodeResponse_Result.NO_VERIFICATION:
      return "NO_VERIFICATION";
    case CheckVerificationCodeResponse_Result.RATE_LIMITED:
      return "RATE_LIMITED";
    case CheckVerificationCodeResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetAssociatedPhoneNumberRequest {
  /**
   * The public key of the owner account that is being queried for a linked
   * phone number.
   */
  ownerAccountId:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(GetAssociatedPhoneNumberRequest) without
   * this field set using the private key of owner_account_id. This provides
   * an authentication mechanism to the RPC.
   */
  signature: Signature | undefined;
}

export interface GetAssociatedPhoneNumberResponse {
  result: GetAssociatedPhoneNumberResponse_Result;
  /** The latest phone number associated with the owner account. */
  phoneNumber:
    | PhoneNumber
    | undefined;
  /**
   * State that determines whether a phone number is linked to the owner
   * account. A phone number is linked if we can treat it as an alias.
   * This is notably different from association, which answers the question
   * of whether the number was linked at any point in time.
   */
  isLinked: boolean;
}

export enum GetAssociatedPhoneNumberResponse_Result {
  OK = 0,
  /** NOT_FOUND - A phone number is not associated with the provided token account. */
  NOT_FOUND = 1,
  UNRECOGNIZED = -1,
}

export function getAssociatedPhoneNumberResponse_ResultFromJSON(object: any): GetAssociatedPhoneNumberResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetAssociatedPhoneNumberResponse_Result.OK;
    case 1:
    case "NOT_FOUND":
      return GetAssociatedPhoneNumberResponse_Result.NOT_FOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetAssociatedPhoneNumberResponse_Result.UNRECOGNIZED;
  }
}

export function getAssociatedPhoneNumberResponse_ResultToJSON(object: GetAssociatedPhoneNumberResponse_Result): string {
  switch (object) {
    case GetAssociatedPhoneNumberResponse_Result.OK:
      return "OK";
    case GetAssociatedPhoneNumberResponse_Result.NOT_FOUND:
      return "NOT_FOUND";
    case GetAssociatedPhoneNumberResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface VerificationCode {
  /** A 4-10 digit numerical code. */
  value: string;
}

/**
 * A one-time use token that can be provided to the Identity service to link an
 * owner account to a user with the verified phone number. The client should
 * treat this token as opaque.
 */
export interface PhoneLinkingToken {
  /** The verified phone number. */
  phoneNumber:
    | PhoneNumber
    | undefined;
  /** The code that verified the phone number. */
  code: VerificationCode | undefined;
}

function createBaseSendVerificationCodeRequest(): SendVerificationCodeRequest {
  return { phoneNumber: undefined };
}

export const SendVerificationCodeRequest = {
  encode(message: SendVerificationCodeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.phoneNumber !== undefined) {
      PhoneNumber.encode(message.phoneNumber, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendVerificationCodeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendVerificationCodeRequest();
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

  fromJSON(object: any): SendVerificationCodeRequest {
    return { phoneNumber: isSet(object.phoneNumber) ? PhoneNumber.fromJSON(object.phoneNumber) : undefined };
  },

  toJSON(message: SendVerificationCodeRequest): unknown {
    const obj: any = {};
    message.phoneNumber !== undefined &&
      (obj.phoneNumber = message.phoneNumber ? PhoneNumber.toJSON(message.phoneNumber) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SendVerificationCodeRequest>, I>>(object: I): SendVerificationCodeRequest {
    const message = createBaseSendVerificationCodeRequest();
    message.phoneNumber = (object.phoneNumber !== undefined && object.phoneNumber !== null)
      ? PhoneNumber.fromPartial(object.phoneNumber)
      : undefined;
    return message;
  },
};

function createBaseSendVerificationCodeResponse(): SendVerificationCodeResponse {
  return { result: 0 };
}

export const SendVerificationCodeResponse = {
  encode(message: SendVerificationCodeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendVerificationCodeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendVerificationCodeResponse();
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

  fromJSON(object: any): SendVerificationCodeResponse {
    return { result: isSet(object.result) ? sendVerificationCodeResponse_ResultFromJSON(object.result) : 0 };
  },

  toJSON(message: SendVerificationCodeResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = sendVerificationCodeResponse_ResultToJSON(message.result));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SendVerificationCodeResponse>, I>>(object: I): SendVerificationCodeResponse {
    const message = createBaseSendVerificationCodeResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

function createBaseCheckVerificationCodeRequest(): CheckVerificationCodeRequest {
  return { phoneNumber: undefined, code: undefined };
}

export const CheckVerificationCodeRequest = {
  encode(message: CheckVerificationCodeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.phoneNumber !== undefined) {
      PhoneNumber.encode(message.phoneNumber, writer.uint32(10).fork()).ldelim();
    }
    if (message.code !== undefined) {
      VerificationCode.encode(message.code, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckVerificationCodeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckVerificationCodeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.phoneNumber = PhoneNumber.decode(reader, reader.uint32());
          break;
        case 2:
          message.code = VerificationCode.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckVerificationCodeRequest {
    return {
      phoneNumber: isSet(object.phoneNumber) ? PhoneNumber.fromJSON(object.phoneNumber) : undefined,
      code: isSet(object.code) ? VerificationCode.fromJSON(object.code) : undefined,
    };
  },

  toJSON(message: CheckVerificationCodeRequest): unknown {
    const obj: any = {};
    message.phoneNumber !== undefined &&
      (obj.phoneNumber = message.phoneNumber ? PhoneNumber.toJSON(message.phoneNumber) : undefined);
    message.code !== undefined && (obj.code = message.code ? VerificationCode.toJSON(message.code) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CheckVerificationCodeRequest>, I>>(object: I): CheckVerificationCodeRequest {
    const message = createBaseCheckVerificationCodeRequest();
    message.phoneNumber = (object.phoneNumber !== undefined && object.phoneNumber !== null)
      ? PhoneNumber.fromPartial(object.phoneNumber)
      : undefined;
    message.code = (object.code !== undefined && object.code !== null)
      ? VerificationCode.fromPartial(object.code)
      : undefined;
    return message;
  },
};

function createBaseCheckVerificationCodeResponse(): CheckVerificationCodeResponse {
  return { result: 0, linkingToken: undefined };
}

export const CheckVerificationCodeResponse = {
  encode(message: CheckVerificationCodeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    if (message.linkingToken !== undefined) {
      PhoneLinkingToken.encode(message.linkingToken, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckVerificationCodeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckVerificationCodeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.linkingToken = PhoneLinkingToken.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckVerificationCodeResponse {
    return {
      result: isSet(object.result) ? checkVerificationCodeResponse_ResultFromJSON(object.result) : 0,
      linkingToken: isSet(object.linkingToken) ? PhoneLinkingToken.fromJSON(object.linkingToken) : undefined,
    };
  },

  toJSON(message: CheckVerificationCodeResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = checkVerificationCodeResponse_ResultToJSON(message.result));
    message.linkingToken !== undefined &&
      (obj.linkingToken = message.linkingToken ? PhoneLinkingToken.toJSON(message.linkingToken) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CheckVerificationCodeResponse>, I>>(
    object: I,
  ): CheckVerificationCodeResponse {
    const message = createBaseCheckVerificationCodeResponse();
    message.result = object.result ?? 0;
    message.linkingToken = (object.linkingToken !== undefined && object.linkingToken !== null)
      ? PhoneLinkingToken.fromPartial(object.linkingToken)
      : undefined;
    return message;
  },
};

function createBaseGetAssociatedPhoneNumberRequest(): GetAssociatedPhoneNumberRequest {
  return { ownerAccountId: undefined, signature: undefined };
}

export const GetAssociatedPhoneNumberRequest = {
  encode(message: GetAssociatedPhoneNumberRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerAccountId !== undefined) {
      SolanaAccountId.encode(message.ownerAccountId, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAssociatedPhoneNumberRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAssociatedPhoneNumberRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ownerAccountId = SolanaAccountId.decode(reader, reader.uint32());
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

  fromJSON(object: any): GetAssociatedPhoneNumberRequest {
    return {
      ownerAccountId: isSet(object.ownerAccountId) ? SolanaAccountId.fromJSON(object.ownerAccountId) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
    };
  },

  toJSON(message: GetAssociatedPhoneNumberRequest): unknown {
    const obj: any = {};
    message.ownerAccountId !== undefined &&
      (obj.ownerAccountId = message.ownerAccountId ? SolanaAccountId.toJSON(message.ownerAccountId) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAssociatedPhoneNumberRequest>, I>>(
    object: I,
  ): GetAssociatedPhoneNumberRequest {
    const message = createBaseGetAssociatedPhoneNumberRequest();
    message.ownerAccountId = (object.ownerAccountId !== undefined && object.ownerAccountId !== null)
      ? SolanaAccountId.fromPartial(object.ownerAccountId)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    return message;
  },
};

function createBaseGetAssociatedPhoneNumberResponse(): GetAssociatedPhoneNumberResponse {
  return { result: 0, phoneNumber: undefined, isLinked: false };
}

export const GetAssociatedPhoneNumberResponse = {
  encode(message: GetAssociatedPhoneNumberResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    if (message.phoneNumber !== undefined) {
      PhoneNumber.encode(message.phoneNumber, writer.uint32(18).fork()).ldelim();
    }
    if (message.isLinked === true) {
      writer.uint32(24).bool(message.isLinked);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAssociatedPhoneNumberResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAssociatedPhoneNumberResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.phoneNumber = PhoneNumber.decode(reader, reader.uint32());
          break;
        case 3:
          message.isLinked = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAssociatedPhoneNumberResponse {
    return {
      result: isSet(object.result) ? getAssociatedPhoneNumberResponse_ResultFromJSON(object.result) : 0,
      phoneNumber: isSet(object.phoneNumber) ? PhoneNumber.fromJSON(object.phoneNumber) : undefined,
      isLinked: isSet(object.isLinked) ? Boolean(object.isLinked) : false,
    };
  },

  toJSON(message: GetAssociatedPhoneNumberResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getAssociatedPhoneNumberResponse_ResultToJSON(message.result));
    message.phoneNumber !== undefined &&
      (obj.phoneNumber = message.phoneNumber ? PhoneNumber.toJSON(message.phoneNumber) : undefined);
    message.isLinked !== undefined && (obj.isLinked = message.isLinked);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAssociatedPhoneNumberResponse>, I>>(
    object: I,
  ): GetAssociatedPhoneNumberResponse {
    const message = createBaseGetAssociatedPhoneNumberResponse();
    message.result = object.result ?? 0;
    message.phoneNumber = (object.phoneNumber !== undefined && object.phoneNumber !== null)
      ? PhoneNumber.fromPartial(object.phoneNumber)
      : undefined;
    message.isLinked = object.isLinked ?? false;
    return message;
  },
};

function createBaseVerificationCode(): VerificationCode {
  return { value: "" };
}

export const VerificationCode = {
  encode(message: VerificationCode, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerificationCode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerificationCode();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): VerificationCode {
    return { value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: VerificationCode): unknown {
    const obj: any = {};
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<VerificationCode>, I>>(object: I): VerificationCode {
    const message = createBaseVerificationCode();
    message.value = object.value ?? "";
    return message;
  },
};

function createBasePhoneLinkingToken(): PhoneLinkingToken {
  return { phoneNumber: undefined, code: undefined };
}

export const PhoneLinkingToken = {
  encode(message: PhoneLinkingToken, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.phoneNumber !== undefined) {
      PhoneNumber.encode(message.phoneNumber, writer.uint32(10).fork()).ldelim();
    }
    if (message.code !== undefined) {
      VerificationCode.encode(message.code, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PhoneLinkingToken {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePhoneLinkingToken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.phoneNumber = PhoneNumber.decode(reader, reader.uint32());
          break;
        case 2:
          message.code = VerificationCode.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PhoneLinkingToken {
    return {
      phoneNumber: isSet(object.phoneNumber) ? PhoneNumber.fromJSON(object.phoneNumber) : undefined,
      code: isSet(object.code) ? VerificationCode.fromJSON(object.code) : undefined,
    };
  },

  toJSON(message: PhoneLinkingToken): unknown {
    const obj: any = {};
    message.phoneNumber !== undefined &&
      (obj.phoneNumber = message.phoneNumber ? PhoneNumber.toJSON(message.phoneNumber) : undefined);
    message.code !== undefined && (obj.code = message.code ? VerificationCode.toJSON(message.code) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PhoneLinkingToken>, I>>(object: I): PhoneLinkingToken {
    const message = createBasePhoneLinkingToken();
    message.phoneNumber = (object.phoneNumber !== undefined && object.phoneNumber !== null)
      ? PhoneNumber.fromPartial(object.phoneNumber)
      : undefined;
    message.code = (object.code !== undefined && object.code !== null)
      ? VerificationCode.fromPartial(object.code)
      : undefined;
    return message;
  },
};

export type PhoneVerificationService = typeof PhoneVerificationService;
export const PhoneVerificationService = {
  /**
   * Sends a verification code to the provided phone number over SMS. If an
   * active verification is already taking place, the existing code will be
   * resent.
   */
  sendVerificationCode: {
    path: "/code.phone.v1.PhoneVerification/SendVerificationCode",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: SendVerificationCodeRequest) =>
      Buffer.from(SendVerificationCodeRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SendVerificationCodeRequest.decode(value),
    responseSerialize: (value: SendVerificationCodeResponse) =>
      Buffer.from(SendVerificationCodeResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => SendVerificationCodeResponse.decode(value),
  },
  /**
   * CheckVerificationCode validates a verification code. On success, a
   * one-time use token to link an owner account is provided.
   */
  checkVerificationCode: {
    path: "/code.phone.v1.PhoneVerification/CheckVerificationCode",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CheckVerificationCodeRequest) =>
      Buffer.from(CheckVerificationCodeRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CheckVerificationCodeRequest.decode(value),
    responseSerialize: (value: CheckVerificationCodeResponse) =>
      Buffer.from(CheckVerificationCodeResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CheckVerificationCodeResponse.decode(value),
  },
  /** Gets the latest verified phone number linked to an owner account. */
  getAssociatedPhoneNumber: {
    path: "/code.phone.v1.PhoneVerification/GetAssociatedPhoneNumber",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetAssociatedPhoneNumberRequest) =>
      Buffer.from(GetAssociatedPhoneNumberRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetAssociatedPhoneNumberRequest.decode(value),
    responseSerialize: (value: GetAssociatedPhoneNumberResponse) =>
      Buffer.from(GetAssociatedPhoneNumberResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetAssociatedPhoneNumberResponse.decode(value),
  },
} as const;

export interface PhoneVerificationServer extends UntypedServiceImplementation {
  /**
   * Sends a verification code to the provided phone number over SMS. If an
   * active verification is already taking place, the existing code will be
   * resent.
   */
  sendVerificationCode: handleUnaryCall<SendVerificationCodeRequest, SendVerificationCodeResponse>;
  /**
   * CheckVerificationCode validates a verification code. On success, a
   * one-time use token to link an owner account is provided.
   */
  checkVerificationCode: handleUnaryCall<CheckVerificationCodeRequest, CheckVerificationCodeResponse>;
  /** Gets the latest verified phone number linked to an owner account. */
  getAssociatedPhoneNumber: handleUnaryCall<GetAssociatedPhoneNumberRequest, GetAssociatedPhoneNumberResponse>;
}

export interface PhoneVerificationClient extends Client {
  /**
   * Sends a verification code to the provided phone number over SMS. If an
   * active verification is already taking place, the existing code will be
   * resent.
   */
  sendVerificationCode(
    request: SendVerificationCodeRequest,
    callback: (error: ServiceError | null, response: SendVerificationCodeResponse) => void,
  ): ClientUnaryCall;
  sendVerificationCode(
    request: SendVerificationCodeRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: SendVerificationCodeResponse) => void,
  ): ClientUnaryCall;
  sendVerificationCode(
    request: SendVerificationCodeRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: SendVerificationCodeResponse) => void,
  ): ClientUnaryCall;
  /**
   * CheckVerificationCode validates a verification code. On success, a
   * one-time use token to link an owner account is provided.
   */
  checkVerificationCode(
    request: CheckVerificationCodeRequest,
    callback: (error: ServiceError | null, response: CheckVerificationCodeResponse) => void,
  ): ClientUnaryCall;
  checkVerificationCode(
    request: CheckVerificationCodeRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CheckVerificationCodeResponse) => void,
  ): ClientUnaryCall;
  checkVerificationCode(
    request: CheckVerificationCodeRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CheckVerificationCodeResponse) => void,
  ): ClientUnaryCall;
  /** Gets the latest verified phone number linked to an owner account. */
  getAssociatedPhoneNumber(
    request: GetAssociatedPhoneNumberRequest,
    callback: (error: ServiceError | null, response: GetAssociatedPhoneNumberResponse) => void,
  ): ClientUnaryCall;
  getAssociatedPhoneNumber(
    request: GetAssociatedPhoneNumberRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetAssociatedPhoneNumberResponse) => void,
  ): ClientUnaryCall;
  getAssociatedPhoneNumber(
    request: GetAssociatedPhoneNumberRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetAssociatedPhoneNumberResponse) => void,
  ): ClientUnaryCall;
}

export const PhoneVerificationClient = makeGenericClientConstructor(
  PhoneVerificationService,
  "code.phone.v1.PhoneVerification",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): PhoneVerificationClient;
  service: typeof PhoneVerificationService;
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
