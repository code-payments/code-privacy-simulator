import { AccountType } from "../accounts/TimelockAccount";

export enum Denomination {
    Ones                = 1,
    Tens                = 10,
    OneHundreds         = 100,
    OneThousands        = 1000,
    TenThousands        = 10000,
    OneHundredThousands = 100000,
    OneMillions         = 1000000,
}

export const VariationCount = 9;
export const DenominationsList = Object.values(Denomination).filter((v) => !isNaN(Number(v))).map((v) => v as Denomination);
export const SlotCount = DenominationsList.length;
export const ValidVariations : number[] = Array.from(Array(VariationCount).keys()).map(x => x + 1);
export const ValidTransferAmounts : number[] = [...new Set(DenominationsList.map((d) => (ValidVariations.map((n) => n * d))).reduce((a, b) => a.concat(b), []).sort((a, b) => b - a))];

// Valid Transfer Amounts (when SlotCount = 7 and VariationCount = 1)
//
//   1,000,000 Kin 
//     100,000 Kin 
//      10,000 Kin 
//       1,000 Kin 
//         100 Kin 
//          10 Kin 
//           1 Kin 

// Valid Transfer Amounts (when SlotCount = 7 and VariationCount = 9)
//
//   1,000,000 Kin |   2,000,000 Kin |   3,000,000 Kin |   4,000,000 Kin |   5,000,000 Kin |   6,000,000 Kin |   7,000,000 Kin |   8,000,000 Kin |   9,000,000 Kin
//     100,000 Kin |     200,000 Kin |     300,000 Kin |     400,000 Kin |     500,000 Kin |     600,000 Kin |     700,000 Kin |     800,000 Kin |     900,000 Kin
//      10,000 Kin |      20,000 Kin |      30,000 Kin |      40,000 Kin |      50,000 Kin |      60,000 Kin |      70,000 Kin |      80,000 Kin |      90,000 Kin
//       1,000 Kin |       2,000 Kin |       3,000 Kin |       4,000 Kin |       5,000 Kin |       6,000 Kin |       7,000 Kin |       8,000 Kin |       9,000 Kin
//         100 Kin |         200 Kin |         300 Kin |         400 Kin |         500 Kin |         600 Kin |         700 Kin |         800 Kin |         900 Kin 
//          10 Kin |          20 Kin |          30 Kin |          40 Kin |          50 Kin |          60 Kin |          70 Kin |          80 Kin |          90 Kin
//           1 Kin |           2 Kin |           3 Kin |           4 Kin |           5 Kin |           6 Kin |           7 Kin |           8 Kin |           9 Kin

export function fromAccountType(type: AccountType) : Denomination {
    /*
    switch (type) {
        case AccountType.Slot1:
            return Denomination.Ones;
        case AccountType.Slot2:
            return Denomination.Tens;
        case AccountType.Slot3:
            return Denomination.OneHundreds;
        case AccountType.Slot4:  
            return Denomination.OneThousands;
        case AccountType.Slot5:  
            return Denomination.TenThousands;
        case AccountType.Slot6:
            return Denomination.OneHundredThousands;
        case AccountType.Slot7:
            return Denomination.OneMillions;
        default:
            throw new Error("Invalid account type");
    }
    */

    // Same as above, but less hard-coded
    const offset : number = AccountType.Slot1;
    for (let i = 0; i < DenominationsList.length; i++) {
        if (type === (i + offset) as AccountType) {
            return DenominationsList[i] as Denomination;
        }
    }

    throw new Error("Invalid account type");

}

export function toAccountType(denomination: Denomination) : AccountType {
    /*
    switch (denomination) {
        case Denomination.Ones:
            return AccountType.Slot1;
        case Denomination.Tens:
            return AccountType.Slot2;
        case Denomination.OneHundreds:
            return AccountType.Slot3;
        case Denomination.OneThousands:
            return AccountType.Slot4;
        case Denomination.TenThousands:
            return AccountType.Slot5;
        case Denomination.OneHundredThousands:
            return AccountType.Slot6;
        case Denomination.OneMillions:
            return AccountType.Slot7;
        default:
            throw new Error("Invalid denomination");
    }
    */

    // Same as above, but less hard-coded
    const offset : number = AccountType.Slot1;
    for (let i = 0; i < DenominationsList.length; i++) {
        if (denomination === DenominationsList[i]) {
            return (i + offset) as AccountType;
        }
    }

    throw new Error("Invalid denomination");
}