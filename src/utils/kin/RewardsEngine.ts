import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export const KREAppIndex = 268
export const KREMagicByte = 0x1

// TransactionType is the memo transaction type.
enum KRETransactionType  {
	TransactionTypeUnknown = -1,
	TransactionTypeNone,
	TransactionTypeEarn,
	TransactionTypeSpend,
	TransactionTypeP2P,
}

// HighestVersion is the highest 'supported' memo version by
// the implementation.
export const HighestVersion = 1

export function getKREMemoInstruction() : TransactionInstruction {
    const data = getKREMemoData(HighestVersion, KRETransactionType.TransactionTypeP2P, KREAppIndex, []);
	const encoded = Buffer.from(data).toString("base64");
    return new TransactionInstruction({
        keys: [],
        programId: new PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo"),
        data: Buffer.from(encoded),
    });
}

// Create a special memo instruction that will be used to identify the
// transaction on the KRE side.
// https://github.com/code-wallet/code-server/blob/master/pkg/kin/memo.go#L36
function getKREMemoData(v:number, t:KRETransactionType, appIndex:number, foreignKey: number[]): number[] {
	// prefil m with zeros
	const m = new Array(32).fill(0);

    if (foreignKey.length > 29) {
        throw new Error("foreign key too long");
    }
    if (v>7) {
        throw new Error("version too large");
    }
    if (t<0 || t>31) {
        throw new Error("invalid transaction type");
    }

    m[0] = KREMagicByte;
    m[0] |= v<<2;
    m[0] |= (t & 0x7) << 5;

	m[1] = (t & 0x18) >> 3;
	m[1] |= (appIndex & 0x3f) << 2;

	m[2] = (appIndex & 0x3fc0) >> 6;
	m[3] = (appIndex & 0xc000) >> 14;

	if (foreignKey.length > 0) {
		m[3] |= (foreignKey[0] & 0x3f) << 2

		// Insert the rest of the fk. since each loop references fk[n] and fk[n+1], the upper bound is offset by 3 instead of 4.
		for (let i = 4; i < 3+foreignKey.length; i++) {
			// apply last 2-bits of current byte
			// apply first 6-bits of next byte
			m[i] = (foreignKey[i-4] >> 6) & 0x3;
			m[i] |= (foreignKey[i-3] & 0x3f) << 2;
		}

		// if the foreign key is less than 29 bytes, the last 2 bits of the FK can be included in the memo
		if (foreignKey.length < 29) {
			m[foreignKey.length + 3] = (foreignKey[foreignKey.length-1] >> 6) & 0x3;
		}
	}

    return m;
}

