import type { SourceRef } from '@spa-bridge/core-model';

import { StableIdFactory } from '../model/stable-id-factory.js';
import type { ProviderNeutralMappingRequest } from '../types.js';

export class ProviderNeutralMappingRequestBuilder {
  private readonly ids = new StableIdFactory();

  build(
    category: ProviderNeutralMappingRequest['category'],
    sourceRefs: SourceRef[],
    draftRefs: ProviderNeutralMappingRequest['draftRefs'],
    ruleIds: string[],
    diagnosticRefs: string[],
    safeContext: Record<string, string | number | boolean | string[]>,
  ): ProviderNeutralMappingRequest {
    return {
      mappingRequestId: this.ids.mappingRequestId(category, sourceRefs[0]?.path ?? 'unknown', sourceRefs.length + draftRefs.length + ruleIds.length + diagnosticRefs.length),
      category,
      sourceRefs,
      draftRefs,
      ruleIds,
      diagnosticRefs,
      safeContext,
    };
  }
}
