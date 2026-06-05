import { type Result } from '@spa-bridge/core-model';
import { createSecurityError, type SecurityEvaluationRequest, type SecurityEvaluationResult } from '../types.js';
export declare class SecurityEvaluationPipeline {
    private readonly configResolver;
    private readonly detector;
    private readonly merger;
    private readonly policyGate;
    private readonly auditBuilder;
    private readonly accessEvaluator;
    evaluate(input: SecurityEvaluationRequest): Result<SecurityEvaluationResult, ReturnType<typeof createSecurityError>>;
}
//# sourceMappingURL=security-evaluation-pipeline.d.ts.map