import { ChannelCredentials } from '@grpc/grpc-js';
import { promisify } from "util";

import * as code from '../../src/code';
import api = code.Network.Account;

export async function example_get_balance(
    env: code.Environment,
    state: code.Tray,
): Promise<void> {

    const client = new api.AccountClient('api.codeinfra.net:443', ChannelCredentials.createSsl());

    // Make the request into a promise instead of a cllback
    const getTokenAccountInfos = promisify(client.getTokenAccountInfos.bind(client));

    try {
        const keypair = code.getOwnerKeypair(env.keyphrase);
        const req = await code.getAccountInfoRequestProto(keypair);
        const res = await getTokenAccountInfos(req);

        // Update the local state for all accounts using the server
        // response. This will throw an error if the server response is
        // invalid or unexpected or is missing any accounts.
        await state.updateFromServer(res as api.GetTokenAccountInfosResponse);

        console.log(code.Utils.prettyPrintState(state));
    } catch (e) {
        console.log("Error updating state", e);
    }

    client.close();
}
