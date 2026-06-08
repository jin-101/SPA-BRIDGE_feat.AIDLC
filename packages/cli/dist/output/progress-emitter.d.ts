import type { CliProgressEvent } from '../types.js';
export declare class ProgressEmitter {
    private readonly events;
    emit(event: CliProgressEvent): void;
    snapshot(): CliProgressEvent[];
}
//# sourceMappingURL=progress-emitter.d.ts.map