import * as grpc from "@grpc/grpc-js";
import * as api from "../grpc/transaction/v2/transaction_service";
import * as api_common from "../grpc/common/v1/model";
import * as ed25519 from '@noble/ed25519';
import { Environment } from "./Environment";
import { Keypair, Transaction } from "@solana/web3.js";
import { Action, TemporaryPrivacyExchangeAction, TemporaryPrivacyTransferAction } from "./Action";
import { getTransactionInspectLink } from "../utils";
import { getOwnerKeypair } from "../accounts";

export type RollbackFunc = () => void;
export const DefaultRollback = () => { /* no-op */ };

export class Intent {
    id : any;
    env: Environment;
    metadata: api.Metadata;
    actions: Action[];
    rollback: RollbackFunc;

    constructor(actions: Action[], metadata: api.Metadata, env: Environment, fn: RollbackFunc = DefaultRollback) {
        this.actions = actions;
        this.metadata = metadata;
        this.env = env;
        this.rollback = fn;

        // Generate a random ID for this intent
        this.id = (new Keypair).publicKey.toBuffer();

        // Set ids for all actions
        let actionId = 0;
        for (const action of actions) {
            action.setId(actionId++);

            // Some actions need to know what intent they are part of
            if (action instanceof TemporaryPrivacyExchangeAction || 
                action instanceof TemporaryPrivacyTransferAction) {
                action.intentId = this.id;
            }
        }
    }

    async toProto(): Promise<api.SubmitIntentRequest> {
        const owner = getOwnerKeypair(this.env.keyphrase);
        const metadata = this.metadata;
        const actions : api.Action[] = [];

        for (const action of this.actions) {
            const proto = await action.toProto()
            actions.push(proto);
        }

        const submitActions = {
            id: { value: this.id },
            owner: { value: owner.publicKey.toBuffer() },
            metadata,
            actions,
        } as api.SubmitIntentRequest_SubmitActions;

        // Sign the payload using the owner's keypair
        const buf = api.SubmitIntentRequest_SubmitActions.encode(submitActions).finish();
        const sig = await ed25519.sign(buf, owner.secretKey.subarray(0, 32));

        // Verify the signature
        if (!await ed25519.verify(sig, buf, owner.publicKey.toBuffer())){
            throw new Error("Signature verification failed");
        }

        //console.log ("submitActionsReq", submitActions);

        return api.SubmitIntentRequest.fromJSON({ 
            submitActions: {
                ...submitActions,
                signature: { value: Buffer.from(sig) },
            }
        });
    }

    async submit(client: api.TransactionClient) : Promise<void> {
        const req = await this.toProto();

        return new Promise((resolve, reject) => {
            const stream: grpc.ClientDuplexStream<
                api.SubmitIntentRequest,
                api.SubmitIntentResponse> = client.submitIntent();

            // Setup stream event handlers
            stream.on("data", async (res: api.SubmitIntentResponse) => {
                if (res.error) {
                    await handleError(res, this.env, this.actions);
                    reject(res.error);
                    return;
                }

                if (res.success) {
                    console.log("Intent submitted successfully");
                    stream.end();
                    resolve();
                    return;
                }

                // Submit the signatures for the intent
                if (res.serverParameters) {
                    const req = await this.sign(res);
                    stream.write(req);
                    stream.end();
                }
            });
            stream.on("end", () => { resolve(); });
            stream.on("error", (error: Error) => {
                console.log(error);
                reject(error);
            });

            // Submit the intent
            stream.write(req);
        });
    }

    async sign(data: api.SubmitIntentResponse) : Promise<api.SubmitIntentRequest> {
        // Check that we have received the same amount of params as actions that
        // that were submitted.
        const params : api.ServerParameter[] = data.serverParameters!.serverParameters!;
        if (params.length != this.actions.length) {
            new Error("Unexpected number of server parameters");
        }

        // Setup the signature response
        const res = api.SubmitIntentRequest.fromJSON({
                submitSignatures: {
                    signatures: [] as api_common.Signature[],
                } as api.SubmitIntentRequest_SubmitSignatures,
            } as api.SubmitIntentRequest
        );

        // Iterate through all the actions and identify those that
        // require at least one client signature. Clients use a
        // well-known construction heuristic using client and server
        // parameters to make the transaction for signing.
        for (let i = 0; i < params.length; i++) {
            const param : api.ServerParameter = params[i];
            const action : Action = this.actions[i];

            // Update the action with server parameters (if any)
            await action.updateFromServerResponse(param);

            // Append the signatures to our response
            const signatures = await action.getSignatures(this.env);

            // Add remaining signatures to the response
            for (const value of signatures) {
                res.submitSignatures!.signatures.push({
                    value: Buffer.from(value),
                } as api_common.Signature);
            }
        }

        //console.log("submitSignaturesReq", res.submitSignatures?.signatures);

        return res;
    }
}


async function handleError(res: api.SubmitIntentResponse, env: Environment, actions: Action[]) {
    // Very crude error handling for now...
    // TODO: Improve this

    console.error(res.error);

    const details = res.error?.errorDetails!;
    if (details.length > 0) {
        const invalidSignature = details[0].invalidSignature;
        if (invalidSignature) {
            const expected = invalidSignature.expectedTransaction?.value;
            const actionId = invalidSignature.actionId;
            console.log("action:", actionId);

            const s = Transaction.from(expected!);
            const c = (await actions[actionId].getTransaction(env));

            console.log("server:", getTransactionInspectLink(s));
            console.log("client:", getTransactionInspectLink(c));
        }

        console.log(res.error?.errorDetails[0].reasonString);
    }
}

