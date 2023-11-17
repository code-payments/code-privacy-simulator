import { test } from 'node:test';
import assert from 'node:assert';

import * as code from '../../src/code';
import * as utils from './environment';

import AccountType = code.Accounts.AccountType;

test("mnemonic tray test", async () => {
    const mnemonic = "couple divorce usage surprise before range feature source bubble chunk spot away";
    const env = await utils.new_test_env(utils.DefaultPhoneNumber, mnemonic);

    //console.log(code.Utils.prettyPrintState(env.state));

    const all = env.state.getAllAccounts();

    for (const account of all) {
        switch (account.getAccountType()) {
            case AccountType.Primary:
                assert.equal(account.address.toBase58(), "GQ14CiKWXv5mbE9fJCUrZ6rocJmMvzbDfAdyHxR74zwh");
                assert.equal(account.getVault().toBase58(), "8DDrALtni72M6FnCiTMToEssMHDEH3KRP1nhA6svQDxp");
                break;
            case AccountType.Incoming:
                assert.equal(account.address.toBase58(), "BQ3vx5saLCteJYHHPVrk9kuej19VYM65aSnVjdoGDius");
                assert.equal(account.getVault().toBase58(), "G2JXRCvg2PVXHd9veJ5MCcR38723tcuz52Mtw7uE4QK8");
                break;
            case AccountType.Outgoing:
                assert.equal(account.address.toBase58(), "5N4UmL7AR3FcRYxxVYHWHghuwBwt8hXeeCoj1Z1Wm3nJ");
                assert.equal(account.getVault().toBase58(), "Gfuc6w9vPwoGKtRwEv7YJtxGWtR4knLGoMoT5Hu1eS6A");
                break;
            case AccountType.Slot1:
                assert.equal(account.address.toBase58(), "FjvPsdbgHbUAQfCbQGJpABUUMa7QQP2T3DbqexrbDcED");
                assert.equal(account.getVault().toBase58(), "J5fzggJmRyPwmAcJw7iVD9jG4q4xZyeELNEEjfhKxp4i");
                break;
            case AccountType.Slot2:
                assert.equal(account.address.toBase58(), "GCpRY92FnW7ehi4iFAS9jkYg8km8yes53DC2e8mXJT3Z");
                assert.equal(account.getVault().toBase58(), "BbCteP1N7DiyShnEuCRGkNLeoYbr7v1d5deGDBbeu5Zg");
                break;
            case AccountType.Slot3:
                assert.equal(account.address.toBase58(), "7ZnNZ5tqjTnFpREjRiraYaARWmVEh41YEnNo7w7UmadS");
                assert.equal(account.getVault().toBase58(), "6eqAKwBqtAQ28juRdc3429GoRpUTuu86gScJrDN6cqGQ");
                break;
            case AccountType.Slot4:
                assert.equal(account.address.toBase58(), "FcYKxTmeUUsGtV5GBKTJCvpd298kvfbV8cp3F5KJn4pk");
                assert.equal(account.getVault().toBase58(), "6upXkqkiY3GYBqm3wSReuAsaWxQSY1d67GuRxLhM74Va");
                break;
            case AccountType.Slot5:
                assert.equal(account.address.toBase58(), "FSjvCPBsjdCNpix66HfY3fBp4Spntbp2Lsd3SnnM4CwN");
                assert.equal(account.getVault().toBase58(), "7GpxPmL2sGqRq1ru4nKTPWPRruemat5BCReGmNLNXsRE");
                break;
            case AccountType.Slot6:
                assert.equal(account.address.toBase58(), "7wTWF1wBy76f4vytvK3YNLspPWESVu3YXXxkKSCx2dok");
                assert.equal(account.getVault().toBase58(), "BEZasPLNZ5vsHH3SfdxeWuTD5uXm8pPUmbyrZkPJqQwr");
                break;
            case AccountType.Slot7:
                assert.equal(account.address.toBase58(), "7NVHFNN6XD17db4nQyNrM7VhkkSjwQSTcQp8SxHbnsRe");
                assert.equal(account.getVault().toBase58(), "AB4w6m9nhQaagqpnu6TcsgE1Z34wXKwKSoxU6tGadAfN");
                break;
            default:
                assert.fail("Unexpected account type");
        }
    }

});
