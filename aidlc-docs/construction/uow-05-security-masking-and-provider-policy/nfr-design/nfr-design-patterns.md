# UOW-05 NFR Design Patterns

## Design Intent

UOW-05 implements security controls as deterministic library components. Provider calls, masking, token restoration, audit evidence, and target-aware rules all pass through explicit gates so downstream units cannot accidentally bypass policy.

The design favors fail-closed behavior, safe structured evidence, in-memory-only reversible tokens, and domain-specific property-based tests.

## Pattern Summary

| Pattern | Components | NFRs Addressed |
|---|---|---|
| Pure Policy Decision Gate | `ProviderPolicyGate`, `ProviderReadinessEvaluator` | Fail-closed reliability, provider readiness, deterministic output |
| Scoped In-Memory Token Vault | `TokenVault`, `TokenScope`, `TokenExpiryPolicy` | No persistence, TTL, controlled restoration |
| Safe Audit Builder | `SafeAuditEventBuilder`, `AuditPrivacyGuard` | No raw values in logs/reports, structured evidence |
| Staged Detection and Masking Pipeline | `SecurityEvaluationPipeline`, `SensitiveDataDetector`, `MaskingPipeline` | Deterministic detection, safe output validation |
| Rule-Pack Registry and Validator | `SecurityRulePackRegistry`, `SecurityRulePackValidator` | Target-aware coverage, downgrade prevention |
| Schema-First Config Resolver | `SecurityConfigResolver`, `SecurityConfigSchema` | Safe defaults, explicit external-provider opt-in |
| Deny-by-Default Access Hook | `AccessControlHookEvaluator` | CLI/Web UI reuse, render-safe decisions |
| Typed Result Failure Handling | Shared `Result`, stable diagnostics | Fail-safe exception handling |
| PBT Support Layer | Domain generators, token lifecycle model | Round-trip, invariants, stateful token tests |

## Pure Provider Policy Gate

`ProviderPolicyGate` is a pure deterministic component. It receives normalized provider intent, masking state, policy configuration, audit state, and security findings. It returns only:

- `allowed`
- `blocked`
- `manual-review`

The decision includes stable reason codes and safe diagnostics. It never calls providers and never inspects raw provider responses.

### Required Behaviors

- Unknown provider type returns `blocked`.
- Missing external-provider opt-in returns `blocked`.
- Missing enterprise opt-out confirmation for external providers returns `blocked`.
- Missing masking satisfaction returns `blocked`.
- Missing audit event creation returns `blocked`.
- Local/internal providers still require policy evaluation.

## Scoped In-Memory Token Vault

`TokenVault` stores reversible token values only in memory.

### Scope Model

| Scope Field | Purpose |
|---|---|
| `runId` | Prevents token reuse across conversion runs |
| `correlationId` | Prevents token reuse across unrelated provider or generation flows |
| `tokenId` | Stable lookup key that reveals no raw value details |
| `expiresAt` | Forces restoration to fail closed after TTL |

### Required Behaviors

- No serialization API exists.
- No raw value logging is possible from public methods.
- Expired tokens are removed or ignored.
- `dispose(scope)` removes all tokens for a scope.
- Lookup outside matching scope returns a blocked restoration decision.

## Safe Audit Event Builder

`SafeAuditEventBuilder` is the only construction path for security audit events.

### Allowed Inputs

- Safe refs
- Counts
- Stable reason codes
- Category names
- Rule IDs
- Render-safe messages

### Forbidden Inputs

- Raw payload text
- Raw source snippets
- Masked excerpts by default
- Secrets, tokens, credentials, PII, proprietary identifiers
- Arbitrary metadata objects from callers

## Staged Detection and Masking Pipeline

The security pipeline runs in explicit stages:

| Stage | Purpose | Failure Behavior |
|---|---|---|
| Normalize | Validate request and config | Invalid input returns typed error |
| Detect | Run generic and target-aware detectors | Detector failure blocks provider use |
| Merge Findings | Deduplicate by category, safe ref, detector ID | Invalid finding blocks output |
| Choose Mode | Select redaction, tokenization, category-only, none, or blocked | Unclear policy returns blocked |
| Mask | Produce safe output or token refs | Masking failure blocks provider use |
| Validate Output | Ensure no forbidden raw values are present | Unsafe output returns blocking diagnostic |
| Audit | Build safe event | Audit failure blocks external provider use |

This keeps regex-style detection as an implementation detail, not the overall architecture.

## Rule-Pack Registry and Validation

Target-aware security rules are registered through `SecurityRulePackRegistry`.

### Validation Rules

- Rule pack has ID, version, precedence, and supported categories.
- Rule pack schema validates before registration.
- Rule execution order is deterministic by precedence, pack ID, version, and rule ID.
- Rule packs may add findings but cannot downgrade or suppress generic findings.
- Duplicate rule outputs merge deterministically.

## Schema-First Config Resolver

`SecurityConfigResolver` merges default config, project config, and run overrides using a deterministic precedence order.

### Safe Defaults

- External providers disabled.
- Enterprise data opt-out not assumed.
- Token vault TTL required.
- Audit excerpts disabled.
- Unknown provider blocked.
- Target-aware rule packs disabled unless listed.

## Deny-by-Default Access-Control Hooks

`AccessControlHookEvaluator` creates reusable CLI/Web UI hook decisions.

Outputs include:

- status
- stable reason codes
- safe display metadata
- required review actions
- allowed operation IDs

The default decision is deny unless the hook receives valid, explicit allow conditions.

## Typed Failure Handling

All public UOW-05 components return `Result`.

Blocking error categories:

- Invalid config
- Detector failure
- Masking failure
- Unsafe audit output
- Token expired
- Token scope mismatch
- Unknown provider
- Rule-pack validation failure

No component should throw as its expected control flow.

## PBT Design

| Property | Design Support |
|---|---|
| Masking round-trip | Generator for valid sensitive payloads and allowed token scopes |
| Redaction invariant | Generator embeds known sensitive values and verifies absence after redaction |
| Fail-closed policy | Generator builds missing/unknown/contradictory policy states |
| Audit privacy | Generator builds payloads/findings and checks audit output for raw values |
| Token lifecycle | Stateful command model: create, lookup, restore, expire, dispose |
| Rule-pack idempotence | Generator applies target-aware packs repeatedly and checks stable findings |

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Safe audit builder restricts logs/events to safe refs, counts, reason codes, and render-safe messages. |
| SECURITY-05 | Compliant | Schema-first config and request normalization are required before processing. |
| SECURITY-08 | Compliant | Deny-by-default access-control hooks are included for later CLI/Web UI enforcement. |
| SECURITY-10 | Compliant | Design avoids new runtime dependencies and keeps exact-pinning as a code-stage requirement. |
| SECURITY-11 | Compliant | Security-critical logic is isolated into explicit core components. |
| SECURITY-13 | Compliant | Rule packs and provider policy inputs require schema validation and deterministic registration. |
| SECURITY-15 | Compliant | Typed fail-closed results cover invalid config, failures, token expiry, and unknown provider. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-09, SECURITY-12, SECURITY-14 | N/A | This library-level NFR design does not introduce infrastructure, deployed endpoints, IAM, authentication, or monitoring resources. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Identified properties are preserved and mapped to design support. |
| PBT-02 | Compliant | Reversible masking/restoration round-trip is designed explicitly. |
| PBT-03 | Compliant | Redaction, fail-closed, audit privacy, and token invariants are designed. |
| PBT-04 | Compliant | Policy and rule-pack idempotence are designed. |
| PBT-06 | Compliant | Token lifecycle has a stateful command model. |
| PBT-07 | Compliant | Domain generators are part of the design. |
| PBT-08 | Compliant | Seeded fast-check execution remains required in code/build stages. |
| PBT-09 | Compliant | fast-check remains selected for TypeScript. |
| PBT-10 | Compliant | Policy matrix example tests complement PBT. |
| PBT-05 | N/A | No independent oracle algorithm is needed. |

## Blocking Findings

- **Security Findings**: None.
- **PBT Findings**: None.
