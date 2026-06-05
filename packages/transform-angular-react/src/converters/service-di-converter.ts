import { StableIdFactory } from '../model/stable-id-factory.js';
import type { ProviderNeutralMappingRequest, ReactServiceDraft, RuleContribution, TransformationContext } from '../types.js';
import { SafeReviewDiagnosticBuilder } from '../diagnostics/safe-review-diagnostic-builder.js';
import { ProviderNeutralMappingRequestBuilder } from '../ai-handoff/provider-neutral-mapping-request-builder.js';

export class ServiceDiConverter {
  constructor(
    private readonly ids = new StableIdFactory(),
    private readonly reviewBuilder = new SafeReviewDiagnosticBuilder(),
    private readonly mappingBuilder = new ProviderNeutralMappingRequestBuilder(),
  ) {}

  convert(context: TransformationContext): RuleContribution {
    const mappingRequests: ProviderNeutralMappingRequest[] = [];
    const serviceDrafts: ReactServiceDraft[] = context.services.map((service) => {
      const reviewItems: string[] = [];
      if (!service.providedIn) {
        const review = this.reviewBuilder.build({
          category: 'di',
          ruleId: 'service-di',
          message: `Service '${service.name}' has no explicit provider scope.`,
          sourcePaths: service.sourceRef ? [service.sourceRef.path] : undefined,
          generatedPaths: undefined,
          remediationHint: 'Preserve the service boundary and resolve provider scope manually.',
          });
        reviewItems.push(review.reviewItem.id);
        mappingRequests.push(
          this.mappingBuilder.build(
            'di',
            service.sourceRef ? [service.sourceRef] : [],
            [this.ids.artifactRef(`${service.name}/service.json`, 'service')],
            ['service-di'],
            [review.diagnostic.code],
            {
              service: service.name,
              providerScope: 'unknown',
            },
          ),
        );
      }

      return {
        id: this.ids.serviceId(service.name, 1),
        name: service.name,
        sourceRef: service.sourceRef,
        kind: service.providedIn ? 'module' : 'unknown',
        providerScope: service.providedIn,
        dependencies: [...service.dependencies],
        reviewItemIds: reviewItems,
        generatedRefs: [this.ids.artifactRef(`${service.name}/service.json`, 'service')],
      };
    });

    return { serviceDrafts, mappingRequests };
  }
}
