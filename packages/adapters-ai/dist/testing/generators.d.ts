import fc from 'fast-check';
import { type ProviderDescriptor, type ProviderNeutralRefinementRequest, type ProviderPolicyDecision, type ProviderResponse, type TargetCapabilityPack } from '../types.js';
export declare const providerDescriptorArb: fc.Arbitrary<ProviderDescriptor>;
export declare const providerPolicyDecisionArb: fc.Arbitrary<ProviderPolicyDecision>;
export declare const providerNeutralRequestArb: fc.Arbitrary<ProviderNeutralRefinementRequest>;
export declare const providerResponseArb: fc.Arbitrary<ProviderResponse>;
export declare const targetCapabilityPackArb: fc.Arbitrary<TargetCapabilityPack>;
//# sourceMappingURL=generators.d.ts.map