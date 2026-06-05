# UOW-05 Logical Components

## Component Overview

| Component | Package Area | Responsibility |
|---|---|---|
| `SecurityConfigResolver` | `packages/core-security/src/config` | Resolve safe defaults, project config, and run overrides deterministically |
| `SecurityConfigSchema` | `packages/core-security/src/config` | Validate security configuration and external-provider opt-in |
| `SecurityEvaluationPipeline` | `packages/core-security/src/pipeline` | Orchestrate normalize, detect, merge, mask, validate, policy, and audit stages |
| `SensitiveDataDetector` | `packages/core-security/src/detection` | Run generic and target-aware detectors |
| `FindingMerger` | `packages/core-security/src/detection` | Deduplicate and order findings deterministically |
| `MaskingPipeline` | `packages/core-security/src/masking` | Select and apply redaction/tokenization/category-only modes |
| `SafeOutputValidator` | `packages/core-security/src/masking` | Verify output contains no forbidden sensitive values |
| `TokenVault` | `packages/core-security/src/token-vault` | Hold reversible token values in memory with scope and TTL |
| `ProviderPolicyGate` | `packages/core-security/src/policy` | Return allow/block/manual-review provider decisions |
| `ProviderReadinessEvaluator` | `packages/core-security/src/policy` | Validate external-provider readiness requirements |
| `SafeAuditEventBuilder` | `packages/core-security/src/audit` | Build safe structured audit events |
| `AuditPrivacyGuard` | `packages/core-security/src/audit` | Reject unsafe audit fields and excerpts |
| `AccessControlHookEvaluator` | `packages/core-security/src/access` | Return deny-by-default CLI/Web UI hook decisions |
| `SecurityRulePackRegistry` | `packages/core-security/src/rule-packs` | Register and order generic and target-aware rule packs |
| `SecurityRulePackValidator` | `packages/core-security/src/rule-packs` | Enforce schema, precedence, and downgrade prevention |
| `SecurityPbtGenerators` | `packages/core-security/src/testing` | Provide domain-specific fast-check generators |
| `TokenVaultModel` | `packages/core-security/src/testing` | Define stateful PBT command model for token lifecycle |
| `SecurityPolicyCoordinator` | `packages/core-application/src/policy` | Coordinate `core-application` calls into `core-security` |

## Package Boundary

`packages/core-security` owns reusable security logic.

`packages/core-application` owns workflow coordination and must call `core-security` before provider coordination. It must not duplicate masking or policy logic.

`packages/adapters-ai` in UOW-06 must consume `ProviderPolicyDecision` and must not perform independent bypass decisions.

## Component Interactions

| From | To | Data | Rule |
|---|---|---|---|
| `SecurityPolicyCoordinator` | `SecurityConfigResolver` | Project/run config | Config must validate before use |
| `SecurityEvaluationPipeline` | `SensitiveDataDetector` | Normalized payload refs and safe payload handle | Detector output uses safe refs |
| `SensitiveDataDetector` | `SecurityRulePackRegistry` | Detector context | Rule packs cannot downgrade generic findings |
| `SecurityEvaluationPipeline` | `MaskingPipeline` | Findings and payload handle | Masking mode is policy-driven |
| `MaskingPipeline` | `TokenVault` | Reversible token values | In-memory only and scoped |
| `SecurityEvaluationPipeline` | `ProviderPolicyGate` | Provider intent and masking state | All provider calls require decision |
| `ProviderPolicyGate` | `ProviderReadinessEvaluator` | External provider readiness context | All readiness conditions required |
| `SecurityEvaluationPipeline` | `SafeAuditEventBuilder` | Safe refs, counts, reason codes | No raw metadata accepted |
| `AccessControlHookEvaluator` | CLI/Web UI units | Safe hook decision | Deny-by-default |

## Public API Shape

| API | Input | Output |
|---|---|---|
| `resolveSecurityConfig(input)` | Project config, overrides | `Result<SecurityConfig, SecurityError>` |
| `evaluateSecurity(request)` | Payload category, safe refs, config, provider intent | `Result<SecurityEvaluationResult, SecurityError>` |
| `maskPayload(request)` | Payload handle, findings, masking policy | `Result<MaskedPayload, SecurityError>` |
| `restoreTokens(request)` | Token refs, run/correlation scope | `Result<RestoredPayload, SecurityError>` |
| `evaluateProviderPolicy(request)` | Provider intent, masking state, config, audit state | `Result<ProviderPolicyDecision, SecurityError>` |
| `buildAuditEvent(request)` | Safe refs, counts, reason codes | `Result<SecurityAuditEvent, SecurityError>` |
| `evaluateAccessHook(context)` | Actor/action/resource/review mode | `Result<AccessControlDecision, SecurityError>` |

## Data Models

| Model | Key Fields |
|---|---|
| `SecurityConfig` | `externalProvidersEnabled`, `enterpriseDataOptOutConfirmed`, `tokenTtlMs`, `auditExcerptMode`, `enabledRulePacks` |
| `SensitiveFinding` | `findingId`, `category`, `severity`, `safeRef`, `detectorId`, `confidence`, `reasonCode` |
| `MaskedPayload` | `mode`, `safePayloadRef`, `tokenRefs`, `redactionSummary`, `diagnostics` |
| `TokenScope` | `runId`, `correlationId`, `purpose` |
| `TokenVaultEntry` | `tokenId`, `scope`, `rawValue`, `expiresAt` |
| `ProviderPolicyDecision` | `status`, `providerType`, `reasonCodes`, `maskingSatisfied`, `outboundAllowed`, `auditEventRef` |
| `SecurityAuditEvent` | `eventId`, `runId`, `correlationId`, `eventType`, `safeRefs`, `counts`, `reasonCodes` |
| `AccessControlDecision` | `status`, `allowedOperationIds`, `reasonCodes`, `safeDisplay` |
| `SecurityRulePack` | `packId`, `version`, `precedence`, `categories`, `rules` |

## Failure Boundaries

| Failure | Component | Result |
|---|---|---|
| Invalid config | `SecurityConfigResolver` | `Err(INVALID_SECURITY_CONFIG)` |
| Detector failure | `SensitiveDataDetector` | `Err(DETECTION_FAILED)` and provider blocked |
| Unsafe output | `SafeOutputValidator` | `Err(UNSAFE_MASKED_OUTPUT)` |
| Token expired | `TokenVault` | `Err(TOKEN_EXPIRED)` |
| Token scope mismatch | `TokenVault` | `Err(TOKEN_SCOPE_MISMATCH)` |
| Unknown provider | `ProviderPolicyGate` | `blocked` decision |
| Missing audit event | `ProviderReadinessEvaluator` | `blocked` decision |
| Unsafe audit field | `AuditPrivacyGuard` | `Err(UNSAFE_AUDIT_EVENT)` |
| Rule-pack downgrade | `SecurityRulePackValidator` | `Err(INVALID_RULE_PACK)` |

## PBT Support Components

| Generator/Model | Purpose |
|---|---|
| `securityConfigArbitrary` | Valid and invalid config combinations |
| `sensitivePayloadArbitrary` | Payloads with embedded synthetic sensitive values |
| `sensitiveFindingArbitrary` | Findings with safe refs and categories |
| `maskingRequestArbitrary` | Redaction/tokenization/category-only scenarios |
| `providerPolicyRequestArbitrary` | Provider readiness matrix inputs |
| `securityAuditEventArbitrary` | Audit event privacy checks |
| `securityRulePackArbitrary` | Rule-pack ordering and downgrade prevention |
| `tokenVaultCommands` | Stateful create, lookup, restore, expire, dispose command model |

## Integration Notes

- UOW-04 provider-neutral mapping requests should be passed into UOW-05 before any UOW-06 provider interaction.
- UOW-06 must treat `blocked` as terminal for provider execution.
- UOW-09 reports should render only `SecurityAuditEvent`, redaction summaries, and safe diagnostics.
- UOW-10 and UOW-11 should render `AccessControlDecision.safeDisplay`, not raw security context.

## Code Generation Notes

- Keep public APIs small and typed with `Result`.
- Prefer Zod schemas for config and rule-pack validation.
- Prefer Node built-ins for token ID hashing and time-free deterministic helpers where possible.
- Do not add runtime dependencies without explicit security review.
- Keep tests split between example-based policy matrices and PBT suites.
