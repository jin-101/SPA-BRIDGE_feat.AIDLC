# UOW-01 Business Rules

## Core Model Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW01-R001 | Angular Source Model and Core IR must remain separate models. | Keeps parser-specific details from leaking into framework-neutral transformation contracts. |
| UOW01-R002 | Core IR must cover components, templates, routes, services, state, dependencies, and traceability. | Supports the approved full MVP conversion scope. |
| UOW01-R003 | Core IR may use explicit extension slots, but core behavior must not depend on raw Angular AST nodes. | Preserves framework-neutral behavior while allowing source-specific metadata. |
| UOW01-R004 | Every persisted IR artifact must include `schemaVersion`. | Enables future schema evolution and migration. |
| UOW01-R005 | Persisted artifacts must pass JSON schema validation before use by downstream units. | Prevents malformed artifacts from corrupting conversion workflows. |

## Traceability Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW01-R006 | Traceability must support file, symbol, template binding, and generated artifact segment granularity. | Supports review, remediation, diagnostics, and report evidence. |
| UOW01-R007 | Every generated artifact segment should link to one or more source or IR references when derivable. | Enables manual review and source-to-output understanding. |
| UOW01-R008 | Trace links must not reference unknown source refs, IR refs, or generated artifact refs. | Preserves referential integrity. |
| UOW01-R009 | Traceability map must include `schemaVersion`. | Supports persisted report and trace compatibility. |

## Diagnostic Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW01-R010 | Diagnostic severity must be one of `info`, `warning`, `error`, `manual-review`, or `security-blocker`. | Matches approved diagnostic severity model. |
| UOW01-R011 | `security-blocker` diagnostics must not be represented as non-blocking in reports or quality summaries. | Enforces fail-closed security behavior. |
| UOW01-R012 | `manual-review` diagnostics must include enough context for source and generated artifact review where available. | Supports Web UI review and CLI report workflows. |
| UOW01-R013 | Diagnostics must support tags for category, source unit, requirement/story reference, and remediation type. | Enables filtering and reporting. |

## Report Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW01-R014 | Canonical report schema must include run summary, converted files, diagnostics, quality results, traceability map, AI-assisted decisions, masking/security events, and manual review workflow state. | Matches approved report scope. |
| UOW01-R015 | Report JSON is canonical; Markdown/HTML are derived views. | Prevents divergence between CLI and Web UI evidence. |
| UOW01-R016 | Report schema must include `schemaVersion`. | Supports compatibility and future migration. |
| UOW01-R017 | Reports must support redacted display values for sensitive content. | Prevents accidental disclosure in reports. |

## Port Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW01-R018 | UOW-01 defines file system, artifact storage, tool runner, LLM provider, report exporter, logger/audit, clock, and randomness ports. | Provides stable effect boundaries for ports-and-adapters architecture. |
| UOW01-R019 | Ports must describe domain-facing behavior, not concrete implementation details. | Keeps core model package independent from adapters. |
| UOW01-R020 | LLM provider port must support policy-mediated requests and structured provider results. | Enables later policy and masking enforcement. |
| UOW01-R021 | Logger/audit port must support structured events with correlation IDs and redaction metadata. | Supports Security Baseline logging requirements. |
| UOW01-R022 | Clock/randomness ports must allow deterministic testing. | Supports reproducibility and PBT. |

## Masking Token Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW01-R023 | Core Model defines masking token types and token maps. | Allows reports, AI context records, and traceability to reference masked content consistently. |
| UOW01-R024 | Masking logic and masking policy evaluation remain outside UOW-01 in `core-security`. | Maintains separation of model and behavior. |
| UOW01-R025 | Token maps must support stable placeholder identity and safe serialization. | Enables restoration and audit without leaking raw values. |

## Property-Based Testing Rules for UOW-01

| Rule ID | Rule | PBT Category |
|---|---|---|
| UOW01-PBT01 | IR serialization followed by deserialization preserves schema-valid structure. | Round-trip |
| UOW01-PBT02 | Report serialization followed by deserialization preserves report evidence and redaction metadata. | Round-trip |
| UOW01-PBT03 | Traceability validation rejects links with missing endpoints. | Invariant |
| UOW01-PBT04 | Diagnostic normalization is idempotent. | Idempotence |
| UOW01-PBT05 | Schema validation result is deterministic for equivalent artifacts. | Idempotence |
| UOW01-PBT06 | Token map serialization preserves token identifiers and redaction category metadata. | Round-trip |

## Security Compliance

| Security Rule | Status | Functional Design Handling |
|---|---|---|
| SECURITY-03 | Compliant | Logger/audit port supports structured logging without sensitive payload requirements. |
| SECURITY-05 | N/A | Boundary input validation is handled in later units; UOW-01 only defines validation result models. |
| SECURITY-08 | N/A | Application authorization is outside UOW-01. |
| SECURITY-10 | N/A | Supply chain controls are outside functional model design. |
| SECURITY-11 | Compliant | Security-critical diagnostic and token models are explicit and separated from core behavior. |
| SECURITY-13 | Compliant | Schema validation and safe artifact contracts support integrity verification. |
| SECURITY-15 | Compliant | `security-blocker` diagnostic model supports fail-closed behavior. |

## PBT Compliance

| PBT Rule | Status | Functional Design Handling |
|---|---|---|
| PBT-01 | Compliant | Testable properties are identified in this document. |
| PBT-02 | Compliant | IR, report, and token map round-trip properties are identified. |
| PBT-03 | Compliant | Traceability and diagnostic invariants are identified. |
| PBT-04 | Compliant | Diagnostic normalization and validation idempotence are identified. |
| PBT-05 | N/A | Oracle/model-based tests may apply later to converter behavior, not UOW-01 model contracts. |
| PBT-06 | N/A | UOW-01 does not manage mutable state. |
| PBT-07 | N/A | Generator implementation belongs to Code Generation. |
| PBT-08 | Compliant | Clock/randomness ports and PBT metadata support reproducibility. |
| PBT-09 | N/A | Framework selection is handled in NFR Requirements. |
| PBT-10 | Compliant | UOW-01 properties complement example-based schema and fixture tests. |

