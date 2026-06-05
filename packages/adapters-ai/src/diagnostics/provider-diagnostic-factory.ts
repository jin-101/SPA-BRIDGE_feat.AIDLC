import { createDiagnostic, createSafeDisplayString, type Diagnostic } from '@spa-bridge/core-model';

import { type ProviderInvocationRequest, type ProviderError, type ProviderSelectionResult, type ManualReviewItem } from '../types.js';

export const createProviderDiagnostic = (
  code: string,
  severity: Diagnostic['severity'],
  message: string,
  request: { sourceRefs?: Diagnostic['sourceRefs']; generatedRefs?: Diagnostic['generatedRefs'] },
  remediationHint?: string,
): Diagnostic =>
  createDiagnostic({
    code,
    severity,
    message,
    sourceRefs: request.sourceRefs ?? [],
    generatedRefs: request.generatedRefs ?? [],
    tags: ['provider', code],
    remediationHint,
  });

export const createManualReviewItem = (
  request: ProviderInvocationRequest,
  reasonCode: string,
  safeMessage: string,
): ManualReviewItem => ({
  itemId: `manual-${request.context.mappingRequestId}-${reasonCode}`,
  mappingRequestId: request.context.mappingRequestId,
  reviewCategory: 'provider-refinement',
  reasonCode,
  severity: 'high',
  safeRefs: request.context.safeRefs,
  safeMessage: createSafeDisplayString(safeMessage),
});

export const createSelectionDiagnostic = (
  result: ProviderSelectionResult,
  request: ProviderInvocationRequest,
): Diagnostic =>
  createProviderDiagnostic(
    result.reasonCode,
    result.status === 'blocked' ? 'security-blocker' : 'manual-review',
    `Provider selection ${result.status} for ${request.providerId ?? request.context.mappingRequestId}`,
    { sourceRefs: request.context.safeRefs.filter((ref) => ref.kind === 'source'), generatedRefs: request.context.safeRefs.filter((ref) => ref.kind === 'generated') },
    result.diagnostics[0],
  );

export const createProviderFailureDiagnostic = (
  error: ProviderError,
  request: ProviderInvocationRequest,
): Diagnostic =>
  createProviderDiagnostic(
    error.code,
    error.code === 'TIMEOUT' ? 'warning' : 'error',
    error.message,
    { sourceRefs: request.context.safeRefs.filter((ref) => ref.kind === 'source'), generatedRefs: request.context.safeRefs.filter((ref) => ref.kind === 'generated') },
    error.retryable ? 'Provider failure may be retried with deterministic strategy' : undefined,
  );
