import {test} from 'node:test';
import assert from 'node:assert';

import * as code from '../../src/code';
import * as utils from './environment';

import AccountType = code.Accounts.AccountType;


test("send 1", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amounts = [ // 1mm spread out
        10 * 1,
        9 * 10,
        9 * 100,
        9 * 1000,
        9 * 10000,
        9 * 100000,
        0 * 1000000,
    ];
    const total = amounts.reduce((a, b) => a + b, 0);
    assert.equal(total, 1000000);

    utils.set_balances(env, new Map([
        [AccountType.Slot1, amounts[0]],
        [AccountType.Slot2, amounts[1]],
        [AccountType.Slot3, amounts[2]],
        [AccountType.Slot4, amounts[3]],
        [AccountType.Slot5, amounts[4]],
        [AccountType.Slot6, amounts[5]],
        [AccountType.Slot7, amounts[6]],
    ]));

    assert.equal(organizer.getSlotBalance(), total);
    assert.equal(organizer.getTotalBalance(), total);

    const result = await organizer.withdrawUsingNaiveStrategy(organizer.getCurrentOutgoing(), BigInt(123456));

    assert.equal(result.length, 6);
    assert.equal(organizer.getOutgoingBalance(), 123456);
    assert.equal(organizer.getSlotBalance(), 1000000 - 123456);
    assert.equal(organizer.getTotalBalance(), 1000000);

    //console.log(organizer.prettyPrint());
    //console.log(organizer.prettyPrintActions(result));
});

test("send 2", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amount = 1000000;

    utils.set_balances(env, new Map([
        [AccountType.Slot7, amount],
    ]));

    assert.equal(organizer.getSlotBalance(), amount);
    assert.equal(organizer.getTotalBalance(), amount);

    try {
        await organizer.withdrawUsingNaiveStrategy(organizer.getCurrentOutgoing(), BigInt(123456));

        console.log(organizer.prettyPrint());
        assert.fail("should not succeed using naive strategy");
    } catch (e : any) {
        assert.equal(e.message, "Not enough bills in slot");
    }
});

test("send 3", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amounts = [ // 1mm spread out
        10 * 1,
        9 * 10,
        19 * 100,
        8 * 1000,
        9 * 10000,
        9 * 100000,
        0 * 1000000,
    ];
    const total = amounts.reduce((a, b) => a + b, 0);
    assert.equal(total, 1000000);

    utils.set_balances(env, new Map([
        [AccountType.Slot1, amounts[0]],
        [AccountType.Slot2, amounts[1]],
        [AccountType.Slot3, amounts[2]],
        [AccountType.Slot4, amounts[3]],
        [AccountType.Slot5, amounts[4]],
        [AccountType.Slot6, amounts[5]],
        [AccountType.Slot7, amounts[6]],
    ]));

    assert.equal(organizer.getSlotBalance(), total);
    assert.equal(organizer.getTotalBalance(), total);

    try {
        await organizer.withdrawUsingNaiveStrategy(organizer.getCurrentOutgoing(), BigInt(9000));

        console.log(organizer.prettyPrint());
        assert.fail("should not succeed using naive strategy");
    } catch (e : any) {
        assert.equal(e.message, "Not enough bills in slot");
    }
});

test("send 4 (dynamic step1)", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amounts = [
        1 * 1,
        1 * 10,
        1 * 100,
        1 * 1000,  // naive strategy would fail here
        10 * 10000,
        9 * 100000,
        0 * 1000000,
    ];
    const total = amounts.reduce((a, b) => a + b, 0);
    assert.equal(total, 1001111);

    utils.set_balances(env, new Map([
        [AccountType.Slot1, amounts[0]],
        [AccountType.Slot2, amounts[1]],
        [AccountType.Slot3, amounts[2]],
        [AccountType.Slot4, amounts[3]],
        [AccountType.Slot5, amounts[4]],
        [AccountType.Slot6, amounts[5]],
        [AccountType.Slot7, amounts[6]],
    ]));

    assert.equal(organizer.getSlotBalance(), total);
    assert.equal(organizer.getTotalBalance(), total);

    //console.log(organizer.prettyPrint());
    const {actions, index} = await organizer.withdrawUsingDynamicStrategyStep1(organizer.getCurrentOutgoing(), BigInt(9000));
    //console.log(organizer.prettyPrint());

    assert.equal(actions.length, 4);
    assert.equal(index, 4);

    assert.equal(organizer.getSlotBalance(), total - 1111);
    assert.equal(organizer.getOutgoingBalance(), 1111);
    assert.equal(organizer.getTotalBalance(), total);
});

test("send 4 (dynamic step2)", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amounts = [
        1 * 1,
        1 * 10,
        1 * 100,
        1 * 1000,  // naive strategy would fail here
        10 * 10000,
        9 * 100000,
        0 * 1000000,
    ];
    const total = amounts.reduce((a, b) => a + b, 0);
    assert.equal(total, 1001111);

    utils.set_balances(env, new Map([
        [AccountType.Slot1, amounts[0]],
        [AccountType.Slot2, amounts[1]],
        [AccountType.Slot3, amounts[2]],
        [AccountType.Slot4, amounts[3]],
        [AccountType.Slot5, amounts[4]],
        [AccountType.Slot6, amounts[5]],
        [AccountType.Slot7, amounts[6]],
    ]));

    assert.equal(organizer.getSlotBalance(), total);
    assert.equal(organizer.getTotalBalance(), total);

    //console.log(organizer.prettyPrint());

    const outgoing = organizer.getCurrentOutgoing(); 
    const {actions, index} = await organizer.withdrawUsingDynamicStrategyStep1(outgoing, BigInt(9000));
    const step1 = actions;
    const step2 = await organizer.withdrawUsingDynamicStrategyStep2(outgoing, index, BigInt(9000-1111));

    //console.log("step1\n",organizer.prettyPrintActions(step1));
    //console.log("step2\n",organizer.prettyPrintActions(step2));
    //console.log(organizer.prettyPrint());

    assert.equal(step1.length, 4);
    assert.equal(step2.length, step1.length * 2);
    assert.equal(organizer.getSlotBalance(), total - 9000);
    assert.equal(organizer.getOutgoingBalance(), 9000);
    assert.equal(organizer.getTotalBalance(), total);
});

test("send 5 (dynamic full)", async () => {
    const env = await utils.new_test_env();
    const organizer = env.organizer;
    const amounts = [
        1 * 1,
        1 * 10,
        1 * 100,
        1 * 1000,  // naive strategy would fail here
        10 * 10000,
        9 * 100000,
        0 * 1000000,
    ];
    const total = amounts.reduce((a, b) => a + b, 0);
    assert.equal(total, 1001111);

    utils.set_balances(env, new Map([
        [AccountType.Slot1, amounts[0]],
        [AccountType.Slot2, amounts[1]],
        [AccountType.Slot3, amounts[2]],
        [AccountType.Slot4, amounts[3]],
        [AccountType.Slot5, amounts[4]],
        [AccountType.Slot6, amounts[5]],
        [AccountType.Slot7, amounts[6]],
    ]));

    assert.equal(organizer.getSlotBalance(), total);
    assert.equal(organizer.getTotalBalance(), total);

    //console.log(organizer.prettyPrint());

    const result = [
        ...await organizer.withdrawUsingDynamicStrategy(organizer.getCurrentOutgoing(), BigInt(9000)),
        ...await organizer.redistribute(),
        ...await organizer.rotateOutgoing(),
    ]

    //console.log(organizer.prettyPrintActions(result));
    //console.log(organizer.prettyPrint());

    assert.equal(result.length, 19);
    assert.equal(organizer.getSlotBalance(), total - 9000);
    assert.equal(organizer.getOutgoingBalance(), 9000);
    assert.equal(organizer.getTotalBalance(), total);
});