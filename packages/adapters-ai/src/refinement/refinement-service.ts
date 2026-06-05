import { createSafeDisplayString, err, ok, type Result } from '@spa-bridge/core-model';
import { type ProviderPolicyDecision } from '@spa-bridge/core-security';

import {
  ProviderErrorSchema,
  ProviderInvocationRequestSchema,
  ProviderNeutralRefinementRequestSchema,
  ProviderSelectionRequestSchema,
  RefinementResultSchema,
  type MockProviderScript,
  type ProviderDescriptor,
  type ProviderError,
  type ProviderMode,
  type ProviderNeutralRefinementRequest,
  type ProviderRegistry,
  type ProviderSelectionResult,
  type RefinementResult,
} from '../types.js';
import { createMinimizedProviderContext } from '../context/provider-context-minimizer.js';
import { buildInvocationAuditEvent } from '../audit/provider-audit-event-builder.js';
import { createManualReviewItem, createProviderFailureDiagnostic } from '../diagnostics/provider-diagnostic-factory.js';
import { bridgeProviderPolicy } from '../policy/provider-policy-bridge.js';
import { createProviderRegistry } from '../registry/provider-registry.js';
import { selectProvider } from '../registry/provider-selection-policy.js';
import { createProviderAdapter } from '../adapters/provider-adapters.js';
import { defaultRetryStrategy, invokeWithTimeout, type RetryStrategy } from '../invocation/provider-timeout-guard.js';
import { validateProviderResponse } from '../validation/provider-response-validator.js';
import { createProviderError } from '../shared-errors.js';

export type RefinementServiceConfig = {
  providerMode: ProviderMode;
  externalProviderOptIn?: boolean;
  auditReady?: boolean;
  maskingSatisfied?: boolean;
  timeoutMs?: number;
  retryStrategy?: RetryStrategy;
  mockScripts?: MockProviderScript[];
};

export type RefinementServiceDependencies = {
  providers: ProviderDescriptor[];
  policyDecision: ProviderPolicyDecision;
  config: RefinementServiceConfig;
};

const buildProviderRegistryOrThrow = (providers: ProviderDescriptor[]): ProviderRegistry => {
  const registryResult = createProviderRegistry(providers);
  if (!registryResult.ok) {
    throw registryResult.error;
  }
  return registryResult.value;
};

const blockedResult = (
  request: ProviderNeutralRefinementRequest,
  providerId: string | undefined,
  reasonCode: string,
  message: string,
): RefinementResult =>
  RefinementResultSchema.parse({
    status: 'blocked',
    suggestions: [],
    diagnostics: [`${reasonCode}: ${message}`],
    manualReviewItems: [
      createManualReviewItem(
        {
          providerId: providerId ?? 'unknown',
          adapterKind: 'local-internal',
          context: {
            contextId: `ctx-${request.mappingRequestId}`,
            mappingRequestId: request.mappingRequestId,
            category: request.category,
            safeContext: request.safeContext,
            safeRefs: [...request.sourceRefs, ...request.draftRefs],
            policyEvidenceRef: createSafeDisplayString('blocked'),
            masked: true,
          },
          timeoutMs: 1,
          requestMetadata: {},
        },
        reasonCode,
        message,
      ),
    ],
    auditEvents: [],
    provenance: [],
  });

export const refineMapping = async (
  request: ProviderNeutralRefinementRequest,
  dependencies: RefinementServiceDependencies,
): Promise<Result<RefinementResult, ProviderError>> => {
  const normalizedRequest = ProviderNeutralRefinementRequestSchema.parse(request);
  const registry = buildProviderRegistryOrThrow(dependencies.providers);
  const minimizedContextResult = createMinimizedProviderContext(normalizedRequest, `policy-${dependencies.policyDecision.reasonCode}`);
  if (!minimizedContextResult.ok) {
    return ok(blockedResult(normalizedRequest, undefined, minimizedContextResult.error.code, minimizedContextResult.error.message));
  }

  const selectionRequest = ProviderSelectionRequestSchema.parse({
    runId: dependencies.providers[0]?.providerId ?? normalizedRequest.mappingRequestId,
    correlationId: normalizedRequest.mappingRequestId,
    mappingRequestId: normalizedRequest.mappingRequestId,
    providerMode: dependencies.config.providerMode,
    category: normalizedRequest.category,
    capabilityTags: [...normalizedRequest.ruleIds, ...normalizedRequest.diagnosticRefs],
    policyDecision: dependencies.policyDecision,
  });

  const selectionResult = selectProvider(registry, selectionRequest);
  if (!selectionResult.ok) {
    return err(selectionResult.error);
  }

  if (selectionResult.value.status !== 'selected' || !selectionResult.value.provider) {
    return ok(blockedResult(normalizedRequest, undefined, selectionResult.value.reasonCode, selectionResult.value.diagnostics[0] ?? 'No provider selected'));
  }

  const provider = selectionResult.value.provider;
  const policyDecisionResult = bridgeProviderPolicy({
    provider,
    policyDecision: dependencies.policyDecision,
    externalProviderOptIn: dependencies.config.externalProviderOptIn,
    auditReady: dependencies.config.auditReady ?? true,
    maskingSatisfied: dependencies.config.maskingSatisfied ?? true,
  });

  if (!policyDecisionResult.ok) {
    return err(policyDecisionResult.error);
  }

  if (policyDecisionResult.value.decision !== 'allow') {
    return ok(blockedResult(normalizedRequest, provider.providerId, policyDecisionResult.value.reasonCode, policyDecisionResult.value.reason));
  }

  const adapter = createProviderAdapter(provider, dependencies.config.mockScripts?.find((script) => script.scriptId === provider.providerId));
  const invocationRequest = ProviderInvocationRequestSchema.parse({
    providerId: provider.providerId,
    adapterKind: provider.adapterKind,
    context: minimizedContextResult.value,
    timeoutMs: dependencies.config.timeoutMs ?? 5_000,
    requestMetadata: {
      runId: normalizedRequest.mappingRequestId,
      correlationId: normalizedRequest.mappingRequestId,
      allowedCapabilityTags: [...normalizedRequest.ruleIds, ...normalizedRequest.diagnosticRefs].join(','),
    },
  });

  const invocationResult = await invokeWithTimeout(
    adapter,
    invocationRequest,
    dependencies.config.retryStrategy ?? defaultRetryStrategy,
  );

  if (!invocationResult.ok) {
    const diagnostic = createProviderFailureDiagnostic(invocationResult.error, invocationRequest);
    const audit = buildInvocationAuditEvent(
      invocationRequest,
      'provider-invocation-failed',
      invocationResult.error.code === 'TIMEOUT' ? 'warning' : 'error',
      [invocationResult.error.code],
      invocationResult.error.message,
      { blockedDecisions: 1 },
    );

    return ok(
      RefinementResultSchema.parse({
        status: 'partial',
        suggestions: [],
        diagnostics: [diagnostic.message],
        manualReviewItems: [createManualReviewItem(invocationRequest, invocationResult.error.code, invocationResult.error.message)],
        auditEvents: audit.ok ? [audit.value] : [],
        provenance: [],
      }),
    );
  }

  const validatedResponseResult = validateProviderResponse(invocationResult.value, invocationRequest);
  if (!validatedResponseResult.ok) {
    return ok(blockedResult(normalizedRequest, provider.providerId, validatedResponseResult.error.code, validatedResponseResult.error.message));
  }

  const suggestions = validatedResponseResult.value.suggestions;
  const audit = buildInvocationAuditEvent(
    invocationRequest,
    'provider-invocation-succeeded',
    'info',
    ['PROVIDER_SELECTED'],
    createSafeDisplayString(`Provider ${provider.providerId} returned ${suggestions.length} suggestions`),
    { suggestions: suggestions.length },
  );

  return ok(
    RefinementResultSchema.parse({
      status: 'succeeded',
      suggestions,
      diagnostics: [],
      manualReviewItems: [],
      auditEvents: audit.ok ? [audit.value] : [],
      provenance: suggestions.map((suggestion) => suggestion.provenance),
    }),
  );
};
