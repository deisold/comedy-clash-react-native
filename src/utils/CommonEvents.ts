import { EventEmitter } from 'events';

export type ViewModelEvents =
    | Readonly<{ type: 'error'; message: string }>
    | Readonly<{ type: 'success'; message: string }>;

export class ViewModelEventEmitter extends EventEmitter {
    emit(event: ViewModelEvents['type'], payload: ViewModelEvents): boolean {
        return super.emit(event, payload);
    }

    on(event: ViewModelEvents['type'], listener: (payload: ViewModelEvents) => void): this {
        return super.on(event, listener);
    }
}