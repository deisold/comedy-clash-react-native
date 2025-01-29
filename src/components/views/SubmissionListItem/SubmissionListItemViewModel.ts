import { useEffect, useRef, useState } from "react";
import { useBlockchainState } from "../../providers/Web3MobileStateProvider";
import { SubmissionWithIndexType } from "@/screens/ShowDetails/ShowDetailsViewModel";

export interface SubmissionListItemState {
    loading: boolean;
    id: number;
    submissionIndex: number;
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

export const useSubmissionListItemViewModel = (submissionWithIndex: SubmissionWithIndexType , precision: bigint, isClosed: boolean) => {
    const { canWrite, walletAddress } = useBlockchainState();

    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the current AbortController

    const [state, setState] = useState<SubmissionListItemState>({
        loading: true,
        id: submissionWithIndex.submission.id,
        submissionIndex: submissionWithIndex.submissionIndex,
        isClosed: isClosed,
        isVotable: walletAddress != submissionWithIndex.submission.artistAddress,
        canWrite: canWrite,
        name: submissionWithIndex.submission.name,
        topic: submissionWithIndex.submission.topic,
        preview: submissionWithIndex.submission.preview,
        averageTotal: submissionWithIndex.submission.averageTotal,
        averageCount: submissionWithIndex.submission.averageCount,
        averageValue: '',
    });

    const init = async () => {
        try {

            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            setState((prev) => ({ ...prev, loading: true }));

            const submission = submissionWithIndex.submission;
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
                averageValue: result,
            }));

        } catch (error: unknown) {
            if (abortControllerRef.current?.signal.aborted) return;

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

    }, [submissionWithIndex, precision, isClosed, walletAddress, canWrite]);

    return { state };
}