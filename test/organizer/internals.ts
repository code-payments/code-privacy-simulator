import {test} from 'node:test';
import assert from 'node:assert';

import * as code from '../../src/code';
import * as utils from './environment';

import AccountType = code.Accounts.AccountType;


test("balance", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;

    utils.set_balances(env, new Map([
        [AccountType.Slot1, 1],
        [AccountType.Slot2, 10],
        [AccountType.Slot3, 100],
        [AccountType.Slot4, 1000],
        [AccountType.Slot5, 10000],
        [AccountType.Slot6, 100000],
        [AccountType.Slot7, 1000000],
        [AccountType.Incoming, 42],
        [AccountType.Outgoing, 18],
        [AccountType.Primary, 123],
    ]));

    assert.equal(organizer.getSlotBalance(), 1111111);
    assert.equal(organizer.getTotalBalance(), 1111111 + 42 + 18 + 123);
});

test("exchange 1", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = 1000000;

    utils.set_balances(env, new Map([
        [AccountType.Slot7, amount],
    ]));

    const result = await organizer.exchangeLargeToSmall();

    assert.equal(result.length, 6);
    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});

test("exchange 2", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = 1000000;

    utils.set_balances(env, new Map([
        [AccountType.Slot5, amount],
    ]));

    const result = await organizer.exchangeLargeToSmall();

    assert.equal(result.length, 4);
    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});

test("exchange 3", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = 1000000;

    utils.set_balances(env, new Map([
        [AccountType.Slot1, amount],
    ]));

    const result = await organizer.exchangeSmallToLarge();

    assert.equal(result.length, 15);
    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});

test("exchange 4", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = 1000000;

    utils.set_balances(env, new Map([
        [AccountType.Slot4, amount],
    ]));

    const result = await organizer.exchangeSmallToLarge();

    assert.equal(result.length, 3);
    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});

test("redistribute 1", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = 1000000;

    utils.set_balances(env, new Map([
        [AccountType.Slot5, amount],
    ]));

    const result = await organizer.redistribute();

    assert.equal(result.length, 5);
    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});

test("redistribute 2", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amounts = [
        19 * 1,
        28 * 10,
        16 * 100,
        39 * 1000,
        42 * 10000,
        17 * 100000,
        1 * 1000000,
    ];
    const total = amounts.reduce((a, b) => a + b, 0);

    utils.set_balances(env, new Map([
        [AccountType.Slot1, amounts[0]],
        [AccountType.Slot2, amounts[1]],
        [AccountType.Slot3, amounts[2]],
        [AccountType.Slot4, amounts[3]],
        [AccountType.Slot5, amounts[4]],
        [AccountType.Slot6, amounts[5]],
        [AccountType.Slot7, amounts[6]],
    ]));

    const result = await organizer.redistribute();

    assert.equal(result.length, 5);
    assert.equal(organizer.getSlotBalance(), total);
    assert.equal(organizer.getTotalBalance(), total);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});

test("redistribute 3", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amounts = [
        19 * 1,
        28 * 10,
        16 * 100,
        0, // gap in the middle
        42 * 10000,
        17 * 100000,
        1 * 1000000,
    ];
    const total = amounts.reduce((a, b) => a + b, 0);

    utils.set_balances(env, new Map([
        [AccountType.Slot1, amounts[0]],
        [AccountType.Slot2, amounts[1]],
        [AccountType.Slot3, amounts[2]],
        [AccountType.Slot4, amounts[3]],
        [AccountType.Slot5, amounts[4]],
        [AccountType.Slot6, amounts[5]],
        [AccountType.Slot7, amounts[6]],
    ]));

    const result = await organizer.redistribute();

    assert.equal(result.length, 5);
    assert.equal(organizer.getSlotBalance(), total);
    assert.equal(organizer.getTotalBalance(), total);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});