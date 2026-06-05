# NFR Requirements Plan - UOW-07 React Target Generation

## Unit Context

- **Unit**: UOW-07 React Target Generation
- **Primary Package(s)**: `packages/target-react`
- **Functional Design Status**: Complete
- **Primary Story**: US-002
- **Supporting Stories**: US-005, US-006, US-011, US-013, US-014
- **Dependencies**: UOW-01 Core Model and Ports Foundation, UOW-04 Transformation Rule Engine and Converters, UOW-05 Security, Masking, and Provider Policy, UOW-06 AI Provider Adapters and Refinement

## NFR Assessment Tasks

- [x] Define target generation performance requirements for 100+ and 500+ component projects.
- [x] Define scalability requirements for write-plan size, generated file count, and memory usage.
- [x] Define deterministic output and idempotent regeneration requirements.
- [x] Define path safety, overwrite safety, and dependency allowlist requirements.
- [x] Define maintainability requirements for target strategy extension.
- [x] Define reliability requirements for partial generation and manual-review output.
- [x] Define compatibility requirements for React 18, Vite, TypeScript, React Router, Redux Toolkit, and Zustand.
- [x] Define PBT and example-based test requirements.
- [x] Define audit/reporting handoff requirements without raw sensitive leakage.
- [x] Generate NFR requirements artifacts after answers are validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What target dependency policy should UOW-07 follow?

A) Generate only allowlisted React target dependencies with exact versions for React, React DOM, Vite, TypeScript, React Router, and selected state libraries
B) Copy Angular project dependencies into the generated React project and let users clean them up later
C) Generate no dependencies and leave package metadata empty
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
What performance target should apply to write-plan generation?

A) Generate deterministic write plans for 100+ component projects within seconds and define 500+ component projects as benchmark scope
B) No explicit performance target until UOW-08 quality gates
C) Optimize only final file writing, not write-plan construction
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
How should memory/scalability requirements be defined?

A) Keep generation bounded by draft metadata and file specs; avoid retaining unnecessary duplicate full content for large projects
B) Keep every draft, intermediate string, and generated file content in memory for simplicity
C) Limit supported projects to 100 components and warn above that size
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
What determinism requirement should UOW-07 enforce?

A) Stable strategy selection, file ordering, file refs, content hashes, dependency ordering, diagnostics, and traces
B) Stable file ordering only; diagnostics may vary
C) Determinism handled later by reporting
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How strict should path and overwrite safety be?

A) Enforce target root containment, traversal rejection, preserve-by-default writes, and explicit overwrite policy
B) Only reject absolute paths and allow overwrites
C) Trust caller-provided output paths
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should generated diagnostics protect sensitive information?

A) Diagnostics and write plans use safe refs, target-relative paths, reason codes, and counts; raw source snippets are forbidden
B) Short raw snippets are allowed in diagnostics for easier debugging
C) Diagnostics can include raw draft/source fields because target generation does not call providers
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
What maintainability requirement should target strategies follow?

A) Strategy registry and shared generator interfaces with Vite React TypeScript as the first strategy
B) Single hardcoded generator until another target is requested
C) Separate unrelated generator APIs for each target project type
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
What reliability behavior should apply to unsupported drafts?

A) Preserve partial output where safe, emit manual-review diagnostics, and block only unsafe paths, invalid schemas, or corrupted write plans
B) Fail the whole generation on any unsupported draft
C) Ignore unsupported drafts silently
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
What PBT coverage should be blocking for this unit?

A) Write-plan determinism, path containment, idempotent generation, dependency selection stability, diagnostic stability, and trace coverage
B) Path containment only
C) Example-based tests only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
How should first target application ecosystem concerns influence UOW-07?

A) Keep generator generic, but include strategy metadata for Angular 15, NgRx-derived state, routing, forms, i18n, animation/media/map assets, QR/barcode, and service-worker review categories
B) Hardcode first target application package names and routes into the generator
C) Exclude ecosystem metadata from target generation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved NFR Requirements Focus

- **Dependency Policy**: Exact-pinned allowlisted target dependencies only.
- **Performance**: 100+ component write-plan generation within seconds; 500+ component projects included in benchmark scope.
- **Scalability**: Bounded draft metadata and file spec processing without unnecessary duplicate full-content retention.
- **Determinism**: Stable strategy selection, ordering, refs, hashes, dependencies, diagnostics, and traces.
- **Security**: Target root containment, traversal rejection, preserve-by-default writes, explicit overwrite policy, and raw snippet exclusion.
- **Maintainability**: Strategy registry and shared generator interfaces.
- **Reliability**: Partial safe output with manual-review diagnostics; block unsafe paths, invalid schemas, and corrupted write plans.
- **PBT**: Write-plan determinism, path containment, idempotence, dependency stability, diagnostic stability, and trace coverage.
- **Target Compatibility**: Generic ecosystem metadata for Angular 15, NgRx, routing, forms, i18n, animation/media/map assets, QR/barcode, and service-worker review categories.

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Markdown uses plain lists and parse-safe question blocks.
