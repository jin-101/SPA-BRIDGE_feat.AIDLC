import { createDiagnostic, createSafeDisplayString } from '@spa-bridge/core-model';
export const createProviderDiagnostic = (code, severity, message, request, remediationHint) => createDiagnostic({
    code,
    severity,
    message,
    sourceRefs: request.sourceRefs ?? [],
    generatedRefs: request.generatedRefs ?? [],
    tags: ['provider', code],
    remediationHint,
});
export const createManualReviewItem = (request, reasonCode, safeMessage) => ({
    itemId: `manual-${request.context.mappingRequestId}-${reasonCode}`,
    mappingRequestId: request.context.mappingRequestId,
    reviewCategory: 'provider-refinement',
    reasonCode,
    severity: 'high',
    safeRefs: request.context.safeRefs,
    safeMessage: createSafeDisplayString(safeMessage),
});
export const createSelectionDiagnostic = (result, request) => createProviderDiagnostic(result.reasonCode, result.status === 'blocked' ? 'security-blocker' : 'manual-review', `Provider selection ${result.status} for ${request.providerId ?? request.context.mappingRequestId}`, { sourceRefs: request.context.safeRefs.filter((ref) => ref.kind === 'source'), generatedRefs: request.context.safeRefs.filter((ref) => ref.kind === 'generated') }, result.diagnostics[0]);
export const createProviderFailureDiagnostic = (error, request) => createProviderDiagnostic(error.code, error.code === 'TIMEOUT' ? 'warning' : 'error', error.message, { sourceRefs: request.context.safeRefs.filter((ref) => ref.kind === 'source'), generatedRefs: request.context.safeRefs.filter((ref) => ref.kind === 'generated') }, error.retryable ? 'Provider failure may be retried with deterministic strategy' : undefined);
//# sourceMappingURL=provider-diagnostic-factory.js.map