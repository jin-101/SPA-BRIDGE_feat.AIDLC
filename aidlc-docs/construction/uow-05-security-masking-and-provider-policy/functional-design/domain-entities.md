# UOW-05 Domain Entities

## Entity Overview

| Entity | Purpose | Key Relationships |
|---|---|---|
| `SecurityEvaluationRequest` | Input for detection, masking, provider policy, or audit-safe review | References `PayloadRef`, `ProviderIntent`, and `SecurityPolicyConfig` |
| `PayloadRef` | Safe reference to the payload being evaluated | Used by findings, audit events, and policy decisions |
| `SensitiveFinding` | Structured detection result without raw sensitive value | Produced by detectors and rule packs |
| `SensitiveCategory` | Classification of sensitive content | Used by masking, policy, audit, and review |
| `MaskingDecision` | Decision describing whether and how masking applies | Produces `MaskedPayload` or blocking diagnostics |
| `MaskedPayload` | Payload safe for downstream use | Carries `MaskTokenRef` entries when reversible tokens are allowed |
| `MaskTokenRef` | Safe token identifier for controlled restoration | Linked to `TokenMapEntry` in memory only |
| `TokenMapEntry` | In-memory original value holder | Never persisted or exported |
| `RestorationRequest` | Request to restore reversible tokens | Requires scope, correlation, and policy evidence |
| `RestorationDecision` | Result of restoration eligibility evaluation | Allows or blocks restoration |
| `ProviderPolicyConfig` | Policy configuration for provider usage | Drives `ProviderPolicyGate` |
| `ProviderIntent` | Provider type, outbound intent, and usage category | Required for every provider decision |
| `ProviderPolicyDecision` | Allow/block/manual-review provider decision | Consumed by UOW-06 provider adapters |
| `SecurityAuditEvent` | Safe structured event for policy/detection/masking/restoration | Consumed by reports and logs |
| `AccessControlContext` | Caller/action/resource context for CLI/Web UI hooks | Produces `AccessControlDecision` |
| `SecurityRulePack` | Generic or target-aware detector/policy rules | Produces findings and review items |
| `SecurityManualReviewItem` | Safe human-review item | Linked to findings, policies, and reports |

## Core Types

### `SecurityEvaluationRequest`

| Field | Type | Required | Notes |
|---|---|---|---|
| `runId` | string | Yes | Stable run identifier |
| `correlationId` | string | Yes | Traceable request identifier |
| `payloadRef` | `PayloadRef` | Yes | Safe reference only |
| `payloadCategory` | `PayloadCategory` | Yes | `source`, `provider-prompt`, `generated-artifact`, `log`, `report`, or `review` |
| `providerIntent` | `ProviderIntent` | Conditional | Required for provider policy |
| `policyConfig` | `SecurityPolicyConfig` | Yes | Effective security configuration |
| `enabledRulePacks` | string[] | Yes | Generic and target-aware rule packs |

### `SensitiveFinding`

| Field | Type | Required | Notes |
|---|---|---|---|
| `findingId` | string | Yes | Stable deterministic ID |
| `category` | `SensitiveCategory` | Yes | Classification, not raw content |
| `severity` | `info`, `warning`, `manual-review`, `blocked` | Yes | Drives policy and review |
| `payloadRef` | `PayloadRef` | Yes | Safe location reference |
| `detectorId` | string | Yes | Generic detector or rule-pack rule ID |
| `confidence` | number | Yes | 0 to 1 |
| `safeMessage` | string | Yes | Must not include raw snippets |
| `remediationHint` | string | No | Safe next action |

### `MaskingDecision`

| Field | Type | Required | Notes |
|---|---|---|---|
| `decisionId` | string | Yes | Stable deterministic ID |
| `mode` | `redact`, `tokenize`, `category-only`, `none`, `blocked` | Yes | Effective masking mode |
| `reasonCodes` | string[] | Yes | Safe explanation |
| `findings` | `SensitiveFinding[]` | Yes | Input findings |
| `tokenRefs` | `MaskTokenRef[]` | No | Only for reversible in-memory flows |
| `diagnostics` | `Diagnostic[]` | Yes | Safe diagnostics |

### `ProviderPolicyDecision`

| Field | Type | Required | Notes |
|---|---|---|---|
| `decisionId` | string | Yes | Stable deterministic ID |
| `status` | `allowed`, `blocked`, `manual-review` | Yes | Provider execution gate |
| `providerType` | `local`, `internal`, `external`, `mock`, `unknown` | Yes | Unknown is blocked |
| `maskingRequired` | boolean | Yes | Indicates if masking was required |
| `maskingSatisfied` | boolean | Yes | Must be true for allowed calls when required |
| `outboundAllowed` | boolean | Yes | Must be true for external calls |
| `reasonCodes` | string[] | Yes | Safe policy explanation |
| `auditEventRef` | string | Yes | Link to safe audit event |

### `SecurityAuditEvent`

| Field | Type | Required | Notes |
|---|---|---|---|
| `eventId` | string | Yes | Stable deterministic ID |
| `timestamp` | string | Yes | ISO 8601 |
| `runId` | string | Yes | Run scope |
| `correlationId` | string | Yes | Request scope |
| `eventType` | string | Yes | Detection, masking, policy, restoration, review |
| `decision` | string | Yes | Safe status |
| `safeRefs` | `PayloadRef[]` | Yes | No raw content |
| `counts` | Record<string, number> | Yes | Category and rule counts |
| `reasonCodes` | string[] | Yes | Safe rationale |

## Sensitive Categories

| Category | Description | Default Handling |
|---|---|---|
| `secret` | API keys, tokens, credentials, private keys | Block or tokenize for controlled memory only |
| `network` | URLs, IP addresses, hostnames, endpoints | Redact in exports, tokenize for provider when allowed |
| `personal-data` | PII or user-identifying content | Block external unless explicit policy allows masked context |
| `proprietary-name` | Company, customer, system, or route names configured as sensitive | Redact or category-only |
| `business-sensitive` | Internal flows, route labels, campaign names, pricing or inventory clues | Manual review by default |
| `source-sensitive` | Code snippets or logic that policy says must not leave the workspace | Local-only or blocked |
| `unknown-sensitive` | Unclassified but suspicious finding | Fail closed |

## Service Components

| Component | Responsibility |
|---|---|
| `SecurityEvaluationService` | Public orchestration service for detection, masking, policy, audit, and restoration decisions |
| `SensitiveDataDetector` | Runs generic detectors and target-aware rule packs |
| `MaskingPipeline` | Produces redacted payloads and controlled token refs |
| `TokenVault` | In-memory token map with scope and correlation constraints |
| `ProviderPolicyGate` | Evaluates provider execution eligibility |
| `SecurityAuditBuilder` | Builds safe structured audit events |
| `AccessControlHookEvaluator` | Produces review-mode and policy-evaluation decisions |
| `TargetAwareSecurityRulePack` | Adds first-target-app-specific detection and review categories |

## Invariants

- Persistent outputs must never contain raw sensitive values.
- Reversible token entries must never be persisted.
- Unknown provider type always yields `blocked`.
- Missing policy always yields `blocked` when sensitive content or provider intent is present.
- Audit events are safe to render in reports and CLI/Web UI.
- Target-aware rule packs may add findings but may not downgrade generic security decisions.

## Construction Notes

- `packages/core-security` should expose reusable security services, schemas, and PBT generators.
- `packages/core-application` should call `core-security` through policy coordination points before provider use.
- UOW-06 provider adapters should consume `ProviderPolicyDecision` and never bypass it.
- UOW-09 reporting should consume only `SecurityAuditEvent`, redaction summaries, and safe diagnostics.
