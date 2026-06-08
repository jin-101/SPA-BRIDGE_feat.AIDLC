import { createSafeDisplayString, ok, err, type Result } from '@spa-bridge/core-model';

import {
  ProviderErrorSchema,
  type ProviderError,
  ProviderInvocationRequestSchema,
  ProviderResponseSchema,
  type MockProviderScript,
  type ProviderAdapterKind,
  type ProviderDescriptor,
  type ProviderInvocationRequest,
  type ProviderResponse,
} from '../types.js';
import { stableHash } from '../internal.js';

const createProviderError = (code: ProviderError['code'], message: string, providerId?: string): ProviderError =>
  ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    providerId,
    retryable: code === 'TIMEOUT' || code === 'ADAPTER_FAILED',
  });

export type ProviderAdapter = {
  descriptor: ProviderDescriptor;
  kind: ProviderAdapterKind;
  invoke: (request: ProviderInvocationRequest) => Promise<Result<ProviderResponse, ProviderError>>;
};

const buildDeterministicResponse = (descriptor: ProviderDescriptor, request: ProviderInvocationRequest): ProviderResponse =>
  ProviderResponseSchema.parse({
    mappingRequestId: request.context.mappingRequestId,
    modelLabel: createSafeDisplayString(`${descriptor.providerId}:${descriptor.adapterKind}`),
    suggestions: request.context.safeRefs.slice(0, 3).map((ref, index) =>
      ({
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
      }) as ProviderResponse['suggestions'][number],
    ),
  });

const parseJsonObject = (text: string): Record<string, unknown> | undefined => {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : undefined;
  } catch {
    return undefined;
  }
};

const toProviderSuggestionText = (value: unknown, fallback: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  if (Array.isArray(value)) {
    const first = value.find((entry) => typeof entry === 'string' && entry.trim().length > 0);
    if (typeof first === 'string') {
      return first.trim();
    }
  }
  return fallback;
};

const buildPrompt = (request: ProviderInvocationRequest): string =>
  [
    'You are SPA-Bridge, an Angular-to-React migration assistant.',
    'Return concise, safe migration refinement guidance only.',
    'Do not include raw proprietary source snippets.',
    `Category: ${request.context.category}`,
    `Mapping request: ${request.context.mappingRequestId}`,
    `Safe context: ${JSON.stringify(request.context.safeContext)}`,
    `Safe refs: ${request.context.safeRefs.map((ref) => `${ref.kind}:${ref.path}`).join(', ')}`,
    'Return JSON if possible: {"summary":"...","rationale":"...","confidence":0.8}',
  ].join('\n');

const buildResponseFromText = (
  descriptor: ProviderDescriptor,
  request: ProviderInvocationRequest,
  text: string,
  modelLabel: string,
): ProviderResponse => {
  const parsed = parseJsonObject(text);
  const summary = toProviderSuggestionText(parsed?.summary ?? parsed?.suggestions, text);
  const rationale = toProviderSuggestionText(parsed?.rationale, 'Provider returned safe refinement guidance.');
  const confidenceValue = typeof parsed?.confidence === 'number' ? parsed.confidence : 0.7;
  const confidence = Math.max(0, Math.min(1, confidenceValue));

  return ProviderResponseSchema.parse({
    mappingRequestId: request.context.mappingRequestId,
    modelLabel: createSafeDisplayString(modelLabel),
    suggestions: [
      {
        suggestionId: `s-${stableHash([descriptor.providerId, request.context.mappingRequestId, summary].join('|'))}`,
        mappingRequestId: request.context.mappingRequestId,
        category: request.context.category,
        safeSummary: createSafeDisplayString(summary.slice(0, 1_000)),
        safeRationale: createSafeDisplayString(rationale.slice(0, 1_000)),
        confidence,
        sourceRefs: request.context.safeRefs.filter((ref): ref is Extract<typeof ref, { kind: 'source' }> => ref.kind === 'source'),
        generatedRefs: request.context.safeRefs.filter((ref): ref is Extract<typeof ref, { kind: 'generated' }> => ref.kind === 'generated'),
        provenance: {
          providerId: descriptor.providerId,
          adapterKind: descriptor.adapterKind,
          modelLabel: createSafeDisplayString(modelLabel),
          invokedAt: createSafeDisplayString(new Date().toISOString()),
          policyDecisionRef: createSafeDisplayString(request.context.policyEvidenceRef),
          auditEventRef: createSafeDisplayString(`audit-${stableHash(request.context.mappingRequestId)}`),
        },
      },
    ],
  });
};

const invokeOllama = async (
  descriptor: ProviderDescriptor,
  request: ProviderInvocationRequest,
): Promise<Result<ProviderResponse, ProviderError>> => {
  const baseUrl = descriptor.metadata.baseUrl ?? process.env.SPA_BRIDGE_OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const model = descriptor.metadata.model ?? process.env.SPA_BRIDGE_OLLAMA_MODEL ?? 'exaone3.5';
  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/generate`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: buildPrompt(request),
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      return err(createProviderError('ADAPTER_FAILED', `Ollama returned HTTP ${response.status}`, descriptor.providerId));
    }

    const payload = await response.json() as { response?: unknown; model?: string };
    const responseText = typeof payload.response === 'string' ? payload.response : JSON.stringify(payload.response ?? {});
    return ok(buildResponseFromText(descriptor, request, responseText, payload.model ?? model));
  } catch (error) {
    return err(createProviderError('ADAPTER_FAILED', `Ollama invocation failed: ${error instanceof Error ? error.message : 'unknown error'}`, descriptor.providerId));
  }
};

const invokeOpenAiCompatible = async (
  descriptor: ProviderDescriptor,
  request: ProviderInvocationRequest,
): Promise<Result<ProviderResponse, ProviderError>> => {
  const endpoint = descriptor.metadata.endpoint ?? process.env.SPA_BRIDGE_EXTERNAL_LLM_ENDPOINT;
  const model = descriptor.metadata.model ?? process.env.SPA_BRIDGE_EXTERNAL_LLM_MODEL;
  const apiKeyEnv = descriptor.metadata.apiKeyEnv ?? 'SPA_BRIDGE_EXTERNAL_LLM_API_KEY';
  const apiKey = process.env[apiKeyEnv];

  if (!endpoint || !model || !apiKey) {
    return err(createProviderError('EXTERNAL_PROVIDER_DISABLED', 'External LLM endpoint, model, or API key is not configured.', descriptor.providerId));
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You provide safe Angular-to-React migration refinement guidance. Return JSON only.' },
          { role: 'user', content: buildPrompt(request) },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      return err(createProviderError('ADAPTER_FAILED', `External LLM returned HTTP ${response.status}`, descriptor.providerId));
    }

    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content ?? '{}';
    return ok(buildResponseFromText(descriptor, request, content, model));
  } catch (error) {
    return err(createProviderError('ADAPTER_FAILED', `External LLM invocation failed: ${error instanceof Error ? error.message : 'unknown error'}`, descriptor.providerId));
  }
};

export const createLocalInternalProviderAdapter = (descriptor: ProviderDescriptor): ProviderAdapter => ({
  descriptor,
  kind: 'local-internal',
  async invoke(request) {
    const parsedRequest = ProviderInvocationRequestSchema.parse(request);

    if (descriptor.adapterKind !== 'local-internal') {
      return err(createProviderError('ADAPTER_FAILED', `Adapter kind mismatch for ${descriptor.providerId}`, descriptor.providerId));
    }

    if (descriptor.metadata.backend === 'ollama') {
      return invokeOllama(descriptor, parsedRequest);
    }

    return ok(buildDeterministicResponse(descriptor, parsedRequest));
  },
});

export const createExternalProviderAdapter = (descriptor: ProviderDescriptor): ProviderAdapter => ({
  descriptor,
  kind: 'external',
  async invoke(request) {
    const parsedRequest = ProviderInvocationRequestSchema.parse(request);

    if (descriptor.adapterKind !== 'external') {
      return err(createProviderError('ADAPTER_FAILED', `Adapter kind mismatch for ${descriptor.providerId}`, descriptor.providerId));
    }

    if (descriptor.metadata.backend === 'openai-compatible') {
      return invokeOpenAiCompatible(descriptor, parsedRequest);
    }

    return err(createProviderError('EXTERNAL_PROVIDER_DISABLED', `External provider ${descriptor.providerId} is disabled by default`, parsedRequest.providerId));
  },
});

export const createMockProvider = (descriptor: ProviderDescriptor, script: MockProviderScript): ProviderAdapter => ({
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

export const createProviderAdapter = (descriptor: ProviderDescriptor, mockScript?: MockProviderScript): ProviderAdapter => {
  if (descriptor.adapterKind === 'local-internal') {
    return createLocalInternalProviderAdapter(descriptor);
  }

  if (descriptor.adapterKind === 'external') {
    return createExternalProviderAdapter(descriptor);
  }

  return createMockProvider(descriptor, mockScript ?? { scriptId: `mock-${descriptor.providerId}`, match: {}, response: undefined });
};
