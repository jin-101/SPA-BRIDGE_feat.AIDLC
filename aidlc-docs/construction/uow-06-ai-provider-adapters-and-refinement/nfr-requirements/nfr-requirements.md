# UOW-06 NFR Requirements

## Scope

These NFRs apply to the AI provider adapter and refinement package planned for UOW-06 and its coordination points with UOW-04 transformation outputs, UOW-05 security policy, and later reporting/interface units.

UOW-06 must provide deterministic provider selection, safe provider context minimization, policy-gated invocation, strict response validation, privacy-safe observability, and reproducible mock/local provider behavior. External provider support is allowed only as a generic disabled-by-default boundary.

## Security Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW06-NFR-SEC-001 | Every provider invocation must consume a UOW-05 policy decision before adapter execution. | Blocking | Integration tests reject calls without a policy decision. |
| UOW06-NFR-SEC-002 | External providers must be disabled by default and require explicit opt-in, masking success, audit readiness, and provider readiness. | Blocking | Policy matrix tests cover all missing-condition combinations. |
| UOW06-NFR-SEC-003 | Unknown, missing, contradictory, or invalid provider readiness must block provider invocation. | Blocking | Example tests and PBT validate fail-closed behavior. |
| UOW06-NFR-SEC-004 | Provider contexts must be schema-validated allowlist payloads before adapter invocation. | Blocking | Schema tests reject forbidden fields. |
| UOW06-NFR-SEC-005 | Raw source snippets, raw prompts, secrets, cookies, credentials, proprietary identifiers, and unrestricted draft objects must never be sent to providers. | Blocking | Context minimization PBT verifies forbidden values are absent. |
| UOW06-NFR-SEC-006 | Provider responses must be schema validated before downstream use. | Blocking | Response validation tests reject malformed responses. |
| UOW06-NFR-SEC-007 | Unsafe rationale text, invalid confidence values, missing provenance, or mismatched mapping request IDs must produce manual-review diagnostics. | Blocking | Validation tests cover each rejection case. |
| UOW06-NFR-SEC-008 | Provider audit events must contain only safe provider IDs, adapter kinds, counts, reason codes, correlation IDs, mapping request IDs, and safe refs. | Blocking | Audit privacy tests reject raw prompt/source/response fields. |
| UOW06-NFR-SEC-009 | Provider adapters must never apply source patches or mutate transformation drafts directly. | Blocking | Package boundary tests and type-level API review. |
| UOW06-NFR-SEC-010 | Generic external adapter boundaries must not hardcode a commercial provider as the default. | Blocking | Configuration and registry tests verify default disabled behavior. |

## Privacy Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW06-NFR-PRI-001 | Persistent artifacts must not include raw provider prompts or raw provider responses by default. | Blocking | Serialization tests inspect generated artifacts and audit events. |
| UOW06-NFR-PRI-002 | Diagnostics must use safe source refs, generated refs, mapping request IDs, and reason codes instead of raw snippets. | Blocking | Diagnostic schema validation. |
| UOW06-NFR-PRI-003 | Provider-neutral minimized context must include only safe scalar values, safe refs, category, capability tags, rule IDs, diagnostic refs, and policy evidence refs. | Blocking | Context schema and PBT invariants. |
| UOW06-NFR-PRI-004 | Target-aware capability metadata may describe framework/library categories but must not store customer-specific raw data. | Blocking | Metadata validation tests. |

## Performance and Scalability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW06-NFR-PERF-001 | Provider registry selection must be deterministic and bounded by provider count and requested capability tags. | High | Selection tests with generated provider sets. |
| UOW06-NFR-PERF-002 | Context minimization must avoid retaining full raw source text beyond the active request. | Blocking | Code review and memory-oriented tests. |
| UOW06-NFR-PERF-003 | Provider invocation must support configurable per-provider timeout values. | Blocking | Timeout tests with mock adapters. |
| UOW06-NFR-PERF-004 | Automatic retry must be disabled unless the provider explicitly declares deterministic retry safety. | Blocking | Retry policy tests verify default single-attempt behavior. |
| UOW06-NFR-PERF-005 | 100+ component projects should keep provider selection and local/mock refinement orchestration within local interactive workflow expectations. | High | Build/test performance instructions and benchmark fixtures. |
| UOW06-NFR-PERF-006 | 500+ component projects must remain compatible with bounded minimized context creation and benchmark coverage. | High | Benchmark generator and memory guidance. |

## Reliability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW06-NFR-REL-001 | Provider registration must reject duplicate provider IDs. | Blocking | Registry validation tests. |
| UOW06-NFR-REL-002 | Provider selection must be stable for the same registry, request, policy decision, and capability set. | Blocking | PBT selection determinism. |
| UOW06-NFR-REL-003 | Local/internal and mock providers must be preferred over external providers when capability and policy readiness are equivalent. | High | Selection precedence tests. |
| UOW06-NFR-REL-004 | Provider timeouts, malformed responses, unsafe content, blocked policy, or missing provider capability must preserve partial conversion output and create manual-review diagnostics. | Blocking | Failure injection tests. |
| UOW06-NFR-REL-005 | Mock provider behavior must be deterministic for the same script, request, category, capability, and seed. | Blocking | Mock reproducibility PBT. |
| UOW06-NFR-REL-006 | Provider diagnostics and audit reason codes must use stable IDs and stable ordering. | High | Snapshot/schema tests. |

## Maintainability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW06-NFR-MAINT-001 | Provider adapter contracts, registry behavior, response validation, and refinement orchestration must live in a dedicated reusable package. | Blocking | Package boundary review. |
| UOW06-NFR-MAINT-002 | Provider adapters must consume UOW-01 shared model types and UOW-05 policy outcomes instead of duplicating security or diagnostic logic. | High | Dependency and import checks. |
| UOW06-NFR-MAINT-003 | Provider capabilities must be declared as metadata rather than hardcoded into transformation rules. | High | Registry schema tests. |
| UOW06-NFR-MAINT-004 | Target-aware capability metadata must be additive and must not weaken generic provider safety rules. | Blocking | Metadata validation and idempotence tests. |
| UOW06-NFR-MAINT-005 | Provider-specific implementation details must not leak into UOW-04 transformation rule APIs. | High | API review and integration tests. |

## Availability and Offline Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW06-NFR-AVL-001 | The default workflow must run without outbound network access. | Blocking | Tests use local/internal and mock providers by default. |
| UOW06-NFR-AVL-002 | External provider unavailability must not fail the entire conversion run. | Blocking | Failure injection produces partial/manual-review results. |
| UOW06-NFR-AVL-003 | Provider selection must return manual-review results when no provider is available for a capability. | Blocking | No-provider tests. |

## Property-Based Testing Requirements

| ID | Property | Category | Blocking |
|---|---|---|---|
| UOW06-PBT-001 | Same provider set, request, policy decision, and capability tags always select the same provider. | Determinism | Yes |
| UOW06-PBT-002 | Minimized provider context never contains forbidden raw fields or generated sensitive values. | Invariant | Yes |
| UOW06-PBT-003 | Unknown policy, blocked policy, missing opt-in, timeout, malformed response, or unsafe response always yields blocked or manual-review output. | Invariant | Yes |
| UOW06-PBT-004 | Invalid confidence, missing suggestion ID, mismatched request ID, or unsafe rationale is rejected. | Invariant | Yes |
| UOW06-PBT-005 | Re-running the same mock script with the same request and seed yields the same result. | Reproducibility | Yes |
| UOW06-PBT-006 | Provider diagnostics and audit events remain stable in ordering and safe field shape. | Idempotence | Yes |
| UOW06-PBT-007 | Target-aware metadata application is additive and does not downgrade generic safety requirements. | Invariant | Yes |

## First Target Compatibility Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW06-NFR-TGT-001 | Provider capability metadata must support Angular 15, NgRx, routing, forms, i18n, animation, map, media, barcode/QR, and service-worker related refinement categories. | High | Metadata fixture tests. |
| UOW06-NFR-TGT-002 | Target-aware provider metadata must remain generic and must not encode customer-specific page names, identifiers, routes, or proprietary strings. | Blocking | Metadata privacy validation. |
| UOW06-NFR-TGT-003 | Complex library scenarios may be represented as capability tags and manual-review reason codes when automated refinement is unsafe. | High | Example tests for unsupported capability fallback. |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Audit/log evidence is safe-ref and reason-code based with raw prompts/responses forbidden by default. |
| SECURITY-05 | Compliant | Provider requests and responses require schema-first validation. |
| SECURITY-10 | Compliant | Runtime dependency additions require exact pinning and review. |
| SECURITY-11 | Compliant | Provider logic fails closed and is gated by UOW-05 policy decisions. |
| SECURITY-13 | Compliant | Provider boundaries are explicit, validated, auditable, and cannot bypass masking/policy contracts. |
| SECURITY-15 | Compliant | Timeout, malformed response, unsafe content, unknown policy, and missing opt-in all fail closed or manual review. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-12, SECURITY-14 | N/A | This stage defines library-level provider NFRs and does not create storage resources, deployed HTML endpoints, IAM policies, runtime authentication, infrastructure, or monitoring resources. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Provider selection, minimization, validation, fail-closed behavior, mock reproducibility, and metadata properties are defined. |
| PBT-03 | Compliant | Context minimization, response validation, audit privacy, and fail-closed invariants are blocking. |
| PBT-04 | Compliant | Provider selection and diagnostic stability are idempotence/determinism requirements. |
| PBT-07 | Compliant | Domain-specific generators are required for provider descriptors, requests, policy decisions, contexts, responses, diagnostics, and metadata. |
| PBT-08 | Compliant | Reproducible mock provider seed/script behavior is required. |
| PBT-09 | Compliant | fast-check remains the selected TypeScript PBT framework. |
| PBT-10 | Compliant | Example-based provider matrix tests must complement PBT. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not require round-trip codecs, independent oracle algorithms, or complex mutable state machines beyond deterministic mock scripting. |

## Blocking Findings

- **Security Findings**: None.
- **PBT Findings**: None.
