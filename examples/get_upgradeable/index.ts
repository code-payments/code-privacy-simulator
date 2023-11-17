import { ChannelCredentials } from '@grpc/grpc-js';
import { promisify } from "util";

import * as code from '../../src/code';
import api = code.Network.Transaction;


export async function example_get_upgradeable(
    env: code.Environment,
): Promise<void> {

    const client = new api.TransactionClient('api.codeinfra.dev:443', ChannelCredentials.createSsl());
    const getUpgradeableIntents = promisify(client.getPrioritizedIntentsForPrivacyUpgrade.bind(client));

    try {

        const keypair = code.getOwnerKeypair(env.keyphrase);
        const req = await code.getUpgradeReqProto(keypair, 10);
        const res = await getUpgradeableIntents(req) as api.GetPrioritizedIntentsForPrivacyUpgradeResponse;

        console.log(res);

        if (res.result != api.GetPrioritizedIntentsForPrivacyUpgradeResponse_Result.OK) {
            throw new Error("Failed to get upgradeable intents");
        }

    } catch (e) {
        console.log(e);
    }

    client.close();
}
