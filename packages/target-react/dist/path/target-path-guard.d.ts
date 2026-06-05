import type { TargetGenerationError } from '../types.js';
export declare class TargetPathGuard {
    ensureContained(targetRoot: string, candidatePath: string): {
        ok: true;
        value: string;
    } | {
        ok: false;
        error: TargetGenerationError;
    };
}
//# sourceMappingURL=target-path-guard.d.ts.map