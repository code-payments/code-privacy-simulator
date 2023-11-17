import {test, it} from 'node:test';
import assert from 'node:assert';
import { PublicKey } from '@solana/web3.js';

import * as code from '../../src/code';
import * as utils from './environment';
import { DefaultMetricRenderer, Metric, MetricSerializer, MetricSerializerWithTotal } from '../utils/metric';

const NumSimulatedReceiveAndSend = 100;
const SimulationPaymentAmount = 10_000_000; // Kin

const KinPrice = 0.00002; // USD
const SolPrice = 65;     // USD
const Verbose = false;

// Sending all the funds to the void...
const destination = PublicKey.default;

class SimulationStats {
    metrics: Map<string, Metric>;

    constructor() {
        this.metrics = new Map();
        this.metrics.set("kin_payments", new Metric());
        this.metrics.set("usd_payments", new Metric());
        this.metrics.set("actions", new Metric());
        this.metrics.set("transactions", new Metric());

        this.metrics.set("distribution", new Metric((m) => {
            const val = Math.round((0.5-1/m.min) * 200) + "%";
            return [
                `${val.padEnd(16)} | `,
                MetricSerializer(m),
            ].join('');
        }));

        this.metrics.set("tx_fees", new Metric((m)=> {
            // Display tx fees in USD
            return MetricSerializerWithTotal(m, (v: number) => {
                const val = (v * (0.000000001 * SolPrice));
                return `${DefaultMetricRenderer(val)}`;
            });
        }));
    }

    addIntent(intent: code.Action[]) {
        // Estimate fees and tx count
        let txs = 0, fees = 0;
        for (const action of intent) {
            const kind = action.getType();

            fees += code.Types.TransactionFeeByActionType.get(kind)!;

            // Add the fee for the upgrade action
            if (kind == code.Types.ActionType.TemporaryPrivacyTransferAction ||
                kind == code.Types.ActionType.TemporaryPrivacyExchangeAction) {
                fees += code.Types.TransactionFeeByActionType.get(code.Types.ActionType.PermanentPrivacyUpgradeAction)!;
            }

            txs += code.Types.TransactionCountByActionType.get(kind)!;
        }
        this.add("tx_fees", fees);
        this.add("transactions", txs);
        this.add("actions", intent.length);
    }

    add(name: string, value: number) {
        const metric = this.metrics.get(name);
        if (metric) {
            metric.add(value);
        }
    }

    finalize() {
        for (const metric of this.metrics.values()) {
            metric.finalize();
        }
    }

    toString() {
        const actions = this.metrics.get("actions")!;
        const transactions = this.metrics.get("transactions")!;
        const kin_payments = this.metrics.get("kin_payments")!;
        const usd_payments = this.metrics.get("usd_payments")!;
        const tx_fees = this.metrics.get("tx_fees")!;
        const distribution = this.metrics.get("distribution")!;

        return [
            `Distribution:         ${distribution.toString()}`,
            `Num Actions:          ${actions.toString()}`,
            `Num Tx (approx):      ${transactions.toString()}`,
            `Amounts (Kin):        ${kin_payments.toString()}`,
            `Amounts (USD):        ${usd_payments.toString()}`,
            `Fees (USD):           ${tx_fees.toString()}`,
        ]
    }
}


test("simulate mass receives and sends", async () => {
    code.Organizer.distribution.clear();
    const stats = new SimulationStats();

    for (let i = 0; i < (NumSimulatedReceiveAndSend / 2); i++) {
        await (async () => {
            const env = await utils.new_test_env();
            const organizer = env.organizer;
            const received = Math.floor(Math.random() * SimulationPaymentAmount);
            const sent = Math.floor(received * Math.random());

            stats.add("kin_payments", received);
            stats.add("kin_payments", sent);
            stats.add("usd_payments", received * KinPrice);
            stats.add("usd_payments", sent * KinPrice);

            utils.set_balances(env, new Map([
                [code.Accounts.AccountType.Incoming, received],
            ]));

            assert.equal(organizer.getIncomingBalance(), received);
            assert.equal(organizer.getTotalBalance(), received);

            const intent1 = [
                // deposit
                ...await organizer.depositFrom(organizer.getCurrentIncoming(), BigInt(received)),
                ...await organizer.redistribute(),
                ...await organizer.rotateIncoming(),
            ];

            const preSend = organizer.prettyPrint();

            const outgoing = organizer.getCurrentOutgoing();
            const intent2 = [
                // payment
                ...await organizer.withdrawTo(outgoing, BigInt(sent)),
                ...await organizer.redistribute(),
                ...await organizer.rotateOutgoing(),
                ...await organizer.sendFrom(outgoing, BigInt(sent), destination),
            ];

            stats.addIntent(intent1);
            stats.addIntent(intent2);

            const result = [...intent1, ...intent2];

            if (Verbose) {
                console.log(`\n\n\n\n${'='.repeat(80)}`);
                console.log(`Sending ${sent.toLocaleString("en-US")} out of ${received.toLocaleString("en-US")}`);
                console.log(`${'='.repeat(80)}\n\n`);

                console.log(organizer.prettyPrintActions(intent1));
                console.log(`Pre-send state:`);
                console.log(preSend);
                console.log(organizer.prettyPrintActions(intent2));

                console.log(`\nPost-send state:`);
                console.log(organizer.prettyPrint());
            }

            assert.equal(result.length > 0, true);
            assert.equal(organizer.getSlotBalance(), received-sent);
            assert.equal(organizer.getPrimaryBalance(), 0);
            assert.equal(organizer.getIncomingBalance(), 0);
            assert.equal(organizer.getOutgoingBalance(), 0);
            assert.equal(organizer.getTotalBalance(), received-sent);

        })();
    }

    //console.log(code.Utils.prettyPrintValueMap());
    const distribution = code.Organizer.distribution;

    for (const [key, value] of distribution) {
        stats.add("distribution", value);
    }

    stats.finalize();

    console.log(`\n\n`);
    console.log(`${'='.repeat(130)}`);
    console.log(`Num Payments:         ${(NumSimulatedReceiveAndSend).toLocaleString('en-US')}`);
    console.log(`Num Slots:            ${(code.Types.SlotCount).toLocaleString('en-US')}`);
    console.log(`Num Denominations:    ${(code.Types.ValidTransferAmounts.length).toLocaleString('en-US')} (unique) from ${code.Types.SlotCount.toLocaleString('en-US')} x ${code.Types.VariationCount}`);
    console.log(`SOL Price:            $${SolPrice}`);
    console.log(`Kin Price:            $${KinPrice}`);
    console.log(`${'='.repeat(130)}`);
    console.log(stats.toString().join('\n'));
    console.log(`${'='.repeat(130)}`);
    console.log(`\n\n`);
});
