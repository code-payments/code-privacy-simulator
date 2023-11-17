import { ChannelCredentials } from '@grpc/grpc-js';

import * as code from '../../src/code';
import api = code.Network.Transaction;

import { isInitialized, setInitialized } from '../utils';

export async function example_init_accounts(env: code.Environment, lastIncoming: number, lastOutgoing: number): Promise<code.Tray> {

    // Initialize the state
    const state = new code.Tray(env);
    const actions = await state.initialize(lastIncoming, lastOutgoing);

    // Check if we need to create the accounts on the blockchain or not
    if (!isInitialized()) {

        const metadata = {
            openAccounts: {} as api.OpenAccountsMetadata
        } as api.Metadata;

        const intent = new code.Intent(actions, metadata, env);

        console.log("Creating accounts on the blockchain");

        try {
            const client = new api.TransactionClient(
                'api.codeinfra.dev:443',
                ChannelCredentials.createSsl());

            await intent.submit(client);
            client.close();

            setInitialized(true);
        } catch (e) {
            console.log("Error submitting intent", e);
        }

        console.log("Done creating accounts on the blockchain");

    }

    return state;
}
