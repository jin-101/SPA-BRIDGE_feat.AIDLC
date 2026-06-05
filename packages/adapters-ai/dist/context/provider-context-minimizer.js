import { createSafeDisplayString, err, ok } from '@spa-bridge/core-model';
import { MinimizedProviderContextSchema, ProviderErrorSchema, ProviderNeutralRefinementRequestSchema, } from '../types.js';
import { hasForbiddenContextField, normalizeKeyList, stableHash } from '../internal.js';
const createProviderError = (code, message) => ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    retryable: false,
});
const dedupeSafeRefs = (refs) => refs.filter((ref, index, array) => array.findIndex((candidate) => candidate.kind === ref.kind && candidate.path === ref.path && ('segment' in candidate ? candidate.segment : undefined) === ('segment' in ref ? ref.segment : undefined)) === index);
export const createMinimizedProviderContext = (input, policyEvidenceRef) => {
    const request = ProviderNeutralRefinementRequestSchema.parse(input);
    const forbiddenKeys = Object.keys(request.safeContext).filter((key) => hasForbiddenContextField(key));
    if (forbiddenKeys.length > 0) {
        return err(createProviderError('UNSAFE_PROVIDER_CONTEXT', `Forbidden safeContext keys: ${normalizeKeyList(forbiddenKeys).join(', ')}`));
    }
    const safeContext = {};
    for (const [key, value] of Object.entries(request.safeContext)) {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            safeContext[key] = value;
            continue;
        }
        safeContext[key] = [...new Set(value)].sort();
    }
    const safeRefs = dedupeSafeRefs([...request.sourceRefs, ...request.draftRefs]);
    return ok(MinimizedProviderContextSchema.parse({
        contextId: `ctx-${stableHash([request.mappingRequestId, request.category, policyEvidenceRef].join('|'))}`,
        mappingRequestId: request.mappingRequestId,
        category: request.category,
        safeContext,
        safeRefs,
        policyEvidenceRef: createSafeDisplayString(policyEvidenceRef),
        masked: true,
    }));
};
//# sourceMappingURL=provider-context-minimizer.js.map