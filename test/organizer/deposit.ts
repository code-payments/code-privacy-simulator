import {test} from 'node:test';
import assert from 'node:assert';

import * as code from '../../src/code';
import * as utils from './environment';

import AccountType = code.Accounts.AccountType;

test("deposit", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = Math.floor(Math.random()*1000000);

    utils.set_balances(env, new Map([
        [AccountType.Primary, amount],
    ]));

    assert.equal(organizer.getPrimaryAccount().getCachedBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    //console.log(organizer.prettyPrint());

    const result = [
        ...await organizer.depositFrom(organizer.getPrimaryAccount(), BigInt(amount)),
        ...await organizer.redistribute(),
    ];

    //console.log(organizer.prettyPrintActions(result));
    //console.log(organizer.prettyPrint());

    assert.equal(result.length > 0, true);
    assert.equal(organizer.getPrimaryBalance(), 0);
    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);
});

test("deposits and send (10 times)", async () => {
    for (let i = 0; i < 10; i++) {
        await (async () => {
            const env = await utils.new_test_env();
            const organizer = env.organizer;
            const deposited = Math.floor(Math.random()*10_000_000);
            const sent = Math.floor(deposited * Math.random());

            utils.set_balances(env, new Map([
                [code.Accounts.AccountType.Primary, deposited],
            ]));

            assert.equal(organizer.getPrimaryBalance(), deposited);
            assert.equal(organizer.getTotalBalance(), deposited);

            //console.log(organizer.prettyPrint());

            // deposit intent
            const intent1 = [
                ...await organizer.depositFrom(organizer.getPrimaryAccount(), BigInt(deposited)),
                ...await organizer.redistribute(),
            ]

            // payment intent
            const intent2 = [
                ...await organizer.withdrawTo(organizer.getCurrentOutgoing(), BigInt(sent)),
                ...await organizer.redistribute(),
                ...await organizer.rotateOutgoing(),
            ];

            //console.log(organizer.prettyPrintActions(result));
            //console.log(organizer.prettyPrint());

            assert.equal(intent1.length > 0, true);
            assert.equal(intent2.length > 0, true);
            assert.equal(organizer.getSlotBalance(), deposited-sent);
            assert.equal(organizer.getPrimaryBalance(), 0);
            assert.equal(organizer.getIncomingBalance(), 0);
            assert.equal(organizer.getOutgoingBalance(), sent);
            assert.equal(organizer.getTotalBalance(), deposited);
        })();
    }
});