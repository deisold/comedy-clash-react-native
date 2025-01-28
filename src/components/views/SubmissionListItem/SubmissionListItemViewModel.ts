import { useEffect, useRef, useState } from "react";
import { Submission } from "../../../data/submission";
import { useBlockchainState } from "../../providers/Web3MobileStateProvider";

export interface SubmissionListItemState {
    loading: boolean;
    id: number;
    isClosed: boolean;
    isVotable: boolean;
    canWrite: boolean;
    name: string;
    topic: string;
    preview: string;
    averageTotal: number;
    averageCount: number;
    averageValue: string;
}

export const useSubmissionListItemViewModel = (submission: Submission, precision: bigint, isClosed: boolean) => {
    const { canWrite, walletAddress } = useBlockchainState();

    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the current AbortController

    const [state, setState] = useState<SubmissionListItemState>({
        loading: true,
        id: submission.id,
        isClosed: true,
        isVotable: false,
        canWrite: false,
        name: submission.name,
        topic: submission.topic,
        preview: submission.preview,
        averageTotal: submission.averageTotal,
        averageCount: submission.averageCount,
        averageValue: '',
    });

    const init = async () => {
        try {

            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            setState((prev) => ({ ...prev, loading: true }));

            const scaledValue = submission.averageValue * 100n; // Scaled for two decimals
            const averageWithTwoDecimals = scaledValue / precision; // Divide by PRECISION to scale it back down
            let result = (averageWithTwoDecimals / 100n).toString(); // First divide to remove the scaling
            const remainder = averageWithTwoDecimals % 100n; // Get the remainder for the fractional part
            if (remainder !== 0n) {
                result += '.' + remainder.toString().padStart(2, '0'); // Append the fractional part with 2 decimals
            }

            setState((prev) => ({
                ...prev,
                loading: false,
                id: submission.id,
                isClosed: isClosed,
                isVotable: walletAddress != submission.artistAddress,
                canWrite: canWrite,
                name: submission.name,
                topic: submission.topic,
                preview: submission.preview,
                averageTotal: submission.averageTotal,
                averageCount: submission.averageCount,
                averageValue: result,
            }));

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`SubmissionListItem: error: ${error.message}`);
            } else {
                const errorMessage = 'An unknown error occurred';
                console.log(`SubmissionListItem: error: ${errorMessage}`);
            }
        }
        finally {
            if (abortControllerRef.current?.signal.aborted) return;
            setState((prev) => ({ ...prev, loading: false }));
            abortControllerRef.current = null;
        }
    }

    useEffect(() => {
        init();

        return () => abortControllerRef.current?.abort();

    }, [submission, precision, isClosed, walletAddress, canWrite]);

    return { state };
}