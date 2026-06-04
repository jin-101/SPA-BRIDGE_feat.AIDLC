import { type Result } from '@spa-bridge/core-model';
import type { ProviderMode } from '../types.js';
export type PolicyDecisionKind = 'allow' | 'deny' | 'block';
export type PolicyDecision = {
    decision: PolicyDecisionKind;
    reason: string;
};
export type PolicyEvaluationInput = {
    providerMode: ProviderMode;
    externalProviderRequested: boolean;
    maskingReady: boolean;
    policyKnown: boolean;
    sensitiveDataPresent: boolean;
};
export declare class PolicyGate {
    evaluate(input: PolicyEvaluationInput): Result<PolicyDecision, never>;
}
//# sourceMappingURL=policy.d.ts.map