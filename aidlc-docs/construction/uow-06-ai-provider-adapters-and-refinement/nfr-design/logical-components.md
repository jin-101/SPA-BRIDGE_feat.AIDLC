# UOW-06 Logical Components

## Component Overview

| Component | Package Area | Responsibility |
|---|---|---|
| `ProviderDescriptorSchema` | `packages/adapters-ai/src/registry` | Validate provider descriptors before registration |
| `ProviderRegistry` | `packages/adapters-ai/src/registry` | Store validated providers and reject duplicates |
| `ProviderSelectionPolicy` | `packages/adapters-ai/src/registry` | Sort and select providers deterministically |
| `ProviderCapabilityCatalog` | `packages/adapters-ai/src/capabilities` | Define generic and target-aware capability metadata |
| `TargetCapabilityPackValidator` | `packages/adapters-ai/src/capabilities` | Validate additive target metadata and prevent raw customer data |
| `ProviderContextMinimizer` | `packages/adapters-ai/src/context` | Build allowlisted minimized context from provider-neutral requests |
| `ForbiddenFieldGuard` | `packages/adapters-ai/src/context` | Reject raw source, prompts, secrets, credentials, and unrestricted drafts |
| `ProviderPolicyBridge` | `packages/adapters-ai/src/policy` | Consume UOW-05 provider policy decisions and readiness evidence |
| `RefinementService` | `packages/adapters-ai/src/refinement` | Orchestrate normalization, minimization, policy, selection, invocation, validation, diagnostics, and result packaging |
| `ProviderTimeoutGuard` | `packages/adapters-ai/src/invocation` | Enforce per-provider timeout and typed timeout results |
| `ProviderRetryStrategy` | `packages/adapters-ai/src/invocation` | Represent single-attempt default and deterministic retry eligibility |
| `LocalInternalProviderAdapter` | `packages/adapters-ai/src/adapters` | Invoke trusted local/internal provider implementations |
| `ExternalProviderAdapter` | `packages/adapters-ai/src/adapters` | Define disabled-by-default external adapter contract |
| `MockProvider` | `packages/adapters-ai/src/testing` | Return deterministic scripted provider results |
| `MockFailureInjector` | `packages/adapters-ai/src/testing` | Produce typed deterministic failure scenarios |
| `ProviderResponseValidator` | `packages/adapters-ai/src/validation` | Validate structured provider responses before downstream use |
| `UnsafeRationaleGuard` | `packages/adapters-ai/src/validation` | Reject unsafe rationale or raw content leakage |
| `ProviderDiagnosticFactory` | `packages/adapters-ai/src/diagnostics` | Create stable safe diagnostics and manual-review records |
| `ProviderAuditEventBuilder` | `packages/adapters-ai/src/audit` | Build safe provider audit events |
| `ProviderAuditPrivacyGuard` | `packages/adapters-ai/src/audit` | Reject unsafe audit fields and raw provider data |
| `ProviderPbtGenerators` | `packages/adapters-ai/src/testing` | Provide fast-check generators for provider domains |

## Package Boundary

`packages/adapters-ai` owns provider adapter contracts, registry behavior, provider selection, context minimization, provider invocation orchestration, response validation, safe diagnostics, audit events, target-aware capability metadata, mock provider behavior, and PBT generators.

`packages/adapters-ai` must not own:

- UOW-04 deterministic transformation rule execution.
- UOW-05 security detection or masking internals.
- UOW-07 quality validation decisions.
- UOW-09 report rendering.
- UOW-10/UOW-11 user interface rendering.
- Credential persistence or production provider secret management.

## Component Interactions

| From | To | Data | Rule |
|---|---|---|---|
| UOW-04 Transformation | `RefinementService` | Provider-neutral mapping request | Transformation rules do not call providers directly |
| `RefinementService` | `ProviderContextMinimizer` | Mapping request and safe refs | Context is minimized before provider selection/invocation |
| `ProviderContextMinimizer` | `ForbiddenFieldGuard` | Candidate minimized context | Forbidden raw fields block invocation |
| `RefinementService` | `ProviderPolicyBridge` | Provider intent, minimized context, policy evidence | UOW-05 decision is required |
| `ProviderPolicyBridge` | UOW-05 Core Security | Policy decision and audit readiness | Blocked means no provider call |
| `RefinementService` | `ProviderRegistry` | Selection request | Registry must be validated and deterministic |
| `ProviderRegistry` | `ProviderSelectionPolicy` | Provider descriptors and capability tags | Stable ordering is required |
| `RefinementService` | `ProviderTimeoutGuard` | Selected adapter and invocation request | Timeout returns typed error |
| `ProviderTimeoutGuard` | Provider Adapter | Minimized provider context | Adapter receives allowlisted context only |
| Provider Adapter | `ProviderResponseValidator` | Structured invocation result | Raw/unvalidated output does not go downstream |
| `ProviderResponseValidator` | `ProviderDiagnosticFactory` | Validation failures | Safe manual-review diagnostics |
| `RefinementService` | `ProviderAuditEventBuilder` | Provider decision and outcome facts | Audit output cannot contain raw prompt/source/response |
| `RefinementService` | UOW-07/UOW-09 | Validated suggestions, diagnostics, audit refs | Downstream receives safe structured artifacts only |

## Public API Shape

| API | Input | Output |
|---|---|---|
| `createProviderRegistry(descriptors)` | Provider descriptor list | `Result<ProviderRegistry, ProviderError>` |
| `selectProvider(request)` | Registry, capability tags, policy decision, provider mode | `ProviderSelectionResult` |
| `minimizeProviderContext(request)` | Provider-neutral mapping request and policy evidence | `Result<MinimizedProviderContext, ProviderError>` |
| `refineMapping(request)` | Provider-neutral request, registry, policy decision, config | `RefinementResult` |
| `invokeProvider(request)` | Selected provider and minimized context | `ProviderInvocationResult` |
| `validateProviderResponse(request)` | Invocation result and mapping request refs | `Result<RefinementSuggestion[], ProviderError>` |
| `buildProviderAuditEvent(request)` | Safe event facts | `Result<ProviderAuditEvent, ProviderError>` |
| `createMockProvider(script)` | Mock provider script | `Result<MockProvider, ProviderError>` |
| `validateTargetCapabilityPack(pack)` | Capability metadata pack | `Result<TargetCapabilityPack, ProviderError>` |

## Data Models

| Model | Key Fields |
|---|---|
| `ProviderDescriptor` | `providerId`, `adapterKind`, `displayName`, `capabilities`, `priority`, `enabled`, `requiresExternalPolicy`, `metadata` |
| `ProviderCapability` | `category`, `supportsStructuredResponse`, `supportsSafeRationale`, `maxContextItems`, `tags` |
| `TargetCapabilityPack` | `packId`, `version`, `capabilityTags`, `supportedFrameworks`, `forbiddenMetadataFields` |
| `ProviderSelectionRequest` | `runId`, `correlationId`, `mappingRequestId`, `providerMode`, `category`, `capabilityTags`, `policyDecision` |
| `ProviderSelectionResult` | `status`, `provider`, `reasonCode`, `diagnostics` |
| `ProviderNeutralRefinementRequest` | `mappingRequestId`, `category`, `sourceRefs`, `draftRefs`, `ruleIds`, `diagnosticRefs`, `safeContext` |
| `MinimizedProviderContext` | `contextId`, `mappingRequestId`, `category`, `safeContext`, `safeRefs`, `policyEvidenceRef`, `masked` |
| `ProviderInvocationRequest` | `providerId`, `adapterKind`, `context`, `timeoutMs`, `requestMetadata` |
| `ProviderInvocationResult` | `status`, `providerId`, `response`, `error`, `auditEvidence` |
| `RefinementSuggestion` | `suggestionId`, `mappingRequestId`, `category`, `safeSummary`, `safeRationale`, `confidence`, `sourceRefs`, `generatedRefs`, `provenance` |
| `ProviderAuditEvent` | `eventId`, `runId`, `correlationId`, `providerId`, `adapterKind`, `reasonCodes`, `counts`, `safeRefs` |
| `ManualReviewItem` | `itemId`, `mappingRequestId`, `reasonCode`, `safeRefs`, `severity`, `reviewCategory` |
| `MockProviderScript` | `scriptId`, `match`, `response`, `failure`, `seed` |
| `ProviderError` | `code`, `message`, `providerId`, `retryable`, `causeCategory` |

## Failure Boundaries

| Failure | Component | Result |
|---|---|---|
| Invalid provider descriptor | `ProviderDescriptorSchema` | `Err(INVALID_PROVIDER_DESCRIPTOR)` |
| Duplicate provider ID | `ProviderRegistry` | `Err(DUPLICATE_PROVIDER_ID)` |
| Invalid target metadata | `TargetCapabilityPackValidator` | `Err(INVALID_TARGET_CAPABILITY_PACK)` |
| Forbidden context field | `ForbiddenFieldGuard` | `Err(UNSAFE_PROVIDER_CONTEXT)` |
| Missing policy decision | `ProviderPolicyBridge` | Blocked result |
| Policy denied | `ProviderPolicyBridge` | Blocked result |
| No matching provider | `ProviderSelectionPolicy` | Manual-review result |
| External provider disabled | `ExternalProviderAdapter` readiness path | Blocked result |
| Provider timeout | `ProviderTimeoutGuard` | Partial result with timeout diagnostic |
| Adapter failure | Provider adapter | Partial result with provider failure diagnostic |
| Malformed response | `ProviderResponseValidator` | Partial result with validation diagnostic |
| Unsafe response content | `UnsafeRationaleGuard` | Blocked or manual-review result |
| Unsafe audit field | `ProviderAuditPrivacyGuard` | `Err(UNSAFE_PROVIDER_AUDIT_EVENT)` |

## PBT Support Components

| Generator/Model | Purpose |
|---|---|
| `providerDescriptorArbitrary` | Valid/invalid provider descriptors and duplicate ID scenarios |
| `providerCapabilityArbitrary` | Capability tags, categories, priorities, and response support combinations |
| `providerSelectionRequestArbitrary` | Provider mode, policy state, category, and capability request combinations |
| `providerPolicyDecisionArbitrary` | UOW-05 allow/block/manual-review decisions and readiness states |
| `providerContextArbitrary` | Safe and unsafe context payload candidates |
| `providerInvocationResultArbitrary` | Success, timeout, failure, malformed, and unsafe response cases |
| `refinementSuggestionArbitrary` | Valid and invalid confidence, traceability, rationale, and provenance |
| `providerAuditEventArbitrary` | Safe audit events and forbidden raw-field attempts |
| `targetCapabilityPackArbitrary` | Additive metadata packs and raw customer data violation cases |
| `mockProviderScriptArbitrary` | Script matching, deterministic seed, and failure injection cases |

## Integration Notes

- UOW-04 emits provider-neutral mapping requests and never calls adapters directly.
- UOW-05 policy decisions are required before any provider invocation.
- UOW-06 treats `blocked` policy as terminal for provider execution.
- UOW-07 consumes validated suggestions and diagnostics, not raw provider output.
- UOW-09 reports safe audit events and manual-review reason codes only.
- UOW-10 and UOW-11 display safe summaries, diagnostics, provenance, and review states only.

## Code Generation Notes

- Keep the provider package dependency-light.
- Reuse UOW-01 result, diagnostic, ref, and validation patterns.
- Reuse UOW-05 policy and audit contracts instead of duplicating security rules.
- Do not introduce a concrete external AI SDK in the initial implementation.
- Prefer exact schema validation for all provider input/output boundaries.
- Keep external provider adapters disabled unless explicit configuration enables them.
- Keep tests split between provider matrix examples and PBT suites.
