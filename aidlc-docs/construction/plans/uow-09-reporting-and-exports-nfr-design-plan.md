# NFR Design Plan - UOW-09 Reporting and Exports

## Plan Metadata

- **Unit**: UOW-09 Reporting and Exports
- **Primary Package**: `packages/core-reporting`
- **Stage**: NFR Design
- **Status**: In Progress
- **NFR Requirements Source**: `aidlc-docs/construction/uow-09-reporting-and-exports/nfr-requirements/`

## Objective

Translate UOW-09 NFR requirements into concrete design patterns and logical components for deterministic, secure, scalable, and reusable report generation.

## NFR Inputs

UOW-09 NFR Requirements define:

- TypeScript-native canonical JSON builder and deterministic Markdown/HTML renderers.
- Seconds-level report generation for 100+ component projects, with 500+ component benchmark scope.
- Bounded evidence summaries and no raw source, prompt, provider response, or unbounded logs.
- Stable ordering, stable IDs, stable content hashes, caller-controlled timestamps, and byte-stable exports.
- Fail-closed validation for unsafe content, duplicate IDs, schema errors, and missing required trace coverage.
- Versioned schema and renderer metadata.
- Blocking PBT for round-trip, idempotence, determinism, grouping invariants, export stability, and trace coverage.

## Planned NFR Design Work

- [x] Review UOW-09 NFR requirements and tech stack decisions.
- [x] Define fail-closed report generation pipeline.
- [x] Define deterministic canonical report builder pattern.
- [x] Define schema validation and version compatibility pattern.
- [x] Define safe content guard and ref validation pattern.
- [x] Define sanitized Markdown and HTML renderer patterns.
- [x] Define export metadata and content hash pattern.
- [x] Define bounded evidence and lazy export materialization pattern.
- [x] Define logical component boundaries for `core-reporting`.
- [x] Define PBT generator families and property coverage.
- [x] Generate NFR design artifacts after answers are provided and validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What report generation pipeline pattern should UOW-09 use?

A) A fail-closed staged pipeline: validate input bundle, normalize sections, build canonical report, validate trace/security/schema, render exports, then hash exports
B) A best-effort renderer that emits whatever sections are available
C) A renderer-only pipeline that skips canonical report validation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should deterministic report building be designed?

A) A `CanonicalReportBuilder` with stable section order, stable item sorting, caller-controlled timestamps, stable IDs, and content-hash support
B) Let each section builder decide its own ordering and timestamps
C) Rely on JavaScript object insertion order without explicit rules
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
How should schema validation and evolution be implemented?

A) A `ReportSchemaValidator` with explicit schema version, additive compatibility checks, required-section validation, and renderer version metadata
B) Validate only at TypeScript compile time
C) Defer schema versioning until CLI/Web UI implementation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
What security component boundary should enforce privacy?

A) A shared `ReportSafeContentGuard` and `ReportRefValidator` that reject raw prompts, raw source, unsafe HTML, secrets, masked originals, and unsafe paths before rendering
B) Trust UOW-05 and upstream packages completely
C) Add checks only in the HTML renderer
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How should Markdown and HTML rendering be designed?

A) Deterministic renderers that consume sanitized view models, escape text, reject raw HTML, and preserve byte-stable output
B) Template files that allow raw HTML injection for flexibility
C) Browser-based rendering through a DOM library
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should export metadata and integrity be represented?

A) A dedicated `ReportExportMetadataBuilder` that records format, renderer version, generated timestamp, content hash, and canonical report ref
B) Only include file names for generated exports
C) Put export metadata only in CLI output
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
What bounded scalability pattern best fits report evidence?

A) Evidence summary and ref-first model with bounded counts, optional lazy export materialization, and no embedded unbounded logs
B) Keep all logs and source snippets inside the canonical report for complete detail
C) Leave evidence handling to future Web UI work
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
What logical component boundary is most appropriate?

A) Dedicated `core-reporting` components for input validation, normalization, report building, grouping, quality summary, trace validation, safe rendering, export metadata, and test generators
B) One large report generation function
C) Split report generation between CLI and Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
How should partial report behavior be designed?

A) Partial reports are allowed only after unsafe fields are removed/rejected, required sections exist, and partial status plus safe diagnostics are recorded
B) Partial reports can include unsafe raw fields if marked as partial
C) Any non-fatal issue should abort report generation entirely
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
How should PBT design be incorporated?

A) Provide generator families and properties for report inputs, canonical reports, diagnostics, review items, traces, render options, exports, and unsafe-content cases
B) Keep PBT only for JSON serialization
C) Skip PBT for renderers and rely on snapshots
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Recommended Answers

For this project, option **A** is recommended for all questions. It gives UOW-09 a deterministic reporting pipeline, explicit schema/security gates, reusable renderers for CLI/Web UI, bounded evidence behavior, and the PBT coverage needed for report-sensitive logic.

## Content Validation Notes

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown uses standard headings, lists, tables, and inline code only.
- Every question includes meaningful choices and mandatory `X) Other` option.

## Next Step

After answers are provided, validate completeness and consistency, then generate:

- `aidlc-docs/construction/uow-09-reporting-and-exports/nfr-design/nfr-design-patterns.md`
- `aidlc-docs/construction/uow-09-reporting-and-exports/nfr-design/logical-components.md`
