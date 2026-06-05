import { createSafeDisplayString, err, ok, type Result } from '@spa-bridge/core-model';
import {
  ProviderPolicyDecisionSchema,
  type ProviderPolicyDecision,
} from '@spa-bridge/core-security';

import { ProviderErrorSchema, type ProviderDescriptor, type ProviderError } from '../types.js';

const createProviderError = (code: ProviderError['code'], message: string, providerId?: string): ProviderError =>
  ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    providerId,
    retryable: false,
  });

export type ProviderPolicyBridgeRequest = {
  provider: ProviderDescriptor;
  policyDecision: ProviderPolicyDecision;
  externalProviderOptIn?: boolean;
  auditReady?: boolean;
  maskingSatisfied?: boolean;
};

export const bridgeProviderPolicy = (
  input: ProviderPolicyBridgeRequest,
): Result<ProviderPolicyDecision, ProviderError> => {
  const provider = input.provider;
  const policyDecision = ProviderPolicyDecisionSchema.parse(input.policyDecision);

  if (policyDecision.decision !== 'allow') {
    return ok(
      ProviderPolicyDecisionSchema.parse({
        ...policyDecision,
        decision: 'block',
        reasonCode: 'POLICY_BLOCKED',
        reason: createSafeDisplayString(`Policy blocked provider ${provider.providerId}`),
      }),
    );
  }

  if (provider.adapterKind === 'external') {
    if (!input.externalProviderOptIn || !input.auditReady || !input.maskingSatisfied || !policyDecision.externalProviderAllowed) {
      return ok(
        ProviderPolicyDecisionSchema.parse({
          ...policyDecision,
          decision: 'block',
          reasonCode: 'EXTERNAL_PROVIDER_DISABLED',
          reason: createSafeDisplayString(`External provider disabled for ${provider.providerId}`),
        }),
      );
    }
  }

  if (!provider.enabled) {
    return ok(
      ProviderPolicyDecisionSchema.parse({
        ...policyDecision,
        decision: 'block',
        reasonCode: 'UNKNOWN_PROVIDER',
        reason: createSafeDisplayString(`Provider disabled: ${provider.providerId}`),
      }),
    );
  }

  return ok(policyDecision);
};
