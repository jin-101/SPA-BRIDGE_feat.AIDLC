import { createDiagnostic, err, ok } from '@spa-bridge/core-model';
const isSortedById = (items) => items.every((item, index) => index === 0 || items[index - 1].id.localeCompare(item.id) <= 0);
export class DraftValidator {
    validate(drafts) {
        const allDraftGroups = [
            drafts.components,
            drafts.templates,
            drafts.services,
            drafts.routes,
            drafts.state,
        ];
        for (const group of allDraftGroups) {
            if (!isSortedById(group)) {
                return err({
                    code: 'TRANSFORMATION_FAILED',
                    message: 'Draft ordering is not deterministic.',
                });
            }
            for (const draft of group) {
                if (!draft.generatedRefs?.length) {
                    return err({
                        code: 'TRANSFORMATION_FAILED',
                        message: `Draft '${draft.id}' is missing generated refs.`,
                    });
                }
            }
        }
        const tracedTargets = new Set(drafts.traces.map((trace) => (trace.target.kind === 'ir' ? trace.target.id : trace.target.path)));
        for (const draft of [...drafts.components, ...drafts.templates, ...drafts.services, ...drafts.routes, ...drafts.state]) {
            if (!draft.generatedRefs.some((ref) => tracedTargets.has(ref.path))) {
                return err({
                    code: 'TRANSFORMATION_FAILED',
                    message: `Draft '${draft.id}' is missing trace coverage.`,
                });
            }
        }
        return ok(undefined);
    }
    toDiagnostic(message) {
        return createDiagnostic({
            code: 'UOW04-DRAFT-001',
            severity: 'error',
            message,
            sourceRefs: [],
            generatedRefs: [],
            tags: ['uow04', 'draft'],
        });
    }
}
//# sourceMappingURL=draft-validator.js.map