# UOW-04 NFR Requirements

## Unit Context

- **Unit**: UOW-04 Angular-to-React Transformation
- **Primary Package**: `packages/transform-angular-react`
- **Functional Design Status**: Complete
- **Primary Stories**: US-005, US-006
- **Supporting Stories**: US-002, US-007, US-011, US-012, US-014

## NFR Summary

UOW-04 must provide deterministic, safe, and scalable Angular-to-React transformation. It consumes structured source/IR artifacts, applies ordered rules, emits React target drafts, preserves traceability, and produces manual-review diagnostics without executing source or generated code.

The package must stay provider-neutral. Difficult mapping handoff may produce structured metadata, but concrete provider calls remain behind UOW-05 policy and UOW-06 adapters.

## Performance Requirements

| Requirement ID | Requirement | Measurement |
|---|---|---|
| UOW04-NFR-PERF-01 | A 100+ component conversion should typically complete in 30 seconds or less under documented local reference conditions. | Benchmark fixture with 100+ component-equivalent source models. |
| UOW04-NFR-PERF-02 | A 500+ component conversion must be covered by benchmark fixtures, even if the first implementation records baseline instead of enforcing a strict pass/fail budget. | Benchmark fixture with 500+ component-equivalent source models. |
| UOW04-NFR-PERF-03 | Rule ordering, rule selection, draft finalization, and diagnostic sorting must use deterministic algorithms with predictable growth characteristics. | Unit and benchmark tests inspect ordering and runtime trends. |
| UOW04-NFR-PERF-04 | Transformation must avoid full raw source processing and must operate on structured source/IR summaries. | Code review and memory-oriented tests. |

## Scalability and Memory Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW04-NFR-SCALE-01 | The transformation engine should support 500+ component projects through bounded draft and trace models. | Keeps conversion viable for enterprise-scale Angular applications. |
| UOW04-NFR-SCALE-02 | UOW-04 must not retain raw Angular or generated React source text as primary intermediate state. | Reduces memory footprint and privacy risk. |
| UOW04-NFR-SCALE-03 | Drafts, traces, diagnostics, and pass summaries should store structured refs and summaries. | Supports reporting without duplicating source content. |
| UOW04-NFR-SCALE-04 | Rule execution should be phase-based and entity-scoped where feasible. | Enables future incremental/resume-friendly transformation. |

## Determinism Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW04-NFR-DET-01 | Rule ordering must be stable by phase, dependency, priority, and ruleId. | Prevents nondeterministic conversion output. |
| UOW04-NFR-DET-02 | Rule conflicts must fail fast before execution. | Prevents ambiguous conversion behavior. |
| UOW04-NFR-DET-03 | Target draft ordering must be stable for equivalent source artifacts and strategy selections. | Enables reproducible generated outputs and reports. |
| UOW04-NFR-DET-04 | Conversion traces must use stable IDs for equivalent source refs, generated refs, and rule IDs. | Supports review, diffing, and report reconstruction. |
| UOW04-NFR-DET-05 | Diagnostic ordering must be stable by severity, source ref, generated ref, rule ID, code, and deterministic tie-breakers. | Avoids noisy report churn. |

## Draft Validation Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW04-NFR-DRAFT-01 | Every target draft must pass schema validation before handoff. | Prevents invalid target artifacts from reaching UOW-07. |
| UOW04-NFR-DRAFT-02 | Every target draft must have trace evidence or explicit synthetic-origin metadata. | Preserves accountability for generated drafts. |
| UOW04-NFR-DRAFT-03 | Draft sets must pass deterministic ordering checks. | Keeps downstream generation and tests stable. |
| UOW04-NFR-DRAFT-04 | Partial drafts must preserve source identity and review diagnostics. | Supports Web UI remediation and reporting. |
| UOW04-NFR-DRAFT-05 | Unsupported source evidence must not disappear silently. | Ensures reviewable mapping gaps remain visible. |

## Reliability and Error Tolerance Requirements

| Requirement ID | Requirement | Behavior |
|---|---|---|
| UOW04-NFR-REL-01 | Invalid transformation requests fail fast. | Return failed result with blocking diagnostics. |
| UOW04-NFR-REL-02 | Invalid rule registries fail fast. | Duplicate rule IDs, unresolved dependencies, and conflicts prevent execution. |
| UOW04-NFR-REL-03 | Per-entity uncertain mappings produce partial drafts with manual-review diagnostics. | Preserve progress without guessing behavior. |
| UOW04-NFR-REL-04 | Unsupported template, form, lifecycle, DI, route, or state mappings produce review markers. | Avoid silent behavior drift. |
| UOW04-NFR-REL-05 | Provider-assisted mapping needs must be represented as provider-neutral metadata only. | Keeps provider decisions behind policy and adapters. |

## Security and Privacy Requirements

| Requirement ID | Requirement | Security Rule Alignment |
|---|---|---|
| UOW04-NFR-SEC-01 | Treat source/IR artifacts as untrusted input. | SECURITY-13 |
| UOW04-NFR-SEC-02 | Never execute Angular expressions, route guards, service logic, generated React code, or package scripts during transformation. | SECURITY-11, SECURITY-13 |
| UOW04-NFR-SEC-03 | Diagnostics and review markers must use safe source refs, generated refs, rule IDs, and stable diagnostic codes. | SECURITY-03, SECURITY-05 |
| UOW04-NFR-SEC-04 | Raw source or generated code snippets must not appear in diagnostics or report-facing strings by default. | SECURITY-03, SECURITY-05 |
| UOW04-NFR-SEC-05 | Provider calls are forbidden in UOW-04; handoff metadata must be provider-neutral and policy-gated by later units. | SECURITY-11 |
| UOW04-NFR-SEC-06 | Runtime dependency additions should be minimal and exact-pinned during implementation. | SECURITY-10 |

## Observability and Audit Evidence Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW04-NFR-OBS-01 | Transformation output must include safe pass summaries. | Helps users and later reports understand conversion coverage. |
| UOW04-NFR-OBS-02 | Rule execution counts must be included as structured summary data. | Supports debugging and audit without raw source logs. |
| UOW04-NFR-OBS-03 | Diagnostic counts and review-item counts must be included by severity/category. | Supports CLI/Web UI status and reports. |
| UOW04-NFR-OBS-04 | Trace coverage summary must be included. | Makes conversion accountability measurable. |
| UOW04-NFR-OBS-05 | Observability output must not contain raw source snippets. | Maintains privacy and safe reporting. |

## Maintainability Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW04-NFR-MAINT-01 | Rule registry, execution planner, pipeline runner, converters, draft builders, trace builders, and diagnostics should be separate logical modules. | Keeps transformation responsibilities testable and evolvable. |
| UOW04-NFR-MAINT-02 | Built-in and extension rules should share the same rule contract. | Preserves extensibility. |
| UOW04-NFR-MAINT-03 | Converter modules should return structured results rather than throw for expected unsupported mappings. | Keeps partial conversion behavior consistent. |
| UOW04-NFR-MAINT-04 | Code must preserve UOW-01 contract compatibility for diagnostics, refs, results, and validation behavior. | Maintains cross-unit integration. |
| UOW04-NFR-MAINT-05 | Example fixtures should cover common Angular component, template, lifecycle, service, DI, route, and state patterns. | Provides executable design evidence. |

## Testability Requirements

| Requirement ID | Requirement | Test Type |
|---|---|---|
| UOW04-NFR-TEST-01 | Rule ordering is a blocking property-based test requirement. | PBT |
| UOW04-NFR-TEST-02 | Conversion idempotence is a blocking property-based test requirement. | PBT |
| UOW04-NFR-TEST-03 | Draft ordering is a blocking property-based test requirement. | PBT |
| UOW04-NFR-TEST-04 | Trace coverage is a blocking property-based test requirement. | PBT |
| UOW04-NFR-TEST-05 | Unsupported mapping preservation is a blocking property-based test requirement. | PBT |
| UOW04-NFR-TEST-06 | Invalid request and invalid registry behavior require example-based tests. | Example-based |
| UOW04-NFR-TEST-07 | Representative component/template/lifecycle/service/DI/route/state conversion fixtures require example-based tests. | Example-based |
| UOW04-NFR-TEST-08 | 100+ and 500+ component-equivalent conversion benchmark fixtures are required. | Performance |

## Availability and Operations Requirements

UOW-04 is an in-process library package, not a deployed service. High availability, network failover, endpoint authorization, and infrastructure monitoring are not applicable at this stage. Operational visibility is provided through safe structured transformation summaries, diagnostics, trace coverage, and later reporting artifacts.

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | UOW-04 does not define deployed storage resources. |
| SECURITY-02 | N/A | No network-facing intermediary is defined. |
| SECURITY-03 | Compliant | Diagnostics, review markers, pass summaries, and observability output must be structured and safe. |
| SECURITY-04 | N/A | No HTML-serving endpoint is defined. |
| SECURITY-05 | Compliant | Transformation request validation, registry validation, draft validation, and safe diagnostics are required. |
| SECURITY-06 | N/A | No IAM or permission policy is defined. |
| SECURITY-07 | N/A | No network configuration is defined. |
| SECURITY-08 | N/A | No application endpoint is defined in this unit. |
| SECURITY-09 | Compliant | Transformation errors must not expose unsafe internals in report-facing diagnostics. |
| SECURITY-10 | Compliant | Runtime dependency policy requires minimal exact-pinned dependencies. |
| SECURITY-11 | Compliant | Provider calls are isolated away from UOW-04 and source/generated code execution is forbidden. |
| SECURITY-12 | N/A | No authentication or credential management is defined. |
| SECURITY-13 | Compliant | Source/IR artifacts are treated as untrusted structured input. |
| SECURITY-14 | N/A | Deployed alerting and monitoring are outside this library unit. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Functional design and NFRs identify UOW-04 properties. |
| PBT-02 | N/A | Round-trip properties are not primary for this NFR stage; draft serialization may be reconsidered in Code Generation. |
| PBT-03 | Compliant | Draft ordering, trace coverage, unsupported mapping preservation, and registry integrity invariants are blocking requirements. |
| PBT-04 | Compliant | Conversion idempotence is a blocking requirement. |
| PBT-05 | N/A | No reference oracle is selected for this NFR stage. |
| PBT-06 | Compliant | Invalid/conflicting registry behavior requires stateful or model-based PBT consideration in code generation. |
| PBT-07 | N/A | Generator implementation belongs to Code Generation. |
| PBT-08 | N/A | Seed logging and reproducibility are finalized during Code Generation and Build/Test. |
| PBT-09 | Compliant | fast-check/Vitest remains the project PBT framework from UOW-01 decisions. |
| PBT-10 | Compliant | UOW-04 requires both example-based conversion fixtures and PBT for general properties. |

## Blocking Findings

- **Security**: None.
- **PBT**: None.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
