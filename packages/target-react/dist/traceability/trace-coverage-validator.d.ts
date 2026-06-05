import type { GeneratedFileSpec, TargetGenerationError } from '../types.js';
import type { TraceLink } from '@spa-bridge/core-model';
export declare class TraceCoverageValidator {
    validate(files: GeneratedFileSpec[], traces: TraceLink[]): {
        ok: true;
        value: void;
    } | {
        ok: false;
        error: TargetGenerationError;
    };
}
//# sourceMappingURL=trace-coverage-validator.d.ts.map