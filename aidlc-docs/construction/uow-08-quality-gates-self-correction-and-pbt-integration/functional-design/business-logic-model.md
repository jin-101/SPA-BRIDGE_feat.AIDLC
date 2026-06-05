# UOW-08 Business Logic Model

## Purpose

UOW-08 coordinates quality gates, self-correction, and property-based testing for the generated conversion workspace. It evaluates build, lint, format, unit, integration, and PBT outcomes; records structured quality results; and decides whether to stop, retry, or escalate to manual review.

The unit consumes generated artifacts from UOW-04, UOW-06, and UOW-07, plus the workspace package boundaries defined in UOW-01 and UOW-02. It does not own transformation logic, target generation, security policy, report rendering, or deployment. Instead, it governs the execution and interpretation of quality signals for those units.

## Approved Scope

| Decision Area | Approved Choice | Design Effect |
|---|---|---|
| Primary purpose | Orchestrate quality gates, self-correction, and property-based testing | Keeps this unit focused on quality assurance, not conversion logic. |
| Gate pipeline | Deterministic ordered build, lint, format, unit, integration, and PBT checks | Makes the evaluation reproducible and reviewable. |
| Self-correction | Bounded correction loop with safe summaries and deterministic stop conditions | Prevents endless retry loops and unsafe guesswork. |
| Failure handling | Distinguish blocking failures from warnings with manual-review escalation | Keeps the workflow fail-closed for quality blockers. |
| PBT integration | Generator families and properties for conversion-sensitive logic and deterministic outputs | Gives strong coverage for the most fragile behavior. |
| PBT failure handling | Seed logging, shrinking, and regression replay | Makes counterexamples reproducible and actionable. |
| Quality results | Structured run summaries with gate status, duration, failure reason, and trace refs | Ensures reporting can consume stable evidence. |
| Tool execution | Explicit tool runner abstractions | Keeps command execution deterministic and replaceable. |
| Traceability | Safe trace links from results back to runs, artifacts, and source inputs | Preserves evidence without leaking sensitive data. |

## Core Business Capabilities

| Capability | Responsibility | Primary Output |
|---|---|---|
| Gate Definition and Scheduling | Define the ordered set of quality gates for a conversion run | `QualityGateDefinition[]` |
| Tool Execution Orchestration | Run build, lint, format, unit, integration, and PBT commands through a deterministic runner | `QualityGateRun[]` |
| Result Aggregation | Combine per-gate outputs into a summary and decision state | `QualityRunSummary` |
| Self-Correction Coordination | Apply bounded correction attempts when a gate fails and a safe fix candidate exists | `SelfCorrectionPlan` |
| PBT Coordination | Execute generator families, seeds, and shrinking logic for conversion-sensitive functions | `PropertyTestRun[]` |
| Evidence Collection | Capture traceable, safe quality evidence for downstream reporting | `QualityEvidenceBundle` |
| Manual-Review Escalation | Convert unresolved quality blockers into actionable review items | `ManualReviewItem[]` |

## End-to-End Quality Flow

1. Receive a quality request containing run identifiers, artifact refs, selected gates, and policy context.
2. Build a deterministic gate schedule using the configured runner profile.
3. Execute gates in order, recording start/end timestamps, exit status, and safe summary details.
4. If a gate fails, classify the failure as blocking, warning, or reviewable according to the unit policy.
5. When the failure is safe to correct automatically, construct a bounded self-correction plan and retry only the affected gates.
6. Run property-based tests for the units that declare conversion-sensitive properties, using deterministic generators and recorded seeds.
7. Shrink failing PBT cases and preserve the minimal counterexample as a regression artifact.
8. Aggregate gate results into a structured summary with evidence refs and trace links.
9. If unresolved blockers remain after bounded correction, escalate to manual review and stop the pipeline.
10. Return a `QualityRunResult` for reporting and downstream workflow decisions.

## Quality Subsystems

| Subsystem | Function |
|---|---|
| Gate Orchestrator | Orders and executes the selected quality gates deterministically. |
| Runner Adapter Layer | Wraps build, lint, format, unit, integration, and PBT commands behind a shared abstraction. |
| Self-Correction Planner | Builds a narrow retry plan from safe summaries and approved correction candidates. |
| PBT Coordinator | Manages generator families, seed values, shrinking, and counterexample replay. |
| Evidence Aggregator | Collects gate outputs, trace refs, and safe diagnostics into reporting-friendly summaries. |
| Escalation Coordinator | Converts unresolved quality failures into manual-review items and blocking signals. |

## Testable Properties

| Property | Category | Candidate Scope |
|---|---|---|
| Gate ordering is deterministic | Determinism | Equivalent inputs produce the same gate sequence and priority order. |
| Retry count is bounded | Invariant | Self-correction never exceeds the configured retry limit. |
| Seeded PBT runs are reproducible | Round-trip-like reproducibility | Re-running with the same seed yields the same counterexample search space. |
| Generator output is valid | Invariant | Generated test inputs satisfy the declared domain constraints. |
| Failure classification is stable | Invariant | The same gate result maps to the same blocking/warning/review classification. |
| Self-correction is idempotent on success | Idempotence | Reapplying the same successful correction does not change the accepted result. |

## Traceability and Reporting Boundaries

- Quality results must carry safe trace refs back to the run, the artifact, and the originating source inputs.
- No raw secret values, raw source snippets, or mutable command transcripts are stored as primary evidence.
- Downstream reporting receives structured result bundles, not ad hoc console logs.

## Security and PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Quality results and diagnostics are structured and safe-display oriented. |
| SECURITY-05 | Compliant | Quality request inputs and artifact refs are validated before execution. |
| SECURITY-10 | Compliant | Tool execution is deterministic and uses explicit runner abstractions. |
| SECURITY-13 | Compliant | Quality evidence is traceable and avoids unsafe artifact mutation semantics. |
| SECURITY-14 | Compliant | The unit is designed to surface quality/security events to later reporting, not suppress them. |
| PBT-01 | Compliant | The unit identifies determinism, invariants, idempotence, and reproducibility as PBT properties. |
| PBT-03 | Compliant | Gate ordering, retry bounds, and classification stability are invariant candidates. |
| PBT-04 | Compliant | Self-correction idempotence is explicitly modeled. |
| PBT-07 | Compliant | Generator families are domain-specific rather than primitive-only. |
| PBT-08 | Compliant | Seed logging and shrinking are required for failures. |
| PBT-09 | Compliant | A TS-compatible PBT framework is assumed for the unit implementation. |
| PBT-10 | Compliant | Example-based checks remain necessary alongside PBT. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12 | N/A | This functional design does not define deployed stores, network intermediaries, UI endpoints, IAM, or auth/session flows. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not define round-trip codecs, oracle-backed algorithms, or mutable state machines as primary behavior. |

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown is limited to plain lists and tables for parse safety.
