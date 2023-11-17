import { ChannelCredentials } from '@grpc/grpc-js';
import { PublicKey } from '@solana/web3.js';

import * as code from '../../src/code';
import api = code.Network.Transaction;

export async function example_make_withdraw(
    organizer: code.Organizer,
    destination: PublicKey,
    amount: bigint,
): Promise<void> {

    // Send kin from the organizer slots to the temporary outgoing account and
    // then the destination (the assumption is that these accounts have enough
    // kin in them)

    const payment = {
        amount,
        address: destination,
        metadata: api.ExchangeData.fromJSON({
            currency: 'kin',
            exchangeRate: 1,
            nativeAmount: amount,
            quarks: code.Utils.ToQuarks(Number(amount))
        }),
    } as code.Payment;

    // Create the intent
    const intent = await organizer.getWithdrawIntent(payment);

    console.log(code.Utils.prettyPrintActions(organizer, intent.actions));

    try {
        const client = new api.TransactionClient('api.codeinfra.dev:443', ChannelCredentials.createSsl());
        await intent.submit(client);
        client.close();
    } catch (e) {
        intent.rollback();
        console.log("Error submitting intent", e);
    }
}