import { type Result } from '@spa-bridge/core-model';
import { type ProviderError, type ProviderInvocationRequest, type ProviderResponse } from '../types.js';
import { type ProviderAdapter } from '../adapters/provider-adapters.js';
export type RetryStrategy = {
    maxAttempts: number;
    allowDeterministicRetry: boolean;
};
export declare const defaultRetryStrategy: RetryStrategy;
export declare const invokeWithTimeout: (adapter: ProviderAdapter, request: ProviderInvocationRequest, retryStrategy?: RetryStrategy) => Promise<Result<ProviderResponse, ProviderError>>;
//# sourceMappingURL=provider-timeout-guard.d.ts.map