import { createSafeDisplayString, err, ok, type Result } from '@spa-bridge/core-model';

import {
  ProviderDescriptorSchema,
  ProviderErrorSchema,
  ProviderSelectionRequestSchema,
  ProviderSelectionResultSchema,
  type ProviderDescriptor,
  type ProviderError,
  type ProviderRegistry,
  type ProviderSelectionRequest,
  type ProviderSelectionResult,
} from '../types.js';
import { compareStrings } from '../internal.js';

const createProviderError = (code: ProviderError['code'], message: string, providerId?: string): ProviderError =>
  ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    providerId,
    retryable: false,
  });

const modeRank = (mode: ProviderSelectionRequest['providerMode'], kind: ProviderDescriptor['adapterKind']): number => {
  if (mode === 'external-only') {
    if (kind === 'external') return 0;
    if (kind === 'local-internal') return 1;
    return 2;
  }

  if (kind === 'local-internal') return 0;
  if (kind === 'mock') return 1;
  return 2;
};

const capabilityMatchScore = (provider: ProviderDescriptor, request: ProviderSelectionRequest): number => {
  const providerCategories = new Set(provider.capabilities.map((capability) => capability.category));
  let score = providerCategories.has(request.category) ? 10 : 0;

  for (const capability of provider.capabilities) {
    for (const tag of request.capabilityTags) {
      if (capability.tags.includes(tag)) {
        score += 1;
      }
    }
  }

  return score;
};

const readinessScore = (provider: ProviderDescriptor, request: ProviderSelectionRequest): number => {
  if (provider.adapterKind !== 'external') {
    return 10;
  }

  if (!request.policyDecision.externalProviderAllowed) {
    return 0;
  }

  if (request.policyDecision.decision !== 'allow') {
    return 0;
  }

  return provider.enabled && provider.requiresExternalPolicy ? 10 : provider.enabled ? 8 : 0;
};

const selectionComparator =
  (request: ProviderSelectionRequest) =>
  (left: ProviderDescriptor, right: ProviderDescriptor): number => {
    const rankDelta = modeRank(request.providerMode, left.adapterKind) - modeRank(request.providerMode, right.adapterKind);
    if (rankDelta !== 0) return rankDelta;

    const scoreDelta = capabilityMatchScore(right, request) - capabilityMatchScore(left, request);
    if (scoreDelta !== 0) return scoreDelta;

    const readinessDelta = readinessScore(right, request) - readinessScore(left, request);
    if (readinessDelta !== 0) return readinessDelta;

    const priorityDelta = right.priority - left.priority;
    if (priorityDelta !== 0) return priorityDelta;

    const providerIdDelta = compareStrings(left.providerId, right.providerId);
    if (providerIdDelta !== 0) return providerIdDelta;

    return compareStrings(left.adapterKind, right.adapterKind);
  };

export const selectProvider = (
  registry: ProviderRegistry,
  input: ProviderSelectionRequest,
): Result<ProviderSelectionResult, ProviderError> => {
  const request = ProviderSelectionRequestSchema.parse(input);
  const providers = registry.providers.map((provider) => ProviderDescriptorSchema.parse(provider));
  const eligibleProviders = providers.filter((provider) => {
    if (!provider.enabled) return false;

    if (provider.adapterKind === 'external' && (!request.policyDecision.externalProviderAllowed || request.policyDecision.decision !== 'allow')) {
      return false;
    }

    const capabilityMatch =
      provider.capabilities.some((capability) => capability.category === request.category) ||
      provider.capabilities.some((capability) => capability.tags.some((tag) => request.capabilityTags.includes(tag)));

    return capabilityMatch || provider.adapterKind === 'mock';
  });

  if (eligibleProviders.length === 0) {
    return ok(
      ProviderSelectionResultSchema.parse({
        status: 'manual-review',
        reasonCode: 'NO_MATCHING_PROVIDER',
        diagnostics: [`No provider matched ${request.category}`],
      }),
    );
  }

  const sorted = [...eligibleProviders].sort(selectionComparator(request));
  const selected = sorted[0];

  if (!selected) {
    return err(createProviderError('NO_MATCHING_PROVIDER', 'No provider could be selected'));
  }

  return ok(
    ProviderSelectionResultSchema.parse({
      status: 'selected',
      provider: selected,
      reasonCode: 'PROVIDER_SELECTED',
      diagnostics: [],
    }),
  );
};
