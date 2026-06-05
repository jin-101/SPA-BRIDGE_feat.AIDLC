import { createSafeDisplayString, ok, err } from '@spa-bridge/core-model';
import { ProviderErrorSchema, ProviderInvocationRequestSchema, ProviderResponseSchema, } from '../types.js';
import { stableHash } from '../internal.js';
const createProviderError = (code, message, providerId) => ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    providerId,
    retryable: code === 'TIMEOUT' || code === 'ADAPTER_FAILED',
});
const buildDeterministicResponse = (descriptor, request) => ProviderResponseSchema.parse({
    mappingRequestId: request.context.mappingRequestId,
    modelLabel: createSafeDisplayString(`${descriptor.providerId}:${descriptor.adapterKind}`),
    suggestions: request.context.safeRefs.slice(0, 3).map((ref, index) => ({
        suggestionId: `s-${stableHash([descriptor.providerId, request.context.mappingRequestId, String(index)].join('|'))}`,
        mappingRequestId: request.context.mappingRequestId,
        category: request.context.category,
        safeSummary: createSafeDisplayString(`${descriptor.displayName} suggestion ${index + 1}`),
        safeRationale: createSafeDisplayString(`Derived from ${request.context.policyEvidenceRef}`),
        confidence: descriptor.adapterKind === 'mock' ? 0.8 : 0.9,
        sourceRefs: ref.kind === 'source' ? [ref] : [],
        generatedRefs: ref.kind === 'generated' ? [ref] : [],
        provenance: {
            providerId: descriptor.providerId,
            adapterKind: descriptor.adapterKind,
            modelLabel: createSafeDisplayString(`${descriptor.providerId}:${descriptor.adapterKind}`),
            invokedAt: createSafeDisplayString(new Date().toISOString()),
            policyDecisionRef: createSafeDisplayString(request.context.policyEvidenceRef),
            auditEventRef: createSafeDisplayString(`audit-${stableHash(request.context.mappingRequestId)}`),
        },
    })),
});
export const createLocalInternalProviderAdapter = (descriptor) => ({
    descriptor,
    kind: 'local-internal',
    async invoke(request) {
        const parsedRequest = ProviderInvocationRequestSchema.parse(request);
        if (descriptor.adapterKind !== 'local-internal') {
            return err(createProviderError('ADAPTER_FAILED', `Adapter kind mismatch for ${descriptor.providerId}`, descriptor.providerId));
        }
        return ok(buildDeterministicResponse(descriptor, parsedRequest));
    },
});
export const createExternalProviderAdapter = (descriptor) => ({
    descriptor,
    kind: 'external',
    async invoke(request) {
        const parsedRequest = ProviderInvocationRequestSchema.parse(request);
        if (descriptor.adapterKind !== 'external') {
            return err(createProviderError('ADAPTER_FAILED', `Adapter kind mismatch for ${descriptor.providerId}`, descriptor.providerId));
        }
        return err(createProviderError('EXTERNAL_PROVIDER_DISABLED', `External provider ${descriptor.providerId} is disabled by default`, parsedRequest.providerId));
    },
});
export const createMockProvider = (descriptor, script) => ({
    descriptor: { ...descriptor, adapterKind: 'mock' },
    kind: 'mock',
    async invoke(request) {
        const parsedRequest = ProviderInvocationRequestSchema.parse(request);
        if (script.failure) {
            return err({
                ...script.failure,
                providerId: descriptor.providerId,
            });
        }
        if (script.match.scriptId && script.match.scriptId !== script.scriptId) {
            return err(createProviderError('ADAPTER_FAILED', `Mock script mismatch for ${descriptor.providerId}`, descriptor.providerId));
        }
        if (script.match.mappingRequestId && script.match.mappingRequestId !== parsedRequest.context.mappingRequestId) {
            return err(createProviderError('NO_MATCHING_PROVIDER', `Mock mapping request mismatch for ${descriptor.providerId}`, descriptor.providerId));
        }
        if (script.match.category && script.match.category !== parsedRequest.context.category) {
            return err(createProviderError('NO_MATCHING_PROVIDER', `Mock category mismatch for ${descriptor.providerId}`, descriptor.providerId));
        }
        if (script.match.capabilityTags?.length) {
            const allTags = script.match.capabilityTags.every((tag) => parsedRequest.requestMetadata.allowedCapabilityTags?.includes(tag));
            if (!allTags) {
                return err(createProviderError('NO_MATCHING_PROVIDER', `Mock capability mismatch for ${descriptor.providerId}`, descriptor.providerId));
            }
        }
        return ok(script.response ?? buildDeterministicResponse({ ...descriptor, adapterKind: 'mock' }, parsedRequest));
    },
});
export const createProviderAdapter = (descriptor, mockScript) => {
    if (descriptor.adapterKind === 'local-internal') {
        return createLocalInternalProviderAdapter(descriptor);
    }
    if (descriptor.adapterKind === 'external') {
        return createExternalProviderAdapter(descriptor);
    }
    return createMockProvider(descriptor, mockScript ?? { scriptId: `mock-${descriptor.providerId}`, match: {}, response: undefined });
};
//# sourceMappingURL=provider-adapters.js.map