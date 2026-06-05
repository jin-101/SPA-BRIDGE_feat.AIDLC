import { type Result } from '@spa-bridge/core-model';
import { createSecurityError, type ProviderPolicyDecision, type SecurityConfig, type SecurityPolicyMode } from '../types.js';
export type ProviderReadiness = {
    ready: boolean;
    missingPrerequisites: string[];
};
export declare class ProviderReadinessEvaluator {
    evaluate(input: {
        config: SecurityConfig;
        maskingReady: boolean;
        auditReady: boolean;
        rulePacksResolved: boolean;
    }): Result<ProviderReadiness, ReturnType<typeof createSecurityError>>;
}
export declare class ProviderPolicyGate {
    private readonly readinessEvaluator;
    evaluate(input: {
        providerMode: SecurityPolicyMode;
        config: SecurityConfig;
        externalProviderRequested: boolean;
        maskingReady: boolean;
        auditReady: boolean;
        rulePacksResolved: boolean;
        policyKnown: boolean;
        providerKnown: boolean;
        findingsPresent: boolean;
    }): Result<ProviderPolicyDecision, ReturnType<typeof createSecurityError>>;
}
//# sourceMappingURL=provider-policy-gate.d.ts.map