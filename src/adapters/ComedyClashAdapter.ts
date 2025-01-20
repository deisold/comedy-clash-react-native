import { ContractTransactionResponse, Provider, Signer } from "ethers";
import { ComedyClash, ComedyClash__factory } from "../utils/types";
import { ComedyClashAdapterType } from "./ComedyClashAdapterType";
import { Submission } from "../data/submission";

export const ComedyClashAdapter = (web3Provider: Provider, signer: Signer | null, address: string): ComedyClashAdapterType => {
    let contractReadOnly: ComedyClash | null = null;

    async function getContractReadOnly() {
        contractReadOnly = contractReadOnly || ComedyClash__factory.connect(address, web3Provider);
        return contractReadOnly;
    }

    async function getContractForWrite() {
        console.log(`getContractForWrite: web3Provider signers=${signer}`);
        if (!signer) throw new Error("Connection read-only!");

        return ComedyClash__factory.connect(address, signer);
    }

    return {
        getPrecision: async (): Promise<bigint> => (await getContractReadOnly()).PRECISION(),
        getDescription: async (): Promise<string> => (await getContractReadOnly()).description(),
        isClosed: async (): Promise<boolean> => (await getContractReadOnly()).closed(),
        getSubmissionCount: async (): Promise<bigint> => (await getContractReadOnly()).submissionCount(),

        getSubmission: async (index: number): Promise<Submission> => {
            const submission = await (await getContractReadOnly()).submissions(index);

            return ({
                id: Number(submission.id),
                artistAddress: submission.artist,
                name: submission.name,
                topic: submission.topic,
                preview: submission.preview,
                // votes: is not returned but also not needed
                averageTotal: Number(submission.averageTotal),
                averageCount: Number(submission.averageCount),
                averageValue: BigInt(submission.averageValue),
            })
        },

        createVotingForSubmission: async (index: number, voterName: string, comment: string, value: bigint): Promise<ContractTransactionResponse> => {
            return (await getContractForWrite()).createVotingForSubmission(index, voterName, comment, value);
        },

        createSubmission: async (name: string, topic: string, preview: string): Promise<ContractTransactionResponse> => {
            return (await getContractForWrite()).createSubmissions(name, topic, preview);
        },

        closeSubmission: async (): Promise<ContractTransactionResponse> => {
            return (await getContractForWrite()).closeSubmission();
        },
    }
}
