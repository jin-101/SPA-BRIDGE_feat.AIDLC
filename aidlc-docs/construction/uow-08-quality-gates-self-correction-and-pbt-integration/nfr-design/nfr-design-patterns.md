# UOW-08 NFR Design Patterns

## Scope

UOW-08 designs the quality orchestration layer that runs build, lint, format, unit, integration, and property-based checks for generated and converted artifacts. The design emphasizes deterministic execution, bounded retries, safe diagnostics, traceable evidence, and manual-review escalation.

## Approved Design Patterns

| Area | Pattern | Purpose |
|---|---|---|
| Gate Flow | Fail-closed ordered pipeline | Prevents continuation past blocking quality failures unless correction succeeds or review is triggered. |
| Registry | Deterministic in-memory gate registry | Keeps gate selection stable for equivalent requests and policy state. |
| Execution | Explicit runner adapter layer | Decouples orchestration from shell-specific command execution details. |
| Correction | Bounded self-correction planner | Limits retries and only reuses safe summaries and approved candidates. |
| Evidence | Structured summary and bounded evidence bundle pattern | Produces review-friendly outputs without leaking raw source or transcripts. |
| PBT | Seeded generator families with replay path | Makes property-based failures reproducible and actionable. |
| Escalation | Manual-review item pattern | Converts unresolved blockers into stable review items with reason codes and refs. |
| Scalability | Bounded orchestration with compact evidence refs | Keeps large-workspace runs usable without retaining unnecessary duplicate content. |
| Extensibility | Additive registry entries and shared interfaces | Allows new quality checks to be added without rewriting orchestration logic. |

## Pipeline Pattern

The recommended pipeline is:

1. Validate the quality request and artifact refs.
2. Resolve the gate set from the deterministic registry.
3. Build the runner invocation plan.
4. Execute gates in stable order.
5. Collect structured per-gate results and safe summaries.
6. Apply bounded self-correction only when the failure is safely correctable.
7. Run property-based checks with the configured seed and generator family.
8. Shrink failures and retain the minimal counterexample as a regression case.
9. Produce an aggregate summary and bounded evidence bundle.
10. Escalate unresolved blockers to manual review and stop the pipeline.

## Failure and Recovery Pattern

| Condition | Pattern Behavior |
|---|---|
| Blocking gate failure | Fail closed, do not continue automatically. |
| Safe correction candidate exists | Execute bounded correction with a deterministic retry limit. |
| Failure remains unresolved | Emit manual-review item and stop. |
| Optional gate missing | Mark as skipped and include in the summary. |
| Unsafe evidence state | Stop rather than fabricate output. |

## PBT Pattern Design

The PBT pattern uses generator families for:
- quality requests
- gate definitions
- runner plans
- seeds and replay metadata
- failure records
- structured diagnostics

Blocking PBT properties cover:
- deterministic gate ordering
- bounded retry counts
- seed reproducibility
- generator validity
- failure classification stability
- example-based regression retention for shrunk failures

## Security and Privacy Pattern

- Diagnostics are safe-by-default and use reason codes, counts, and trace refs.
- No raw source snippets, secrets, or prompt-like payloads are retained in evidence bundles.
- Manual-review artifacts are limited to display-safe summaries and refs.
- Structured evidence is preferred over mutable console transcripts.

## Traceability Pattern

Every quality run produces:
- a structured run summary
- per-gate result records
- safe trace refs back to the originating artifacts
- bounded evidence bundles
- manual-review items when needed

## Compliance Summary

| Rule | Status | Notes |
|---|---|---|
| SECURITY-05 | Compliant | Quality inputs and artifact refs are schema-validated. |
| SECURITY-10 | Compliant | Runner/test/PBT dependencies remain exact-pinned and allowlisted. |
| SECURITY-13 | Compliant | Evidence and traceability are structured and safe. |
| PBT-01 | Compliant | Determinism, invariants, idempotence, and reproducibility are identified. |
| PBT-03 | Compliant | Ordering, retry bounds, and classification stability are blocking invariants. |
| PBT-04 | Compliant | Self-correction idempotence is modeled. |
| PBT-07 | Compliant | Generator families are domain-specific. |
| PBT-08 | Compliant | Seeds and shrinking are required for reproducibility. |
| PBT-09 | Compliant | fast-check is the selected framework. |
| PBT-10 | Compliant | Regression examples remain alongside PBT. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12 | N/A | This unit does not define deployed stores, network intermediaries, web endpoints, IAM, auth/session flows, infrastructure, or monitoring resources. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not define round-trip codecs, oracle-backed algorithms, or state-machine heavy behavior. |

