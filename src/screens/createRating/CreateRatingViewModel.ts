import { useAppContext } from '../../components/providers/AppProviders';
import { validateRatingInputUseCase, RatingInputErrorMessages } from './useCases/ValidateRatingInput';
import { useState, useRef } from 'react';
import { ViewModelEventEmitter } from '../../utils/CommonEvents';
import _ from 'lodash';
import { useBlockchainState } from '@/components/providers/Web3MobileStateProvider';

export interface CreateRatingState {
    name: string;
    comment: string;
    value: string;
    loading: boolean;
    successMessage: string;
    errors: RatingInputErrorMessages;
    submitted: boolean;
    canWrite: boolean;
}

export interface CreateRatingViewModelActions {
    onChangeName: (value: string) => void;
    onChangeComment: (value: string) => void;
    onChangeValue: (value: string) => void;
    onSubmit: () => void;
}

export const useCreateRatingViewModel = (showAddress: string, submissionIndex: string) => {
    const { canWrite } = useBlockchainState();
    const { comedyClashRepo } = useAppContext();
    const eventEmitter = useRef(new ViewModelEventEmitter()).current;
    const  abortControllerRef = useRef<AbortController | null>(null); // Ref to store the current AbortController

    const isValidNumber = _.isFinite(_.toNumber(submissionIndex));
    if (comedyClashRepo == null || showAddress == null || !isValidNumber) {
        throw new Error('CreateRatingViewModel: dependencies null');
    }

    const [state, setState] = useState<CreateRatingState>({
        name: '',
        comment: '',
        value: '',
        loading: false,
        successMessage: '',
        errors: { name: '', comment: '', value: '' },
        submitted: false,
        canWrite: canWrite
    });

    const actions: CreateRatingViewModelActions = {
        onChangeName: (value: string) => {
            setState(prevState => ({
                ...prevState,
                name: value,
                errors: { ...prevState.errors, name: '' },
                submitted: false
            }));
        },
        onChangeComment: (value: string) => {
            setState(prevState => ({
                ...prevState,
                comment: value,
                errors: { ...prevState.errors, comment: '' },
                submitted: false
            }));
        },
        onChangeValue: (value: string) => {
            setState(prevState => ({
                ...prevState,
                value: value,
                errors: { ...prevState.errors, value: '' },
                submitted: false
            }));
        },
        onSubmit: async () => {
            setState(prevState => ({ ...prevState, submitted: true }));

            const errors: RatingInputErrorMessages = validateRatingInputUseCase(state.name, state.comment, state.value);
            setState(prevState => ({ ...prevState, errors }));

            if (Object.values(errors).every(value => value === '')) {

                abortControllerRef.current?.abort();
                abortControllerRef.current = new AbortController();

                try {
                    setState(prevState => ({ ...prevState, loading: true }));

                    const txResponse = await comedyClashRepo.createVotingForSubmission(
                        showAddress, Number(submissionIndex), state.name, state.comment, _.toNumber(state.value)
                    );
                    var message = 'Transcation successfully created - waiting for confirmation!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: message });

                    console.log(`CreateRatingViewModel: createVotingForSubmission: ${message}`);

                    await txResponse.wait();

                    message = 'Transaction confirmed!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: message });
                    console.log(`CreateRatingViewModel: createVotingForSubmission: ${message}`);

                } catch (error: unknown) {
                    if (abortControllerRef.current?.signal.aborted) return;
                    if (error instanceof Error) {
                        console.log(`CreateRatingViewModel: createVotingForSubmission: ${error.message}`);
                    } else {
                        const errorMessage = 'An unknown error occurred';
                        console.log(`CreateRatingViewModel: createVotingForSubmission: ${errorMessage}`);
                    }
                    eventEmitter.emit('error', { type: 'error', message: 'Error creating show!' });
                    console.error('CreateRatingViewModel: createVotingForSubmission: Error creating show:', error);
                } finally {
                    if (abortControllerRef.current?.signal.aborted) return;
                    setState(prevState => ({ ...prevState, loading: false }));
                }

                return () => abortControllerRef.current?.abort();
            }
        }
    };

    return { state, actions, eventEmitter };
};
