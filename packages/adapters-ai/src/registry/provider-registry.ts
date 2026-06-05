import { err, ok, type Result } from '@spa-bridge/core-model';

import { ProviderDescriptorSchema, ProviderErrorSchema, type ProviderDescriptor, type ProviderError, type ProviderRegistry } from '../types.js';
import { compareStrings, stableHash } from '../internal.js';

const createProviderError = (code: ProviderError['code'], message: string, providerId?: string): ProviderError =>
  ProviderErrorSchema.parse({
    code,
    message,
    providerId,
    retryable: false,
  });

export const createProviderRegistry = (providers: ProviderDescriptor[]): Result<ProviderRegistry, ProviderError> => {
  const parsedProviders = providers.map((provider) => ProviderDescriptorSchema.parse(provider));
  const seen = new Set<string>();

  for (const provider of parsedProviders) {
    if (seen.has(provider.providerId)) {
      return err(createProviderError('DUPLICATE_PROVIDER_ID', `Duplicate provider ID: ${provider.providerId}`, provider.providerId));
    }
    seen.add(provider.providerId);
  }

  const registry: ProviderRegistry = {
    registryId: `provider-registry-${stableHash(parsedProviders.map((provider) => provider.providerId).join('|'))}`,
    providers: [...parsedProviders].sort((left, right) => compareStrings(left.providerId, right.providerId)),
  };

  return ok(registry);
};
