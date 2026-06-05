import { createDiagnostic, err, ok, type Diagnostic, type Result } from '@spa-bridge/core-model';

import type { ReactTargetDraftSet, TransformationError } from '../types.js';

const isSortedById = <T extends { id: string }>(items: T[]): boolean =>
  items.every((item, index) => index === 0 || items[index - 1].id.localeCompare(item.id) <= 0);

export class DraftValidator {
  validate(drafts: ReactTargetDraftSet): Result<void, TransformationError> {
    const allDraftGroups = [
      drafts.components,
      drafts.templates,
      drafts.services,
      drafts.routes,
      drafts.state,
    ];

    for (const group of allDraftGroups) {
      if (!isSortedById(group as Array<{ id: string }>)) {
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

  toDiagnostic(message: string): Diagnostic {
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
