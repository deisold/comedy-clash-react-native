import { EventEmitter } from 'events';

export type ModelEvents =
    | Readonly<{ type: 'error'; message: string }>
    | Readonly<{ type: 'success'; message: string }>;

export class ModelEventEmitter extends EventEmitter {
    emit(event: ModelEvents['type'], payload: ModelEvents): boolean {
        return super.emit(event, payload);
    }

    on(event: ModelEvents['type'], listener: (payload: ModelEvents) => void): this {
        return super.on(event, listener);
    }
}