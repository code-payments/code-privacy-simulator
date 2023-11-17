import { PublicKey } from '@solana/web3.js';
import * as code from '../src/code';
import {
    getLastIncomingIndex,
    getLastOutgoingIndex,
    setLastIncomingIndex,
    setLastOutgoingIndex,
    isVerified,
    readInput,
    getOrCreateKeyphrase,
} from './utils';

import { example_init_accounts } from './init_accounts/index';
import { example_receive_deposit } from './receive_deposit';
import { example_receive_payment } from './receive_payment';
import { example_send_payment } from './make_payment';
import { example_get_balance } from './get_balance';
import { example_get_upgradeable } from './get_upgradeable';
import { example_upgrade_flow } from './upgrade_privacy';
import { example_verify_phone } from './verify_phone';
import { example_link_account } from './link_account';
import { example_make_withdraw } from './make_withdraw';

const mint = new PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");
const subsidizer = new PublicKey("codeHy87wGD5oMRLG75qKqsSi1vWE3oxNyYmXo5F9YR");
const keyphrase = getOrCreateKeyphrase();

(async function main() {

    const env = { mint, subsidizer, keyphrase } as code.Environment;

    if (!isVerified()) {
        /* E.164 phone number value */
        env.phoneNumber = await readInput("Please enter your phone number using E.164 format (eg: +11111111111): ");
        await verifyAndLink(env);
    }

    const state = await example_init_accounts(
        env,
        getLastIncomingIndex(),
        getLastOutgoingIndex(),
    );
    const organizer = new code.Organizer(state);
    await example_get_balance(env, state);

    code.Utils.prettyPrintState(state);
    code.Utils.prettyPrintAccounts(organizer);

    // Uncomment the examples you want to run
    /*
    await example1(env, state, organizer);
    await example2(env, state, organizer);
    await example3(env, state, organizer);
    await example4(env, state, organizer);
    await example5(env, state, organizer);
    await example6(env, state, organizer);
    */

    // Save the index to the .env file
    setLastIncomingIndex(state.getIncomingIndex());
    setLastOutgoingIndex(state.getOutgoingIndex());

})();


async function verifyAndLink(env: code.Environment) {
    console.log("\n\nPhone Verification & Keypair linking");
    console.log("--------------------------------------");

    const token = await example_verify_phone(env);
    if (!token) {
        console.log("Phone verification failed");
        return;
    }

    await example_link_account(env, token);
}

async function example1(env: code.Environment, state: code.Tray, organizer: code.Organizer) {
    // The assumption is that Kin has been sent to the primary vault account already.

    console.log("\n\nExample 1: Receive a deposit");
    console.log("------------------------------");
    await example_receive_deposit(organizer, BigInt(1));
    console.log(code.Utils.prettyPrintOrganizer(organizer));
}

async function example2(env: code.Environment, state: code.Tray, organizer: code.Organizer) {
    // The assumption is that Kin has been sent to the current incoming vault account already.

    console.log("\n\nExample 2: Receive a payment");
    console.log("------------------------------");
    await example_receive_payment(organizer, BigInt(42));
    console.log(code.Utils.prettyPrintOrganizer(organizer));
}

async function example3(env: code.Environment, state: code.Tray, organizer: code.Organizer) {
    console.log("\n\nExample 3: Send a payment");
    console.log("---------------------------");
    const destination = new PublicKey("3cPHJRcMSf3s9WsnaRmrx2Fo8aLqYxc6Usp8Bh69CxtX");
    await example_send_payment(organizer, destination, BigInt(321));
    console.log(code.Utils.prettyPrintOrganizer(organizer));
}

async function example4(env: code.Environment, state: code.Tray, organizer: code.Organizer) {
    console.log("\n\nExample 4: Make a withdrawal");
    console.log("---------------------------");
    const destination = new PublicKey("DY1Bh6E53F8pr5AihHiqUhe2tZcZJ3mxFo9yauvdSXpC");
    await example_make_withdraw(organizer, destination, BigInt(12));
    console.log(code.Utils.prettyPrintOrganizer(organizer));
}

async function example5(env: code.Environment, state: code.Tray, organizer: code.Organizer) {
    console.log("\n\nExample 4: Get Upgradeable Intents");
    console.log("-------------------------");

    await example_get_upgradeable(env);
}

async function example6(env: code.Environment, state: code.Tray, organizer: code.Organizer) {
    console.log("\n\nExample 5: Upgrade flow");
    console.log("-------------------------");

    await example_upgrade_flow(env);
}
