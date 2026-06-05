import { type Result } from '@spa-bridge/core-model';
import { type ProviderCapability, type ProviderCapabilityCategory, type ProviderError, type TargetCapabilityPack } from '../types.js';
export declare const defaultCapabilityCatalog: ReadonlyArray<ProviderCapability>;
export declare const getCapabilityTemplate: (category: ProviderCapabilityCategory) => ProviderCapability | undefined;
export declare const createTargetCapabilityPack: (input: TargetCapabilityPack) => Result<TargetCapabilityPack, ProviderError>;
//# sourceMappingURL=provider-capability-catalog.d.ts.map