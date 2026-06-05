import { StableIdFactory } from '../model/stable-id-factory.js';
import type { RuleContribution, TransformationContext } from '../types.js';
import { SafeReviewDiagnosticBuilder } from '../diagnostics/safe-review-diagnostic-builder.js';
import { ProviderNeutralMappingRequestBuilder } from '../ai-handoff/provider-neutral-mapping-request-builder.js';
export declare class ServiceDiConverter {
    private readonly ids;
    private readonly reviewBuilder;
    private readonly mappingBuilder;
    constructor(ids?: StableIdFactory, reviewBuilder?: SafeReviewDiagnosticBuilder, mappingBuilder?: ProviderNeutralMappingRequestBuilder);
    convert(context: TransformationContext): RuleContribution;
}
//# sourceMappingURL=service-di-converter.d.ts.map