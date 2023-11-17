import {test} from 'node:test';
import assert from 'node:assert';

import * as code from '../../src/code';
import * as utils from './environment';

import AccountType = code.Accounts.AccountType;


test("receive 1", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = 1000000;

    utils.set_balances(env, new Map([
        [AccountType.Incoming, amount],
    ]));

    assert.equal(organizer.getSlotBalance(), 0);
    assert.equal(organizer.getTotalBalance(), amount);

    const result = await organizer.depositFrom(organizer.getCurrentIncoming(), BigInt(amount));
    assert.equal(result.length, 1);
    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});

test("receive 2", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = 1234567;

    utils.set_balances(env, new Map([
        [AccountType.Incoming, amount],
    ]));

    assert.equal(organizer.getSlotBalance(), 0);
    assert.equal(organizer.getTotalBalance(), amount);

    const result = await organizer.depositFrom(organizer.getCurrentIncoming(), BigInt(amount));

    assert.equal(result.length, 7);
    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});

test("receive 3", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = 1234567;

    utils.set_balances(env, new Map([
        [AccountType.Incoming, amount],
    ]));

    assert.equal(organizer.getSlotBalance(), 0);
    assert.equal(organizer.getTotalBalance(), amount);

    const result = [
        ...await organizer.depositFrom(organizer.getCurrentIncoming(), BigInt(amount)),
        ...await organizer.redistribute(),
    ];

    assert.equal(result.length, 13);
    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});
