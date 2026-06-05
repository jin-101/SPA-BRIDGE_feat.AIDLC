import { createDiagnostic, createSafeDisplayString } from '@spa-bridge/core-model';
import { StableIdFactory } from '../model/stable-id-factory.js';
export class SafeReviewDiagnosticBuilder {
    ids = new StableIdFactory();
    build(input) {
        const sourceRefs = (input.sourcePaths ?? []).map((path) => ({ kind: 'source', path }));
        const generatedRefs = (input.generatedPaths ?? []).map((path) => ({ kind: 'generated', path }));
        const diagnostic = createDiagnostic({
            code: `UOW04-${input.category.toUpperCase()}-REVIEW`,
            severity: 'manual-review',
            message: input.message,
            sourceRefs,
            generatedRefs,
            tags: ['uow04', 'manual-review', input.category, input.ruleId],
            remediationHint: input.remediationHint,
        });
        const reviewItem = {
            id: this.ids.next('review', [input.category, input.ruleId, sourceRefs[0]?.path ?? 'unknown']),
            title: createSafeDisplayString(`Review ${input.category} mapping`),
            description: createSafeDisplayString(input.message),
            status: 'open',
        };
        return { diagnostic, reviewItem };
    }
}
//# sourceMappingURL=safe-review-diagnostic-builder.js.map