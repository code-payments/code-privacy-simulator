import { PublicKey } from "@solana/web3.js";
import { TimelockAccount } from "../accounts/TimelockAccount";
import { Metadata, ReceivePaymentsMetadata, SendPaymentMetadata } from "../grpc/transaction/v2/transaction_service";
import {
    Action,
    CloseDormantAccountAction,
    CloseEmptyAccountAction,
    NoPrivacyWithdrawAction,
    OpenAccountAction,
    TemporaryPrivacyExchangeAction,
    TemporaryPrivacyTransferAction
} from "./Action";
import { ValidTransferAmounts, Denomination, fromAccountType } from "./Denomination";
import { Intent, RollbackFunc } from "./Intent";
import { Tray } from "./Tray";
import { Payment } from "./Payment";
import { Slot } from "./Slot";
import * as utils from "../utils";

export class Organizer {
    slots: Slot[];
    state: Tray;

    constructor(state: Tray) {
        this.slots = [];
        this.state = state;

        if (!state.isInitialized()) {
            throw new Error("Unexpected state, did you initialize the state?")
        }

        // Import the organizer state
        for (const account of state.slots) {
            const type = account.getAccountType();
            const billType = fromAccountType(type);
            this.slots.push(
                new Slot(billType, account)
            );
        }

        // Link the slots together, so we can easily traverse them later
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            if (i - 1 >= 0) {
                slot.previous = this.slots[i - 1];
            }
            if (i + 1 < this.slots.length) {
                slot.next = this.slots[i + 1];
            }
        }
    }

    getIncomingAccounts(): TimelockAccount[] {
        return this.state.getAllIncomingAccounts();
    }

    getOutgoingAccounts(): TimelockAccount[] {
        return this.state.getAllOutgoingAccounts();
    }

    getSlots(): Slot[] {
        return this.slots;
    }

    getSlotByType(type: Denomination): Slot {
        const res = this.slots.find((slot) => slot.type === type);
        if (res === undefined) {
            throw new Error("Slot not found");
        }

        return res;
    }

    getPrimaryAccount(): TimelockAccount {
        return this.state.getPrimaryTimelockAccount();
    }

    getCurrentIncoming(): TimelockAccount {
        return this.state.getCurrentIncomingAccount();
    }

    getCurrentOutgoing(): TimelockAccount {
        return this.state.getCurrentOutgoingAccount();
    }

    getRollback(): RollbackFunc {
        const currentIncomingIndex = this.state.getIncomingIndex();
        const currentOutgoingIndex = this.state.getOutgoingIndex();

        const all = this.state.getAllAccounts();
        const balances = all.map((account) => account.getCachedBalance());

        const incoming = this.state.getAllIncomingAccounts();
        const outgoing = this.state.getAllOutgoingAccounts();

        // In case this intent goes wrong, we need a way to recover the
        // underlying state.
        return () => {
            this.state.incomingIndex = currentIncomingIndex;
            this.state.outgoingIndex = currentOutgoingIndex;

            for (let i = 0; i < all.length; i++) {
                all[i].setCachedBalance(balances[i]);
            }

            this.state.incoming = incoming;
            this.state.outgoing = outgoing;
        };
    }

    async getSendIntent(payment: Payment): Promise<Intent> {
        const env = this.state.getEnvironment();
        const outgoing = this.getCurrentOutgoing();

        const { amount, address } = payment;
        const exchangeData = payment.metadata;

        if (exchangeData === undefined) {
            throw new Error("Unexpected undefined exchange data");
        }

        if (this.getSlotBalance() < amount) {
            throw new Error("Not enough tokens in the organizer");
        }

        const rollback = this.getRollback();

        let actions;
        try {

            const preBalance = this.getTotalBalance();

            actions = [
                ...await this.withdrawTo(outgoing, amount),
                ...await this.sendFrom(outgoing, amount, address),
                ...await this.redistribute(),
                ...await this.rotateOutgoing()
            ];

            const postBalance = this.getTotalBalance();

            if (preBalance - postBalance !== amount) {
                throw new Error(`getSendIntent: Balance mismatch after intent ${preBalance} - ${postBalance} !== ${amount}`);
            }

        } catch (e) {
            rollback();
            throw e;
        }

        // TODO: double check that the actions are valid

        const metadata = {
            sendPayment: {
                destination: { value: address.toBuffer() },
                exchangeData: exchangeData,
                isWithdrawal: false,
            } as SendPaymentMetadata,
        } as Metadata;

        return new Intent(actions, metadata, env, rollback);
    }

    async getReceiveIntent(amount: bigint): Promise<Intent> {
        const env = this.state.getEnvironment();
        const incoming = this.getCurrentIncoming();

        if (incoming.getCachedBalance() < amount) {
            throw new Error("Not enough tokens in the incoming account");
        }


        const rollback = this.getRollback();

        let actions;
        try {

            const preBalance = this.getTotalBalance();
            const preIncoming = this.getIncomingBalance();

            actions = [
                ...await this.depositFrom(incoming, amount),
                ...await this.redistribute(),
                ...await this.rotateIncoming(),
            ];

            const postBalance = this.getTotalBalance();
            const postIncoming = this.getIncomingBalance();

            if (preBalance !== postBalance) {
                throw new Error(`getReceiveIntent: Balance mismatch after intent ${preBalance} != ${postBalance}`);
            }

            if (preIncoming - postIncoming !== amount) {
                throw new Error(`getReceiveIntent: Incoming balance mismatch after intent ${preIncoming} - ${postIncoming} != ${amount}`);
            }

        } catch (e) {
            rollback();
            throw e;
        }

        // TODO: double check that the actions are valid

        const metadata = {
            receivePayments: {
                source: { value: incoming.getVault().toBuffer() },
                quarks: utils.ToQuarks(Number(amount)),
                isDeposit: false,
            } as ReceivePaymentsMetadata,
        } as Metadata;

        return new Intent(actions, metadata, env, rollback);
    }

    async getDepositIntent(amount: bigint): Promise<Intent> {
        const env = this.state.getEnvironment();
        const primary = this.getPrimaryAccount();

        if (primary.getCachedBalance() < amount) {
            throw new Error("Not enough tokens in the primary account");
        }

        const rollback = this.getRollback();

        let actions;
        try {

            const preBalance = this.getTotalBalance();
            const prePrimary = this.getPrimaryBalance();

            actions = [
                ...await this.depositFrom(primary, amount),
                ...await this.redistribute(),
            ];

            const postBalance = this.getTotalBalance();
            const postPrimary = this.getPrimaryBalance();

            if (preBalance !== postBalance) {
                throw new Error(`getDepositIntent: Balance mismatch after intent ${preBalance} != ${postBalance}`);
            }

            if (prePrimary - postPrimary !== amount) {
                throw new Error(`getDepositIntent: Primary balance mismatch after intent ${prePrimary} - ${postPrimary} != ${amount}`);
            }

        } catch (e) {
            rollback();
            throw e;
        }

        // TODO: double check that the actions are valid

        const metadata = {
            receivePayments: {
                source: { value: primary.getVault().toBuffer() },
                quarks: utils.ToQuarks(Number(amount)),
                isDeposit: true,
            } as ReceivePaymentsMetadata,
        } as Metadata;

        return new Intent(actions, metadata, env, rollback);
    }

    async getWithdrawIntent(payment: Payment): Promise<Intent> {
        const env = this.state.getEnvironment();
        const outgoing = this.getCurrentOutgoing();

        const { amount, address } = payment;

        if (this.getSlotBalance() < amount) {
            throw new Error("Not enough tokens in the organizer");
        }

        const rollback = this.getRollback();

        let actions;
        try {

            const preBalance = this.getTotalBalance();

            actions = [
                ...await this.withdrawTo(outgoing, amount),
                ...await this.sendFrom(outgoing, amount, address),
                ...await this.redistribute(),
            ];

            const postBalance = this.getTotalBalance();

            if (preBalance - postBalance !== amount) {
                throw new Error(`getWithdrawIntent: Balance mismatch after intent ${preBalance} - ${postBalance} != ${amount}`);
            }

        } catch (e) {
            rollback();
            throw e;
        }

        // TODO: double check that the actions are valid

        const metadata = {
            sendPayment: {
                destination: { value: address.toBuffer() },
                exchangeData: payment.metadata,
                isWithdrawal: true,
            } as SendPaymentMetadata,
        } as Metadata;

        return new Intent(actions, metadata, env, rollback);
    }

    getIncomingBalance(): bigint {
        return BigInt(this.state.getAllIncomingAccounts().reduce((acc, account) => acc + Number(account.cachedBalance), 0));
    }

    getOutgoingBalance(): bigint {
        return BigInt(this.state.getAllOutgoingAccounts().reduce((acc, account) => acc + Number(account.cachedBalance), 0));
    }

    getPrimaryBalance(): bigint {
        return this.state.getPrimaryTimelockAccount().cachedBalance;
    }

    getSlotBalance(): bigint {
        let total = BigInt(0);
        for (const slot of this.slots) {
            total += slot.getCurrentBalance();
        }
        return total;
    }

    getTotalBalance(): bigint {
        const accounts = this.state.getAllAccounts();
        let total = BigInt(0);
        for (const account of accounts) {
            total += account.getCachedBalance();
        }
        return total;
    }

    async redistribute(): Promise<Action[]> {
        // Redistribute the bills in the organizer to ensure there are no gaps
        // in consecutive slots. 

        // For example, avoid this:
        // ----------------------------------------------------------------
        // | slot 0 | slot 1 | slot 2 | slot 3 | slot 4 | slot 5 | slot 6 |
        // ----------------------------------------------------------------
        // |  1     |   0    |   10    |   10  |   0    |   0    |   0    | = 1,101
        //    ^---------^--- not optimal

        // Instead, we want this:
        // ----------------------------------------------------------------
        // | slot 0 | slot 1 | slot 2 | slot 3 | slot 4 | slot 5 | slot 6 |
        // ----------------------------------------------------------------
        // |  11     |   9   |    9   |   10   |   0    |   0    |   0    | = 1,101
        //     ^---------^--------┘  split the 10 downwards

        // The examples above both have the same total balance, but the second
        // example should allow for more efficient payments later down the line.

        // We also try to limit the number of bills in each slot as a secondary
        // goal. This is done by recursively exchanging large bills for smaller
        // bills and vice versa with rules around how many of each denomination
        // to keep. Typically, you never need more than 9 pennies to make any
        // payment.

        // Algorithm:
        // ---------------------------------------------------------------------
        //  1) First we take large bills and exchange them for smaller bills one
        //  at a time. We do this recursively until we can't exchange any more
        //  large bills to small ones. This spreads out our total balance over
        //  as many slots as possible.
        // 
        //  2) Then we take smaller bills and exchange them for larger bills if
        //  we have more than needed in any slot. This reduces the number of
        //  bills we have in total.
        //
        // This algorithm guarantees that we will never have gaps (zero balance)
        // between consecutive slots (e.g. 1000, 0, 10, 1).
        // ---------------------------------------------------------------------

        // TODO: this algorithm could be optimized to reduce the number of
        // transactions

        const actions = [
            ...await this.exchangeLargeToSmall(),
            ...await this.exchangeSmallToLarge(),
        ]

        return actions;
    }

    async exchangeLargeToSmall(): Promise<Action[]> {
        // Recursive function to exchange large bills to smaller bills (when
        // possible).

        // For example, if we have dimes but no pennies, we should break a dime
        // into pennies.

        for (let i = this.slots.length - 1; i >= 0; i--) {
            const current = this.slots[i];
            const previous = current.getLowerSlot();

            if (previous === undefined) {
                // We're at the lowest denomination, so we can't exchange
                // anymore.
                break;
            }

            if (current.getCurrentBillCount() < 1) {
                // Nothing to exchange, the current slot is empty.
                continue;
            }

            const howManyFit = current.getBillValue() / previous.getBillValue();

            if (previous.getCurrentBillCount() >= Number(howManyFit) - 1) {
                // No reason to exchange yet, the previous slot already has
                // enough bills most payments.
                continue;
            }

            return [
                // The previous slot is empty and we have a bill in the current slot,
                // so let's exchange one bill down a slot.
                ...await this.exchange(current, previous, current.getBillValue()),

                // Recurse to check if we can exchange more
                ...await this.exchangeLargeToSmall()
            ]
        }

        return [];
    }

    async exchangeSmallToLarge(): Promise<Action[]> {
        // Recursive function to exchange small bills to larger bills (when
        // possible).

        // For example, if we have 19 pennies or more, we should exchange excess
        // pennies for dimes. But if we only have 18 pennies or less, we
        // should not exchange any because we'd be unable to make a future
        // payment that has a $0.09 amount (there are some edge cases).

        for (let i = 0; i < this.slots.length; i++) {
            const current = this.slots[i];
            const next = current.getHeigherSlot();

            if (next === undefined) {
                // We're at the highest denomination, so we can't exchange
                // anymore.
                break;
            }

            // First we need to check how many bills of the current type fit
            // into the next slot.

            // Note: We could hard-code the following to base 10 numbers, but
            // its better to do the math in case we ever skip a denomination or
            // add a slot in-between. For example, we currently have 1 Kin,
            // 10 Kin, and 100 Kin slots, but we may ditch the 10 Kin slot in the
            // future and skip right to 100 Kin. Conversely, we may add a slot
            // between 100,000 Kin and 1,000,000 Kin. Either way, we should do the
            // math so that the code can stay flexible.

            const howManyFit = Number(next.getBillValue() / current.getBillValue());
            const howManyWeHave = current.getCurrentBillCount();
            const howManyToLeave = Math.min(howManyFit - 1, howManyWeHave);

            if (howManyWeHave < howManyFit) {
                // We don't have enough bills to exchange, so we can't do
                // anything in this slot at the moment.
                continue;
            }

            // Check if the exchange would consume too many bills. We want to
            // leave enough to make payments gracefully.
            if (howManyWeHave < ((howManyFit * 2) - 1)) {
                // We could make the exchange, but it would consume too many of
                // our bills in the current slot.
                continue;
            }

            // We have enough bills to exchange, so let's do it!
            const howManyToExchange = Math.floor((howManyWeHave - howManyToLeave) / howManyFit) * howManyFit;

            return [
                ...await this.exchange(current, next, BigInt(howManyToExchange) * current.getBillValue()),

                // Recurse to check if we can exchange more
                ...await this.exchangeSmallToLarge(),
            ];
        }

        return [];
    }

    async withdrawUsingNaiveStrategy(to: TimelockAccount, amount: bigint): Promise<Action[]> {
        // Try using a naive approach where we send from the amounts currently
        // in the slots. This will fail if we don't have enough of a particular
        // denomination in a slot to pay the amount. In that case, we'll need to
        // use another fallback strategy.

        // The assumption is that our redistribute() strategy will allow this
        // strategy to work most of the time.

        const actions = [];
        const outgoing = to;

        let remaining = amount;

        // From largest to smallest
        for (let i = this.slots.length - 1; i >= 0; i--) {
            const slot = this.slots[i];

            const howManyToSend = remaining / slot.getBillValue();
            if (howManyToSend < 1) {
                // No need to send any bills from this slot
                continue;
            }

            if (slot.getCurrentBillCount() < howManyToSend) {
                throw new Error("Not enough bills in slot");
            }

            actions.push(...[
                // Privately move the funds from the organizer to the outgoing
                ...await this.transfer(slot.account, outgoing, howManyToSend * slot.getBillValue()),
            ])

            // Update remaining amount
            remaining -= howManyToSend * slot.getBillValue();
        }

        if (remaining > 0) {
            // We should have sent all the funds
            throw new Error(`Cannot fund outgoing with ${amount}`);
        }

        return actions;
    }

    async withdrawUsingDynamicStrategy(to: TimelockAccount, amount: bigint): Promise<Action[]> {
        // Start at the smallest denomination and move upwards while adding
        // everything along the way until we reach a denomination that is larger
        // than the remaining amount. Then split and go backwards...
        //
        // Losely based on the following algorithm:
        // https://dl.acm.org/doi/10.1145/321864.321874

        const pre = this.prettyPrint();

        const { actions, index, remaining } = await this.withdrawUsingDynamicStrategyStep1(to, amount);

        // Note: it is possible under some circumstances that we will not need
        // step 2. For example, if we have enough balance in the smaller
        // denominations to pay the amount fully. This should be pretty rare
        // though. No special handling is needed for this case.

        try {
            actions.push(... await this.withdrawUsingDynamicStrategyStep2(to, index, remaining));
        } catch (e) {

            console.log(pre);
            console.log(this.prettyPrintActions(actions));
            console.log(this.prettyPrint());

            throw e;

        }

        return actions;
    }

    async withdrawUsingDynamicStrategyStep1(to: TimelockAccount, amount: bigint): Promise<{ actions: Action[], index: number, remaining: bigint }> {
        const actions = [];
        const outgoing = to;

        let remaining = amount;
        let index = 0;

        // Step 1, add up all our bills from smallest to largest to try to make
        // the requested amount.

        for (index = 0; index < this.slots.length; index++) {
            const slot = this.slots[index];

            if (slot.getBillValue() > remaining) {
                // We've reached a denomination that is larger than the
                // remaining amount, so we can stop and go backwards.
                break;
            }

            if (remaining < 1) {
                // We've sent enough funds (plus minus floating point errors... todo: use BN.js)
                return { actions, index, remaining };
            }

            const howManyFit = (remaining / slot.getBillValue()) * slot.getBillValue();
            const howMuchToSend = Math.min(Number(slot.getCurrentBalance()), Number(howManyFit));

            actions.push(...[
                // Privately move the funds from the organizer to the outgoing
                ...await this.transfer(slot.account, outgoing, BigInt(howMuchToSend)),
            ])

            // Update remaining amount
            remaining -= BigInt(howMuchToSend);

            // Check if the new remaining amount is less than the balance of the
            // current slot before going to the next slot.
            if (slot.getCurrentBalance() > remaining) {
                break;
            }
        }

        // If we went all the way to the end, the index might be one too
        // high due to the last for-loop interation.
        //index = Math.min(index, this.slots.length - 1);

        return { actions, index, remaining };
    }

    async withdrawUsingDynamicStrategyStep2(to: TimelockAccount, index: number, amount: bigint): Promise<Action[]> {
        const actions = [];
        const outgoing = to;

        let remaining = amount;
        if (remaining < 1) {
            // nothing to do
            return [];
        }

        // Step 2, reverse direction and split larger bills into smaller bills.

        // From our assumptions, we know that the slot we're currently at is is
        // not empty and should not be the lowest slot.

        const current = this.slots[index];
        const previous = current.getLowerSlot();
        if (previous === undefined) {
            throw new Error(`Unexpectedly reached lowest denomination`);
        }

        if (current.getCurrentBillCount() < 1) {
            console.log(`remaining: ${remaining}`);
            console.log(`index: ${index}`);
            throw new Error(`Unexpected empty slot`);
        }

        // We're going to break the current slot into the lower slot and then
        // transfer until remaining is 0.
        actions.push(...[
            ...await this.exchange(current, previous, current.getBillValue()),
        ]);

        for (let j = index - 1; j >= 0; j--) {
            const slot = this.slots[j];
            const previous = slot.getLowerSlot();

            const howManyToSend = (remaining / slot.getBillValue());
            if (slot.getCurrentBillCount() < howManyToSend) {
                // Should not happen...
                throw new Error("Not enough bills in slot");
            }

            if (previous !== undefined) {

                // We're splitting denominations all the way down (when
                // possible), in order to make sure we have enough in each slot.
                // Remember that the core assumption for why we're in this
                // strategy is that some slot didn't have enough to fill the
                // entire remaining amount.
                if (howManyToSend < slot.getCurrentBillCount()) {
                    actions.push(...[
                        ...await this.exchange(slot, previous, slot.getBillValue()),
                    ]);
                }
            }

            if (howManyToSend < 1) {
                // No need to send any bills from this slot
                continue;
            }

            actions.push(...[
                // Privately move the funds from the organizer to the outgoing
                ...await this.transfer(slot.account, outgoing, howManyToSend * slot.getBillValue()),
            ]);

            remaining -= howManyToSend * slot.getBillValue();
        }

        return actions;
    }

    async withdrawTo(to: TimelockAccount, amount: bigint): Promise<Action[]> {
        // This function sends money from the organizer to the outgoing
        // temporary account. It has to solve the interesting problem of
        // figuring out which denominations to use when making a payment.

        // Unfortunately, this is actually a pretty hard problem to solve optimally.
        // https://en.wikipedia.org/wiki/Change-making_problem

        // We're going to use the following approach, which should be pretty
        // good most of the time but definitely has room for improvement.
        // Specifically, we may want to move from a dynamic programming solution
        // to a greedy solution in the future.

        // Algorithm:
        // ---------------------------------------------------------------------
        // 1) Check the total balance to make sure we have enough to send.
        // 
        // 2) Try using a naive approach where we send from the amounts
        // currently in the slots. This will fail if we don't have enough of a
        // particular bill to pay the amount.
        //
        // 3) If step 2) fails, start at the smallest denomination and move
        // upwards while adding everything along the way until we reach a
        // denomination that is larger than the remaining amount. Then split and
        // go backwards... (dynamic programming strategy)
        // ---------------------------------------------------------------------

        // Do we even have enough balance to send this amount?
        if (this.getSlotBalance() < amount) {
            throw new Error("Not enough funds in organizer");
        }

        // Save cached balances in case we need to revert
        const cachedBalances: Map<TimelockAccount, bigint> = new Map();
        for (const account of this.state.getAllAccounts()) {
            cachedBalances.set(account, account.getCachedBalance());
        }

        try {
            // Try the naive approach first
            const result = await this.withdrawUsingNaiveStrategy(to, amount);
            // console.log("Using naive strategy");
            return result;
        } catch (e) {
            // The naive approach failed, so we'll need to use the fallback
            // strategy.

            //console.log("Using fallback strategy");

            // Revert balances
            for (const account of this.state.getAllAccounts()) {
                account.setCachedBalance(cachedBalances.get(account) || BigInt(0));
            }

            // Retry using fallback strategy
            return await this.withdrawUsingDynamicStrategy(to, amount);
        }
    }

    async depositFrom(from: TimelockAccount, amount: bigint): Promise<Action[]> {
        const actions = [];
        const incoming = from;

        let remaining = amount;

        // From largest to smallest
        for (let i = this.slots.length - 1; i >= 0; i--) {
            const slot = this.slots[i];

            const howManyToReceive = (remaining / slot.getBillValue());
            if (howManyToReceive < 1) {
                // No need to receive any bills from this slot
                continue;
            }

            actions.push(...[
                // Privately move the funds from the incoming to the organizer
                ...await this.transfer(incoming, slot.account, howManyToReceive * slot.getBillValue())
            ]);

            // Update remaining amount
            remaining -= howManyToReceive * slot.getBillValue();
        }

        if (remaining > 0) {
            // Somone may have sent us some dust...
            console.log(`Received dust of ${remaining} from incoming`);
        }

        return actions;
    }

    async rotateIncoming(): Promise<Action[]> {
        const primary = this.getPrimaryAccount();
        const oldAccount = this.getCurrentIncoming();
        const newAccount = await this.state.newIncomingAccount();

        const actions = [
            new CloseEmptyAccountAction(oldAccount, 1),
            new OpenAccountAction(newAccount),
            new CloseDormantAccountAction(newAccount, primary.getVault()),
        ];

        return actions;
    }

    async rotateOutgoing(): Promise<Action[]> {
        const primary = this.getPrimaryAccount();
        const newAccount = await this.state.newOutgoingAccount();

        const actions = [
            new OpenAccountAction(newAccount),
            new CloseDormantAccountAction(newAccount, primary.getVault()),
        ];

        return actions;
    }

    async sendFrom(from: TimelockAccount, amount: bigint, destination: PublicKey): Promise<Action[]> {

        if (!from.canUseForTransfer()) {
            throw new Error(`Cannot transfer from ${from.getVault().toBase58()}, its state is ${utils.prettyPrintManagementState(from.getManagementState())} and it has a balance source ${utils.prettyPrintBalanceSource(from.getBalanceSource())}`);

        }

        from.cachedBalance -= amount;

        return [
            new NoPrivacyWithdrawAction(from, destination, Number(amount)),
        ]
    }

    async anonymize(amount: bigint, newAction: (val: bigint) => Action): Promise<Action[]> {
        // The primary job of this function is to ensure we're not transferring
        // amounts that could de-anonymize the sender.  With that in mind, we
        // want to limit the "amount" we transfer to be one of the denominations
        // that we've defined in the organizer.

        // Important: Even though we're transfering between two particular slots
        // that have two particular denominations, we can ignore that and use
        // any denomiation when exchanging.

        // The reason is that we need to consider malicious quantities being
        // added to slots external to our system. For example, if someone adds 1
        // million kin to the 1 kin slot, we cannot demand that transfers out of
        // that slot be only in denominations of 10 kin. This would consume an
        // unreasonable amount of transactions. Instead, we would allow multiple
        // transfers from the table below. For example: 900,000 kin, 90,000 kin, 
        // 9,000 kin, 900 kin, and 90 kin when moving 999,990 kin out. 
        
        // The anonymize function makes sure that only transfers of the
        // following amounts are allowed:

        //   9,000,000 Kin |   8,000,000 Kin |   7,000,000 Kin |   6,000,000 Kin |   5,000,000 Kin |   4,000,000 Kin |   3,000,000 Kin |   2,000,000 Kin |   1,000,000 Kin 
        //     900,000 Kin |     800,000 Kin |     700,000 Kin |     600,000 Kin |     500,000 Kin |     400,000 Kin |     300,000 Kin |     200,000 Kin |     100,000 Kin 
        //      90,000 Kin |      80,000 Kin |      70,000 Kin |      60,000 Kin |      50,000 Kin |      40,000 Kin |      30,000 Kin |      20,000 Kin |      10,000 Kin 
        //       9,000 Kin |       8,000 Kin |       7,000 Kin |       6,000 Kin |       5,000 Kin |       4,000 Kin |       3,000 Kin |       2,000 Kin |       1,000 Kin 
        //         900 Kin |         800 Kin |         700 Kin |         600 Kin |         500 Kin |         400 Kin |         300 Kin |         200 Kin |         100 Kin 
        //          90 Kin |          80 Kin |          70 Kin |          60 Kin |          50 Kin |          40 Kin |          30 Kin |          20 Kin |          10 Kin 
        //           9 Kin |           8 Kin |           7 Kin |           6 Kin |           5 Kin |           4 Kin |           3 Kin |           2 Kin |           1 Kin 

        // So, if we're given an amount of 42,000,000 kin, this function will
        // generate 4 actions: 9,000,000 + 9,000,000 + 9,000,000 + 5,000,000.

        const actions: Action[] = [];
        /*
        const val = amount;
            actions.push(newAction(val));

            // Bookkeeping for stats output (not required and intended for debugging)
            Organizer.distribution.set(val,
                (Organizer.distribution.get(val) || 0) + 1);
                */
        

        // Split the desired amount into allowed values
        let remaining = amount;
        while (remaining > 0) {
            // find the largest denomination that is less than or equal to the remaining amount
            const allowedAmount = ValidTransferAmounts.find((d) => d <= remaining);
            if (!allowedAmount) {
                throw new Error(`Cannot anonymize ${remaining} kin`);
            }

            const val = BigInt(allowedAmount);
            actions.push(newAction(val));
            remaining -= val;

            // Bookkeeping for stats output (not required and intended for debugging)
            Organizer.distribution.set(val,
                (Organizer.distribution.get(val) || 0) + 1);
        }

        return actions;
    }

    async exchange(from: Slot, to: Slot, amount: bigint): Promise<Action[]> {
        // A private exchange between two slots (in the monopoly context, this
        // is you breaking a bill into smaller ones or vice-versa).

        if (!from.account.canUseForTransfer()) {
            throw new Error(`Cannot transfer from ${from.account.getVault().toBase58()}, its state is ${utils.prettyPrintManagementState(from.account.getManagementState())} and it has a balance source ${utils.prettyPrintBalanceSource(from.account.getBalanceSource())}`);

        }

        if (!to.account.canUseForTransfer()) {
            throw new Error(`Cannot transfer to ${to.account.getVault().toBase58()}, its state is ${utils.prettyPrintManagementState(to.account.getManagementState())} and it has a balance source ${utils.prettyPrintBalanceSource(to.account.getBalanceSource())}`);
        }

        const actions = await this.anonymize(amount, (howMuchToSend) => {
            // Update the cached balances
            from.account.cachedBalance -= howMuchToSend;
            to.account.cachedBalance += howMuchToSend;

            return new TemporaryPrivacyExchangeAction(
                from.account, to.account.getVault(), Number(howMuchToSend));
        });

        // Check that the generated actions are as expected
        for (const item of actions) {
            const action = item as TemporaryPrivacyExchangeAction;
            if (action.account !== from.account) {
                throw new Error(`Expected action source to be ${from.account.getVault().toBase58()}, but it was ${action.account.vault.toBase58()}`);
            }
            
            if (action.destination !== to.account.getVault()) {
                throw new Error(`Expected action destination to be ${to.account.getVault().toBase58()}, but it was ${action.destination.toBase58()}`);
            }
        }

        return actions;
    }

    async transfer(from: TimelockAccount, to: TimelockAccount, amount: bigint): Promise<Action[]> {
        // A private transfer between one of the organizer's accounts.

        if (!from.canUseForTransfer()) {
            throw new Error(`Cannot transfer from ${from.getVault().toBase58()}, its state is ${utils.prettyPrintManagementState(from.getManagementState())} and it has a balance source ${utils.prettyPrintBalanceSource(from.getBalanceSource())}`);

        }

        if (!to.canUseForTransfer()) {
            throw new Error(`Cannot transfer to ${to.getVault().toBase58()}, its state is ${utils.prettyPrintManagementState(to.getManagementState())} and it has a balance source ${utils.prettyPrintBalanceSource(to.getBalanceSource())}`);
        }

        const actions = await this.anonymize(amount, (howMuchToSend) => {
            // Update the cached balances
            from.cachedBalance -= howMuchToSend;
            to.cachedBalance += howMuchToSend;

            return new TemporaryPrivacyTransferAction(
                from, to.getVault(), Number(howMuchToSend));
        });

        // Check that the generated actions are as expected
        for (const item of actions) {
            const action = item as TemporaryPrivacyTransferAction;
            if (action.account !== from) {
                throw new Error(`Expected action source to be ${from.getVault().toBase58()}, but it was ${action.account.vault.toBase58()}`);
            }
            
            if (action.destination !== to.getVault()) {
                throw new Error(`Expected action destination to be ${to.getVault().toBase58()}, but it was ${action.destination.toBase58()}`);
            }
        }

        return actions;
    }

    prettyPrint(): string {
        return utils.prettyPrintOrganizer(this);
    }

    prettyPrintActions(actions: Action[]): string {
        return utils.prettyPrintActions(this, actions);
    }

    // Internal map for printing out the distribution of bills moved by all
    // organizers. This is not needed for anything but verifing that there are
    // no outliers.
    static distribution = new Map<bigint, number>();
}
