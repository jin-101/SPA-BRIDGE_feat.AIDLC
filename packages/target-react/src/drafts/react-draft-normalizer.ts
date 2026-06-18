import type { Diagnostic, ManualReviewItem } from '@spa-bridge/core-model';
import type { ReactTargetDraftSet } from '@spa-bridge/transform-angular-react';

import type { NormalizedTargetDraftBundle, TargetGenerationRequest } from '../types.js';

const byId = <T extends { id: string }>(left: T, right: T): number => left.id.localeCompare(right.id);

export class ReactDraftNormalizer {
  normalize(request: TargetGenerationRequest): NormalizedTargetDraftBundle {
    const draftSet: ReactTargetDraftSet = request.draftSet;

    return {
      schemaVersion: 1,
      targetFramework: 'react',
      projectStrategy: request.strategyId ?? draftSet.projectStrategy,
      aliasModel: draftSet.aliasModel,
      targetRoot: request.targetRoot,
      projectName: request.projectName ?? draftSet.projectStrategy,
      stateStrategy: request.selectedStateStrategy ?? 'unknown',
      components: [...draftSet.components].sort(byId),
      templates: [...draftSet.templates].sort(byId),
      services: [...draftSet.services].sort(byId),
      routes: [...draftSet.routes].sort(byId),
      state: [...draftSet.state].sort(byId),
      reduxToolkit: [...draftSet.reduxToolkit].sort(byId),
      animations: [...draftSet.animations].sort(byId),
      manualReviewItems: [...draftSet.manualReviewItems].sort(byId) as ManualReviewItem[],
      diagnostics: [...draftSet.diagnostics].sort((left: Diagnostic, right: Diagnostic) => {
        const severity = left.severity.localeCompare(right.severity);
        return severity !== 0 ? severity : left.code.localeCompare(right.code);
      }),
      traces: [...draftSet.traces].sort((left, right) => left.id.localeCompare(right.id)),
    };
  }
}
