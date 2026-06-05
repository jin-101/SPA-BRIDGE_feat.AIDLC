import type { Diagnostic } from '@spa-bridge/core-model';

import { StableIdFactory } from '../model/stable-id-factory.js';
import type { ProviderNeutralMappingRequest, RuleContribution, TransformationContext, ReactHookDraft } from '../types.js';
import { SafeReviewDiagnosticBuilder } from '../diagnostics/safe-review-diagnostic-builder.js';
import { ProviderNeutralMappingRequestBuilder } from '../ai-handoff/provider-neutral-mapping-request-builder.js';

export class BehaviorConverter {
  constructor(
    private readonly ids = new StableIdFactory(),
    private readonly reviewBuilder = new SafeReviewDiagnosticBuilder(),
    private readonly mappingBuilder = new ProviderNeutralMappingRequestBuilder(),
  ) {}

  convert(context: TransformationContext): RuleContribution {
    const hooks: ReactHookDraft[] = [];
    const diagnostics: Diagnostic[] = [];
    const reviewItems = [];
    const mappingRequests: ProviderNeutralMappingRequest[] = [];

    for (const component of context.components) {
      for (const hookName of component.lifecycleHooks) {
        const review = this.reviewBuilder.build({
          category: 'lifecycle',
          ruleId: 'behavior-lifecycle',
          message: `Lifecycle hook '${hookName}' mapped as hook intent for component '${component.name}'.`,
          sourcePaths: component.sourceRef ? [component.sourceRef.path] : undefined,
          generatedPaths: [this.ids.artifactRef(`${component.name}/hooks/${hookName}.json`, hookName).path],
          remediationHint: 'Verify side effects and ordering in React implementation.',
        });

        mappingRequests.push(
          this.mappingBuilder.build(
            'lifecycle',
            component.sourceRef ? [component.sourceRef] : [],
            [this.ids.artifactRef(`${component.name}/hooks/${hookName}.json`, hookName)],
            ['behavior-lifecycle'],
            [review.diagnostic.code],
            {
              component: component.name,
              hook: hookName,
            },
          ),
        );

        hooks.push({
          id: this.ids.hookId(component.name, hookName, hooks.length + 1),
          kind: hookName === 'ngOnInit' || hookName === 'ngAfterViewInit' ? 'effect' : 'custom',
          sourceRef: component.sourceRef,
          dependencies: [...component.serviceRefs],
          intent: `Preserve '${hookName}' semantics`,
          reviewItemIds: [review.reviewItem.id],
          generatedRefs: [this.ids.artifactRef(`${component.name}/hooks/${hookName}.json`, hookName)],
        });
        diagnostics.push(review.diagnostic);
        reviewItems.push(review.reviewItem);
      }
      if (component.inputs.some((input) => input.includes('form')) || component.outputs.some((output) => output.includes('change'))) {
        const review = this.reviewBuilder.build({
          category: 'form',
          ruleId: 'behavior-form',
          message: `Component '${component.name}' includes form-like bindings that need review.`,
          sourcePaths: component.sourceRef ? [component.sourceRef.path] : undefined,
          generatedPaths: undefined,
          remediationHint: 'Map form behavior only when the event and state flow are explicit.',
        });
        diagnostics.push(review.diagnostic);
        reviewItems.push(review.reviewItem);
      }
    }

    return { hooks, diagnostics, reviewItems, mappingRequests };
  }
}
