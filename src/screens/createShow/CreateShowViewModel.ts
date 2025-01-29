import { useAppContext } from '../../components/providers/AppProviders';
import { validateShowInputUseCase, ShowInputErrorMessages } from './useCases/ValidateShowInput';
import { useState, useRef } from 'react';
import { ViewModelEventEmitter } from '../../utils/CommonEvents';

export interface CreateShowState {
    description: string;
    days: string;
    isManager: boolean;
    loading: boolean;
    successMessage: string;
    errors: ErrorMessages;
    submitted: boolean;
}

export interface ErrorMessages {
    description: string;
    days: string;
}

export interface CreateShowViewModelActions {
    onChangeDescription: (value: string) => void;
    onChangeDays: (value: string) => void;
    onSubmit: () => void;
}

export const useCreateShowViewModel = () => {
    const { comedyTheaterRepo, isManager: appIsManager } = useAppContext();
    const eventEmitter = useRef(new ViewModelEventEmitter()).current;
    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the current AbortController

    const [state, setState] = useState<CreateShowState>({
        description: '',
        days: '',
        isManager: appIsManager,
        loading: false,
        successMessage: '',
        errors: { description: '', days: '' },
        submitted: false,
    });

    const actions: CreateShowViewModelActions = {
        onChangeDescription: (value: string) => {
            setState(prevState => ({
                ...prevState,
                description: value,
                errors: { ...prevState.errors, description: '' },
                submitted: false
            }));
        },
        onChangeDays: (value: string) => {
            setState(prevState => ({
                ...prevState,
                days: value,
                errors: { ...prevState.errors, days: '' },
                submitted: false
            }));
        },
        onSubmit: async () => {
            // eventEmitter.emit('success', { type: 'success', message: 'TEST' });
            setState(prevState => ({ ...prevState, submitted: true }));

            const errors: ShowInputErrorMessages = validateShowInputUseCase(state.description, state.days);
            setState(prevState => ({ ...prevState, errors }));

            if (Object.values(errors).every(value => value === '')) {
                abortControllerRef.current?.abort();
                abortControllerRef.current = new AbortController();

                try {
                    setState(prevState => ({ ...prevState, loading: true }));

                    const txResponse = await comedyTheaterRepo!!.addShow(state.description, Number(state.days));
                    var message = 'Transcation successfully created - waiting for confirmation!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: message });

                    console.log(`CreateShowViewModel: addShow: ${message}`);

                    await txResponse.wait();

                    message = 'Transaction confirmed!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: message });
                    console.log(`CreateShowViewModel: addShow: ${message}`);
                } catch (error: any) {
                    if (abortControllerRef.current?.signal.aborted) return;
                    eventEmitter.emit('error', { type: 'error', message: 'Error creating show!' });
                    console.error('CreateShowViewModel: Error creating show:', error);
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
