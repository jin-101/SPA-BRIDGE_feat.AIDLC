# NFR Requirements Plan - UOW-09 Reporting and Exports

## Plan Metadata

- **Unit**: UOW-09 Reporting and Exports
- **Primary Package**: `packages/core-reporting`
- **Stage**: NFR Requirements
- **Status**: In Progress
- **Functional Design Source**: `aidlc-docs/construction/uow-09-reporting-and-exports/functional-design/`

## Objective

Identify non-functional requirements and technology decisions for deterministic, secure, scalable, and reusable report generation and exports.

## Functional Design Inputs

UOW-09 functional design defines:

- canonical JSON report as the single source of truth
- typed report input bundles from prior units
- deterministic diagnostic and manual-review grouping
- quality target evaluation using the 85 percent baseline
- safe AI-assisted decision summaries without raw prompts/source snippets
- JSON, Markdown, and sanitized HTML exports
- PBT properties for round-trip, ordering, invariants, sanitization, export stability, and trace coverage

## Planned NFR Assessment Work

- [x] Review functional design artifacts and prior UOW reporting dependencies.
- [x] Define report generation performance and scalability requirements.
- [x] Define deterministic serialization, ordering, hashing, and replay requirements.
- [x] Define report privacy, sanitization, and unsafe-content rejection requirements.
- [x] Define export format and rendering technology decisions.
- [x] Define maintainability requirements for CLI/Web UI reuse.
- [x] Define reliability and partial-report behavior requirements.
- [x] Define storage, memory, and bounded evidence requirements.
- [x] Define PBT and example-test coverage requirements.
- [x] Generate NFR requirements artifacts after answers are provided and validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the report rendering technology stack?

A) TypeScript-native JSON builder plus custom deterministic Markdown and escaped HTML renderers with no browser/runtime dependency
B) Use a browser DOM renderer for all report exports
C) Use a template engine that accepts raw HTML snippets from report inputs
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
What should be the report generation performance target?

A) Generate reports for 100+ component projects in seconds, with 500+ component projects included in benchmark scope
B) Report generation can take minutes because conversion itself is slower
C) No performance target for reporting
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
How should memory and evidence size be constrained?

A) Use bounded evidence summaries, refs, counts, and lazy export strings; never embed unbounded logs or raw source
B) Store all source snippets, logs, prompts, and rendered exports in memory for easier debugging
C) Leave memory behavior to downstream CLI/Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
What determinism requirements should reporting enforce?

A) Stable section order, item order, IDs, content hashes, generated timestamps by caller control, and byte-stable exports for equivalent inputs
B) Stable JSON only; Markdown and HTML may vary
C) Determinism is not required for reports
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
What privacy requirement should report exports enforce?

A) Reports must reject or sanitize raw prompts, raw provider responses, raw source snippets, secrets, masked originals, unsafe HTML, and absolute paths
B) Reports can include raw snippets if they are useful to reviewers
C) Privacy is handled only by UOW-05, so reporting does not need its own checks
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should report validation failures behave?

A) Fail closed for schema, unsafe content, duplicate IDs, and missing required trace coverage; allow partial reports only for non-fatal safe-section issues
B) Always emit whatever report can be built, even if unsafe fields are present
C) Abort all reporting on any warning-level issue
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
How should report schema evolution be handled?

A) Versioned schema with additive changes, explicit renderer version metadata, and compatibility validation
B) Ad hoc schema changes without versioning until the first public release
C) Separate schema versions for CLI and Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
What maintainability boundary best fits reporting?

A) A reusable `core-reporting` package with report builder, validators, sanitized renderers, view-model adapters, fixtures, and generators
B) Reporting logic embedded in `core-application`
C) Reporting logic duplicated in CLI and Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
What dependency policy should reporting use?

A) Prefer no runtime dependencies beyond existing workspace packages; add exact-pinned dependencies only if a structured sanitizer/serializer is necessary
B) Add broad Markdown/HTML rendering libraries immediately
C) Use remote rendering or SaaS report generation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
What should be the blocking PBT requirement for reporting?

A) Report JSON round-trip, normalization idempotence, deterministic ordering, grouping invariants, sanitization idempotence, export byte stability, and trace coverage
B) Only report JSON round-trip needs PBT
C) Reporting should use example tests only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Recommended Answers

For this project, option **A** is recommended for all questions. It keeps reporting deterministic, safe for sensitive projects, reusable by CLI/Web UI, and aligned with the enabled Security Baseline and Property-Based Testing extensions.

## Content Validation Notes

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown uses standard headings, tables, lists, and inline code only.
- Every question includes meaningful choices and mandatory `X) Other` option.

## Next Step

After answers are provided, validate completeness and consistency, then generate:

- `aidlc-docs/construction/uow-09-reporting-and-exports/nfr-requirements/nfr-requirements.md`
- `aidlc-docs/construction/uow-09-reporting-and-exports/nfr-requirements/tech-stack-decisions.md`
