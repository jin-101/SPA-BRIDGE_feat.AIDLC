# UOW-06 Domain Entities

## ProviderDescriptor

Represents a registered provider.

| Field | Description |
|---|---|
| `providerId` | Stable unique provider identifier |
| `adapterKind` | `local-internal`, `external`, or `mock` |
| `displayName` | Safe provider display label |
| `capabilities` | Supported mapping categories and operations |
| `priority` | Deterministic selection priority |
| `enabled` | Whether provider can be selected |
| `requiresExternalPolicy` | Whether external-provider policy checks are required |
| `metadata` | Safe provider metadata |

## ProviderCapability

Describes what a provider can refine.

| Field | Description |
|---|---|
| `category` | Mapping category such as template, lifecycle, DI, route, state, or form |
| `supportsStructuredResponse` | Whether the provider returns schema-valid suggestions |
| `supportsSafeRationale` | Whether safe rationale is expected |
| `maxContextItems` | Limit for minimized context items |

## ProviderRegistry

Collection of registered providers with deterministic selection behavior.

| Field | Description |
|---|---|
| `providers` | Validated provider descriptors |
| `selectionPolicy` | Deterministic ranking rules |
| `registryVersion` | Version for audit and compatibility |

## ProviderSelectionRequest

Request to choose a provider.

| Field | Description |
|---|---|
| `runId` | Conversion run identifier |
| `correlationId` | Request correlation identifier |
| `mappingRequestId` | UOW-04 mapping request ID |
| `providerMode` | `local-first`, `external-only`, or `auto` |
| `category` | Requested mapping category |
| `capabilityTags` | Required provider capabilities |
| `policyDecision` | UOW-05 policy result |

## ProviderSelectionResult

Outcome of provider selection.

| Field | Description |
|---|---|
| `status` | `selected`, `blocked`, or `manual-review` |
| `provider` | Selected provider descriptor when available |
| `reasonCode` | Safe selection reason |
| `diagnostics` | Safe diagnostics |

## ProviderNeutralRefinementRequest

Minimal provider-neutral mapping request.

| Field | Description |
|---|---|
| `mappingRequestId` | Stable request ID |
| `category` | Mapping category |
| `sourceRefs` | Safe source references |
| `draftRefs` | Safe generated/draft references |
| `ruleIds` | Related deterministic rule IDs |
| `diagnosticRefs` | Related diagnostic IDs |
| `safeContext` | Safe scalar context only |

## MinimizedProviderContext

Provider-ready context after minimization and policy/masking checks.

| Field | Description |
|---|---|
| `contextId` | Stable minimized context ID |
| `mappingRequestId` | Related mapping request |
| `category` | Mapping category |
| `safeContext` | Safe scalar context |
| `safeRefs` | Safe source/generated refs |
| `policyEvidenceRef` | Safe UOW-05 decision/audit reference |
| `masked` | Whether masking was applied |

## ProviderInvocationRequest

Invocation request sent to a provider adapter.

| Field | Description |
|---|---|
| `providerId` | Selected provider ID |
| `adapterKind` | Adapter kind |
| `context` | Minimized provider context |
| `timeoutMs` | Invocation timeout |
| `requestMetadata` | Safe request metadata |

## ProviderInvocationResult

Raw adapter outcome after invocation but before response validation.

| Field | Description |
|---|---|
| `status` | `succeeded`, `failed`, `timed-out`, or `blocked` |
| `providerId` | Provider ID |
| `response` | Structured provider response if present |
| `error` | Typed safe provider error |
| `auditEvidence` | Safe invocation evidence |

## RefinementSuggestion

Validated provider suggestion.

| Field | Description |
|---|---|
| `suggestionId` | Stable suggestion ID |
| `mappingRequestId` | Related mapping request |
| `category` | Suggestion category |
| `safeSummary` | Safe suggestion summary |
| `safeRationale` | Safe rationale |
| `confidence` | Confidence score from 0 to 1 |
| `sourceRefs` | Safe source refs |
| `generatedRefs` | Safe generated/draft refs |
| `provenance` | AI-assisted provenance metadata |

## ProviderProvenance

Evidence that a suggestion came from provider assistance.

| Field | Description |
|---|---|
| `providerId` | Provider ID |
| `adapterKind` | Adapter kind |
| `modelLabel` | Optional safe model label |
| `invokedAt` | Safe timestamp if available |
| `policyDecisionRef` | Safe UOW-05 policy reference |
| `auditEventRef` | Safe audit reference |

## RefinementResult

Final package returned by UOW-06.

| Field | Description |
|---|---|
| `status` | `succeeded`, `partial`, `blocked`, or `manual-review` |
| `suggestions` | Validated refinement suggestions |
| `diagnostics` | Safe diagnostics |
| `manualReviewItems` | Manual-review handoff records |
| `auditEvents` | Safe provider audit events |
| `provenance` | AI-assisted provenance records |

## ProviderError

Typed provider failure.

| Field | Description |
|---|---|
| `code` | Stable provider error code |
| `message` | Safe display message |
| `providerId` | Provider ID when known |
| `retryable` | Whether later retry may be useful |
| `causeCategory` | Safe cause category only |

## MockProviderScript

Deterministic mock provider behavior.

| Field | Description |
|---|---|
| `scriptId` | Stable script ID |
| `match` | Category/request/capability matcher |
| `response` | Structured scripted response |
| `failure` | Optional typed failure injection |
| `seed` | Optional deterministic seed |

