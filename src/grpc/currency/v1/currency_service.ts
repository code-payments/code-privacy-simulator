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
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "code.currency.v1";

export interface GetRateRequest {
  /**
   * If timestamp is included, the returned rate will be the most recent available
   * exchange rate prior to the provided timestamp within the same day. If timestamp
   * is excluded, the current rate will be returned.
   */
  timestamp: Date | undefined;
}

export interface GetRateResponse {
  result: GetRateResponse_Result;
  /** The time of the exchange rate. */
  asOf:
    | Date
    | undefined;
  /** The price of 1 Kin in different currencies. Keyed on 3- or 4- letter lowercase currency code. */
  rates: { [key: string]: number };
}

export enum GetRateResponse_Result {
  OK = 0,
  /** MISSING_DATA - MISSING_DATA indicates no currency data is available for the requested timestamp. */
  MISSING_DATA = 1,
  UNRECOGNIZED = -1,
}

export function getRateResponse_ResultFromJSON(object: any): GetRateResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetRateResponse_Result.OK;
    case 1:
    case "MISSING_DATA":
      return GetRateResponse_Result.MISSING_DATA;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetRateResponse_Result.UNRECOGNIZED;
  }
}

export function getRateResponse_ResultToJSON(object: GetRateResponse_Result): string {
  switch (object) {
    case GetRateResponse_Result.OK:
      return "OK";
    case GetRateResponse_Result.MISSING_DATA:
      return "MISSING_DATA";
    case GetRateResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetRateResponse_RatesEntry {
  key: string;
  value: number;
}

export interface GetAllRatesRequest {
  /**
   * If timestamp is included, the returned rate will be the most recent available
   * exchange rate prior to the provided timestamp within the same day. If timestamp
   * is excluded, the current rate will be returned.
   */
  timestamp: Date | undefined;
}

export interface GetAllRatesResponse {
  result: GetAllRatesResponse_Result;
  /** The time of the exchange rate. */
  asOf:
    | Date
    | undefined;
  /** The price of 1 Kin in different currencies. Keyed on 3- or 4- letter lowercase currency code. */
  rates: { [key: string]: number };
}

export enum GetAllRatesResponse_Result {
  OK = 0,
  /** MISSING_DATA - MISSING_DATA indicates no currency data is available for the requested timestamp. */
  MISSING_DATA = 1,
  UNRECOGNIZED = -1,
}

export function getAllRatesResponse_ResultFromJSON(object: any): GetAllRatesResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetAllRatesResponse_Result.OK;
    case 1:
    case "MISSING_DATA":
      return GetAllRatesResponse_Result.MISSING_DATA;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetAllRatesResponse_Result.UNRECOGNIZED;
  }
}

export function getAllRatesResponse_ResultToJSON(object: GetAllRatesResponse_Result): string {
  switch (object) {
    case GetAllRatesResponse_Result.OK:
      return "OK";
    case GetAllRatesResponse_Result.MISSING_DATA:
      return "MISSING_DATA";
    case GetAllRatesResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetAllRatesResponse_RatesEntry {
  key: string;
  value: number;
}

export interface GetExchangeRateHistoryRequest {
  /** ISO 4217 alpha-3 currency code (example: 'USD'). */
  forSymbol: string;
  /**
   * The frequency of the samples in the data returned. The data will be
   * sampled into buckets if the underlying currency exchange
   * data is available for the range requested. If missing, there
   * could be gaps in the response.
   *
   * NOTE: the first record returned will be the current exchange rate and may not
   * align with the frequency selected.
   */
  interval: GetExchangeRateHistoryRequest_Interval;
  /** From timestamp (inclusive, in the past) */
  start:
    | Date
    | undefined;
  /**
   * Until timestamp (optional but must be in the future relative to the start
   * timestamp. If not provided the server  will default to "now")
   */
  end: Date | undefined;
}

export enum GetExchangeRateHistoryRequest_Interval {
  /** INTERVAL_RAW - Get the raw data stored by the database */
  INTERVAL_RAW = 0,
  /** INTERVAL_HOUR - Get hourly buckets of data (if it exists) */
  INTERVAL_HOUR = 1,
  /** INTERVAL_DAY - Get daily buckets of data (if it exists) */
  INTERVAL_DAY = 2,
  /** INTERVAL_WEEK - Get weekly buckets of data (if it exists) */
  INTERVAL_WEEK = 3,
  /** INTERVAL_MONTH - Get monthly buckets of data (if it exists) */
  INTERVAL_MONTH = 4,
  UNRECOGNIZED = -1,
}

export function getExchangeRateHistoryRequest_IntervalFromJSON(object: any): GetExchangeRateHistoryRequest_Interval {
  switch (object) {
    case 0:
    case "INTERVAL_RAW":
      return GetExchangeRateHistoryRequest_Interval.INTERVAL_RAW;
    case 1:
    case "INTERVAL_HOUR":
      return GetExchangeRateHistoryRequest_Interval.INTERVAL_HOUR;
    case 2:
    case "INTERVAL_DAY":
      return GetExchangeRateHistoryRequest_Interval.INTERVAL_DAY;
    case 3:
    case "INTERVAL_WEEK":
      return GetExchangeRateHistoryRequest_Interval.INTERVAL_WEEK;
    case 4:
    case "INTERVAL_MONTH":
      return GetExchangeRateHistoryRequest_Interval.INTERVAL_MONTH;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetExchangeRateHistoryRequest_Interval.UNRECOGNIZED;
  }
}

export function getExchangeRateHistoryRequest_IntervalToJSON(object: GetExchangeRateHistoryRequest_Interval): string {
  switch (object) {
    case GetExchangeRateHistoryRequest_Interval.INTERVAL_RAW:
      return "INTERVAL_RAW";
    case GetExchangeRateHistoryRequest_Interval.INTERVAL_HOUR:
      return "INTERVAL_HOUR";
    case GetExchangeRateHistoryRequest_Interval.INTERVAL_DAY:
      return "INTERVAL_DAY";
    case GetExchangeRateHistoryRequest_Interval.INTERVAL_WEEK:
      return "INTERVAL_WEEK";
    case GetExchangeRateHistoryRequest_Interval.INTERVAL_MONTH:
      return "INTERVAL_MONTH";
    case GetExchangeRateHistoryRequest_Interval.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetExchangeRateHistoryResponse {
  result: GetExchangeRateHistoryResponse_Result;
  items: ExchangeRate[];
}

export enum GetExchangeRateHistoryResponse_Result {
  OK = 0,
  NOT_FOUND = 1,
  UNRECOGNIZED = -1,
}

export function getExchangeRateHistoryResponse_ResultFromJSON(object: any): GetExchangeRateHistoryResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetExchangeRateHistoryResponse_Result.OK;
    case 1:
    case "NOT_FOUND":
      return GetExchangeRateHistoryResponse_Result.NOT_FOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetExchangeRateHistoryResponse_Result.UNRECOGNIZED;
  }
}

export function getExchangeRateHistoryResponse_ResultToJSON(object: GetExchangeRateHistoryResponse_Result): string {
  switch (object) {
    case GetExchangeRateHistoryResponse_Result.OK:
      return "OK";
    case GetExchangeRateHistoryResponse_Result.NOT_FOUND:
      return "NOT_FOUND";
    case GetExchangeRateHistoryResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ExchangeRate {
  /** Rate of the currency in the base currency */
  rate: number;
  /** The time for the exchange rate */
  time: Date | undefined;
}

function createBaseGetRateRequest(): GetRateRequest {
  return { timestamp: undefined };
}

export const GetRateRequest = {
  encode(message: GetRateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRateRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRateRequest {
    return { timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined };
  },

  toJSON(message: GetRateRequest): unknown {
    const obj: any = {};
    message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetRateRequest>, I>>(object: I): GetRateRequest {
    const message = createBaseGetRateRequest();
    message.timestamp = object.timestamp ?? undefined;
    return message;
  },
};

function createBaseGetRateResponse(): GetRateResponse {
  return { result: 0, asOf: undefined, rates: {} };
}

export const GetRateResponse = {
  encode(message: GetRateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    if (message.asOf !== undefined) {
      Timestamp.encode(toTimestamp(message.asOf), writer.uint32(18).fork()).ldelim();
    }
    Object.entries(message.rates).forEach(([key, value]) => {
      GetRateResponse_RatesEntry.encode({ key: key as any, value }, writer.uint32(26).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.asOf = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          const entry3 = GetRateResponse_RatesEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.rates[entry3.key] = entry3.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRateResponse {
    return {
      result: isSet(object.result) ? getRateResponse_ResultFromJSON(object.result) : 0,
      asOf: isSet(object.asOf) ? fromJsonTimestamp(object.asOf) : undefined,
      rates: isObject(object.rates)
        ? Object.entries(object.rates).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: GetRateResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getRateResponse_ResultToJSON(message.result));
    message.asOf !== undefined && (obj.asOf = message.asOf.toISOString());
    obj.rates = {};
    if (message.rates) {
      Object.entries(message.rates).forEach(([k, v]) => {
        obj.rates[k] = v;
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetRateResponse>, I>>(object: I): GetRateResponse {
    const message = createBaseGetRateResponse();
    message.result = object.result ?? 0;
    message.asOf = object.asOf ?? undefined;
    message.rates = Object.entries(object.rates ?? {}).reduce<{ [key: string]: number }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Number(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseGetRateResponse_RatesEntry(): GetRateResponse_RatesEntry {
  return { key: "", value: 0 };
}

export const GetRateResponse_RatesEntry = {
  encode(message: GetRateResponse_RatesEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(17).double(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRateResponse_RatesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRateResponse_RatesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRateResponse_RatesEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
  },

  toJSON(message: GetRateResponse_RatesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetRateResponse_RatesEntry>, I>>(object: I): GetRateResponse_RatesEntry {
    const message = createBaseGetRateResponse_RatesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

function createBaseGetAllRatesRequest(): GetAllRatesRequest {
  return { timestamp: undefined };
}

export const GetAllRatesRequest = {
  encode(message: GetAllRatesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.timestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.timestamp), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllRatesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllRatesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.timestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAllRatesRequest {
    return { timestamp: isSet(object.timestamp) ? fromJsonTimestamp(object.timestamp) : undefined };
  },

  toJSON(message: GetAllRatesRequest): unknown {
    const obj: any = {};
    message.timestamp !== undefined && (obj.timestamp = message.timestamp.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAllRatesRequest>, I>>(object: I): GetAllRatesRequest {
    const message = createBaseGetAllRatesRequest();
    message.timestamp = object.timestamp ?? undefined;
    return message;
  },
};

function createBaseGetAllRatesResponse(): GetAllRatesResponse {
  return { result: 0, asOf: undefined, rates: {} };
}

export const GetAllRatesResponse = {
  encode(message: GetAllRatesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    if (message.asOf !== undefined) {
      Timestamp.encode(toTimestamp(message.asOf), writer.uint32(18).fork()).ldelim();
    }
    Object.entries(message.rates).forEach(([key, value]) => {
      GetAllRatesResponse_RatesEntry.encode({ key: key as any, value }, writer.uint32(26).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllRatesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllRatesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.asOf = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          const entry3 = GetAllRatesResponse_RatesEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.rates[entry3.key] = entry3.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAllRatesResponse {
    return {
      result: isSet(object.result) ? getAllRatesResponse_ResultFromJSON(object.result) : 0,
      asOf: isSet(object.asOf) ? fromJsonTimestamp(object.asOf) : undefined,
      rates: isObject(object.rates)
        ? Object.entries(object.rates).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: GetAllRatesResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getAllRatesResponse_ResultToJSON(message.result));
    message.asOf !== undefined && (obj.asOf = message.asOf.toISOString());
    obj.rates = {};
    if (message.rates) {
      Object.entries(message.rates).forEach(([k, v]) => {
        obj.rates[k] = v;
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAllRatesResponse>, I>>(object: I): GetAllRatesResponse {
    const message = createBaseGetAllRatesResponse();
    message.result = object.result ?? 0;
    message.asOf = object.asOf ?? undefined;
    message.rates = Object.entries(object.rates ?? {}).reduce<{ [key: string]: number }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Number(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseGetAllRatesResponse_RatesEntry(): GetAllRatesResponse_RatesEntry {
  return { key: "", value: 0 };
}

export const GetAllRatesResponse_RatesEntry = {
  encode(message: GetAllRatesResponse_RatesEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(17).double(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllRatesResponse_RatesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllRatesResponse_RatesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAllRatesResponse_RatesEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
  },

  toJSON(message: GetAllRatesResponse_RatesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAllRatesResponse_RatesEntry>, I>>(
    object: I,
  ): GetAllRatesResponse_RatesEntry {
    const message = createBaseGetAllRatesResponse_RatesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

function createBaseGetExchangeRateHistoryRequest(): GetExchangeRateHistoryRequest {
  return { forSymbol: "", interval: 0, start: undefined, end: undefined };
}

export const GetExchangeRateHistoryRequest = {
  encode(message: GetExchangeRateHistoryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.forSymbol !== "") {
      writer.uint32(42).string(message.forSymbol);
    }
    if (message.interval !== 0) {
      writer.uint32(16).int32(message.interval);
    }
    if (message.start !== undefined) {
      Timestamp.encode(toTimestamp(message.start), writer.uint32(26).fork()).ldelim();
    }
    if (message.end !== undefined) {
      Timestamp.encode(toTimestamp(message.end), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetExchangeRateHistoryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetExchangeRateHistoryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 5:
          message.forSymbol = reader.string();
          break;
        case 2:
          message.interval = reader.int32() as any;
          break;
        case 3:
          message.start = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 4:
          message.end = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetExchangeRateHistoryRequest {
    return {
      forSymbol: isSet(object.forSymbol) ? String(object.forSymbol) : "",
      interval: isSet(object.interval) ? getExchangeRateHistoryRequest_IntervalFromJSON(object.interval) : 0,
      start: isSet(object.start) ? fromJsonTimestamp(object.start) : undefined,
      end: isSet(object.end) ? fromJsonTimestamp(object.end) : undefined,
    };
  },

  toJSON(message: GetExchangeRateHistoryRequest): unknown {
    const obj: any = {};
    message.forSymbol !== undefined && (obj.forSymbol = message.forSymbol);
    message.interval !== undefined && (obj.interval = getExchangeRateHistoryRequest_IntervalToJSON(message.interval));
    message.start !== undefined && (obj.start = message.start.toISOString());
    message.end !== undefined && (obj.end = message.end.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetExchangeRateHistoryRequest>, I>>(
    object: I,
  ): GetExchangeRateHistoryRequest {
    const message = createBaseGetExchangeRateHistoryRequest();
    message.forSymbol = object.forSymbol ?? "";
    message.interval = object.interval ?? 0;
    message.start = object.start ?? undefined;
    message.end = object.end ?? undefined;
    return message;
  },
};

function createBaseGetExchangeRateHistoryResponse(): GetExchangeRateHistoryResponse {
  return { result: 0, items: [] };
}

export const GetExchangeRateHistoryResponse = {
  encode(message: GetExchangeRateHistoryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    for (const v of message.items) {
      ExchangeRate.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetExchangeRateHistoryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetExchangeRateHistoryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.items.push(ExchangeRate.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetExchangeRateHistoryResponse {
    return {
      result: isSet(object.result) ? getExchangeRateHistoryResponse_ResultFromJSON(object.result) : 0,
      items: Array.isArray(object?.items) ? object.items.map((e: any) => ExchangeRate.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetExchangeRateHistoryResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getExchangeRateHistoryResponse_ResultToJSON(message.result));
    if (message.items) {
      obj.items = message.items.map((e) => e ? ExchangeRate.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetExchangeRateHistoryResponse>, I>>(
    object: I,
  ): GetExchangeRateHistoryResponse {
    const message = createBaseGetExchangeRateHistoryResponse();
    message.result = object.result ?? 0;
    message.items = object.items?.map((e) => ExchangeRate.fromPartial(e)) || [];
    return message;
  },
};

function createBaseExchangeRate(): ExchangeRate {
  return { rate: 0, time: undefined };
}

export const ExchangeRate = {
  encode(message: ExchangeRate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rate !== 0) {
      writer.uint32(17).double(message.rate);
    }
    if (message.time !== undefined) {
      Timestamp.encode(toTimestamp(message.time), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExchangeRate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExchangeRate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.rate = reader.double();
          break;
        case 1:
          message.time = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ExchangeRate {
    return {
      rate: isSet(object.rate) ? Number(object.rate) : 0,
      time: isSet(object.time) ? fromJsonTimestamp(object.time) : undefined,
    };
  },

  toJSON(message: ExchangeRate): unknown {
    const obj: any = {};
    message.rate !== undefined && (obj.rate = message.rate);
    message.time !== undefined && (obj.time = message.time.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ExchangeRate>, I>>(object: I): ExchangeRate {
    const message = createBaseExchangeRate();
    message.rate = object.rate ?? 0;
    message.time = object.time ?? undefined;
    return message;
  },
};

export type CurrencyService = typeof CurrencyService;
export const CurrencyService = {
  /**
   * GetRate returns the exchange rate for Kin.
   *
   * Note: The current implementation of GetRate is deprecated and GetAllRates
   *       should be used in its place. In the future, this will fetch a single
   *       rate.
   */
  getRate: {
    path: "/code.currency.v1.Currency/GetRate",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetRateRequest) => Buffer.from(GetRateRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetRateRequest.decode(value),
    responseSerialize: (value: GetRateResponse) => Buffer.from(GetRateResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetRateResponse.decode(value),
  },
  /** GetRate returns the exchange rates for Kin against all available currencies. */
  getAllRates: {
    path: "/code.currency.v1.Currency/GetAllRates",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetAllRatesRequest) => Buffer.from(GetAllRatesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetAllRatesRequest.decode(value),
    responseSerialize: (value: GetAllRatesResponse) => Buffer.from(GetAllRatesResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetAllRatesResponse.decode(value),
  },
  /**
   * GetExchangeRateHistory returns the exchange rate for Kin given a time
   * range, bucketing interval, and currency.
   */
  getExchangeRateHistory: {
    path: "/code.currency.v1.Currency/GetExchangeRateHistory",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetExchangeRateHistoryRequest) =>
      Buffer.from(GetExchangeRateHistoryRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetExchangeRateHistoryRequest.decode(value),
    responseSerialize: (value: GetExchangeRateHistoryResponse) =>
      Buffer.from(GetExchangeRateHistoryResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetExchangeRateHistoryResponse.decode(value),
  },
} as const;

export interface CurrencyServer extends UntypedServiceImplementation {
  /**
   * GetRate returns the exchange rate for Kin.
   *
   * Note: The current implementation of GetRate is deprecated and GetAllRates
   *       should be used in its place. In the future, this will fetch a single
   *       rate.
   */
  getRate: handleUnaryCall<GetRateRequest, GetRateResponse>;
  /** GetRate returns the exchange rates for Kin against all available currencies. */
  getAllRates: handleUnaryCall<GetAllRatesRequest, GetAllRatesResponse>;
  /**
   * GetExchangeRateHistory returns the exchange rate for Kin given a time
   * range, bucketing interval, and currency.
   */
  getExchangeRateHistory: handleUnaryCall<GetExchangeRateHistoryRequest, GetExchangeRateHistoryResponse>;
}

export interface CurrencyClient extends Client {
  /**
   * GetRate returns the exchange rate for Kin.
   *
   * Note: The current implementation of GetRate is deprecated and GetAllRates
   *       should be used in its place. In the future, this will fetch a single
   *       rate.
   */
  getRate(
    request: GetRateRequest,
    callback: (error: ServiceError | null, response: GetRateResponse) => void,
  ): ClientUnaryCall;
  getRate(
    request: GetRateRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetRateResponse) => void,
  ): ClientUnaryCall;
  getRate(
    request: GetRateRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetRateResponse) => void,
  ): ClientUnaryCall;
  /** GetRate returns the exchange rates for Kin against all available currencies. */
  getAllRates(
    request: GetAllRatesRequest,
    callback: (error: ServiceError | null, response: GetAllRatesResponse) => void,
  ): ClientUnaryCall;
  getAllRates(
    request: GetAllRatesRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetAllRatesResponse) => void,
  ): ClientUnaryCall;
  getAllRates(
    request: GetAllRatesRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetAllRatesResponse) => void,
  ): ClientUnaryCall;
  /**
   * GetExchangeRateHistory returns the exchange rate for Kin given a time
   * range, bucketing interval, and currency.
   */
  getExchangeRateHistory(
    request: GetExchangeRateHistoryRequest,
    callback: (error: ServiceError | null, response: GetExchangeRateHistoryResponse) => void,
  ): ClientUnaryCall;
  getExchangeRateHistory(
    request: GetExchangeRateHistoryRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetExchangeRateHistoryResponse) => void,
  ): ClientUnaryCall;
  getExchangeRateHistory(
    request: GetExchangeRateHistoryRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetExchangeRateHistoryResponse) => void,
  ): ClientUnaryCall;
}

export const CurrencyClient = makeGenericClientConstructor(CurrencyService, "code.currency.v1.Currency") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): CurrencyClient;
  service: typeof CurrencyService;
};

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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
