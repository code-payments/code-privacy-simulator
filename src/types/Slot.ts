import { TimelockAccount } from "../accounts/TimelockAccount";
import { Denomination } from "./Denomination";

export class Slot {
    type: Denomination;
    account: TimelockAccount;

    // Double linked list for convenience
    previous?: Slot; // The next lower denomination of bill
    next?: Slot;     // The next higher denomination of bill

    constructor(type: Denomination, account: TimelockAccount) {
        this.type = type;
        this.account = account;
    }

    getLowerSlot(): Slot | undefined {
        return this.previous;
    }

    getHeigherSlot(): Slot | undefined {
        return this.next;
    }

    getCurrentBillCount(): number {
        // How many bills of this type do we actually have?
        const billValue : bigint = this.getBillValue();
        const currentBalance : bigint = this.getCurrentBalance();
        return Number(currentBalance / billValue);
    }

    getBillValue(): bigint {
        return BigInt(this.type);
    }

    getCurrentBalance(): bigint {
        // How much money is in this slot? (not the same as what count of bills
        // we have)
        return this.account.getCachedBalance();
    }
}
