import { type Result } from '@spa-bridge/core-model';
import { type ProviderError, type MockProviderScript, type ProviderAdapterKind, type ProviderDescriptor, type ProviderInvocationRequest, type ProviderResponse } from '../types.js';
export type ProviderAdapter = {
    descriptor: ProviderDescriptor;
    kind: ProviderAdapterKind;
    invoke: (request: ProviderInvocationRequest) => Promise<Result<ProviderResponse, ProviderError>>;
};
export declare const createLocalInternalProviderAdapter: (descriptor: ProviderDescriptor) => ProviderAdapter;
export declare const createExternalProviderAdapter: (descriptor: ProviderDescriptor) => ProviderAdapter;
export declare const createMockProvider: (descriptor: ProviderDescriptor, script: MockProviderScript) => ProviderAdapter;
export declare const createProviderAdapter: (descriptor: ProviderDescriptor, mockScript?: MockProviderScript) => ProviderAdapter;
//# sourceMappingURL=provider-adapters.d.ts.map