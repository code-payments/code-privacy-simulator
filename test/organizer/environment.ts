import { Keypair, PublicKey } from "@solana/web3.js";
import * as code from '../../src/code';

export const DefaultPhoneNumber = "1234567890";

export interface TestEnv {
    env: code.Environment;
    organizer: code.Organizer;
    state: code.Tray;
}

export async function new_test_env(
    phone: string = DefaultPhoneNumber,
    mnemonic: string = code.Utils.MnemonicPhrase.generate().getPhrase()) : Promise<TestEnv> {

    const mint          = new PublicKey("kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6");
    const subsidizer    = new PublicKey("codeHy87wGD5oMRLG75qKqsSi1vWE3oxNyYmXo5F9YR");

    const phoneNumber = phone;
    const keyphrase = mnemonic;

    const env = {
        mint,
        subsidizer,
        phoneNumber,
        keyphrase,
    } as code.Environment;

    const state = new code.Tray(env);
    await state.initialize();

    const organizer = new code.Organizer(state);

    return {
        env,
        organizer,
        state,
    };
}

export function set_balances(env: TestEnv, balances: Map<code.Accounts.AccountType, number>) {
    // Crude, but avoids having to mock RPC calls to a server

    const accounts = env.state.getAllAccounts();
    for (const account of accounts) {
        const type = account.getAccountType();
        if (balances.has(type)) {
            const balance = balances.get(type);
            if (balance != undefined) {
                account.cachedBalance = BigInt(balance);
            }
        }
    }
}
