import { err, ok, type Result } from '@spa-bridge/core-model';

import {
  SecurityEvaluationPipeline,
  type SecurityEvaluationRequest,
  type SecurityEvaluationResult,
  type SecurityPolicyMode,
} from '@spa-bridge/core-security';

import type { ApplicationError } from '../types.js';

export class SecurityPolicyCoordinator {
  private readonly pipeline = new SecurityEvaluationPipeline();

  evaluate(input: {
    payload: SecurityEvaluationRequest['payload'];
    rawConfig?: unknown;
    overrides?: unknown;
    providerMode: SecurityPolicyMode;
    externalProviderRequested: boolean;
    rulePacks?: SecurityEvaluationRequest['rulePacks'];
    sourceRefs?: SecurityEvaluationRequest['sourceRefs'];
    generatedRefs?: SecurityEvaluationRequest['generatedRefs'];
  }): Result<SecurityEvaluationResult, ApplicationError> {
    const result = this.pipeline.evaluate({
      schemaVersion: 1,
      payload: input.payload,
      rawConfig: input.rawConfig,
      overrides: input.overrides,
      providerMode: input.providerMode,
      externalProviderRequested: input.externalProviderRequested,
      rulePacks: input.rulePacks ?? [],
      sourceRefs: input.sourceRefs ?? [],
      generatedRefs: input.generatedRefs ?? [],
    });

    if (!result.ok) {
      return err({
        code: 'POLICY_BLOCKED',
        message: result.error.message,
        cause: result.error,
      });
    }

    return ok(result.value);
  }
}
