import { ChannelCredentials } from '@grpc/grpc-js';

import * as code from '../../src/code';
import api = code.Network.Transaction;

export async function example_receive_payment(
    organizer: code.Organizer,
    amount: bigint,
): Promise<void> {

    // Receive kin from the current incoming account (the assumption is that
    // this account already has enough kin in it)

    const intent = await organizer.getReceiveIntent(amount);

    console.log(code.Utils.prettyPrintActions(organizer, intent.actions));

    try {
        const client = new api.TransactionClient( 'api.codeinfra.dev:443', ChannelCredentials.createSsl());
        await intent.submit(client);
        client.close();
    } catch (e) {
        intent.rollback();
        console.log("Error submitting intent", e);
    }
}