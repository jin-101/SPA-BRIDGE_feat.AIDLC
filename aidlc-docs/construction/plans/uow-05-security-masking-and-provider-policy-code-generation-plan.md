# Code Generation Plan - UOW-05 Security, Masking, and Provider Policy

## Unit Context

- **Unit**: UOW-05 Security, Masking, and Provider Policy
- **Primary Package(s)**: `packages/core-security`, policy coordination updates in `packages/core-application`
- **Primary Owner Role**: Security Reviewer
- **Reviewer Roles**: Architect, Migration Engineer
- **Primary Stories**: US-009, US-010
- **Supporting Stories**: US-001, US-003, US-006, US-007, US-011, US-013, US-014
- **Workspace Root**: `/Users/jhan/Desktop/test/ai-dlc/spa-bridge`
- **Application Code Location**: `packages/core-security/` and targeted policy exports in `packages/core-application/`
- **Documentation Location**: `aidlc-docs/construction/uow-05-security-masking-and-provider-policy/code/`

## Generation Approach

Create a dedicated `@spa-bridge/core-security` package that implements deterministic, fail-closed security primitives. The package will expose small typed APIs for configuration, detection, masking, token vault lifecycle, provider policy decisions, safe audit events, access-control hooks, rule-pack validation, and PBT support.

The implementation will avoid new runtime dependencies beyond `@spa-bridge/core-model`, `zod`, and Node built-ins. Tests will use Vitest and fast-check.

## Dependencies and Interfaces

| Dependency | Use |
|---|---|
| `@spa-bridge/core-model` | `Result`, diagnostics, safe refs, masking token contracts |
| `zod` | Schema-first validation |
| Node built-ins | Token ID hashing, deterministic helpers, timer-free TTL checks |
| `vitest` | Example-based tests |
| `fast-check` | Property-based and stateful model tests |

## Story Traceability

| Story | Planned Coverage |
|---|---|
| US-009 | Masking pipeline, token vault, provider policy gate, external-provider readiness gate |
| US-010 | Secure runtime defaults, audit-safe events, dependency minimization, fail-closed handling |
| US-001 | Core application policy coordinator handoff |
| US-003 | Safe refs for source-analysis security findings |
| US-006 | Security support for route/state/provider-sensitive mappings |
| US-007 | Provider-neutral decisions consumed by AI adapters |
| US-011 | Typed diagnostics and deterministic policy outputs for quality/self-correction |
| US-013 | Report-safe audit events and redaction summaries |
| US-014 | Extensible rule-pack registry and validated boundaries |

## Code Generation Steps

### Step 1: Project Structure Setup

- [x] Create `packages/core-security/package.json`.
- [x] Create `packages/core-security/tsconfig.json`.
- [x] Create `packages/core-security/src/index.ts`.
- [x] Create package directories: `config`, `types`, `detection`, `masking`, `token-vault`, `policy`, `audit`, `access`, `rule-packs`, `pipeline`, `testing`.
- [x] Update root `package.json` build/test scripts to include `@spa-bridge/core-security`.

### Step 2: Core Types and Schemas

- [x] Generate security domain types and Zod schemas in `packages/core-security/src/types/`.
- [x] Include `SecurityConfig`, `PayloadRef`, `SensitiveFinding`, `MaskedPayload`, `TokenScope`, `ProviderPolicyDecision`, `SecurityAuditEvent`, `AccessControlDecision`, and `SecurityRulePack`.
- [x] Add stable security error codes and typed `SecurityError`.
- [x] Export types through `src/index.ts`.

### Step 3: Security Config Resolver

- [x] Implement `SecurityConfigResolver`.
- [x] Implement schema-first config validation with safe defaults.
- [x] Enforce explicit external-provider opt-in and deterministic merge order.
- [x] Add example tests for default deny, explicit opt-in, invalid config, and deterministic merge.

### Step 4: Detection and Rule-Pack Registry

- [x] Implement generic `SensitiveDataDetector`.
- [x] Implement deterministic `FindingMerger`.
- [x] Implement `SecurityRulePackRegistry`.
- [x] Implement `SecurityRulePackValidator` with ID/version/precedence/schema checks and downgrade prevention.
- [x] Add target-aware starter rule pack for library-driven review patterns without hardcoding raw customer values.

### Step 5: Masking Pipeline and Safe Output Validation

- [x] Implement staged `MaskingPipeline`.
- [x] Implement irreversible redaction, reversible tokenization request handoff, and category-only finding support.
- [x] Implement `SafeOutputValidator` to reject unsafe output and excerpt fields.
- [x] Add example tests for redaction, tokenization mode selection, category-only mode, and unsafe output rejection.

### Step 6: Token Vault

- [x] Implement scoped in-memory `TokenVault`.
- [x] Enforce run/correlation namespace, TTL, explicit dispose, and no serialization API.
- [x] Implement restoration decisions for allowed scope, expired token, missing token, and scope mismatch.
- [x] Add example tests for token lifecycle behavior.

### Step 7: Provider Policy Gate

- [x] Implement pure deterministic `ProviderPolicyGate`.
- [x] Implement `ProviderReadinessEvaluator` for external-provider prerequisites.
- [x] Enforce fail-closed behavior for unknown provider, missing masking, missing audit, missing opt-in, and contradictory policy.
- [x] Add policy matrix tests.

### Step 8: Safe Audit and Access Hooks

- [x] Implement `SafeAuditEventBuilder`.
- [x] Implement `AuditPrivacyGuard`.
- [x] Implement `AccessControlHookEvaluator`.
- [x] Enforce deny-by-default and render-safe outputs.
- [x] Add tests for unsafe audit fields, safe event creation, and access hook defaults.

### Step 9: Security Evaluation Pipeline

- [x] Implement `SecurityEvaluationPipeline` to orchestrate config, detection, merge, masking, policy, and audit stages.
- [x] Ensure all public APIs return `Result`.
- [x] Add integration-style unit tests for end-to-end allow, block, and manual-review flows.

### Step 10: PBT Support and Tests

- [x] Implement `packages/core-security/src/testing/generators.ts`.
- [x] Implement domain generators for configs, payloads, findings, masking requests, provider policy requests, audit events, and rule packs.
- [x] Implement token vault stateful command model test support.
- [x] Add PBT tests for masking round-trip, redaction invariant, policy fail-closed, audit privacy, rule-pack idempotence, and token lifecycle.

### Step 11: Core Application Policy Coordinator

- [x] Add or update `packages/core-application/src/policy/security-policy-coordinator.ts`.
- [x] Export coordinator from `packages/core-application/src/index.ts` if needed.
- [x] Keep coordination thin and avoid duplicating `core-security` logic.
- [x] Add smoke tests for coordinator delegation.

### Step 12: Documentation and Artifact Summary

- [x] Create `aidlc-docs/construction/uow-05-security-masking-and-provider-policy/code/summary.md`.
- [x] Create `aidlc-docs/construction/uow-05-security-masking-and-provider-policy/code/artifact-index.md`.
- [x] Document created application files, tests, PBT properties, security compliance, and integration boundaries.

## Out of Scope

- Full authentication and authorization implementation.
- External AI provider implementation.
- Persistent encrypted token vault.
- Infrastructure resources, deployment artifacts, or cloud monitoring.
- Full report rendering implementation.

## Completion Criteria

- `@spa-bridge/core-security` package exists and exports the planned APIs.
- Workspace build/test scripts include the new package.
- Example and property-based tests cover the blocking security/PBT requirements.
- `core-application` has only a thin policy coordination integration.
- Documentation summaries exist under `aidlc-docs/construction/uow-05-security-masking-and-provider-policy/code/`.

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Markdown tables and code paths are plain text and parse-safe.
