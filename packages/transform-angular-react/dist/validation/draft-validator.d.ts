import { type Diagnostic, type Result } from '@spa-bridge/core-model';
import type { ReactTargetDraftSet, TransformationError } from '../types.js';
export declare class DraftValidator {
    validate(drafts: ReactTargetDraftSet): Result<void, TransformationError>;
    toDiagnostic(message: string): Diagnostic;
}
//# sourceMappingURL=draft-validator.d.ts.map