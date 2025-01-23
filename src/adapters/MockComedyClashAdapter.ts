import { Provider, Signer } from "ethers";
import { ComedyClashAdapterType } from "./ComedyClashAdapterType";
import { Submission } from "../data/submission";
import { createDelayedMockResponse as createDelayedMockResponse, defaultDelayMS } from "./MockTransactionResponse";

export const MockComedyClashAdapter = (_web3Provider: Provider, _signer: Signer | null, address: string): ComedyClashAdapterType => {
    let submissions = 3;

    const closed = new Proxy<{ [key: string]: boolean }>(
        {},
        {
            get: (_target, key: string): boolean => {
                return key !== '0';
            }
        }
    );

    const delay = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    return ({
        getPrecision: async () => BigInt(10 ** 18),
        getDescription: async () => {
            await delay(defaultDelayMS);
            return "Desc-" + address;
        },
        isClosed: async () => closed[address],
        getSubmissionCount: async (): Promise<bigint> => BigInt(submissions),

        getSubmission: async (index: number): Promise<Submission> => ({
            id: index,
            artistAddress: String(900 + index),
            name: `Name${index}`,
            topic: `Topic${index}`,
            preview: `Preview${index}`,
            // votes: is not returned but also not needed
            averageTotal: index * 8,
            averageCount: index + 10,
            averageValue: BigInt(Math.floor(Math.random() * 401 + 100).toString() + Array(16).fill(0).map(() =>
                Math.floor(Math.random() * 10)).join('')),
        }),
        createVotingForSubmission: async (_index: number, _voterName: string, _comment: string, _value: bigint) => {
            await delay(defaultDelayMS);
            return createDelayedMockResponse();
        },
        createSubmission: async (_name: string, _topic: string, _preview: string) => {
            submissions++;
            await delay(defaultDelayMS);
            return createDelayedMockResponse();
        },
        closeSubmission: async () => {
            closed[address] = true;
            await delay(defaultDelayMS);
            return createDelayedMockResponse();
        }
    })
}