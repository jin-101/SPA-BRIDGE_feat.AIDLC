import type { Diagnostic } from '@spa-bridge/core-model';

import { StableIdFactory } from '../model/stable-id-factory.js';
import type { NormalizedTemplate, ProviderNeutralMappingRequest, RuleContribution, TransformationContext } from '../types.js';
import { SafeReviewDiagnosticBuilder } from '../diagnostics/safe-review-diagnostic-builder.js';
import { ProviderNeutralMappingRequestBuilder } from '../ai-handoff/provider-neutral-mapping-request-builder.js';

export class TemplateConverter {
  constructor(
    private readonly ids = new StableIdFactory(),
    private readonly reviewBuilder = new SafeReviewDiagnosticBuilder(),
    private readonly mappingBuilder = new ProviderNeutralMappingRequestBuilder(),
  ) {}

  convert(context: TransformationContext): RuleContribution {
    const mappingRequests: ProviderNeutralMappingRequest[] = [];
    const templateDrafts = context.templates.map((template) => {
      const reviewItemIds: string[] = [];
      const forms = template.bindings.filter((binding) => binding.includes('ngModel') || binding.includes('form'));
      const unsupported = template.externalReferences.filter((ref) => ref.startsWith('javascript:'));
      if (unsupported.length > 0) {
        const review = this.reviewBuilder.build({
          category: 'template',
          ruleId: 'template-unsupported-reference',
          message: `Template '${template.id}' has unsupported external references.`,
          sourcePaths: template.sourceRef ? [template.sourceRef.path] : undefined,
          generatedPaths: undefined,
          remediationHint: 'Preserve the behavior as a review item and map it manually.',
        });
        reviewItemIds.push(review.reviewItem.id);
        mappingRequests.push(
          this.mappingBuilder.build(
            'template',
            template.sourceRef ? [template.sourceRef] : [],
            [this.ids.artifactRef(`${template.id}/template.json`, 'template')],
            ['template-unsupported-reference'],
            [review.diagnostic.code],
            {
              templateId: template.id,
              parserMode: template.parserMode,
            },
          ),
        );
        return {
          id: template.id,
          ownerComponentId: this.ids.componentId(template.ownerComponentName ?? template.id, 1),
          sourceRef: template.sourceRef,
          jsxNodes: template.bindings.map((binding) => `node:${binding}`),
          bindings: [...template.bindings],
          events: [...template.events],
          forms,
          rawText: template.rawText,
          externalReferences: [...template.externalReferences],
          reviewItemIds,
          generatedRefs: [this.ids.artifactRef(`${template.id}/template.json`, 'template')],
        };
      }

      return {
        id: template.id,
        ownerComponentId: this.ids.componentId(template.ownerComponentName ?? template.id, 1),
        sourceRef: template.sourceRef,
        jsxNodes: template.bindings.map((binding) => `node:${binding}`),
        bindings: [...template.bindings],
        events: [...template.events],
        forms,
        rawText: template.rawText,
        externalReferences: [...template.externalReferences],
        reviewItemIds,
        generatedRefs: [this.ids.artifactRef(`${template.id}/template.json`, 'template')],
      };
    });

    return { templateDrafts, mappingRequests };
  }
}
