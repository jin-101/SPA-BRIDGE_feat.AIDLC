import type { Result } from '@spa-bridge/core-model';
import type { QualityError } from '../shared-errors.js';
import type { QualityRequest } from '../types.js';
import { QualityRequestValidator } from './quality-request-validator.js';
export declare class ValidationGuard {
    private readonly validator;
    constructor(validator?: QualityRequestValidator);
    validate(input: unknown): Result<QualityRequest, QualityError>;
}
//# sourceMappingURL=validation-guard.d.ts.map