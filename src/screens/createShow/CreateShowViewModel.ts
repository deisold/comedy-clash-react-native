import { useAppContext } from '../../components/providers/AppProviders';
import { validateShowInputUseCase, ShowInputErrorMessages } from './useCases/ValidateShowInput';
import { useState, useRef } from 'react';
import { EventEmitter } from 'events';

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

export type CreateShowViewModelEvent =
    | Readonly<{ type: 'error'; message: string }>
    | Readonly<{ type: 'success'; message: string }>;

export class CreateShowViewModelEventEmitter extends EventEmitter {
    emit(event: CreateShowViewModelEvent['type'], payload: CreateShowViewModelEvent): boolean {
        return super.emit(event, payload);
    }

    on(event: CreateShowViewModelEvent['type'], listener: (payload: CreateShowViewModelEvent) => void): this {
        return super.on(event, listener);
    }
}

export const useCreateShowViewModel = () => {
    const { comedyTheaterRepo, isManager: appIsManager } = useAppContext();
    const eventEmitter = useRef(new CreateShowViewModelEventEmitter()).current;

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
                const controller = new AbortController();

                try {
                    setState(prevState => ({ ...prevState, loading: true }));

                    const txResponse = await comedyTheaterRepo!!.addShow(state.description, Number(state.days));
                    var message = 'Transcation successfully created - waiting for confirmation!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: 'TEST222' });

                    console.log(`ViewModel: addShow: ${message}`);

                    await txResponse.wait();

                    message = 'Transaction confirmed!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: message });
                    console.log(`ViewModel: addShow: ${message}`);
                } catch (error: any) {
                    if (controller.signal.aborted) return;
                    eventEmitter.emit('error', { type: 'error', message: 'Error creating show!' });
                    console.error('ViewModel: Error creating show:', error);
                } finally {
                    if (!controller.signal.aborted) {
                        setState(prevState => ({ ...prevState, loading: false }));
                    }
                }

                return () => controller.abort();
            }
        }
    };

    return { state, actions, toastEmitter: eventEmitter };
};
