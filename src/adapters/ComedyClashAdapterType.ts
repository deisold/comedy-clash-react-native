// frontend/app/source/adapters/ComedyClashAdapterType.ts
import { ContractTransactionResponse } from "ethers";
import { Submission } from "../data/submission";

export type ComedyClashAdapterType = {
    getPrecision: () => Promise<bigint>;
    getDescription: () => Promise<string>;
    isClosed: () => Promise<boolean>;
    getSubmissionCount: () => Promise<bigint>;
    getSubmission: (index: number) => Promise<Submission>;
    createVotingForSubmission: (index: number, voterName: string, comment: string, value: bigint) => Promise<ContractTransactionResponse>;
    createSubmission: (name: string, topic: string, preview: string) => Promise<ContractTransactionResponse>;
    closeSubmission: () => Promise<ContractTransactionResponse>;
}