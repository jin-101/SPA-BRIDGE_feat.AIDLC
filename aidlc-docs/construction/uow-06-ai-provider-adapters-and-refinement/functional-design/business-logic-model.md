# UOW-06 Business Logic Model

## Purpose

UOW-06 defines the AI provider adapter and refinement business logic for SPA-Bridge. The unit lets deterministic conversion request provider assistance for difficult mappings while keeping provider behavior outside mapping rules and behind UOW-05 security policy gates.

The default strategy is local/internal provider first. External providers are disabled by default and can be used only after explicit configuration, masking, policy evaluation, and audit readiness succeed.

## Primary Business Capabilities

| Capability | Responsibility | Output |
|---|---|---|
| Provider Registry | Register, validate, rank, and select providers deterministically | `ProviderSelectionResult` |
| Local/Internal Provider Adapter | Invoke trusted local/internal provider implementations with minimized context | `ProviderInvocationResult` |
| External Provider Boundary | Define disabled-by-default external provider adapter shape behind policy gates | `ExternalProviderBoundary` |
| Mock Provider | Provide deterministic scripted responses and failure injection for tests | `MockProviderResult` |
| Context Minimization | Convert provider-neutral mapping requests into the smallest safe provider payload | `MinimizedProviderContext` |
| Refinement Service | Coordinate provider selection, security gate, invocation, response validation, diagnostics, and result packaging | `RefinementResult` |
| Response Validation | Validate structured provider suggestions before downstream use | `ValidatedRefinementSuggestion` |
| Manual Review Handoff | Preserve partial conversion and emit manual-review diagnostics for blocked or failed provider flows | `ManualReviewHandoff` |

## End-to-End Refinement Flow

1. UOW-04 emits a provider-neutral mapping request for an unresolved mapping.
2. `RefinementService` normalizes the request and verifies required trace refs, run ID, correlation ID, and mapping category.
3. `ProviderContextMinimizer` removes unsupported fields and creates a minimal structured context.
4. UOW-05 evaluates policy, masking, external-provider opt-in, and audit readiness.
5. If policy blocks the call, the service returns a structured blocked result with safe diagnostics and manual-review handoff.
6. `ProviderRegistry` selects a provider deterministically by mode, provider ID, capability tags, priority, and readiness.
7. The selected adapter receives only the minimized safe context.
8. The adapter returns a structured provider response, not final code patches.
9. `ProviderResponseValidator` validates schema, confidence, suggestion category, safe rationale, and traceability.
10. `RefinementService` packages suggestions, diagnostics, audit evidence, and provenance for downstream quality/reporting units.

## Provider Strategy

| Provider Type | Default Behavior | Allowed Use |
|---|---|---|
| Local/Internal | Preferred baseline | Allowed after policy evaluation and context minimization |
| External | Disabled by default | Allowed only with explicit opt-in, masking success, audit readiness, and provider policy approval |
| Mock/Test | Deterministic scripted provider | Allowed in test mode with synthetic/safe inputs |
| Unknown | Blocked | Requires explicit registration and validation |

## Refinement Ownership Boundary

UOW-06 owns:

- Provider registry and deterministic selection.
- Provider adapter contracts and response contracts.
- Provider invocation orchestration.
- Provider response validation.
- AI-assisted provenance records.
- Safe diagnostics and manual-review handoff.

UOW-06 does not own:

- Transformation rule execution.
- React target code generation.
- Security masking internals or token vault storage.
- Report rendering.
- Concrete commercial provider credential management.

## Provider Context Rules

Provider context must be:

- Provider-neutral.
- Structured and schema validated.
- Minimized to mapping category, safe refs, draft refs, rule IDs, diagnostic refs, and safe scalar context.
- Free of raw source snippets, raw prompt content, secrets, cookies, proprietary identifiers, and full project files.
- Traceable to UOW-04 mapping requests and UOW-05 policy/audit evidence.

## Provider Response Rules

Provider responses must be structured suggestions with:

- Suggestion ID.
- Mapping request ID.
- Suggestion category.
- Safe summary and safe rationale.
- Confidence between 0 and 1.
- Source and generated refs where available.
- Provider ID, adapter kind, model label if allowed, and AI-assisted provenance.
- Manual-review diagnostics when confidence is low or the response is incomplete.

Raw text responses are not passed downstream without validation. Provider adapters never apply final source code patches directly.

## Failure and Manual Review Flow

The refinement service returns a blocked or partial result when:

- UOW-05 policy blocks the provider call.
- Provider selection is ambiguous or unsupported.
- Provider invocation times out.
- Provider response is malformed.
- Provider returns unsafe rationale or raw content.
- External provider configuration lacks explicit opt-in.
- Mock provider failure injection is triggered.

In each case, partial conversion artifacts are preserved and safe manual-review diagnostics are emitted.

## PBT Candidates

| Component | Property Category | Property |
|---|---|---|
| `ProviderRegistry` | Determinism | Same provider set and request always produce the same selected provider |
| `ProviderContextMinimizer` | Invariant | Minimized context never contains forbidden raw fields |
| `RefinementService` | Fail-closed | Blocked policy or malformed response always produces blocked/manual-review result |
| `ProviderResponseValidator` | Invariant | Invalid confidence, missing suggestion ID, or unsafe rationale is rejected |
| `MockProvider` | Reproducibility | Same scripted input and seed produce the same response |
| `ProviderSelection` | Idempotence | Repeated selection without registry changes is stable |

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Provider audit evidence is modeled without raw prompt content. |
| SECURITY-05 | Compliant | Provider requests and responses are schema validated before use. |
| SECURITY-10 | Compliant | Concrete dependencies and supply-chain checks are deferred to NFR/code stages. |
| SECURITY-11 | Compliant | Provider security decisions are kept behind UOW-05 policy gates. |
| SECURITY-13 | Compliant | Provider adapter boundaries are explicit and cannot bypass masking/policy contracts. |
| SECURITY-15 | Compliant | Unsafe provider states fail closed with diagnostics and manual-review handoff. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-12, SECURITY-14 | N/A | This functional design does not create deployed endpoints, auth flows, IAM, infrastructure, monitoring, or UI. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Provider selection, minimization, validation, and mock reproducibility properties are identified. |
| PBT-03 | Compliant | Context minimization and fail-closed invariants are explicit. |
| PBT-04 | Compliant | Provider selection idempotence is a core property. |
| PBT-07, PBT-08, PBT-09, PBT-10 | Deferred | Generator quality, reproducibility settings, framework choice, and example/PBT mix are enforced in NFR/code stages. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not define round-trip codecs, oracle-backed algorithms, or mutable state-machine behavior beyond deterministic mock scripting. |

