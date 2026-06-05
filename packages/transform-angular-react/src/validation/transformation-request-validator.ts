import { createDiagnostic, err, ok, type Result } from '@spa-bridge/core-model';

import type { TransformationError, TransformationRequest } from '../types.js';

export class TransformationRequestValidator {
  validate(request: TransformationRequest): Result<TransformationRequest, TransformationError> {
    if (!request.runId.trim() || !request.correlationId.trim()) {
      return err({
        code: 'INVALID_REQUEST',
        message: 'Run and correlation identifiers are required.',
      });
    }

    if (request.targetFramework !== 'react') {
      return err({
        code: 'INVALID_REQUEST',
        message: `Unsupported target framework '${request.targetFramework}'.`,
      });
    }

    if (!request.analysis?.sourceModelBoundary?.sourceModelRef?.projectPath) {
      return err({
        code: 'INVALID_REQUEST',
        message: 'Transformation request requires a source model boundary ref.',
      });
    }

    if (!request.enabledRulePacks) {
      return err({
        code: 'INVALID_REQUEST',
        message: 'Enabled rule pack configuration is required.',
      });
    }

    if (request.enabledRulePacks.length === 0) {
      return err({
        code: 'INVALID_REQUEST',
        message: 'At least one enabled rule pack or built-in rule selection is required.',
      });
    }

    if (request.enabledRulePacks.some((pack) => !pack.trim())) {
      return err({
        code: 'INVALID_REQUEST',
        message: 'Enabled rule pack names must be non-empty.',
      });
    }

    return ok(request);
  }

  toDiagnostic(message: string, path: string): ReturnType<typeof createDiagnostic> {
    return createDiagnostic({
      code: 'UOW04-REQUEST-001',
      severity: 'error',
      message,
      sourceRefs: [{ kind: 'source', path }],
      generatedRefs: [],
      tags: ['uow04', 'request'],
    });
  }
}
