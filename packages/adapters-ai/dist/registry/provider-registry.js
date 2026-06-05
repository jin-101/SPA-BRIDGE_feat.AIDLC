import { err, ok } from '@spa-bridge/core-model';
import { ProviderDescriptorSchema, ProviderErrorSchema } from '../types.js';
import { compareStrings, stableHash } from '../internal.js';
const createProviderError = (code, message, providerId) => ProviderErrorSchema.parse({
    code,
    message,
    providerId,
    retryable: false,
});
export const createProviderRegistry = (providers) => {
    const parsedProviders = providers.map((provider) => ProviderDescriptorSchema.parse(provider));
    const seen = new Set();
    for (const provider of parsedProviders) {
        if (seen.has(provider.providerId)) {
            return err(createProviderError('DUPLICATE_PROVIDER_ID', `Duplicate provider ID: ${provider.providerId}`, provider.providerId));
        }
        seen.add(provider.providerId);
    }
    const registry = {
        registryId: `provider-registry-${stableHash(parsedProviders.map((provider) => provider.providerId).join('|'))}`,
        providers: [...parsedProviders].sort((left, right) => compareStrings(left.providerId, right.providerId)),
    };
    return ok(registry);
};
//# sourceMappingURL=provider-registry.js.map