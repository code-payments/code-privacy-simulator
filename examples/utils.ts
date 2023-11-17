import dotenv from 'dotenv';
import * as fs from 'fs';
import * as readline from "readline";
import * as code from '../src/code';

dotenv.config();

export function isInitialized() : boolean {
    return process.env.INITIALIZED == "true";
}

export function setInitialized(val: boolean) : void {
    setEnvVar("INITIALIZED", val ? "true" : "false");
}

export function isVerified() : boolean {
    return process.env.VERIFIED == "true";
}

export function setVerified(val: boolean) : void {
    setEnvVar("VERIFIED", val ? "true" : "false");
}

export function getOrCreateKeyphrase() : string {
    const keyphrase = getOrSetEnvVar("KEYPHRASE", code.Utils.MnemonicPhrase.generate().getPhrase());

    if (!process.env.KEYPHRASE) {
        saveKeyphrase(keyphrase);
    }

    return keyphrase;
}

export function getLastIncomingIndex() : number {
    return parseInt(getOrSetEnvVar("LAST_INCOMING", '0'));
}
export function getLastOutgoingIndex() : number {
    return parseInt(getOrSetEnvVar("LAST_OUTGOING", '0'));
}
export function setLastIncomingIndex(index: number) {
    setEnvVar("LAST_INCOMING", index.toString());
}
export function setLastOutgoingIndex(index: number) {
    setEnvVar("LAST_OUTGOING", index.toString());
}

function getOrSetEnvVar(key: string, val: string) {
    const existing = process.env[key];

    if (existing) {
        console.log(`Using existing ${key} = "${existing}" from .env file`);
        return existing;
    } else {
        setEnvVar(key, val);
        return val;
    }
}

function setEnvVar(key: string, val: string) {
    //console.log(`Writing ${key}=${val} to .env file`);

    // Read the .env file and replace the index
    let data = fs.readFileSync('.env', 'utf8');
    const regex = new RegExp(`^${key}=.*`, 'm');

    if (data.match(regex)) {
        data = data.replace(regex, `${key}=${val}`);
    } else {
        data += `\n${key}=${val}`;
    }

    // Write the new .env file
    fs.writeFileSync('.env', data);
}

export function readInput(question: string) : Promise<string> {
    // Read a single line of input from stdin

    const client = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => client.question(question, answer => {
        client.close();
        resolve(answer);
    }))
}

export function saveKeyphrase(keyphrase: string) {
    // Save the keyphrase to a file, in case we ever need it again

    if (!fs.existsSync('cache')) {
        fs.mkdirSync('cache');
    }

    if (!fs.existsSync('cache/keys')) {
        fs.mkdirSync('cache/keys');
    }

    const keypair = code.getOwnerKeypair(keyphrase);
    const pubkey = keypair.publicKey.toBase58();

    fs.writeFileSync(`cache/keys/${pubkey}`, keyphrase);
}
