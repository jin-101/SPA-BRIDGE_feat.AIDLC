import { type Result } from '@spa-bridge/core-model';
import { type ProviderPolicyDecision } from '@spa-bridge/core-security';
import { type ProviderDescriptor, type ProviderError } from '../types.js';
export type ProviderPolicyBridgeRequest = {
    provider: ProviderDescriptor;
    policyDecision: ProviderPolicyDecision;
    externalProviderOptIn?: boolean;
    auditReady?: boolean;
    maskingSatisfied?: boolean;
};
export declare const bridgeProviderPolicy: (input: ProviderPolicyBridgeRequest) => Result<ProviderPolicyDecision, ProviderError>;
//# sourceMappingURL=provider-policy-bridge.d.ts.map