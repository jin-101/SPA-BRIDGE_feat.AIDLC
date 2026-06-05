# UOW-08 NFR Requirements

## Scope

These NFRs apply to `packages/core-quality`, which orchestrates build, lint, format, unit, integration, and property-based quality checks for generated and converted artifacts. The unit coordinates bounded self-correction, deterministic execution, safe diagnostics, reproducible PBT runs, and manual-review escalation.

UOW-08 does not own transformation logic, target generation, provider policy, deployment, or production observability. It consumes quality-relevant outputs from those units and produces safe run summaries, evidence bundles, and review items.

## Security Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW08-NFR-SEC-001 | Quality diagnostics, summaries, and evidence bundles must use safe refs, reason codes, counts, and trace links only. | Blocking | Serialized artifacts do not contain raw source snippets, secrets, or mutable command transcripts. |
| UOW08-NFR-SEC-002 | Blocking gate failures must fail closed until bounded self-correction succeeds or manual review is triggered. | Blocking | Gate orchestration tests confirm no silent continuation after a blocking failure. |
| UOW08-NFR-SEC-003 | Quality request inputs, run identifiers, selected gate sets, and artifact refs must be schema-validated before execution. | Blocking | Validation tests reject malformed requests and unsafe refs. |
| UOW08-NFR-SEC-004 | Quality evidence must not become a covert channel for raw source snippets or provider outputs. | Blocking | Evidence bundle tests verify privacy-preserving summaries only. |

## Privacy Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW08-NFR-PRI-001 | Logs and summaries must exclude raw source excerpts, secrets, and prompt-like payloads. | Blocking | Serialization and logging tests. |
| UOW08-NFR-PRI-002 | Manual-review items must be safe to display and must not expose sensitive internals. | Blocking | Review item fixtures. |
| UOW08-NFR-PRI-003 | Evidence bundles must remain bounded and reference-based rather than transcript-heavy. | High | Evidence bundle shape tests. |
| UOW08-NFR-PRI-004 | Seed values and counterexamples may be recorded for reproducibility, but only in safe structured form. | High | PBT failure reporting tests. |

## Performance and Scalability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW08-NFR-PERF-001 | Quality orchestration overhead should remain bounded and deterministic for 100+ component workspaces. | High | Reference benchmarks and execution timing checks. |
| UOW08-NFR-PERF-002 | 500+ component runs are benchmark scope for gate scheduling, retry planning, and summary generation. | High | Benchmark fixture coverage. |
| UOW08-NFR-PERF-003 | Gate execution summaries must be generated without retaining unnecessary duplicate command transcripts or intermediate strings. | High | Memory-oriented code review and test fixtures. |
| UOW08-NFR-PERF-004 | Self-correction retries must remain bounded and should not introduce unbounded latency. | Blocking | Retry-limit tests and orchestration timing checks. |
| UOW08-NFR-PERF-005 | PBT failure shrinking and replay must remain reproducible under the selected seed policy. | High | PBT replay tests. |

## Determinism Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW08-NFR-DET-001 | Gate ordering must be deterministic for equivalent requests and registry state. | Blocking | Ordering PBT and snapshot tests. |
| UOW08-NFR-DET-002 | Runner selection and invocation plans must be stable for equivalent inputs. | Blocking | Runner plan determinism tests. |
| UOW08-NFR-DET-003 | PBT execution must be reproducible through logged seeds and stable generator families. | Blocking | Failure replay tests. |
| UOW08-NFR-DET-004 | Failure classification must remain stable for the same gate outcome and policy input. | Blocking | Classification tests. |
| UOW08-NFR-DET-005 | Self-correction must be idempotent for the same accepted input state and correction result. | High | Correction replay tests. |

## Reliability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW08-NFR-REL-001 | Unresolved blocking failures must escalate to manual review after bounded retry attempts. | Blocking | Escalation tests. |
| UOW08-NFR-REL-002 | Warning results may be recorded without blocking continuation only when the pipeline remains usable. | High | Classification and summary tests. |
| UOW08-NFR-REL-003 | If the pipeline cannot produce safe traceable evidence, it must stop rather than fabricate output. | Blocking | Evidence failure tests. |
| UOW08-NFR-REL-004 | The quality package must tolerate missing optional gates by marking them skipped rather than failing the entire run. | High | Optional gate fixtures. |

## Maintainability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW08-NFR-MAINT-001 | The package must expose a shared gate registry and explicit runner abstractions. | Blocking | API review and tests. |
| UOW08-NFR-MAINT-002 | New gates should be introduced through additive registry entries rather than hardcoded orchestration branches. | Blocking | Registry extension tests. |
| UOW08-NFR-MAINT-003 | Tooling and PBT dependencies should be kept exact-pinned and allowlisted. | Blocking | Package manifest review. |
| UOW08-NFR-MAINT-004 | The package must remain reusable across future quality workflows without coupling to UOW-specific report UI. | High | Module boundary review. |

## Test Stack Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW08-NFR-TEST-001 | Vitest should be the primary example-based test runner. | Blocking | Package manifest and test script review. |
| UOW08-NFR-TEST-002 | fast-check should be the property-based testing framework. | Blocking | Package manifest and generator tests. |
| UOW08-NFR-TEST-003 | The runner abstraction should support build, lint, format, unit, integration, and property commands. | Blocking | Tool runner tests. |
| UOW08-NFR-TEST-004 | Example-based regression tests must remain alongside PBT for critical paths and shrunk failures. | Blocking | Test layout review. |

## Quality Evidence Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW08-NFR-EVID-001 | Every gate run must produce a structured result record. | Blocking | Run-summary tests. |
| UOW08-NFR-EVID-002 | Aggregate summaries must include duration, status, and failure reason fields. | Blocking | Summary serialization tests. |
| UOW08-NFR-EVID-003 | Safe trace refs must connect run results to artifacts and review items. | Blocking | Trace-link tests. |
| UOW08-NFR-EVID-004 | Evidence bundles must be bounded and reference-based. | High | Evidence bundle shape tests. |

## Blocking PBT Requirements

| ID | Property | Category | Blocking |
|---|---|---|---|
| UOW08-PBT-001 | Equivalent requests produce the same deterministic gate order. | Determinism | Yes |
| UOW08-PBT-002 | Retry counts never exceed the configured bounded limit. | Invariant | Yes |
| UOW08-PBT-003 | Logged seeds and generator families reproduce the same failing PBT scenario. | Reproducibility | Yes |
| UOW08-PBT-004 | Generator families produce domain-valid runner requests, seeds, and failure records. | Invariant | Yes |
| UOW08-PBT-005 | Failure classification remains stable for equivalent gate outcomes and policy input. | Invariant | Yes |
| UOW08-PBT-006 | Example-based regression cases are retained for shrunk failures. | Idempotence-like regression rule | Yes |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | N/A | This unit is not a deployed application component with runtime logging infrastructure. |
| SECURITY-05 | Compliant | Quality request inputs, gate requests, and artifact refs are schema-validated. |
| SECURITY-10 | Compliant | Runner/test/PBT dependencies are exact-pinned and allowlisted. |
| SECURITY-13 | Compliant | Structured evidence and traceability are required for quality artifacts. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12 | N/A | This unit does not define deployed stores, network intermediaries, web endpoints, IAM, auth/session flows, infrastructure, or monitoring resources. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | The unit identifies determinism, invariants, idempotence, and reproducibility as PBT properties. |
| PBT-03 | Compliant | Gate ordering, retry bounds, and failure classification stability are invariant candidates. |
| PBT-04 | Compliant | Self-correction idempotence is explicitly modeled. |
| PBT-07 | Compliant | Generator families are domain-specific rather than primitive-only. |
| PBT-08 | Compliant | Seed logging and shrinking are required for failures. |
| PBT-09 | Compliant | fast-check is the selected TypeScript PBT framework. |
| PBT-10 | Compliant | Example-based checks remain necessary alongside PBT. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not define round-trip codecs, oracle-backed algorithms, or complex mutable state machines as primary behavior. |
