import { StableIdFactory } from '../model/stable-id-factory.js';
export class ProviderNeutralMappingRequestBuilder {
    ids = new StableIdFactory();
    build(category, sourceRefs, draftRefs, ruleIds, diagnosticRefs, safeContext) {
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
//# sourceMappingURL=provider-neutral-mapping-request-builder.js.map