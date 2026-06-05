# UOW-06 NFR Design Patterns

## Design Intent

UOW-06 implements AI provider assistance as a deterministic, policy-gated library pipeline. Provider behavior is kept outside transformation rules, and every provider interaction passes through explicit minimization, policy, timeout, validation, diagnostics, and audit gates.

The design favors local/internal and mock providers by default. External providers remain disabled unless explicit configuration and UOW-05 policy readiness allow them.

## Pattern Summary

| Pattern | Components | NFRs Addressed |
|---|---|---|
| Fail-Closed Provider Pipeline | `RefinementService`, `ProviderPolicyBridge`, `ProviderTimeoutGuard`, `ProviderResponseValidator` | Security, reliability, manual-review fallback |
| Deterministic Provider Registry | `ProviderRegistry`, `ProviderSelectionPolicy`, `ProviderDescriptorSchema` | Selection determinism, duplicate rejection, scalability |
| Schema-First Context Minimization | `ProviderContextMinimizer`, `ProviderContextSchema`, `ForbiddenFieldGuard` | Privacy, safe provider input, bounded context |
| Structured Response Validation Gate | `ProviderResponseValidator`, `RefinementSuggestionSchema`, `UnsafeRationaleGuard` | Safe AI output, provenance, confidence bounds |
| Disabled-by-Default External Boundary | `ExternalProviderAdapter`, `ExternalProviderReadiness`, UOW-05 policy decision | Zero-outbound default, explicit opt-in |
| Deterministic Mock Provider | `MockProvider`, `MockProviderScript`, `MockFailureInjector` | Offline availability, reproducible tests |
| Safe Provider Audit Builder | `ProviderAuditEventBuilder`, `ProviderAuditPrivacyGuard` | No raw prompt/source/response leakage |
| Target-Aware Capability Metadata | `ProviderCapabilityCatalog`, `TargetCapabilityPack` | First target coverage without customer-specific data |
| Typed Result Failure Handling | Shared `Result`, stable diagnostics, manual-review records | Fail-closed behavior and partial conversion preservation |
| PBT Support Layer | Provider generators and property suites | Determinism, invariants, reproducibility |

## Fail-Closed Provider Pipeline

`RefinementService` coordinates provider assistance as an ordered pipeline:

| Stage | Purpose | Failure Behavior |
|---|---|---|
| Normalize Request | Validate run, correlation, mapping request, category, and safe refs | Invalid input returns manual-review diagnostic |
| Minimize Context | Build allowlisted provider-neutral context | Forbidden fields block invocation |
| Evaluate Policy | Consume UOW-05 policy, masking evidence, opt-in, and audit readiness | Blocked policy returns blocked result |
| Select Provider | Choose deterministic provider by mode, capability, readiness, priority, ID, and adapter kind | No provider returns manual review |
| Invoke Adapter | Execute selected adapter with timeout guard | Timeout returns partial/manual-review result |
| Validate Response | Validate schema, confidence, traceability, rationale, and provenance | Invalid response is rejected |
| Package Result | Emit suggestions, safe diagnostics, audit events, and manual-review records | Partial conversion output is preserved |

Provider errors are expected control flow and must not abort the whole conversion run.

## Timeout and Retry Pattern

`ProviderTimeoutGuard` wraps adapter invocation.

| Rule | Design |
|---|---|
| Timeout Source | Provider descriptor or validated run configuration |
| Default Retry | Single attempt, no automatic retry |
| Retry Enablement | Allowed only when provider declares deterministic retry safety |
| Timeout Result | Typed provider error and manual-review diagnostic |
| External Provider Timeout | Same fail-closed handling as local provider timeout |

The retry strategy is a data object, not adapter-specific hidden behavior.

## Deterministic Provider Registry

`ProviderRegistry` stores validated descriptors in memory for the current process/run. It rejects invalid descriptors before selection.

### Selection Ordering

| Step | Sort Key |
|---|---|
| 1 | Provider mode preference: local/internal, mock/test, external when allowed |
| 2 | Capability match score |
| 3 | UOW-05 policy readiness |
| 4 | Declared priority |
| 5 | Provider ID |
| 6 | Adapter kind |

The same registry, request, policy decision, and capability tags must always produce the same selected provider.

## Schema-First Context Minimization

`ProviderContextMinimizer` constructs provider context from provider-neutral mapping requests instead of passing through full drafts.

### Allowed Field Families

- Run and correlation refs
- Mapping request ID
- Category and capability tags
- Safe source and generated refs
- Rule IDs and diagnostic refs
- Safe scalar context values
- Policy evidence refs
- Masking state flag

### Forbidden Field Families

- Raw source snippets
- Raw prompts
- Secrets, cookies, credentials, tokens, PII, and proprietary identifiers
- Full project files
- Unrestricted transformation drafts
- Arbitrary adapter metadata

Forbidden fields block invocation before any adapter receives the request.

## Structured Response Validation Gate

`ProviderResponseValidator` is the only path from adapter output to refinement suggestions.

### Required Validations

| Validation | Failure Result |
|---|---|
| Schema shape | Rejected response diagnostic |
| Mapping request ID match | Manual-review diagnostic |
| Suggestion ID present | Rejected response diagnostic |
| Confidence between 0 and 1 | Rejected response diagnostic |
| Safe summary and rationale | Unsafe response diagnostic |
| AI-assisted provenance present | Manual-review diagnostic |
| No raw source/prompt leakage | Blocked or manual-review result |

Adapters may produce structured results, but they do not decide whether a result is safe for downstream use.

## Disabled-by-Default External Boundary

`ExternalProviderAdapter` is a contract, not a default commercial integration.

External invocation requires:

- Explicit external-provider opt-in.
- UOW-05 policy allow decision.
- Masking success or safe-context proof.
- Audit readiness.
- Provider descriptor enabled state.
- Adapter readiness.

If any condition is absent, the service returns a blocked result with safe diagnostics.

## Deterministic Mock Provider

`MockProvider` supports offline workflows and reproducible tests.

### Script Matching

| Matcher | Purpose |
|---|---|
| `scriptId` | Direct test selection |
| `mappingRequestId` | Request-specific scripted result |
| `category` | Category-level defaults |
| `capabilityTags` | Capability-specific behavior |
| `seed` | Deterministic generated variation |

Failure injection is typed and produces the same error for the same script/request/seed.

## Safe Provider Audit Builder

`ProviderAuditEventBuilder` accepts only safe event data.

### Allowed Audit Data

- Provider ID
- Adapter kind
- Provider mode
- Run ID and correlation ID
- Mapping request ID
- Reason codes
- Counts
- Safe source/generated refs
- Policy evidence refs

### Forbidden Audit Data

- Raw provider prompts
- Raw provider responses
- Raw source text
- Secrets or credentials
- Full minimized context payloads when they include scalar data that may be sensitive
- Arbitrary metadata objects

## Target-Aware Capability Metadata

Target-aware capability metadata is additive and generic.

| Capability Area | Metadata Examples |
|---|---|
| Angular 15 | Component, directive, service, module, lifecycle |
| NgRx | Store, effects, entity, router-store |
| Forms | Template-driven, reactive, validator, control binding |
| Routing | Route config, guard, resolver, lazy route |
| i18n | Translation key, interpolation, locale-sensitive text |
| Animation and Media | Angular animations, Lottie, GSAP/anime, image capture |
| Maps and Geo | Mapbox, turf, geojson references |
| QR and Barcode | QR, barcode, PDF/image output |
| Service Worker | Cache, offline, update flow |

Metadata must not contain concrete customer page names, route strings, proprietary identifiers, or raw source snippets.

## Typed Failure Handling

All public UOW-06 components return typed results. Expected provider failures are represented as data.

| Failure | Result |
|---|---|
| Invalid provider descriptor | Registration error |
| Duplicate provider ID | Registration error |
| Missing policy decision | Blocked result |
| Policy denied | Blocked result |
| No matching provider | Manual-review result |
| Timeout | Partial result with timeout diagnostic |
| Malformed provider response | Partial result with validation diagnostic |
| Unsafe response content | Blocked or manual-review result |
| External provider disabled | Blocked result |

## PBT Design

| Property | Design Support |
|---|---|
| Provider selection determinism | Generator for provider descriptors, policy states, and request capabilities |
| Context minimization invariant | Generator embeds forbidden raw fields and verifies absence after minimization |
| Fail-closed behavior | Generator builds blocked policy, missing opt-in, timeout, malformed response, and unsafe content scenarios |
| Response validation invariant | Generator mutates confidence, IDs, provenance, and rationale fields |
| Mock reproducibility | Generator repeats script/request/seed combinations |
| Diagnostic stability | Generator checks stable ordering and safe field shapes |
| Target metadata safety | Generator creates target capability packs and verifies additive/no-raw-data rules |

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Safe provider audit builder restricts events to safe refs, counts, IDs, and reason codes. |
| SECURITY-05 | Compliant | Provider descriptors, contexts, invocations, responses, and audit events require schema-first validation. |
| SECURITY-10 | Compliant | Design avoids concrete external SDK dependencies and keeps exact-pinning as a code-stage requirement. |
| SECURITY-11 | Compliant | Provider orchestration fails closed and is gated by UOW-05 decisions. |
| SECURITY-13 | Compliant | External adapter and target metadata boundaries are explicit and validated. |
| SECURITY-15 | Compliant | Timeout, malformed response, policy block, unsafe content, and missing opt-in all return typed fail-closed results. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-12, SECURITY-14 | N/A | This library-level NFR design does not introduce infrastructure, deployed endpoints, IAM, authentication, or monitoring resources. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Identified provider properties are preserved and mapped to concrete design support. |
| PBT-03 | Compliant | Context minimization, fail-closed handling, validation, audit privacy, and metadata invariants are designed. |
| PBT-04 | Compliant | Provider selection and diagnostic stability are deterministic/idempotence properties. |
| PBT-07 | Compliant | Domain generators are part of the design. |
| PBT-08 | Compliant | Seeded mock provider reproducibility remains required in code/build stages. |
| PBT-09 | Compliant | fast-check remains selected for TypeScript. |
| PBT-10 | Compliant | Provider matrix example tests complement PBT. |
| PBT-02, PBT-05, PBT-06 | N/A | No round-trip codec, independent oracle, or complex mutable state-machine model is required beyond deterministic mock scripting. |

## Blocking Findings

- **Security Findings**: None.
- **PBT Findings**: None.
