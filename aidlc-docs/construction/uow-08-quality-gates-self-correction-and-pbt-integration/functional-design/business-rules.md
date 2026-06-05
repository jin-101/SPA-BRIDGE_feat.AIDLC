# UOW-08 Business Rules

## Quality Gate Rules

- The quality pipeline must execute in a deterministic order.
- The default gate order is build, lint, format, unit tests, integration tests, then property-based tests.
- A gate result must be represented as passed, failed, skipped, or blocked.
- A failed blocking gate prevents automatic continuation.
- Gate definitions must be stable for equivalent run inputs.

## Self-Correction Rules

- Self-correction is bounded by an explicit retry limit.
- The correction loop may only reuse safe summaries and approved artifact refs.
- Self-correction must stop when the retry limit is reached, when the failure is not safely correctable, or when the corrected result still fails.
- Self-correction must never invent fixes without evidence from the failing gate.
- Successful correction is idempotent for the same accepted input state.

## Failure Classification Rules

- Blocking failures include compilation failures, invariant violations, and unresolved quality gate failures that prevent trustworthy output.
- Non-blocking warnings are allowed only when the result remains usable and the issue is explicitly recorded.
- Manual-review escalation is required when the pipeline cannot safely continue or when the failure requires human judgment.
- Failure classification must be stable for the same gate outcome and policy input.

## PBT Rules

- PBT applies to conversion-sensitive logic, deterministic summaries, and stable result packing.
- PBT generator families must reflect real domain shapes such as gate definitions, runner inputs, seeds, retry plans, and failure records.
- PBT failures must log the seed and preserve the minimal shrunk counterexample.
- PBT regression cases discovered through shrinking must be retained as example-based tests.
- PBT must complement example-based tests and never replace them for critical paths.

## Tool Execution Rules

- Build, lint, format, unit, integration, and PBT commands must be executed through explicit runner abstractions.
- Runner abstractions must preserve deterministic invocation and safe result capture.
- The unit must not depend on shell-specific behavior that cannot be modeled or replayed.

## Evidence and Traceability Rules

- Every quality result must link back to the originating run and affected artifact refs.
- Safe trace refs are required for evidence packaging.
- Raw console output is not the authoritative record when structured result data is available.
- Sensitive source snippets must not be embedded into quality evidence.

## Stop Conditions

- Stop after the configured retry limit.
- Stop if a blocking failure cannot be corrected safely.
- Stop if the quality result would become non-deterministic due to retry behavior or mutable external state.
- Stop if the pipeline cannot produce safe traceable evidence.

## Output Rules

- Produce a structured run summary for each gate.
- Produce an aggregate summary with durations, statuses, and failure reasons.
- Produce manual-review items when unresolved blockers remain.
- Preserve safe traceability references for reporting.

## PBT and Quality Cross-Checks

- Gate ordering, retry bounds, and failure classification stability are mandatory blocking properties.
- Seed reproducibility and generator validity are mandatory blocking properties.
- Example-based regression coverage remains required for any shrunk PBT failure.

