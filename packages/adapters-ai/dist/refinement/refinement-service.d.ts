import { type Result } from '@spa-bridge/core-model';
import { type ProviderPolicyDecision } from '@spa-bridge/core-security';
import { type MockProviderScript, type ProviderDescriptor, type ProviderError, type ProviderMode, type ProviderNeutralRefinementRequest, type RefinementResult } from '../types.js';
import { type RetryStrategy } from '../invocation/provider-timeout-guard.js';
export type RefinementServiceConfig = {
    providerMode: ProviderMode;
    externalProviderOptIn?: boolean;
    auditReady?: boolean;
    maskingSatisfied?: boolean;
    timeoutMs?: number;
    retryStrategy?: RetryStrategy;
    mockScripts?: MockProviderScript[];
};
export type RefinementServiceDependencies = {
    providers: ProviderDescriptor[];
    policyDecision: ProviderPolicyDecision;
    config: RefinementServiceConfig;
};
export declare const refineMapping: (request: ProviderNeutralRefinementRequest, dependencies: RefinementServiceDependencies) => Promise<Result<RefinementResult, ProviderError>>;
//# sourceMappingURL=refinement-service.d.ts.map