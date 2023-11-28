import * as ed25519 from '@noble/ed25519';
import { Keypair } from '@solana/web3.js';

import { ChannelCredentials } from '@grpc/grpc-js';
import { promisify } from "util";

import * as code from '../../src/code';
import api = code.Network.User;
import phone = code.Network.Phone;

import { setVerified } from '../utils';

export async function example_link_account(
    env: code.Environment,
    token: phone.PhoneLinkingToken,
): Promise<void> {
    
    const client = new api.IdentityClient('api.codeinfra.net:443', ChannelCredentials.createSsl());
    const linkAccount = promisify(client.linkAccount.bind(client));

    try {

        const keypair = code.getOwnerKeypair(env.keyphrase);
        const req = await getLinkAccountReqProto(keypair, token);
        const res = await linkAccount(req) as api.LinkAccountResponse;

        console.log(res);

        if (res.result != api.LinkAccountResponse_Result.OK) {
            throw new Error("Failed to link account");
        }

        setVerified(true);

    } catch (e) {
        console.log(e);
        throw e;
    }

    client.close();
}

export async function getLinkAccountReqProto(owner: Keypair, token: phone.PhoneLinkingToken): Promise<api.LinkAccountRequest> {
    const req = {
        ownerAccountId: { value: owner.publicKey.toBuffer() },
        phone: token,
    } as api.LinkAccountRequest;

    const buf = api.LinkAccountRequest.encode(req).finish();
    const sig = await ed25519.sign(buf, owner.secretKey.subarray(0, 32));
    req.signature = { value: Buffer.from(sig) };

    return api.LinkAccountRequest.fromJSON(req);
}