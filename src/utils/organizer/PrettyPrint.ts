import { AccountType, BalanceSource, ManagementState, TimelockAccount } from "../../accounts/TimelockAccount";
import { Action, CloseDormantAccountAction, CloseEmptyAccountAction, NoPrivacyWithdrawAction, OpenAccountAction, TemporaryPrivacyExchangeAction, TemporaryPrivacyTransferAction } from "../../types/Action";
import { Organizer } from "../../types/Organizer";
import { Tray } from "../../types/Tray";

export function prettyPrintState(state: Tray): string {
    const header = [
        'Timelock'.padEnd(45),
        'Vault'.padEnd(45),
        'AccountType'.padEnd(25),
        'Index'.padEnd(7),
        'Balance'.padEnd(15),
        'BalanceSource'.padEnd(15),
        'ManagmentState'.padEnd(15),
    ].join(' | ')

    return [
        '\n\n',
        header,
        '-'.repeat(header.length),
        ...state.getAllAccounts().map((account) => {
            return [
                    account.address.toBase58().padStart(45),
                    account.getVault().toBase58().padStart(45),
                    prettyPrintAccountType(account.getAccountType()).padStart(25),
                    account.getDerivationIndex().toString().padStart(7),
                    (account.getCachedBalance().toLocaleString('en-US') + ' Kin').padStart(15),
                    prettyPrintBalanceSource(account.getBalanceSource()).padStart(15),
                    prettyPrintManagementState(account.getManagementState()).padStart(15),
            ].join(' | ')
        }),
    ].join('\n');
}

export function prettyPrintOrganizer(organizer: Organizer): string {
    const padding = 16;
    const empty = " ".repeat(padding);

    const primary = organizer.getPrimaryAccount(),
        slots = organizer.getSlots(),
        incoming = organizer.getIncomingAccounts(),
        outgoing = organizer.getOutgoingAccounts();

    const counts = [
        empty,
        empty,
        incoming.map(() => empty).join("|"),
        slots.slice(0).reverse().map( (slot) => `${slot.account.cachedBalance / slot.getBillValue()} x ░ `.padStart(padding)).join("|"),
        outgoing.map(() => empty).join("|"),
    ].join("|");

    const values = [
        empty,
        ` ${primary.getCachedBalance().toLocaleString("en-US")} `.padStart(padding),
        incoming.map((a) => `${a.getCachedBalance().toLocaleString("en-US")} `.padStart(padding)).join("|"),
        slots.slice(0).reverse().map((a) => `(${a.getCurrentBalance().toLocaleString("en-US")}) `.padStart(padding)).join("|"),
        outgoing.map((a) => `${a.getCachedBalance().toLocaleString("en-US")} `.padStart(padding)).join("|"),
    ].join("|");

    const slotBalance = organizer.getSlotBalance();
    const totalBalance = organizer.getTotalBalance();
    const incomingBalance = organizer.getIncomingBalance();
    const outgoingBalance = organizer.getOutgoingBalance();

    const hr = `${"-".repeat(counts.length)}`;
    const br = `\n\n`;

    return [
        prettyPrintAccounts(organizer),
        counts,
        values,
        br,
        (`${'Primary:'.padEnd(padding)}`+`${primary.getCachedBalance().toLocaleString("en-US").padStart(padding)} `).padStart(hr.length),
        (`${'Slots:'.padEnd(padding)}`+`${slotBalance.toLocaleString("en-US").padStart(padding)} `).padStart(hr.length),
        (`${'Incoming:'.padEnd(padding)}`+`${incomingBalance.toLocaleString("en-US").padStart(padding)} `).padStart(hr.length),
        (`${'Outgoing:'.padEnd(padding)}`+`${outgoingBalance.toLocaleString("en-US").padStart(padding)} `).padStart(hr.length),
        hr,
        (`${'Total:'.padEnd(padding)}`+`${totalBalance.toLocaleString("en-US").padStart(padding)}\n`).padStart(hr.length),
    ].join(`\n`);
}

export function prettyPrintAccounts(organizer: Organizer): string {
    const padding = 16;
    const empty = " ".repeat(padding);

    const primary = organizer.getPrimaryAccount(),
        slots = organizer.getSlots(),
        incoming = organizer.getIncomingAccounts(),
        outgoing = organizer.getOutgoingAccounts();

    const index = [
        empty,
        ` PRIMARY`.padEnd(padding),
        incoming.map((_, i) => ` INCOMING ${i}`.padEnd(padding)).join("|"),
        slots.slice(0).reverse().map((_, i) => ` SLOT ${slots.length - i}`.padEnd(padding)).join("|"),
        outgoing.map((_, i) => ` OUTGOING ${i}`.padEnd(padding)).join("|"),
    ].join("|");

    const denomination = [
        empty,
        empty,
        incoming.map(() => empty).join("|"),
        slots.slice(0).reverse().map((slot) => ` ${slot.getBillValue().toLocaleString("en-US")}'s`.padEnd(padding)).join("|"),
        outgoing.map(() => empty).join("|"),
    ].join("|")

    const addresses = [
        "Address".padEnd(padding),
        ` ${primary.address.toBase58().substring(0,13)}… `.padEnd(padding),
        incoming.map((a) => ` ${a.address.toBase58().substring(0,13)}… `.padEnd(padding)).join("|"),
        slots.slice(0).reverse().map((a) => ` ${a.account.address.toBase58().substring(0,13)}… `.padEnd(padding)).join("|"),
        outgoing.map((a) => ` ${a.address.toBase58().substring(0,13)}… `.padEnd(padding)).join("|"),
    ].join("|");

    const vaults = [
        "Token Account".padEnd(padding),
        ` ${primary.getVault().toBase58().substring(0,13)}… `.padEnd(padding),
        incoming.map((a) => ` ${a.getVault().toBase58().substring(0,13)}… `.padEnd(padding)).join("|"),
        slots.slice(0).reverse().map((a) => ` ${a.account.getVault().toBase58().substring(0,13)}… `.padEnd(padding)).join("|"),
        outgoing.map((a) => ` ${a.getVault().toBase58().substring(0,13)}… `.padEnd(padding)).join("|"),
    ].join("|");

    const hr = `${"-".repeat(index.length)}`;
    const br = `\n\n`;

    return [
        br,
        index,
        denomination,
        addresses.replace(/[^|]/g, " "),
        addresses,
        vaults,
        hr.replace(/-{17}/g, "----------------+"),
    ].join(`\n`);
}

export function prettyPrintActions(organizer: Organizer, action: Action[]): string {
    const padding = 16;
    const empty = " ".repeat(padding);

    const primary = organizer.getPrimaryAccount(),
        slots = organizer.getSlots(),
        incoming = organizer.getIncomingAccounts(),
        outgoing = organizer.getOutgoingAccounts();
    
    const accounts : TimelockAccount[] = [
        primary,
        ...incoming,
        ...slots.slice(0).reverse().map((slot) => slot.account),
        ...outgoing,
    ];

    const lines = action.map((item) => {

        if (item instanceof OpenAccountAction) {
            const name = `Open`.padEnd(padding);

            return [
                name,
                ...accounts.map((o) => {
                    if (o == item.account) {
                        return `*new* `.padStart(padding);
                    }
                    return empty;
                })
            ].join("|")
        }

        if (item instanceof CloseEmptyAccountAction) {
            const name = `CloseEmpty`.padEnd(padding);

            return [
                name,
                ...accounts.map((o) => {
                    if (o == item.account) {
                        return `*close* `.padStart(padding);
                    }
                    return empty;
                })
            ].join("|")
        }

        if (item instanceof CloseDormantAccountAction) {
            const name = `CloseDormant`.padEnd(padding);

            return [
                name,
                ...accounts.map((o) => {
                    if (o == item.account) {
                        return `*close* `.padStart(padding);
                    }
                    return empty;
                })
            ].join("|")
        }

        if (item instanceof TemporaryPrivacyExchangeAction) {
            const a = item as TemporaryPrivacyExchangeAction;
            const name = `Exchange`.padEnd(padding);
            const from = a.account;
            const to = accounts.find((item) => item.vault.equals(a.destination))!;

            return [
                name,
                ...accounts.map((o) => {
                    if (o == from) {
                        return ` -${a.amount}`.padEnd(padding);
                    }
                    if (o == to) {
                        return ` +${a.amount}`.padEnd(padding);
                    }
                    return empty;
                })
            ].join("|")
        }

        if (item instanceof TemporaryPrivacyTransferAction) {
            const a = item as TemporaryPrivacyTransferAction;
            const name = `Transfer`.padEnd(padding);
            const from = a.account;
            const to = accounts.find((item) => item.vault.equals(a.destination))!;

            return [
                name,
                ...accounts.map((o) => {
                    if (o == from) {
                        return ` -${a.amount}`.padEnd(padding);
                    }
                    if (o == to) {
                        return ` +${a.amount}`.padEnd(padding);
                    }
                    return empty;
                })
            ].join("|")
        }

        if (item instanceof NoPrivacyWithdrawAction) {
            const a = item as NoPrivacyWithdrawAction;
            const name = `Withdraw`.padEnd(padding);
            const from = a.account;
            const to = accounts.find((item) => item.vault.equals(a.destinationTokenAccount))!;

            return [
                name,
                ...accounts.map((o) => {
                    if (o == from) {
                        return ` -${a.amount} *close*`.padEnd(padding);
                    }
                    if (o == to) {
                        return ` +${a.amount}`.padEnd(padding);
                    }
                    return empty;
                })
            ].join("|")
        }

        return "";
    });

    const br = `\n\n`;

    return [
        prettyPrintAccounts(organizer),
        ...lines,
        br,
    ].join("\n");
}

export function prettyPrintValueMap(): string {
    const valueCountMap = Organizer.distribution;

    const values = Array.from(valueCountMap.keys()).sort((a, b) => Number(b - a));
    const counts = values.map((v) => valueCountMap.get(v) || 0);

    /*
    // print a horizontal table of values and counts
    const padding = 16;
    const rows = [];
    for (let i = 0; i < values.length / 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            row.push(` ${counts[i*9+j]}x`.padEnd(5)+`${values[i*9+j].toLocaleString("en-US")} Kin `.padStart(padding));
        }
        rows.push(row.join("|"));
    }
    */

    // Print a vertical table of values and counts
    const rows = values.map((v, i) => ` ${counts[i]}x`.padEnd(10)+`${v.toLocaleString("en-US")} Kin `.padStart(16));

    return [
        //"\n", "\n",
        "\nValues distribution:\n",
        rows.join("\n"),
        "\n",
        //"Total Transfers:\n",
        //counts.reduce((a, b) => a + b, 0),
        //"\n", "\n",
    ].join("\n");
}

export function prettyPrintAccountType(val: AccountType): string {
    switch (val) {
        case AccountType.Primary:
            return "Primary";
        case AccountType.Incoming:
            return "Temporary Incoming";
        case AccountType.Outgoing:
            return "Temporary Outgoing";
        case AccountType.Slot1:
            return "Bucket 1 Kin";
        case AccountType.Slot2:
            return "Bucket 10 Kin";
        case AccountType.Slot3:
            return "Bucket 100 Kin";
        case AccountType.Slot4:
            return "Bucket 1,000 Kin";
        case AccountType.Slot5:
            return "Bucket 10,000 Kin";
        case AccountType.Slot6:
            return "Bucket 100,000 Kin";
        case AccountType.Slot7:
            return "Bucket 1,000,000 Kin";
        default:
            return "Unknown";
    }
}

export function prettyPrintBalanceSource(val: BalanceSource): string{
    switch (val) {
        case BalanceSource.Blockchain:
            return "Blockchain";
        case BalanceSource.Cache:
            return "Cache";
        default:
            return "Unknown";
    }
}

export function prettyPrintManagementState(val: ManagementState): string{
    switch (val) {
        case ManagementState.None:
            return "None";
        case ManagementState.Locking:
            return "Locking";
        case ManagementState.Locked:
            return "Locked";
        case ManagementState.Unlocking:
            return "Unlocking";
        case ManagementState.Unlocked:
            return "Unlocked";
        case ManagementState.Closing:
            return "Closing";
        case ManagementState.Closed:
            return "Closed";
        default:
            return "Unknown";
    }
}

