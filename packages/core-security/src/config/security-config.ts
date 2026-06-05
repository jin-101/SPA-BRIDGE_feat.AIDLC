import { err, ok, type Result, validateSchema } from '@spa-bridge/core-model';

import {
  createSecurityError,
  type SecurityConfig,
  type SecurityConfigInput,
  SecurityConfigInputSchema,
  SecurityConfigSchema,
} from '../types.js';

const mergeRulePackIds = (defaults: string[], raw: string[], overrides: string[]): string[] =>
  [...defaults, ...raw, ...overrides].filter((value, index, values) => values.indexOf(value) === index);

export class SecurityConfigResolver {
  resolve(input: {
    projectRoot: string;
    runId: string;
    correlationId: string;
    rawConfig?: unknown;
    overrides?: unknown;
  }): Result<SecurityConfig, ReturnType<typeof createSecurityError>> {
    const rawResult = validateSchema(SecurityConfigInputSchema, input.rawConfig ?? {});
    if (!rawResult.ok) {
      return err(createSecurityError('INVALID_CONFIG', 'Security config could not be validated.', rawResult.error));
    }

    const overridesResult = validateSchema(SecurityConfigInputSchema, input.overrides ?? {});
    if (!overridesResult.ok) {
      return err(createSecurityError('INVALID_CONFIG', 'Security overrides could not be validated.', overridesResult.error));
    }

    const defaults = SecurityConfigSchema.parse({
      schemaVersion: 1,
      projectRoot: input.projectRoot,
      runId: input.runId,
      correlationId: input.correlationId,
    });

    const rawConfig = rawResult.value satisfies SecurityConfigInput;
    const overrides = overridesResult.value satisfies SecurityConfigInput;

    const merged = SecurityConfigSchema.parse({
      schemaVersion: 1,
      projectRoot: input.projectRoot,
      runId: input.runId,
      correlationId: input.correlationId,
      detectSensitiveData: overrides.detectSensitiveData ?? rawConfig.detectSensitiveData ?? defaults.detectSensitiveData,
      redactOutputs: overrides.redactOutputs ?? rawConfig.redactOutputs ?? defaults.redactOutputs,
      allowExternalProviderUse:
        overrides.allowExternalProviderUse ?? rawConfig.allowExternalProviderUse ?? defaults.allowExternalProviderUse,
      externalProviderOptIn: overrides.externalProviderOptIn ?? rawConfig.externalProviderOptIn ?? defaults.externalProviderOptIn,
      auditEnabled: overrides.auditEnabled ?? rawConfig.auditEnabled ?? defaults.auditEnabled,
      manualReviewEnabled: overrides.manualReviewEnabled ?? rawConfig.manualReviewEnabled ?? defaults.manualReviewEnabled,
      preservePartialArtifacts:
        overrides.preservePartialArtifacts ?? rawConfig.preservePartialArtifacts ?? defaults.preservePartialArtifacts,
      tokenTtlMs: overrides.tokenTtlMs ?? rawConfig.tokenTtlMs ?? defaults.tokenTtlMs,
      rulePackIds: mergeRulePackIds(
        defaults.rulePackIds,
        rawConfig.rulePackIds ?? [],
        overrides.rulePackIds ?? [],
      ),
      defaultProviderMode:
        overrides.defaultProviderMode ?? rawConfig.defaultProviderMode ?? defaults.defaultProviderMode,
      targetAwareRulePacks:
        overrides.targetAwareRulePacks ?? rawConfig.targetAwareRulePacks ?? defaults.targetAwareRulePacks,
    });

    return ok(merged);
  }
}
