import { type Result } from '@spa-bridge/core-model';
import { type SecurityEvaluationRequest, type SecurityEvaluationResult, type SecurityPolicyMode } from '@spa-bridge/core-security';
import type { ApplicationError } from '../types.js';
export declare class SecurityPolicyCoordinator {
    private readonly pipeline;
    evaluate(input: {
        payload: SecurityEvaluationRequest['payload'];
        rawConfig?: unknown;
        overrides?: unknown;
        providerMode: SecurityPolicyMode;
        externalProviderRequested: boolean;
        rulePacks?: SecurityEvaluationRequest['rulePacks'];
        sourceRefs?: SecurityEvaluationRequest['sourceRefs'];
        generatedRefs?: SecurityEvaluationRequest['generatedRefs'];
    }): Result<SecurityEvaluationResult, ApplicationError>;
}
//# sourceMappingURL=security-policy-coordinator.d.ts.map