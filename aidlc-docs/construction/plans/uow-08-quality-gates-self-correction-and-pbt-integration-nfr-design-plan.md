# NFR Design Plan - UOW-08 Quality Gates, Self-Correction, and PBT Integration

## Unit Context

- **Unit**: UOW-08 Quality Gates, Self-Correction, and PBT Integration
- **Primary Package(s)**: `packages/core-quality`
- **NFR Requirements Status**: Complete
- **Primary Story**: US-011
- **Supporting Stories**: US-005, US-006, US-007, US-009, US-012, US-013
- **Dependencies**: UOW-01 Core Model and Ports Foundation, UOW-04 Transformation Rule Engine and Converters, UOW-05 Security, Masking, and Provider Policy, UOW-06 AI Provider Adapters and Refinement, UOW-07 React Target Generation

## NFR Design Tasks

- [x] Define fail-closed quality gate pipeline patterns.
- [x] Define deterministic gate registry and runner orchestration patterns.
- [x] Define bounded self-correction and manual-review escalation patterns.
- [x] Define safe diagnostics, evidence bundling, and trace retention patterns.
- [x] Define reproducible seed and PBT replay patterns.
- [x] Define bounded scalability patterns for large workspaces and evidence bundles.
- [x] Define shared logical components for gate execution, correction, reporting, and PBT.
- [x] Define maintainable extension points for new quality checks.
- [x] Define PBT generator families and blocking property design.
- [x] Generate NFR design artifacts after answers are validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the core resilience pattern for UOW-08?

A) A fail-closed ordered pipeline with bounded self-correction, safe summaries, and manual-review escalation for unresolved blockers
B) Best-effort execution that continues through failures whenever possible
C) Fail-fast behavior that aborts all quality work on any non-passing gate
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should the gate registry and runner orchestration be designed?

A) Use a deterministic in-memory gate registry with explicit runner adapters and stable selection by gate ID and priority
B) Let each caller choose runners independently without a shared registry
C) Hardcode a single runner path for all quality checks
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
What bounded self-correction pattern should be used?

A) A correction planner with explicit retry limits, safe correction candidates, and deterministic stop conditions
B) Retry until the run passes with no upper bound
C) Skip self-correction entirely and only report failures
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
How should safe diagnostics and evidence be structured?

A) Use safe diagnostics, reason codes, structured summaries, and bounded evidence bundles with trace refs only
B) Store raw command transcripts and source excerpts for easier debugging
C) Emit only a final pass/fail flag with no supporting evidence
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How should reproducibility and PBT replay be designed?

A) Record seeds, stable generator families, and replay paths for failures so property-based results are reproducible
B) Reproducibility is optional and handled manually after failures
C) Only example-based regression tests need replay support
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
What scalability pattern should UOW-08 follow?

A) Keep orchestration bounded for 100+ component workspaces and make 500+ component runs benchmark scope
B) Optimize only small workspaces and defer large cases to future work
C) Duplicate all intermediate command output in memory for simplicity
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
What logical components best fit this unit?

A) Gate registry, runner adapter layer, self-correction planner, evidence aggregator, PBT coordinator, and escalation coordinator
B) A single monolithic quality service with inline command execution
C) Separate unrelated scripts for each check type with no shared abstractions
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
How should maintainable extension points be designed?

A) Additive registry entries and shared interfaces for new checks, without hardcoding UOW-specific report UI behavior
B) Modify core orchestration logic directly whenever a new check is added
C) Keep the system closed to new checks after initial release
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
What PBT design should be blocking for this unit?

A) Deterministic gate ordering, retry bounds, seed reproducibility, generator validity, failure classification stability, and regression retention
B) Only example-based tests for the orchestration layer
C) Only path containment properties
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
How should first-class quality reporting integration behave?

A) Produce structured run summaries and manual-review items that downstream reporting can consume without leaking sensitive data
B) Push raw logs directly into reporting and let the UI sanitize them
C) Keep quality output internal and do not expose any report-friendly artifacts
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved NFR Design Focus

- **Resilience**: Fail-closed ordered pipeline with bounded self-correction and manual-review escalation.
- **Orchestration**: Deterministic in-memory gate registry with explicit runner adapters.
- **Correction**: Retry-limited correction planner with safe candidates and deterministic stop conditions.
- **Diagnostics**: Safe diagnostics, reason codes, and bounded evidence bundles with trace refs.
- **Reproducibility**: Seeds, stable generator families, and replay paths for PBT failures.
- **Scalability**: Bounded orchestration for 100+ component workspaces and benchmark scope for 500+.
- **Components**: Gate registry, runner adapter, self-correction planner, evidence aggregator, PBT coordinator, escalation coordinator.
- **Extensibility**: Additive registry entries and shared interfaces only.
- **Blocking PBT**: Deterministic ordering, retry bounds, seed reproducibility, generator validity, failure classification stability, and regression retention.
- **Reporting**: Structured run summaries and safe manual-review items for downstream consumers.
