import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../components/providers/AppProviders";
import { Submission } from "../../data/submission";
import { ModelEventEmitter } from "../../utils/CommonEvents";


export interface ShowDetailsState {
    description: string;
    submissionCount: number;
    submissions: Submission[];
    isClosed: boolean;
}

export interface ShowDetailsViewModelActions {
    onCloseShow: () => void;
    onRefresh: () => void;
}

export const useShowDetailsViewModel = (showAddress: string) => {
    const { comedyClashRepo } = useAppContext();
    const eventEmitter = useRef(new ModelEventEmitter()).current;
    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the current AbortController

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [details, setDetails] = useState<ShowDetailsState>({
        description: '',
        submissionCount: 0,
        submissions: [],
        isClosed: false,
    });

    const buildOrderedSubmissions = async (submissionCount: number) => {
        if (comedyClashRepo == null || showAddress == null) {
            return [];
        }

        const submissions = await Promise.all(
            Array.from({ length: submissionCount }, (_, index) => {
                return comedyClashRepo.getSubmission(showAddress, index);
            })
        );
        return submissions.sort((a, b) => (a.averageValue < b.averageValue ? 1 : -1));
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
            const submissions = await buildOrderedSubmissions(submissionCount);
            if (controller.signal.aborted) return;
            const closed = await comedyClashRepo.isClosed(showAddress);
            if (controller.signal.aborted) return;

            setDetails({
                description: showDescription,
                submissionCount: submissionCount,
                submissions: submissions,
                isClosed: closed,
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
            abortControllerRef.current = null;
        }
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
        details,
        error,
        actions
    }
}