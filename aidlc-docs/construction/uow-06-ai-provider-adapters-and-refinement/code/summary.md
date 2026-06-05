# UOW-06 Code Summary

## Overview

UOW-06 introduces `@spa-bridge/adapters-ai`, a reusable provider/refinement package that sits behind UOW-04 mapping output and UOW-05 policy gates.

## Created Files

- `packages/adapters-ai/package.json`
- `packages/adapters-ai/tsconfig.json`
- `packages/adapters-ai/src/index.ts`
- `packages/adapters-ai/src/types.ts`
- `packages/adapters-ai/src/internal.ts`
- `packages/adapters-ai/src/registry/provider-registry.ts`
- `packages/adapters-ai/src/registry/provider-selection-policy.ts`
- `packages/adapters-ai/src/capabilities/provider-capability-catalog.ts`
- `packages/adapters-ai/src/context/provider-context-minimizer.ts`
- `packages/adapters-ai/src/policy/provider-policy-bridge.ts`
- `packages/adapters-ai/src/invocation/provider-timeout-guard.ts`
- `packages/adapters-ai/src/adapters/provider-adapters.ts`
- `packages/adapters-ai/src/testing/mock-provider.ts`
- `packages/adapters-ai/src/validation/provider-response-validator.ts`
- `packages/adapters-ai/src/diagnostics/provider-diagnostic-factory.ts`
- `packages/adapters-ai/src/audit/provider-audit-event-builder.ts`
- `packages/adapters-ai/src/refinement/refinement-service.ts`
- `packages/adapters-ai/src/testing/generators.ts`
- `packages/adapters-ai/src/shared-errors.ts`
- `packages/adapters-ai/tests/adapters-ai.test.ts`
- `aidlc-docs/construction/uow-06-ai-provider-adapters-and-refinement/code/artifact-index.md`

## Public API

- Provider descriptor, capability, registry, selection, context minimization, invocation, response validation, diagnostics, audit, and refinement types are exported from `packages/adapters-ai/src/index.ts`.
- Mock provider support is exported for deterministic offline testing.
- fast-check generator families are exported for property-based tests.

## Security Controls

- External provider use is disabled by default.
- Provider context is minimized before invocation.
- Provider responses are schema-validated before downstream use.
- Audit events are safe-ref based and reject raw prompt/source/response leakage.
- Manual-review items preserve partial results when provider interaction fails or is blocked.

## PBT Coverage

- Provider selection determinism.
- Context minimization invariants.
- Fail-closed behavior for policy blocks, timeouts, and unsafe responses.
- Mock reproducibility.
- Diagnostic stability.
- Target-aware metadata safety.

## Integration Notes

- `@spa-bridge/core-model` supplies shared result, ref, diagnostic, and safe-display contracts.
- `@spa-bridge/core-security` supplies provider policy decisions and security boundaries.
- The package is intended to be consumed by transformation and orchestration units without owning transformation rules.

## Verification Notes

- `npm run build --workspace @spa-bridge/adapters-ai` passed.
- `npm run test --workspace @spa-bridge/adapters-ai` passed.
- `npm run build` passed across the workspace.
- `npm run test` passed across the workspace.
