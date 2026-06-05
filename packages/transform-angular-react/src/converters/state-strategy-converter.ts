import { StableIdFactory } from '../model/stable-id-factory.js';
import type { ProviderNeutralMappingRequest, RuleContribution, TransformationContext } from '../types.js';
import { SafeReviewDiagnosticBuilder } from '../diagnostics/safe-review-diagnostic-builder.js';
import { ProviderNeutralMappingRequestBuilder } from '../ai-handoff/provider-neutral-mapping-request-builder.js';

export class StateStrategyConverter {
  constructor(
    private readonly ids = new StableIdFactory(),
    private readonly reviewBuilder = new SafeReviewDiagnosticBuilder(),
    private readonly mappingBuilder = new ProviderNeutralMappingRequestBuilder(),
  ) {}

  convert(context: TransformationContext): RuleContribution {
    const mappingRequests: ProviderNeutralMappingRequest[] = [];
    const stateDrafts = context.states.map((state) => {
      const reviewItems: string[] = [];
      if (state.strategy === 'unknown') {
        const review = this.reviewBuilder.build({
          category: 'state',
          ruleId: 'state-unknown',
          message: `State artifact '${state.name}' requires a target strategy decision.`,
          sourcePaths: state.sourceRef ? [state.sourceRef.path] : undefined,
          generatedPaths: undefined,
          remediationHint: 'Preserve state evidence and defer the implementation choice to the target strategy.',
          });
        reviewItems.push(review.reviewItem.id);
        mappingRequests.push(
          this.mappingBuilder.build(
            'state',
            state.sourceRef ? [state.sourceRef] : [],
            [this.ids.artifactRef(`${state.name}/state.json`, 'state')],
            ['state-unknown'],
            [review.diagnostic.code],
            {
              state: state.name,
              strategy: 'unknown',
            },
          ),
        );
      }

      return {
        id: state.id,
        name: state.name,
        sourceRef: state.sourceRef,
        strategy: state.strategy,
        storeRefs: [...state.dependencies],
        actions: [...state.dependencies],
        selectors: [...state.dependencies],
        effects: [...state.dependencies],
        reviewItemIds: reviewItems,
        generatedRefs: [this.ids.artifactRef(`${state.name}/state.json`, 'state')],
      };
    });

    return { stateDrafts, mappingRequests };
  }
}
