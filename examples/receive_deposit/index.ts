import { ChannelCredentials } from '@grpc/grpc-js';

import * as code from '../../src/code';
import api = code.Network.Transaction;

export async function example_receive_deposit(
    organizer: code.Organizer,
    amount: bigint,
): Promise<void> {

    // Receive kin from the primary account (the assumption is that
    // this account already has enough kin in it)

    // Deposits are assumed to always come in from the primary account. This
    // ensures that the deposit address is constant.

    const intent = await organizer.getDepositIntent(amount);

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