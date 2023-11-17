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
import { DataContainerId, PhoneNumber, Signature, SolanaAccountId } from "../../common/v1/model";

export const protobufPackage = "code.contact.v1";

export interface AddContactsRequest {
  /** The public key of the owner account that signed this request message. */
  ownerAccountId:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(AddContactsRequest) without this field set
   * using the private key of owner_account_id. This provides an authentication
   * mechanism to the RPC.
   */
  signature:
    | Signature
    | undefined;
  /** The data container for the copy of the contact list being added to. */
  containerId:
    | DataContainerId
    | undefined;
  /** The set of contacts to add to the contact list */
  contacts: PhoneNumber[];
}

export interface AddContactsResponse {
  result: AddContactsResponse_Result;
  /**
   * The contacts' current status keyed by phone number. This is an optimization
   * so that clients can populate initial state without needing an extra network
   * call.
   */
  contactStatus: { [key: string]: ContactStatus };
}

export enum AddContactsResponse_Result {
  OK = 0,
  UNRECOGNIZED = -1,
}

export function addContactsResponse_ResultFromJSON(object: any): AddContactsResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return AddContactsResponse_Result.OK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AddContactsResponse_Result.UNRECOGNIZED;
  }
}

export function addContactsResponse_ResultToJSON(object: AddContactsResponse_Result): string {
  switch (object) {
    case AddContactsResponse_Result.OK:
      return "OK";
    case AddContactsResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface AddContactsResponse_ContactStatusEntry {
  key: string;
  value: ContactStatus | undefined;
}

export interface RemoveContactsRequest {
  /** The public key of the owner account that signed this request message. */
  ownerAccountId:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(RemoveContactsRequest) without this field
   * set using the private key of owner_account_id. This provides an
   * authentication mechanism to the RPC.
   */
  signature:
    | Signature
    | undefined;
  /** The data container for the copy of the contact list being removed from. */
  containerId:
    | DataContainerId
    | undefined;
  /** The set of contacts to remove from the contact list */
  contacts: PhoneNumber[];
}

export interface RemoveContactsResponse {
  result: RemoveContactsResponse_Result;
}

export enum RemoveContactsResponse_Result {
  OK = 0,
  UNRECOGNIZED = -1,
}

export function removeContactsResponse_ResultFromJSON(object: any): RemoveContactsResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return RemoveContactsResponse_Result.OK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RemoveContactsResponse_Result.UNRECOGNIZED;
  }
}

export function removeContactsResponse_ResultToJSON(object: RemoveContactsResponse_Result): string {
  switch (object) {
    case RemoveContactsResponse_Result.OK:
      return "OK";
    case RemoveContactsResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface GetContactsRequest {
  /** The public key of the owner account that signed this request message. */
  ownerAccountId:
    | SolanaAccountId
    | undefined;
  /**
   * The signature is of serialize(GetContactsRequest) without this field set
   * using the private key of owner_account_id. This provides an authentication
   * mechanism to the RPC.
   */
  signature:
    | Signature
    | undefined;
  /** The data container for the copy of the contact list being fetched. */
  containerId:
    | DataContainerId
    | undefined;
  /**
   * The page token, which is retreived from a previous response, to get the next
   * set of contacts. The first page is returned when not set.
   */
  pageToken:
    | PageToken
    | undefined;
  /**
   * Filter out contacts that have an association with Code. This includes users
   * that have both been invited and registered with the app.
   */
  includeOnlyInAppContacts: boolean;
}

export interface GetContactsResponse {
  result: GetContactsResponse_Result;
  /** A page of contacts */
  contacts: Contact[];
  /**
   * The page token to include in a subsequent request to get the next set of
   * contacts. This will not be set for the last response in the list of
   * pages.
   */
  nextPageToken: PageToken | undefined;
}

export enum GetContactsResponse_Result {
  OK = 0,
  UNRECOGNIZED = -1,
}

export function getContactsResponse_ResultFromJSON(object: any): GetContactsResponse_Result {
  switch (object) {
    case 0:
    case "OK":
      return GetContactsResponse_Result.OK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GetContactsResponse_Result.UNRECOGNIZED;
  }
}

export function getContactsResponse_ResultToJSON(object: GetContactsResponse_Result): string {
  switch (object) {
    case GetContactsResponse_Result.OK:
      return "OK";
    case GetContactsResponse_Result.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Contact {
  /** The contact's phone number */
  phoneNumber:
    | PhoneNumber
    | undefined;
  /** The contact's current status */
  status: ContactStatus | undefined;
}

export interface ContactStatus {
  /**
   * Flag to indicate whether a user has registered with Code and used the app
   * at least once.
   */
  isRegistered: boolean;
  /**
   * Flag to indicate whether a user has been invited to Code.
   *
   * todo: This field will be deprecated after the invite phase is complete.
   */
  isInvited: boolean;
  /**
   * Flag to indicate whether a user's invitation to Code has been revoked.
   *
   * todo: This field will be deprecated after the invite phase is complete.
   */
  isInviteRevoked: boolean;
}

export interface PageToken {
  value: Buffer;
}

function createBaseAddContactsRequest(): AddContactsRequest {
  return { ownerAccountId: undefined, signature: undefined, containerId: undefined, contacts: [] };
}

export const AddContactsRequest = {
  encode(message: AddContactsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerAccountId !== undefined) {
      SolanaAccountId.encode(message.ownerAccountId, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    if (message.containerId !== undefined) {
      DataContainerId.encode(message.containerId, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.contacts) {
      PhoneNumber.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddContactsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddContactsRequest();
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
          message.contacts.push(PhoneNumber.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddContactsRequest {
    return {
      ownerAccountId: isSet(object.ownerAccountId) ? SolanaAccountId.fromJSON(object.ownerAccountId) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
      containerId: isSet(object.containerId) ? DataContainerId.fromJSON(object.containerId) : undefined,
      contacts: Array.isArray(object?.contacts) ? object.contacts.map((e: any) => PhoneNumber.fromJSON(e)) : [],
    };
  },

  toJSON(message: AddContactsRequest): unknown {
    const obj: any = {};
    message.ownerAccountId !== undefined &&
      (obj.ownerAccountId = message.ownerAccountId ? SolanaAccountId.toJSON(message.ownerAccountId) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    message.containerId !== undefined &&
      (obj.containerId = message.containerId ? DataContainerId.toJSON(message.containerId) : undefined);
    if (message.contacts) {
      obj.contacts = message.contacts.map((e) => e ? PhoneNumber.toJSON(e) : undefined);
    } else {
      obj.contacts = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddContactsRequest>, I>>(object: I): AddContactsRequest {
    const message = createBaseAddContactsRequest();
    message.ownerAccountId = (object.ownerAccountId !== undefined && object.ownerAccountId !== null)
      ? SolanaAccountId.fromPartial(object.ownerAccountId)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    message.containerId = (object.containerId !== undefined && object.containerId !== null)
      ? DataContainerId.fromPartial(object.containerId)
      : undefined;
    message.contacts = object.contacts?.map((e) => PhoneNumber.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAddContactsResponse(): AddContactsResponse {
  return { result: 0, contactStatus: {} };
}

export const AddContactsResponse = {
  encode(message: AddContactsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    Object.entries(message.contactStatus).forEach(([key, value]) => {
      AddContactsResponse_ContactStatusEntry.encode({ key: key as any, value }, writer.uint32(18).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddContactsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddContactsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          const entry2 = AddContactsResponse_ContactStatusEntry.decode(reader, reader.uint32());
          if (entry2.value !== undefined) {
            message.contactStatus[entry2.key] = entry2.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddContactsResponse {
    return {
      result: isSet(object.result) ? addContactsResponse_ResultFromJSON(object.result) : 0,
      contactStatus: isObject(object.contactStatus)
        ? Object.entries(object.contactStatus).reduce<{ [key: string]: ContactStatus }>((acc, [key, value]) => {
          acc[key] = ContactStatus.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: AddContactsResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = addContactsResponse_ResultToJSON(message.result));
    obj.contactStatus = {};
    if (message.contactStatus) {
      Object.entries(message.contactStatus).forEach(([k, v]) => {
        obj.contactStatus[k] = ContactStatus.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddContactsResponse>, I>>(object: I): AddContactsResponse {
    const message = createBaseAddContactsResponse();
    message.result = object.result ?? 0;
    message.contactStatus = Object.entries(object.contactStatus ?? {}).reduce<{ [key: string]: ContactStatus }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = ContactStatus.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseAddContactsResponse_ContactStatusEntry(): AddContactsResponse_ContactStatusEntry {
  return { key: "", value: undefined };
}

export const AddContactsResponse_ContactStatusEntry = {
  encode(message: AddContactsResponse_ContactStatusEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      ContactStatus.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddContactsResponse_ContactStatusEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddContactsResponse_ContactStatusEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = ContactStatus.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddContactsResponse_ContactStatusEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? ContactStatus.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: AddContactsResponse_ContactStatusEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value ? ContactStatus.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddContactsResponse_ContactStatusEntry>, I>>(
    object: I,
  ): AddContactsResponse_ContactStatusEntry {
    const message = createBaseAddContactsResponse_ContactStatusEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? ContactStatus.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseRemoveContactsRequest(): RemoveContactsRequest {
  return { ownerAccountId: undefined, signature: undefined, containerId: undefined, contacts: [] };
}

export const RemoveContactsRequest = {
  encode(message: RemoveContactsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerAccountId !== undefined) {
      SolanaAccountId.encode(message.ownerAccountId, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    if (message.containerId !== undefined) {
      DataContainerId.encode(message.containerId, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.contacts) {
      PhoneNumber.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveContactsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveContactsRequest();
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
          message.contacts.push(PhoneNumber.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveContactsRequest {
    return {
      ownerAccountId: isSet(object.ownerAccountId) ? SolanaAccountId.fromJSON(object.ownerAccountId) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
      containerId: isSet(object.containerId) ? DataContainerId.fromJSON(object.containerId) : undefined,
      contacts: Array.isArray(object?.contacts) ? object.contacts.map((e: any) => PhoneNumber.fromJSON(e)) : [],
    };
  },

  toJSON(message: RemoveContactsRequest): unknown {
    const obj: any = {};
    message.ownerAccountId !== undefined &&
      (obj.ownerAccountId = message.ownerAccountId ? SolanaAccountId.toJSON(message.ownerAccountId) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    message.containerId !== undefined &&
      (obj.containerId = message.containerId ? DataContainerId.toJSON(message.containerId) : undefined);
    if (message.contacts) {
      obj.contacts = message.contacts.map((e) => e ? PhoneNumber.toJSON(e) : undefined);
    } else {
      obj.contacts = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveContactsRequest>, I>>(object: I): RemoveContactsRequest {
    const message = createBaseRemoveContactsRequest();
    message.ownerAccountId = (object.ownerAccountId !== undefined && object.ownerAccountId !== null)
      ? SolanaAccountId.fromPartial(object.ownerAccountId)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    message.containerId = (object.containerId !== undefined && object.containerId !== null)
      ? DataContainerId.fromPartial(object.containerId)
      : undefined;
    message.contacts = object.contacts?.map((e) => PhoneNumber.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRemoveContactsResponse(): RemoveContactsResponse {
  return { result: 0 };
}

export const RemoveContactsResponse = {
  encode(message: RemoveContactsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RemoveContactsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveContactsResponse();
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

  fromJSON(object: any): RemoveContactsResponse {
    return { result: isSet(object.result) ? removeContactsResponse_ResultFromJSON(object.result) : 0 };
  },

  toJSON(message: RemoveContactsResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = removeContactsResponse_ResultToJSON(message.result));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveContactsResponse>, I>>(object: I): RemoveContactsResponse {
    const message = createBaseRemoveContactsResponse();
    message.result = object.result ?? 0;
    return message;
  },
};

function createBaseGetContactsRequest(): GetContactsRequest {
  return {
    ownerAccountId: undefined,
    signature: undefined,
    containerId: undefined,
    pageToken: undefined,
    includeOnlyInAppContacts: false,
  };
}

export const GetContactsRequest = {
  encode(message: GetContactsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ownerAccountId !== undefined) {
      SolanaAccountId.encode(message.ownerAccountId, writer.uint32(10).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      Signature.encode(message.signature, writer.uint32(18).fork()).ldelim();
    }
    if (message.containerId !== undefined) {
      DataContainerId.encode(message.containerId, writer.uint32(26).fork()).ldelim();
    }
    if (message.pageToken !== undefined) {
      PageToken.encode(message.pageToken, writer.uint32(34).fork()).ldelim();
    }
    if (message.includeOnlyInAppContacts === true) {
      writer.uint32(40).bool(message.includeOnlyInAppContacts);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetContactsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetContactsRequest();
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
          message.pageToken = PageToken.decode(reader, reader.uint32());
          break;
        case 5:
          message.includeOnlyInAppContacts = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetContactsRequest {
    return {
      ownerAccountId: isSet(object.ownerAccountId) ? SolanaAccountId.fromJSON(object.ownerAccountId) : undefined,
      signature: isSet(object.signature) ? Signature.fromJSON(object.signature) : undefined,
      containerId: isSet(object.containerId) ? DataContainerId.fromJSON(object.containerId) : undefined,
      pageToken: isSet(object.pageToken) ? PageToken.fromJSON(object.pageToken) : undefined,
      includeOnlyInAppContacts: isSet(object.includeOnlyInAppContacts)
        ? Boolean(object.includeOnlyInAppContacts)
        : false,
    };
  },

  toJSON(message: GetContactsRequest): unknown {
    const obj: any = {};
    message.ownerAccountId !== undefined &&
      (obj.ownerAccountId = message.ownerAccountId ? SolanaAccountId.toJSON(message.ownerAccountId) : undefined);
    message.signature !== undefined &&
      (obj.signature = message.signature ? Signature.toJSON(message.signature) : undefined);
    message.containerId !== undefined &&
      (obj.containerId = message.containerId ? DataContainerId.toJSON(message.containerId) : undefined);
    message.pageToken !== undefined &&
      (obj.pageToken = message.pageToken ? PageToken.toJSON(message.pageToken) : undefined);
    message.includeOnlyInAppContacts !== undefined && (obj.includeOnlyInAppContacts = message.includeOnlyInAppContacts);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetContactsRequest>, I>>(object: I): GetContactsRequest {
    const message = createBaseGetContactsRequest();
    message.ownerAccountId = (object.ownerAccountId !== undefined && object.ownerAccountId !== null)
      ? SolanaAccountId.fromPartial(object.ownerAccountId)
      : undefined;
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? Signature.fromPartial(object.signature)
      : undefined;
    message.containerId = (object.containerId !== undefined && object.containerId !== null)
      ? DataContainerId.fromPartial(object.containerId)
      : undefined;
    message.pageToken = (object.pageToken !== undefined && object.pageToken !== null)
      ? PageToken.fromPartial(object.pageToken)
      : undefined;
    message.includeOnlyInAppContacts = object.includeOnlyInAppContacts ?? false;
    return message;
  },
};

function createBaseGetContactsResponse(): GetContactsResponse {
  return { result: 0, contacts: [], nextPageToken: undefined };
}

export const GetContactsResponse = {
  encode(message: GetContactsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.result !== 0) {
      writer.uint32(8).int32(message.result);
    }
    for (const v of message.contacts) {
      Contact.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.nextPageToken !== undefined) {
      PageToken.encode(message.nextPageToken, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetContactsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetContactsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = reader.int32() as any;
          break;
        case 2:
          message.contacts.push(Contact.decode(reader, reader.uint32()));
          break;
        case 3:
          message.nextPageToken = PageToken.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetContactsResponse {
    return {
      result: isSet(object.result) ? getContactsResponse_ResultFromJSON(object.result) : 0,
      contacts: Array.isArray(object?.contacts) ? object.contacts.map((e: any) => Contact.fromJSON(e)) : [],
      nextPageToken: isSet(object.nextPageToken) ? PageToken.fromJSON(object.nextPageToken) : undefined,
    };
  },

  toJSON(message: GetContactsResponse): unknown {
    const obj: any = {};
    message.result !== undefined && (obj.result = getContactsResponse_ResultToJSON(message.result));
    if (message.contacts) {
      obj.contacts = message.contacts.map((e) => e ? Contact.toJSON(e) : undefined);
    } else {
      obj.contacts = [];
    }
    message.nextPageToken !== undefined &&
      (obj.nextPageToken = message.nextPageToken ? PageToken.toJSON(message.nextPageToken) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetContactsResponse>, I>>(object: I): GetContactsResponse {
    const message = createBaseGetContactsResponse();
    message.result = object.result ?? 0;
    message.contacts = object.contacts?.map((e) => Contact.fromPartial(e)) || [];
    message.nextPageToken = (object.nextPageToken !== undefined && object.nextPageToken !== null)
      ? PageToken.fromPartial(object.nextPageToken)
      : undefined;
    return message;
  },
};

function createBaseContact(): Contact {
  return { phoneNumber: undefined, status: undefined };
}

export const Contact = {
  encode(message: Contact, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.phoneNumber !== undefined) {
      PhoneNumber.encode(message.phoneNumber, writer.uint32(10).fork()).ldelim();
    }
    if (message.status !== undefined) {
      ContactStatus.encode(message.status, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Contact {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContact();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.phoneNumber = PhoneNumber.decode(reader, reader.uint32());
          break;
        case 2:
          message.status = ContactStatus.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Contact {
    return {
      phoneNumber: isSet(object.phoneNumber) ? PhoneNumber.fromJSON(object.phoneNumber) : undefined,
      status: isSet(object.status) ? ContactStatus.fromJSON(object.status) : undefined,
    };
  },

  toJSON(message: Contact): unknown {
    const obj: any = {};
    message.phoneNumber !== undefined &&
      (obj.phoneNumber = message.phoneNumber ? PhoneNumber.toJSON(message.phoneNumber) : undefined);
    message.status !== undefined && (obj.status = message.status ? ContactStatus.toJSON(message.status) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Contact>, I>>(object: I): Contact {
    const message = createBaseContact();
    message.phoneNumber = (object.phoneNumber !== undefined && object.phoneNumber !== null)
      ? PhoneNumber.fromPartial(object.phoneNumber)
      : undefined;
    message.status = (object.status !== undefined && object.status !== null)
      ? ContactStatus.fromPartial(object.status)
      : undefined;
    return message;
  },
};

function createBaseContactStatus(): ContactStatus {
  return { isRegistered: false, isInvited: false, isInviteRevoked: false };
}

export const ContactStatus = {
  encode(message: ContactStatus, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isRegistered === true) {
      writer.uint32(8).bool(message.isRegistered);
    }
    if (message.isInvited === true) {
      writer.uint32(16).bool(message.isInvited);
    }
    if (message.isInviteRevoked === true) {
      writer.uint32(24).bool(message.isInviteRevoked);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactStatus {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isRegistered = reader.bool();
          break;
        case 2:
          message.isInvited = reader.bool();
          break;
        case 3:
          message.isInviteRevoked = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContactStatus {
    return {
      isRegistered: isSet(object.isRegistered) ? Boolean(object.isRegistered) : false,
      isInvited: isSet(object.isInvited) ? Boolean(object.isInvited) : false,
      isInviteRevoked: isSet(object.isInviteRevoked) ? Boolean(object.isInviteRevoked) : false,
    };
  },

  toJSON(message: ContactStatus): unknown {
    const obj: any = {};
    message.isRegistered !== undefined && (obj.isRegistered = message.isRegistered);
    message.isInvited !== undefined && (obj.isInvited = message.isInvited);
    message.isInviteRevoked !== undefined && (obj.isInviteRevoked = message.isInviteRevoked);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContactStatus>, I>>(object: I): ContactStatus {
    const message = createBaseContactStatus();
    message.isRegistered = object.isRegistered ?? false;
    message.isInvited = object.isInvited ?? false;
    message.isInviteRevoked = object.isInviteRevoked ?? false;
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

export type ContactListService = typeof ContactListService;
export const ContactListService = {
  /** Adds a batch of contacts to a user's contact list */
  addContacts: {
    path: "/code.contact.v1.ContactList/AddContacts",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: AddContactsRequest) => Buffer.from(AddContactsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => AddContactsRequest.decode(value),
    responseSerialize: (value: AddContactsResponse) => Buffer.from(AddContactsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => AddContactsResponse.decode(value),
  },
  /** Removes a batch of contacts from a user's contact list */
  removeContacts: {
    path: "/code.contact.v1.ContactList/RemoveContacts",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: RemoveContactsRequest) => Buffer.from(RemoveContactsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => RemoveContactsRequest.decode(value),
    responseSerialize: (value: RemoveContactsResponse) => Buffer.from(RemoveContactsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => RemoveContactsResponse.decode(value),
  },
  /** Gets a subset of contacts from a user's contact list */
  getContacts: {
    path: "/code.contact.v1.ContactList/GetContacts",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetContactsRequest) => Buffer.from(GetContactsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetContactsRequest.decode(value),
    responseSerialize: (value: GetContactsResponse) => Buffer.from(GetContactsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetContactsResponse.decode(value),
  },
} as const;

export interface ContactListServer extends UntypedServiceImplementation {
  /** Adds a batch of contacts to a user's contact list */
  addContacts: handleUnaryCall<AddContactsRequest, AddContactsResponse>;
  /** Removes a batch of contacts from a user's contact list */
  removeContacts: handleUnaryCall<RemoveContactsRequest, RemoveContactsResponse>;
  /** Gets a subset of contacts from a user's contact list */
  getContacts: handleUnaryCall<GetContactsRequest, GetContactsResponse>;
}

export interface ContactListClient extends Client {
  /** Adds a batch of contacts to a user's contact list */
  addContacts(
    request: AddContactsRequest,
    callback: (error: ServiceError | null, response: AddContactsResponse) => void,
  ): ClientUnaryCall;
  addContacts(
    request: AddContactsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: AddContactsResponse) => void,
  ): ClientUnaryCall;
  addContacts(
    request: AddContactsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: AddContactsResponse) => void,
  ): ClientUnaryCall;
  /** Removes a batch of contacts from a user's contact list */
  removeContacts(
    request: RemoveContactsRequest,
    callback: (error: ServiceError | null, response: RemoveContactsResponse) => void,
  ): ClientUnaryCall;
  removeContacts(
    request: RemoveContactsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: RemoveContactsResponse) => void,
  ): ClientUnaryCall;
  removeContacts(
    request: RemoveContactsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: RemoveContactsResponse) => void,
  ): ClientUnaryCall;
  /** Gets a subset of contacts from a user's contact list */
  getContacts(
    request: GetContactsRequest,
    callback: (error: ServiceError | null, response: GetContactsResponse) => void,
  ): ClientUnaryCall;
  getContacts(
    request: GetContactsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetContactsResponse) => void,
  ): ClientUnaryCall;
  getContacts(
    request: GetContactsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetContactsResponse) => void,
  ): ClientUnaryCall;
}

export const ContactListClient = makeGenericClientConstructor(
  ContactListService,
  "code.contact.v1.ContactList",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions>): ContactListClient;
  service: typeof ContactListService;
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
