import path from 'node:path';

import { createDiagnostic, err, ok, type Diagnostic, type Result } from '@spa-bridge/core-model';

import { createTargetGenerationError } from '../shared-errors.js';
import type { TargetGenerationRequest } from '../types.js';

const allowedStrategies = new Set(['vite-react-typescript', 'react-default']);
const allowedPolicies = new Set(['preserve', 'overwrite', 'fail']);
const allowedStateStrategies = new Set(['service', 'signals', 'store', 'local', 'unknown']);

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

export class TargetGenerationRequestValidator {
  validate(request: TargetGenerationRequest): Result<TargetGenerationRequest, ReturnType<typeof createTargetGenerationError>> {
    if (!isNonEmptyString(request.runId) || !isNonEmptyString(request.correlationId)) {
      return err(createTargetGenerationError('INVALID_REQUEST', 'Run and correlation identifiers are required.'));
    }

    if (!isNonEmptyString(request.targetRoot) || !path.isAbsolute(request.targetRoot)) {
      return err(createTargetGenerationError('INVALID_REQUEST', 'Target root must be an absolute workspace path.'));
    }

    if (!request.draftSet || request.draftSet.targetFramework !== 'react') {
      return err(createTargetGenerationError('INVALID_DRAFT_SET', 'A validated React draft set is required.'));
    }

    if (!allowedPolicies.has(request.overwritePolicy)) {
      return err(createTargetGenerationError('INVALID_REQUEST', `Unsupported overwrite policy '${request.overwritePolicy}'.`));
    }

    if (request.strategyId && !allowedStrategies.has(request.strategyId)) {
      return err(createTargetGenerationError('INVALID_STRATEGY', `Unknown target strategy '${request.strategyId}'.`));
    }

    if (request.selectedStateStrategy && !allowedStateStrategies.has(request.selectedStateStrategy)) {
      return err(createTargetGenerationError('INVALID_REQUEST', `Unknown state strategy '${request.selectedStateStrategy}'.`));
    }

    if (request.existingPaths?.some((value) => !isNonEmptyString(value))) {
      return err(createTargetGenerationError('INVALID_REQUEST', 'Existing paths must be non-empty strings.'));
    }

    return ok(request);
  }

  toDiagnostic(message: string, sourcePath?: string): Diagnostic {
    return createDiagnostic({
      code: 'UOW07-REQUEST-001',
      severity: 'error',
      message,
      sourceRefs: sourcePath ? [{ kind: 'source', path: sourcePath }] : [],
      generatedRefs: [],
      tags: ['uow07', 'request', 'validation'],
    });
  }
}
