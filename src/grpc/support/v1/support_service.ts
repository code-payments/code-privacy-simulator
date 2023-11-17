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
import { Locale } from "../../common/v1/model";

export const protobufPackage = "code.support.v1";

export interface GetFAQsRequest {
  /**
   * The locale of the user requesting the FAQs.
   *
   * If a translation specific to the locale's region is available, it will be returned,
   * otherwise the service will fall back to a translation in the locale's language.
   */
  locale: Locale | undefined;
}

export interface GetFAQsResponse {
  result: GetFAQsResponse_Result;
  /**
   * If result == Result::OK, the returned FAQs are in the requested locale's language.
   * If result == Result::LANG_UNAVAILABLE, the returned FAQs are in English.
   */
  faqs: FAQ[];
}

export enum GetFAQsResponse_Result {
  OK = 0,
  /** LANG_UNAVAILABLE - FAQs for the requested language are currently unavailable. */
  LANG_UNAVAILABLE = 1,
  UNRECOGNIZED = -1,
}

export function getFAQsResponse_ResultFromJSON(object: any): GetFAQsResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetFAQsResponse_Result.OK;
    case 1:
    case "LANG_UNAVAILABLE":
      return GetFAQsResponse_Result.LANG_UNAVAILABLE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetFAQsResponse_Result.UNRECOGNIZED;
  }
}

export function getFAQsResponse_ResultToJSON(object: GetFAQsResponse_Result): string {
  switch (object) {
    case GetFAQsResponse_Result.OK:
      return "OK";
    case GetFAQsResponse_Result.LANG_UNAVAILABLE:
      return "LANG_UNAVAILABLE";
    case GetFAQsResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface FAQ {
  question: string;
  answer: string;
}

function createBaseGetFAQsRequest(): GetFAQsRequest {
  return { locale: undefined };
}

export const GetFAQsRequest = {
  encode(message: GetFAQsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.locale !== undefined) {
      Locale.encode(message.locale, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetFAQsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetFAQsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.locale = Locale.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetFAQsRequest {
    return { locale: isSet(object.locale) ? Locale.fromJSON(object.locale) : undefined };
  },

  toJSON(message: GetFAQsRequest): unknown {
    const obj: any = {};
    message.locale !== undefined && (obj.locale = message.locale ? Locale.toJSON(message.locale) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetFAQsRequest>, I>>(object: I): GetFAQsRequest {
    const message = createBaseGetFAQsRequest();
    message.locale = (object.locale !== undefined && object.locale !== null)
      ? Locale.fromPartial(object.locale)
      : undefined;
    return message;
  },
};

function createBaseGetFAQsResponse(): GetFAQsResponse {
  return { result: 0, faqs: [] };
}

export const GetFAQsResponse = {
  encode(message: GetFAQsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    for (const v of message.faqs) {
      FAQ.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetFAQsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetFAQsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.faqs.push(FAQ.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetFAQsResponse {
    return {
      result: isSet(object.result) ? getFAQsResponse_ResultFromJSON(object.result) : 0,
      faqs: Array.isArray(object?.faqs) ? object.faqs.map((e: any) => FAQ.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetFAQsResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getFAQsResponse_ResultToJSON(message.result));
    if (message.faqs) {
      obj.faqs = message.faqs.map((e) => e ? FAQ.toJSON(e) : undefined);
    } else {
      obj.faqs = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetFAQsResponse>, I>>(object: I): GetFAQsResponse {
    const message = createBaseGetFAQsResponse();
    message.result = object.result ?? 0;
    message.faqs = object.faqs?.map((e) => FAQ.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFAQ(): FAQ {
  return { question: "", answer: "" };
}

export const FAQ = {
  encode(message: FAQ, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.question !== "") {
      writer.uint32(10).string(message.question);
    }
    if (message.answer !== "") {
      writer.uint32(18).string(message.answer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FAQ {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFAQ();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.question = reader.string();
          break;
        case 2:
          message.answer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FAQ {
    return {
      question: isSet(object.question) ? String(object.question) : "",
      answer: isSet(object.answer) ? String(object.answer) : "",
    };
  },

  toJSON(message: FAQ): unknown {
    const obj: any = {};
    message.question !== undefined && (obj.question = message.question);
    message.answer !== undefined && (obj.answer = message.answer);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FAQ>, I>>(object: I): FAQ {
    const message = createBaseFAQ();
    message.question = object.question ?? "";
    message.answer = object.answer ?? "";
    return message;
  },
};

export type SupportService = typeof SupportService;
export const SupportService = {
  /** GetFAQs returns a list of frequently asked questions. */
  getFAQs: {
    path: "/code.support.v1.Support/GetFAQs",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetFAQsRequest) => Buffer.from(GetFAQsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetFAQsRequest.decode(value),
    responseSerialize: (value: GetFAQsResponse) => Buffer.from(GetFAQsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetFAQsResponse.decode(value),
  },
} as const;

export interface SupportServer extends UntypedServiceImplementation {
  /** GetFAQs returns a list of frequently asked questions. */
  getFAQs: handleUnaryCall<GetFAQsRequest, GetFAQsResponse>;
}

export interface SupportClient extends Client {
  /** GetFAQs returns a list of frequently asked questions. */
  getFAQs(
    request: GetFAQsRequest,
    callback: (error: ServiceError | null, response: GetFAQsResponse) => void,
  ): ClientUnaryCall;
  getFAQs(
    request: GetFAQsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetFAQsResponse) => void,
  ): ClientUnaryCall;
  getFAQs(
    request: GetFAQsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetFAQsResponse) => void,
  ): ClientUnaryCall;
}

export const SupportClient = makeGenericClientConstructor(SupportService, "code.support.v1.Support") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): SupportClient;
  service: typeof SupportService;
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
