import { ok, type Result } from '@spa-bridge/core-model';
import type { GeneratedArtifactRef } from '@spa-bridge/core-model';

import { createQualityError, type QualityError } from '../shared-errors.js';
import type { QualityRequest } from '../types.js';

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isGeneratedArtifactRef = (value: unknown): value is GeneratedArtifactRef =>
  isPlainObject(value) && value.kind === 'generated' && isNonEmptyString(value.path);

export class QualityRequestValidator {
  validate(input: unknown): Result<QualityRequest, QualityError> {
    if (!isPlainObject(input)) {
      return { ok: false, error: createQualityError('INVALID_REQUEST', 'Quality request must be an object.') };
    }

    if (!isNonEmptyString(input.runId)) {
      return { ok: false, error: createQualityError('INVALID_REQUEST', 'runId is required.') };
    }

    if (!isNonEmptyString(input.correlationId)) {
      return { ok: false, error: createQualityError('INVALID_REQUEST', 'correlationId is required.') };
    }

    if (!isNonEmptyString(input.workspaceRoot)) {
      return { ok: false, error: createQualityError('INVALID_REQUEST', 'workspaceRoot is required.') };
    }

    if (input.seed !== undefined && !Number.isInteger(input.seed)) {
      return { ok: false, error: createQualityError('INVALID_REQUEST', 'seed must be an integer when provided.') };
    }

    if (input.selectedGateIds !== undefined) {
      if (!Array.isArray(input.selectedGateIds) || input.selectedGateIds.some((value) => !isNonEmptyString(value))) {
        return { ok: false, error: createQualityError('INVALID_REQUEST', 'selectedGateIds must be a string array.') };
      }
    }

    if (input.artifactRefs !== undefined) {
      if (!Array.isArray(input.artifactRefs) || input.artifactRefs.some((value) => !isGeneratedArtifactRef(value))) {
        return { ok: false, error: createQualityError('INVALID_REQUEST', 'artifactRefs must contain generated artifact refs.') };
      }
    }

    if (input.policyContext !== undefined) {
      if (!isPlainObject(input.policyContext)) {
        return { ok: false, error: createQualityError('INVALID_REQUEST', 'policyContext must be an object when provided.') };
      }

      for (const value of Object.values(input.policyContext)) {
        if (!isNonEmptyString(value)) {
          return { ok: false, error: createQualityError('INVALID_REQUEST', 'policyContext values must be non-empty strings.') };
        }
      }
    }

    return ok({
      runId: input.runId,
      correlationId: input.correlationId,
      workspaceRoot: input.workspaceRoot,
      selectedGateIds: input.selectedGateIds as string[] | undefined,
      artifactRefs: input.artifactRefs as GeneratedArtifactRef[] | undefined,
      seed: input.seed as number | undefined,
      policyContext: input.policyContext as Record<string, string> | undefined,
    });
  }
}
