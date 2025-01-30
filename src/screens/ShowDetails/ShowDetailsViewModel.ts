import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../components/providers/AppProviders";
import { Submission } from "../../data/submission";
import { ViewModelEventEmitter } from "../../utils/CommonEvents";

export interface SubmissionWithIndexType { submission: Submission, submissionIndex: number }

export interface ShowDetailsState {
    description: string;
    submissionCount: number;
    submissions: SubmissionWithIndexType[];
    isClosed: boolean;
    precision: bigint;
}

export interface ShowDetailsViewModelActions {
    onCloseShow: () => void;
    onRefresh: () => void;
}

export const useShowDetailsViewModel = (showAddress: string) => {
    const { comedyClashRepo } = useAppContext();
    const eventEmitter = useRef(new ViewModelEventEmitter()).current;
    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the current AbortController

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<ShowDetailsState>({
        description: '',
        submissionCount: 0,
        submissions: [],
        isClosed: false,
        precision: 0n,
    });

    const buildOrderedSubmissions = async (submissionCount: number): Promise<SubmissionWithIndexType[]> => {
        if (comedyClashRepo == null || showAddress == null) {
            return [];
        }

        const submissions: SubmissionWithIndexType[] = await Promise.all(
            Array.from({ length: submissionCount }, async (_, index) => {
                const submission = await comedyClashRepo.getSubmission(showAddress, index);
                return { submission, submissionIndex: index };
            })
        );
        return submissions.sort((a, b) => (a.submission.averageValue < b.submission.averageValue ? 1 : -1));
    }

    const init = async () => {
        try {
            if (comedyClashRepo == null || showAddress == null) {
                throw new Error('ShowDetails: dependencies null');
            }

            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            setLoading(true);
            setError('');

            const showDescription = await comedyClashRepo.getDescription(showAddress);
            const controller = abortControllerRef.current;
            if (controller.signal.aborted) return;
            const submissionCount = await comedyClashRepo.getSubmissionCount(showAddress);
            if (controller.signal.aborted) return;
            const submissionWithIndex = await buildOrderedSubmissions(submissionCount);
            if (controller.signal.aborted) return;
            const closed = await comedyClashRepo.isClosed(showAddress);
            if (controller.signal.aborted) return;
            const precision = await comedyClashRepo.getPrecision(showAddress);
            if (controller.signal.aborted) return;

            setData({
                description: showDescription,
                submissionCount: submissionCount,
                submissions: submissionWithIndex,
                isClosed: closed,
                precision: precision,
            });
        }
        catch (err: any) {
            if (abortControllerRef.current?.signal.aborted) return;
            const errorMessage = err.message || 'Failed to load show details';
            setError(errorMessage);
            eventEmitter.emit('error', { type: 'error', message: errorMessage });
        }
        finally {
            if (abortControllerRef.current?.signal.aborted) return;
            setLoading(false);
        }

        return () => abortControllerRef.current?.abort();
    }

    useEffect(() => {
        init();

        return () => abortControllerRef.current?.abort();
    }, [comedyClashRepo, showAddress]);


    const actions: ShowDetailsViewModelActions = {
        onCloseShow: () => { },
        onRefresh: () => {
            abortControllerRef.current?.abort();
            init();
        }
    }

    return {
        loading,
        data,
        error,
        actions,
        eventEmitter
    }
}