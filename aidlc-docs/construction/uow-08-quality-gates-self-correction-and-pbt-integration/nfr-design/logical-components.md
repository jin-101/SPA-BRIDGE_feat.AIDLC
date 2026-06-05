# UOW-08 Logical Components

## Component Model

| Component | Responsibility | Inputs | Outputs |
|---|---|---|---|
| Gate Registry | Stores the deterministic set of quality gate definitions and priorities | Quality request, policy context | Ordered gate list |
| Runner Adapter Layer | Executes build, lint, format, unit, integration, and property commands through a shared abstraction | Runner request, gate plan | Tool runner results |
| Self-Correction Planner | Produces bounded correction attempts for safely recoverable failures | Failed gate result, safe summary, correction policy | Correction plan |
| Evidence Aggregator | Collects per-gate results into bounded evidence bundles | Gate results, traces, diagnostics | Evidence bundle |
| PBT Coordinator | Runs generator families, seeds, and shrinking for property checks | PBT plan, seed, generator family | Property test result |
| Escalation Coordinator | Converts unresolved blockers into manual-review items | Failed/blocked run, trace refs, reason code | Manual-review items |
| Summary Builder | Produces structured run summaries and aggregate status | Gate results, evidence refs, PBT results | Run summary |
| Validation Guard | Validates request shape, refs, and result consistency before execution and publication | Quality request, artifact refs, gate results | Validation decision, blocking diagnostics |

## Interaction Pattern

1. A validated quality request enters the validation guard.
2. The gate registry resolves the ordered gate set.
3. The runner adapter layer executes each gate deterministically.
4. Results flow to the summary builder and evidence aggregator.
5. If a gate fails, the self-correction planner evaluates whether a bounded retry is safe.
6. If the failure is not safely correctable, the escalation coordinator emits a manual-review item.
7. The PBT coordinator executes seeded property families and reports reproducible failures.
8. The summary builder produces the final aggregate status and safe trace refs.

## Component Boundaries

| Boundary | Rule |
|---|---|
| Registry to Runner | The registry selects what to run; the runner adapter decides how to run it. |
| Runner to Correction | Correction only receives safe summaries and approved trace refs. |
| Runner to Evidence | Evidence aggregation consumes structured results, not raw transcripts. |
| PBT to Reporting | Property failures surface as structured records with seeds and shrunk cases. |
| Validation to Orchestration | Invalid requests and unsafe refs never enter execution. |

## Safety Constraints

- No component stores raw source snippets as part of its public contract.
- No component depends on mutable console transcripts as the authoritative record.
- No component may exceed the configured correction retry limit.
- No component may continue past a blocking failure without a correction success or manual-review escalation.

## Extension Points

- Add new gates by extending the registry with a stable ID and order.
- Add new runner kinds by implementing the shared runner adapter interface.
- Add new PBT families by extending the generator registry and replay metadata.
- Add new review categories by extending the safe summary and reason-code catalog.

## Compliance Summary

| Rule | Status | Notes |
|---|---|---|
| SECURITY-05 | Compliant | Request and result shapes are validated before execution and publication. |
| SECURITY-10 | Compliant | Dependencies remain exact-pinned and allowlisted. |
| SECURITY-13 | Compliant | Evidence and traceability remain structured and safe. |
| PBT-01 | Compliant | The component model includes determinism, invariants, and reproducibility properties. |
| PBT-03 | Compliant | Gate ordering and failure classification are modeled as invariants. |
| PBT-04 | Compliant | Self-correction idempotence is represented by the planner. |
| PBT-07 | Compliant | Generator families are domain-specific. |
| PBT-08 | Compliant | Seed logging and shrinking are required for property failures. |
| PBT-09 | Compliant | fast-check remains the selected framework. |
| PBT-10 | Compliant | Regression cases remain alongside PBT. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12 | N/A | No deployed stores, network intermediaries, web endpoints, IAM, auth/session flows, infrastructure, or monitoring resources are defined here. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not define round-trip codecs, oracle-backed algorithms, or state-machine heavy behavior. |

