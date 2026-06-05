import { createDiagnostic, createSafeDisplayString, type Diagnostic, type ManualReviewItem } from '@spa-bridge/core-model';

import { StableIdFactory } from '../model/stable-id-factory.js';

export type SafeReviewDiagnosticInput = {
  category: 'template' | 'lifecycle' | 'di' | 'route' | 'state' | 'form' | 'unknown';
  ruleId: string;
  message: string;
  sourcePaths?: string[];
  generatedPaths?: string[];
  remediationHint?: string;
};

export class SafeReviewDiagnosticBuilder {
  private readonly ids = new StableIdFactory();

  build(input: SafeReviewDiagnosticInput): { diagnostic: Diagnostic; reviewItem: ManualReviewItem } {
    const sourceRefs = (input.sourcePaths ?? []).map((path) => ({ kind: 'source' as const, path }));
    const generatedRefs = (input.generatedPaths ?? []).map((path) => ({ kind: 'generated' as const, path }));
    const diagnostic = createDiagnostic({
      code: `UOW04-${input.category.toUpperCase()}-REVIEW`,
      severity: 'manual-review',
      message: input.message,
      sourceRefs,
      generatedRefs,
      tags: ['uow04', 'manual-review', input.category, input.ruleId],
      remediationHint: input.remediationHint,
    });

    const reviewItem: ManualReviewItem = {
      id: this.ids.next('review', [input.category, input.ruleId, sourceRefs[0]?.path ?? 'unknown']),
      title: createSafeDisplayString(`Review ${input.category} mapping`),
      description: createSafeDisplayString(input.message),
      status: 'open',
    };

    return { diagnostic, reviewItem };
  }
}
