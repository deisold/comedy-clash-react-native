import { ContractTransactionResponse } from "ethers";

export type MockTransactionResponse = ContractTransactionResponse & {
    wait: () => Promise<void>;
};

export const defaultDelayMS = 2000;

export const createDelayedMockResponse = (): MockTransactionResponse => ({
    wait: () => new Promise(resolve => setTimeout(resolve, defaultDelayMS))
} as MockTransactionResponse);