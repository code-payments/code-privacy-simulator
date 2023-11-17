import { readInput } from '../utils';
import { ChannelCredentials } from '@grpc/grpc-js';
import { promisify } from "util";

import * as code from '../../src/code';
import api = code.Network.Phone;

export async function example_verify_phone(
    env: code.Environment,
): Promise<api.PhoneLinkingToken | undefined> {
    
    const client = new api.PhoneVerificationClient('api.codeinfra.dev:443', ChannelCredentials.createSsl());

    const sendVerificationCode = promisify(client.sendVerificationCode.bind(client));
    const checkVerificationCode = promisify(client.checkVerificationCode.bind(client));

    try {

        const req = await getPhoneVerificationReqProto(env.phoneNumber);
        const res = await sendVerificationCode(req) as api.SendVerificationCodeResponse;

        console.log(res);

        if (res.result != api.SendVerificationCodeResponse_Result.OK) {
            throw new Error("Failed to send verification code");
        }

    } catch (e) {
        console.log(e);
        throw e;
    }

    let token: api.PhoneLinkingToken | undefined = undefined;
    try {
        const code = await readInput(`\n\nPlease enter the verification code sent to ${env.phoneNumber}: `);

        const req = await getCheckVerificationCodeReqProto(env.phoneNumber, code);
        const res = await checkVerificationCode(req) as api.CheckVerificationCodeResponse;

        console.log(res);

        if (res.result != api.CheckVerificationCodeResponse_Result.OK) {
            throw new Error("Failed to verify phone number");
        }

        token = res.linkingToken;


    } catch (e) {
        console.log(e);
        throw e;
    }

    client.close();

    return token;
}

export async function getPhoneVerificationReqProto(
    /* E.164 phone number value */
    phoneNumber: string,
): Promise<api.SendVerificationCodeRequest> {
    return api.SendVerificationCodeRequest.fromJSON({
        phoneNumber: {
            value: phoneNumber,
        }
    });
}

export async function getCheckVerificationCodeReqProto(
    /* E.164 phone number value */
    phoneNumber: string,
    /* Verification code */
    verificationCode: string,
): Promise<api.CheckVerificationCodeRequest> {
    return api.CheckVerificationCodeRequest.fromJSON({
        phoneNumber: {
            value: phoneNumber,
        },
        code: {
            value: verificationCode,
        },
    });
}
