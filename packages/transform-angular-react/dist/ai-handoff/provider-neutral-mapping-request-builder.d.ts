import type { SourceRef } from '@spa-bridge/core-model';
import type { ProviderNeutralMappingRequest } from '../types.js';
export declare class ProviderNeutralMappingRequestBuilder {
    private readonly ids;
    build(category: ProviderNeutralMappingRequest['category'], sourceRefs: SourceRef[], draftRefs: ProviderNeutralMappingRequest['draftRefs'], ruleIds: string[], diagnosticRefs: string[], safeContext: Record<string, string | number | boolean | string[]>): ProviderNeutralMappingRequest;
}
//# sourceMappingURL=provider-neutral-mapping-request-builder.d.ts.map