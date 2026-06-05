# UOW-06 AI Provider Adapters and Refinement Code Generation Plan

## Plan Status

- **Unit**: UOW-06 AI Provider Adapters and Refinement
- **Stage**: Code Generation Planning
- **Workspace Root**: `/Users/jhan/Desktop/test/ai-dlc/spa-bridge`
- **Application Code Location**: `packages/adapters-ai/`
- **Documentation Location**: `aidlc-docs/construction/uow-06-ai-provider-adapters-and-refinement/code/`
- **Approval Required Before Generation**: Yes

This plan is the single source of truth for UOW-06 code generation. Code generation must follow the steps in order and mark each checkbox immediately when completed.

## Unit Context

UOW-06 introduces a reusable AI provider/refinement package that sits behind UOW-04 transformation and UOW-05 security policy gates.

### Responsibilities

- Register, validate, and select providers deterministically.
- Minimize provider context before invocation.
- Consume UOW-05 provider policy decisions.
- Invoke local/internal, mock, and disabled-by-default external provider adapters.
- Enforce timeout and retry policy.
- Validate provider responses before downstream use.
- Emit safe diagnostics, manual-review records, audit events, and AI-assisted provenance.
- Provide PBT generators and tests for provider behavior.

### Non-Responsibilities

- Do not execute Angular-to-React transformation rules.
- Do not own sensitive-data detection or masking internals.
- Do not persist credentials.
- Do not implement a concrete commercial external provider SDK.
- Do not render reports or UI.

## Story Traceability

| Story | Coverage in UOW-06 |
|---|---|
| US-007 AI-Assisted Refinement | Local/internal provider adapter, minimized context, provider failure manual-review diagnostics, AI-assisted provenance |
| US-009 Secure Provider Context Handling | Policy-gated provider invocation, fail-closed external provider boundary, no raw prompt/source logging |
| US-014 Extension Boundaries | Shared provider adapter contracts, deterministic registry, provider integrity checks, package boundary tests |

## Dependencies and Interfaces

| Dependency | Usage |
|---|---|
| `@spa-bridge/core-model` | Shared diagnostics, source refs, generated refs, result helpers, safe display strings |
| `@spa-bridge/core-security` | `ProviderPolicyDecision`, security audit/policy concepts, fail-closed provider policy gates |
| `@spa-bridge/transform-angular-react` | Provider-neutral mapping request handoff concept and future integration point |
| `zod` | Runtime schema validation for provider descriptors, contexts, responses, audit events, and metadata |
| `vitest` | Example-based unit and integration tests |
| `fast-check` | Property-based tests for determinism and invariants |

## Expected Package Structure

| Path | Purpose |
|---|---|
| `packages/adapters-ai/package.json` | Workspace package metadata and scripts |
| `packages/adapters-ai/tsconfig.json` | TypeScript package configuration |
| `packages/adapters-ai/src/index.ts` | Public exports |
| `packages/adapters-ai/src/types.ts` | Shared provider/refinement types and schemas |
| `packages/adapters-ai/src/registry/provider-registry.ts` | Provider registration and duplicate rejection |
| `packages/adapters-ai/src/registry/provider-selection-policy.ts` | Deterministic provider selection |
| `packages/adapters-ai/src/capabilities/provider-capability-catalog.ts` | Generic and target-aware capability metadata |
| `packages/adapters-ai/src/context/provider-context-minimizer.ts` | Allowlisted minimized provider context creation |
| `packages/adapters-ai/src/policy/provider-policy-bridge.ts` | UOW-05 policy decision bridge |
| `packages/adapters-ai/src/invocation/provider-timeout-guard.ts` | Timeout and retry wrapper |
| `packages/adapters-ai/src/adapters/provider-adapters.ts` | Local, external, and adapter contracts |
| `packages/adapters-ai/src/testing/mock-provider.ts` | Deterministic mock provider |
| `packages/adapters-ai/src/validation/provider-response-validator.ts` | Structured provider response validation |
| `packages/adapters-ai/src/diagnostics/provider-diagnostic-factory.ts` | Safe diagnostics and manual-review records |
| `packages/adapters-ai/src/audit/provider-audit-event-builder.ts` | Safe provider audit event construction |
| `packages/adapters-ai/src/refinement/refinement-service.ts` | End-to-end provider refinement pipeline |
| `packages/adapters-ai/src/testing/generators.ts` | fast-check generator families |
| `packages/adapters-ai/tests/adapters-ai.test.ts` | Example and PBT coverage |
| `package.json` | Root build/test scripts updated to include `@spa-bridge/adapters-ai` |

## Generation Steps

### Step 1: Project Structure Setup

- [x] Create `packages/adapters-ai/` package structure.
- [x] Add `package.json` with exact dependency versions aligned to existing packages.
- [x] Add `tsconfig.json` extending root TypeScript settings.
- [x] Add root `package.json` build/test script entries for `@spa-bridge/adapters-ai`.

### Step 2: Shared Types and Schemas

- [x] Create `src/types.ts`.
- [x] Define provider descriptor, capability, target capability pack, selection request/result, minimized context, invocation request/result, refinement suggestion, audit event, manual-review item, mock script, and provider error schemas.
- [x] Use schema-first validation with `zod`.
- [x] Reuse `core-model` source/generated refs and safe display strings where appropriate.

### Step 3: Provider Registry and Selection

- [x] Create `src/registry/provider-registry.ts`.
- [x] Create `src/registry/provider-selection-policy.ts`.
- [x] Implement duplicate provider ID rejection.
- [x] Implement deterministic ordering by mode, capability match, policy readiness, priority, provider ID, and adapter kind.
- [x] Return manual-review result when no provider matches.

### Step 4: Capability Catalog and Target Metadata

- [x] Create `src/capabilities/provider-capability-catalog.ts`.
- [x] Add generic categories for template, lifecycle, DI, route, state, form, i18n, animation, map, media, QR/barcode, service-worker, and unknown.
- [x] Add target capability pack validation.
- [x] Reject raw customer data fields in metadata.

### Step 5: Context Minimization

- [x] Create `src/context/provider-context-minimizer.ts`.
- [x] Construct allowlisted minimized context from provider-neutral mapping requests.
- [x] Reject forbidden fields including raw source, raw prompt, secrets, cookies, credentials, tokens, full files, and unrestricted drafts.
- [x] Preserve safe refs, category, capability tags, rule IDs, diagnostics, policy evidence refs, and safe scalar context only.

### Step 6: Policy Bridge

- [x] Create `src/policy/provider-policy-bridge.ts`.
- [x] Consume `ProviderPolicyDecision` from `@spa-bridge/core-security`.
- [x] Convert missing, block, or manual-review policy into safe blocked/manual-review provider decisions.
- [x] Ensure external provider use requires explicit policy allow and provider readiness.

### Step 7: Invocation Guards and Adapter Contracts

- [x] Create `src/invocation/provider-timeout-guard.ts`.
- [x] Create `src/adapters/provider-adapters.ts`.
- [x] Define adapter contracts for local/internal and external providers.
- [x] Keep external provider boundary disabled by default.
- [x] Implement timeout handling and default single-attempt/no-retry behavior.

### Step 8: Mock Provider

- [x] Create `src/testing/mock-provider.ts`.
- [x] Implement deterministic script matching by script ID, mapping request ID, category, capability tags, and optional seed.
- [x] Implement typed deterministic failure injection.

### Step 9: Response Validation

- [x] Create `src/validation/provider-response-validator.ts`.
- [x] Validate response schema, mapping request ID, suggestion ID, confidence bounds, safe summary, safe rationale, provenance, and no unsafe raw content.
- [x] Reject invalid responses with safe diagnostics.

### Step 10: Diagnostics and Audit

- [x] Create `src/diagnostics/provider-diagnostic-factory.ts`.
- [x] Create `src/audit/provider-audit-event-builder.ts`.
- [x] Emit stable safe diagnostics, manual-review records, reason codes, counts, correlation IDs, mapping request IDs, provider IDs, and safe refs.
- [x] Reject raw prompt/source/response fields in audit events.

### Step 11: Refinement Service

- [x] Create `src/refinement/refinement-service.ts`.
- [x] Orchestrate normalize, minimize, policy bridge, selection, timeout-guarded invocation, response validation, diagnostics, audit, and result packaging.
- [x] Preserve partial output and emit manual-review diagnostics for blocked/failed provider flows.

### Step 12: Public Exports

- [x] Create `src/index.ts`.
- [x] Export stable public APIs, schemas, types, registry, minimizer, policy bridge, adapters, validator, diagnostics, audit, refinement service, mock provider, and test generators.

### Step 13: Tests and PBT

- [x] Create `src/testing/generators.ts`.
- [x] Create `tests/adapters-ai.test.ts`.
- [x] Add example tests for registry validation, selection precedence, context minimization, policy bridge, timeout behavior, mock provider, response validation, audit privacy, and refinement pipeline.
- [x] Add PBT for provider selection determinism, context minimization invariants, fail-closed behavior, response validation, mock reproducibility, diagnostic stability, and target metadata safety.

### Step 14: Documentation Summary

- [x] Create `aidlc-docs/construction/uow-06-ai-provider-adapters-and-refinement/code/summary.md`.
- [x] Create `aidlc-docs/construction/uow-06-ai-provider-adapters-and-refinement/code/artifact-index.md`.
- [x] Document created files, public APIs, security controls, PBT coverage, and integration notes.

### Step 15: Verification

- [x] Run package build for `@spa-bridge/adapters-ai`.
- [x] Run package tests for `@spa-bridge/adapters-ai`.
- [x] Run workspace build.
- [x] Run workspace test.
- [x] Record verification results in the code summary.

## Approval Gate

Code generation must not begin until this plan is explicitly approved.

Approved next action after approval: execute Step 1 through Step 15 in order, updating this plan immediately after each completed step.
