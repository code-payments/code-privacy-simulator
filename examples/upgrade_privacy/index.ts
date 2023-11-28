import { ChannelCredentials } from '@grpc/grpc-js';
import { promisify } from "util";

import * as code from '../../src/code';
import api = code.Network.Transaction;

export async function example_upgrade_flow(
    env: code.Environment,
): Promise<void> {

    const client = new api.TransactionClient('api.codeinfra.net:443', ChannelCredentials.createSsl());
    const getUpgradeableIntents = promisify(client.getPrioritizedIntentsForPrivacyUpgrade.bind(client));

    try {

        const keypair = code.getOwnerKeypair(env.keyphrase);
        const req = await code.getUpgradeReqProto(keypair, 100);
        const res = await getUpgradeableIntents(req) as api.GetPrioritizedIntentsForPrivacyUpgradeResponse;

        console.log(res);

        if (res.result != api.GetPrioritizedIntentsForPrivacyUpgradeResponse_Result.OK) {
            throw new Error("Failed to get intents for privacy upgrade");
        }

        for (const upgradeable of res.items) {
            const actions : code.Action[] = [];

            for (let i = 0; i < upgradeable.actions.length; i++) {
                actions.push(await code.PermanentPrivacyUpgradeAction.fromUpgradeIntent(env, upgradeable, i));
            }

            const metadata = {
                upgradePrivacy: {
                } as api.UpgradePrivacyMetadata,
            } as api.Metadata;

            const intent = new code.Intent(actions, metadata, env);

            // Use the same ID as the original intent
            intent.id = upgradeable.id?.value;

            await intent.submit(client);
        }

    } catch (e) {
        console.log(e);
    }

    client.close();
}