# UOW-03 NFR Requirements

## Unit Context

- **Unit**: UOW-03 Angular Source Analysis
- **Primary Package**: `packages/source-angular`
- **Functional Design Status**: Complete
- **Primary Stories**: US-003
- **Supporting Stories**: US-004, US-005, US-006, US-012

## NFR Summary

UOW-03 must provide deterministic, safe, and scalable Angular source analysis. It reads local source files as untrusted input, parses TypeScript and Angular templates through structured parser APIs, emits safe diagnostics, and produces stable analysis artifacts for downstream conversion units.

## Performance Requirements

| Requirement ID | Requirement | Measurement |
|---|---|---|
| UOW03-NFR-PERF-01 | A 100+ component Angular application scan should typically complete in 30 seconds or less under documented local reference conditions. | Benchmark fixture with 100+ components. |
| UOW03-NFR-PERF-02 | A 500+ component Angular application must be covered by benchmark fixtures, even if the first implementation does not set a strict pass/fail time budget. | Benchmark fixture with 500+ components and recorded baseline. |
| UOW03-NFR-PERF-03 | Inventory, graph assembly, and diagnostic sorting must use deterministic algorithms with predictable growth characteristics. | Unit and benchmark tests inspect ordering and runtime trends. |
| UOW03-NFR-PERF-04 | The analyzer must avoid full semantic type checking unless a later approved design explicitly enables it. | Code review and dependency/API usage checks. |

## Scalability and Memory Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW03-NFR-SCALE-01 | The analyzer should support 500+ component projects through bounded in-memory models. | Prevents source analysis from becoming unusable on realistic enterprise applications. |
| UOW03-NFR-SCALE-02 | File reads must be streaming-friendly or file-at-a-time where feasible. | Avoids keeping all raw source text in memory. |
| UOW03-NFR-SCALE-03 | Persisted artifacts should store structured summaries and source refs, not duplicated raw file contents. | Reduces memory and disk footprint while preserving traceability. |
| UOW03-NFR-SCALE-04 | Graph construction must support stable incremental assembly from parsed file records. | Enables future resume/incremental analysis without changing domain contracts. |

## Determinism Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW03-NFR-DET-01 | Source inventory ordering must be stable for equivalent input file sets. | Enables reproducible reports and tests. |
| UOW03-NFR-DET-02 | Graph node IDs and edge IDs must be stable for equivalent source refs and relationships. | Enables downstream traceability and diff-friendly artifacts. |
| UOW03-NFR-DET-03 | Diagnostic ordering must be stable by severity, source ref, code, and deterministic tie-breakers. | Prevents noisy report churn. |
| UOW03-NFR-DET-04 | Artifact refs must be stable for equivalent project roots, run contexts, and artifact kinds. | Supports deterministic orchestration and report references. |

## Reliability and Error Tolerance Requirements

| Requirement ID | Requirement | Behavior |
|---|---|---|
| UOW03-NFR-REL-01 | Fatal workspace/config errors stop source analysis. | Return failed result with blocking diagnostics. |
| UOW03-NFR-REL-02 | Per-file TypeScript/template parse errors produce partial results when workspace/config state is valid. | Preserve source refs, partial file records, and diagnostics. |
| UOW03-NFR-REL-03 | Missing external templates/styles produce diagnostics and partial component models. | Continue where safe. |
| UOW03-NFR-REL-04 | Dynamic routes, providers, or decorator shapes produce manual-review diagnostics instead of guessed semantics. | Avoid silent behavior drift. |
| UOW03-NFR-REL-05 | Parser failures must not leave malformed graph artifacts. | Validate graph endpoints before handoff. |

## Security and Privacy Requirements

| Requirement ID | Requirement | Security Rule Alignment |
|---|---|---|
| UOW03-NFR-SEC-01 | Treat all source files and config files as untrusted input. | SECURITY-13 |
| UOW03-NFR-SEC-02 | Never execute project source code, package scripts, Angular builders, route expressions, or template expressions during analysis. | SECURITY-11, SECURITY-13 |
| UOW03-NFR-SEC-03 | Enforce workspace/source root containment, block traversal, and allow explicit external refs only. | SECURITY-05 |
| UOW03-NFR-SEC-04 | Diagnostics must use safe path/ref/code data and must not include raw source snippets by default. | SECURITY-03, SECURITY-05 |
| UOW03-NFR-SEC-05 | Dependency additions are limited to exact-pinned TypeScript and Angular compiler parser dependencies. | SECURITY-10 |
| UOW03-NFR-SEC-06 | Source analysis must not call AI providers or masking pipelines directly. | SECURITY-11 |

## Maintainability Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW03-NFR-MAINT-01 | Scanner, TypeScript parser, template parser, route analyzer, graph builder, diagnostics, and artifact mapper should be separate logical modules. | Keeps parser responsibilities understandable and testable. |
| UOW03-NFR-MAINT-02 | Parser adapters should return structured domain results rather than throw for expected malformed source. | Keeps fail-soft behavior consistent. |
| UOW03-NFR-MAINT-03 | Code must preserve UOW-01 contract compatibility for diagnostics, source refs, and source model boundary refs. | Maintains cross-unit integration. |
| UOW03-NFR-MAINT-04 | Example fixtures should cover common Angular 15+ patterns and edge-case malformed patterns. | Provides executable design evidence. |

## Testability Requirements

| Requirement ID | Requirement | Test Type |
|---|---|---|
| UOW03-NFR-TEST-01 | Inventory determinism is a blocking property-based test requirement. | PBT |
| UOW03-NFR-TEST-02 | File classification idempotence is a blocking property-based test requirement. | PBT |
| UOW03-NFR-TEST-03 | Graph invariants, especially no dangling non-external endpoints, are blocking property-based test requirements. | PBT |
| UOW03-NFR-TEST-04 | Diagnostic stability and severity preservation are blocking property-based test requirements. | PBT |
| UOW03-NFR-TEST-05 | Fatal workspace/config errors and partial parse failures require example-based tests. | Example-based |
| UOW03-NFR-TEST-06 | Representative Angular component, service, route, template, and style fixtures require example-based tests. | Example-based |
| UOW03-NFR-TEST-07 | Benchmark fixtures must include 100+ and 500+ component source sets or generated equivalent fixtures. | Performance |

## Availability and Operations Requirements

UOW-03 is an in-process library package, not a deployed service. High availability, network failover, endpoint authorization, and infrastructure monitoring are not applicable at this stage. Operational visibility is provided through diagnostics, safe structured events from UOW-02, and later reporting artifacts.

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | UOW-03 does not define deployed storage resources. |
| SECURITY-02 | N/A | No network-facing intermediary is defined. |
| SECURITY-03 | Compliant | Diagnostics must be structured and safe; concrete logging is handled through shared ports. |
| SECURITY-04 | N/A | No HTML-serving endpoint is defined. |
| SECURITY-05 | Compliant | Path containment, traversal blocking, source scope validation, and safe diagnostics are required. |
| SECURITY-06 | N/A | No IAM or permission policy is defined. |
| SECURITY-07 | N/A | No network configuration is defined. |
| SECURITY-08 | N/A | No application endpoint is defined in this unit. |
| SECURITY-09 | Compliant | Parser errors must not expose unsafe internals in report-facing diagnostics. |
| SECURITY-10 | Compliant | Dependency policy limits additions to exact-pinned TypeScript and Angular compiler parser dependencies. |
| SECURITY-11 | Compliant | Source analysis is isolated from AI/provider behavior and explicitly avoids source execution. |
| SECURITY-12 | N/A | No authentication or credential management is defined. |
| SECURITY-13 | Compliant | Source/config inputs are parsed and validated as untrusted data. |
| SECURITY-14 | N/A | Deployed alerting and monitoring are outside this library unit. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Functional design and NFRs identify UOW-03 properties. |
| PBT-02 | Compliant | Parser fixture serialization round-trip remains a candidate for supported modeled fields. |
| PBT-03 | Compliant | Graph, diagnostic, and source identity invariants are blocking requirements. |
| PBT-04 | Compliant | Classification and diagnostic normalization idempotence are blocking requirements. |
| PBT-05 | N/A | No reference oracle is selected for this NFR stage. |
| PBT-06 | Compliant | Fatal/partial analysis behavior requires stateful or model-based PBT consideration in code generation. |
| PBT-07 | N/A | Generator implementation belongs to Code Generation. |
| PBT-08 | N/A | Seed logging and reproducibility are finalized during Code Generation and Build/Test. |
| PBT-09 | Compliant | fast-check/Vitest remains the project PBT framework from UOW-01 decisions. |
| PBT-10 | Compliant | UOW-03 requires both example-based parser fixtures and PBT for general properties. |

## Blocking Findings

- **Security**: None.
- **PBT**: None.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
