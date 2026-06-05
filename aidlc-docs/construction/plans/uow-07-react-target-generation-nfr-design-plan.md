# NFR Design Plan - UOW-07 React Target Generation

## Unit Context

- **Unit**: UOW-07 React Target Generation
- **Primary Package(s)**: `packages/target-react`
- **NFR Requirements Status**: Complete
- **Primary Story**: US-002
- **Supporting Stories**: US-005, US-006, US-011, US-013, US-014
- **Dependencies**: UOW-01 Core Model and Ports Foundation, UOW-04 Transformation Rule Engine and Converters, UOW-05 Security, Masking, and Provider Policy, UOW-06 AI Provider Adapters and Refinement

## NFR Design Tasks

- [x] Define fail-closed target generation pipeline pattern.
- [x] Define deterministic strategy registry and strategy selection pattern.
- [x] Define path containment and overwrite conflict guard pattern.
- [x] Define deterministic write-plan builder and content hashing pattern.
- [x] Define dependency allowlist and exact-version manifest pattern.
- [x] Define bounded memory and large-project generation pattern.
- [x] Define safe diagnostic and manual-review preservation pattern.
- [x] Define trace coverage validator and report handoff pattern.
- [x] Define PBT generator families and blocking properties.
- [x] Generate NFR design artifacts after answers are validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
Which generation pipeline pattern should UOW-07 use?

A) A fail-closed staged pipeline: validate request, select strategy, normalize drafts, build write plan, validate safety, then expose write-ready output
B) A best-effort pipeline that writes each generated file as soon as possible
C) A placeholder-only pipeline that skips safety validation until CLI/Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should target strategy selection be designed?

A) Deterministic in-memory strategy registry with stable selection by explicit ID, default marker, priority, and strategy ID
B) Runtime selection by registration order
C) One hardcoded Vite generator with no registry boundary
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
How should path safety and overwrite protection be implemented?

A) A shared `TargetPathGuard` and `OverwriteConflictPolicy` that validate normalized target-relative paths before write-plan approval
B) Inline string checks in each generator
C) Let downstream CLI/Web UI decide whether generated paths are safe
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
How should write-plan determinism be designed?

A) A `WritePlanBuilder` that sorts file specs, assigns stable file refs, computes stable content hashes, and rejects duplicate paths/refs
B) Preserve whatever order draft processing happens to produce
C) Sort only at report generation time
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How should dependency generation be designed?

A) A `DependencyManifestBuilder` with exact-version allowlists keyed by target, routing, and state strategies
B) Copy source project dependencies and remove obvious Angular packages
C) Avoid generating package metadata in UOW-07
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
What bounded-memory pattern should large project generation use?

A) File-spec-first generation with optional lazy content materialization and no unnecessary duplicate full-content retention
B) Keep all intermediate rendered strings and final file contents in memory
C) Defer large-project concerns to UOW-08
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
How should manual-review and partial output be designed?

A) Preserve safe partial output, attach stable manual-review diagnostics, and generate deterministic review stubs only when needed
B) Fail the whole generation whenever a draft is unsupported
C) Drop unsupported drafts silently
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
How should traceability validation be designed?

A) A `TraceCoverageValidator` that requires every generated file to have source draft refs or explicit synthetic origin
B) Traceability handled later by reporting only
C) Trace only component files and ignore scaffold/config files
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
How should first-target ecosystem metadata be represented?

A) Generic additive category metadata for Angular 15, NgRx, routing, forms, i18n, animation/media/map, QR/barcode, and service-worker review categories
B) Hardcoded first target application routes, package names, and page identifiers
C) No ecosystem metadata in target generation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
How should PBT design be incorporated?

A) Provide generator families for target requests, strategy descriptors, draft bundles, file specs, paths, dependency manifests, diagnostics, and traces
B) Keep PBT only for path containment and use examples elsewhere
C) Skip PBT for generator behavior
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved NFR Design Focus

- **Pipeline**: Fail-closed staged generation pipeline.
- **Strategy Selection**: Deterministic in-memory target strategy registry.
- **Path Safety**: Shared `TargetPathGuard` and `OverwriteConflictPolicy`.
- **Write Planning**: `WritePlanBuilder` with stable refs, sorted specs, hashes, and duplicate rejection.
- **Dependency Generation**: `DependencyManifestBuilder` with exact-version allowlists.
- **Scalability**: File-spec-first generation and optional lazy content materialization.
- **Manual Review**: Safe partial output, stable diagnostics, deterministic review stubs when needed.
- **Traceability**: `TraceCoverageValidator` for every generated file.
- **Metadata**: Generic additive ecosystem metadata only.
- **PBT**: Generator families for target requests, strategies, draft bundles, file specs, paths, dependency manifests, diagnostics, and traces.

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Markdown uses plain lists and parse-safe question blocks.
