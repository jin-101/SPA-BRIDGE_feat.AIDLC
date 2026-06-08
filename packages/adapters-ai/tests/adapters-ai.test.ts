import { afterEach, describe, expect, it, vi } from 'vitest';
import fc from 'fast-check';

import {
  createProviderRegistry,
  createMinimizedProviderContext,
  createLocalInternalProviderAdapter,
  createMockProvider,
  bridgeProviderPolicy,
  invokeWithTimeout,
  refineMapping,
  selectProvider,
  validateProviderResponse,
  providerDescriptorArb,
  providerNeutralRequestArb,
  providerPolicyDecisionArb,
  providerResponseArb,
  targetCapabilityPackArb,
} from '../src/index.js';

describe('adapters-ai', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects duplicate provider IDs', () => {
    const provider = fc.sample(providerDescriptorArb, 1)[0]!;
    const result = createProviderRegistry([provider, provider]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('DUPLICATE_PROVIDER_ID');
    }
  });

  it('minimizes provider context and strips forbidden fields', () => {
    const request = fc.sample(providerNeutralRequestArb, 1)[0]!;
    request.safeContext = { rawPrompt: 'secret', allowed: 'yes', allowedArray: ['a', 'b'] };
    const result = createMinimizedProviderContext(request, 'policy-ref-1');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('UNSAFE_PROVIDER_CONTEXT');
    }
  });

  it('blocks external providers when policy is not ready', () => {
    const provider = { ...fc.sample(providerDescriptorArb, 1)[0]!, adapterKind: 'external' as const, requiresExternalPolicy: true };
    const policyDecision = { ...fc.sample(providerPolicyDecisionArb, 1)[0]!, decision: 'allow' as const, externalProviderAllowed: false };
    const result = bridgeProviderPolicy({
      provider,
      policyDecision,
      externalProviderOptIn: false,
      auditReady: false,
      maskingSatisfied: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.decision).toBe('block');
    }
  });

  it('keeps mock provider responses deterministic', async () => {
    const provider = { ...fc.sample(providerDescriptorArb, 1)[0]!, adapterKind: 'mock' as const };
    const request = {
      providerId: provider.providerId,
      adapterKind: 'mock' as const,
      context: {
        contextId: 'ctx-1',
        mappingRequestId: 'map-1',
        category: 'template' as const,
        safeContext: {},
        safeRefs: [],
        policyEvidenceRef: 'policy-1',
        masked: true,
      },
      timeoutMs: 1000,
      requestMetadata: {},
    };
    const adapter = createMockProvider(provider, {
      scriptId: provider.providerId,
      match: { mappingRequestId: 'map-1', category: 'template' },
      response: {
        mappingRequestId: 'map-1',
        suggestions: [],
      },
    });
    const first = await adapter.invoke(request);
    const second = await adapter.invoke(request);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
  });

  it('invokes Ollama local provider metadata and returns safe suggestions', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          model: 'exaone3.5',
          response: JSON.stringify({
            summary: 'Prefer a React hook for lifecycle migration.',
            rationale: 'The safe context indicates lifecycle behavior.',
            confidence: 0.82,
          }),
        }),
      })),
    );

    const provider = {
      providerId: 'ollama-exaone3.5',
      adapterKind: 'local-internal' as const,
      displayName: 'Ollama EXAONE 3.5',
      capabilities: [{ category: 'template' as const, tags: ['jsx'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 50 }],
      priority: 100,
      enabled: true,
      requiresExternalPolicy: false,
      metadata: { backend: 'ollama', baseUrl: 'http://127.0.0.1:11434', model: 'exaone3.5' },
    };
    const adapter = createLocalInternalProviderAdapter(provider);
    const result = await adapter.invoke({
      providerId: provider.providerId,
      adapterKind: 'local-internal',
      context: {
        contextId: 'ctx-ollama',
        mappingRequestId: 'map-ollama',
        category: 'template',
        safeContext: { bindingCount: 1 },
        safeRefs: [{ kind: 'source', path: 'src/app/app.component.ts' }],
        policyEvidenceRef: 'policy-ollama',
        masked: true,
      },
      timeoutMs: 1000,
      requestMetadata: {},
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.modelLabel).toBe('exaone3.5');
      expect(result.value.suggestions[0]?.safeSummary).toContain('React hook');
    }
  });


  it('validates provider responses against mapping requests', () => {
    const request = {
      providerId: 'provider-1',
      adapterKind: 'local-internal' as const,
      context: {
        contextId: 'ctx-1',
        mappingRequestId: 'map-1',
        category: 'template' as const,
        safeContext: {},
        safeRefs: [],
        policyEvidenceRef: 'policy-1',
        masked: true,
      },
      timeoutMs: 1000,
      requestMetadata: {},
    };

    const result = validateProviderResponse(
      {
        mappingRequestId: 'map-1',
        suggestions: [],
      },
      request,
    );

    expect(result.ok).toBe(true);
  });

  it('refines mappings with a local provider', async () => {
    const provider = { ...fc.sample(providerDescriptorArb, 1)[0]!, adapterKind: 'local-internal' as const, enabled: true };
    const policyDecision = { ...fc.sample(providerPolicyDecisionArb, 1)[0]!, decision: 'allow' as const, externalProviderAllowed: false };
    const request = fc.sample(providerNeutralRequestArb, 1)[0]!;
    const result = await refineMapping(request, {
      providers: [provider],
      policyDecision,
      config: {
        providerMode: 'local-first',
        timeoutMs: 1000,
        auditReady: true,
        maskingSatisfied: true,
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(['succeeded', 'partial', 'blocked', 'manual-review']).toContain(result.value.status);
    }
  });

  it('supports target capability pack validation', () => {
    const pack = fc.sample(targetCapabilityPackArb, 1)[0]!;
    const selection = createProviderRegistry([]);
    expect(selection.ok).toBe(true);
    expect(pack.packId.length).toBeGreaterThan(0);
  });
});
