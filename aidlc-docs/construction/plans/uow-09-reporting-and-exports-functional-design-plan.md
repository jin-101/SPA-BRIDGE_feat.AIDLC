# Functional Design Plan - UOW-09 Reporting and Exports

## Plan Metadata

- **Unit**: UOW-09 Reporting and Exports
- **Primary Package**: `packages/core-reporting`
- **Primary Story**: US-013 Generate Conversion Reports and Exports
- **Supporting Stories**: US-001, US-003, US-007, US-008, US-009, US-011, US-012
- **Stage**: Functional Design
- **Status**: In Progress

## Objective

Define the business logic for canonical conversion reporting and exports. UOW-09 should aggregate run metadata, diagnostics, traceability, AI-assisted decisions, manual review items, quality results, and generated artifacts into safe machine-readable and human-readable outputs.

## Context Summary

UOW-09 depends on the model, application, and quality units that already exist:

- `packages/core-model` provides shared result, diagnostic, traceability, and report-oriented contracts.
- `packages/core-application` owns conversion run/workspace status and report export use cases.
- `packages/core-quality` produces quality summaries, evidence bundles, PBT outcomes, and manual review items.
- `packages/core-security` defines safe audit and masking expectations that reporting must preserve.
- `packages/cli` and `packages/web` will later consume UOW-09 output.

## Planned Functional Design Work

- [x] Review UOW-09 unit definition, story map, reporting-related user stories, and prior UOW artifacts.
- [x] Define canonical report aggregate and report section boundaries.
- [x] Define report input model for run summary, inventory, transformation, provider, target generation, quality, diagnostics, and traceability data.
- [x] Define report building rules for deterministic ordering, stable IDs, and severity grouping.
- [x] Define export model for JSON, Markdown, and HTML outputs.
- [x] Define sanitized rendering rules for redaction-safe report content.
- [x] Define manual review item grouping and stakeholder summary logic.
- [x] Define quality target summary logic, including the 85 percent conversion quality target.
- [x] Define traceability and provenance rules for source-to-output references.
- [x] Identify functional PBT properties and example-based test scenarios.
- [x] Generate functional design artifacts after answers are provided and validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the canonical report model for UOW-09?

A) A single canonical JSON report composed of stable sections for run metadata, source inventory, conversion output, diagnostics, AI decisions, manual review items, quality results, traceability, and export metadata
B) Separate unrelated report documents per package with no shared canonical model
C) Human-readable Markdown only, with JSON deferred to CLI/Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should report input aggregation behave?

A) Use explicit typed input bundles from application, source analysis, transformation, provider, target generation, quality, and security/audit summaries
B) Read arbitrary workspace files and infer report content heuristically
C) Let each downstream interface assemble its own report independently
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
How should diagnostics and manual review items be grouped?

A) Group by severity, source artifact, generated artifact, requirement/story area, and review category with stable ordering
B) Group only by package name
C) Keep raw chronological order only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
How should quality criteria be represented in the report?

A) Include gate status, self-correction attempts, PBT outcomes, evidence counts, and configured conversion-quality target evaluation
B) Include only pass/fail build status
C) Leave quality details out of the report and require users to read test logs
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How should AI-assisted decisions be recorded?

A) Record provider-neutral decision summaries, confidence/provenance metadata, safe rationale, and policy status without raw prompts or raw source snippets
B) Store raw prompts, raw provider responses, and source snippets for maximum debugging detail
C) Exclude AI-assisted decision data from reports entirely
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should report exports be generated?

A) Generate canonical JSON first, then deterministic Markdown and sanitized HTML views from the canonical model
B) Generate Markdown first and convert it to JSON and HTML
C) Generate only HTML and let CLI/Web UI scrape it
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
How should sensitive data and unsafe content be handled during rendering?

A) Use sanitized rendering helpers that allow safe refs, escaped text, reason codes, and redacted values only
B) Trust upstream packages to sanitize everything and render strings directly
C) Allow raw source snippets in HTML but not JSON
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
How should traceability be surfaced?

A) Every report item that references generated output should include source refs, generated refs, artifact refs, and synthetic origins where applicable
B) Traceability should appear only in a separate debug export
C) Traceability is not needed for the initial report package
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
What report API shape best fits later CLI and Web UI use?

A) A reusable `core-reporting` package with a report builder, export renderers, view-model adapters, validation, and deterministic test utilities
B) A CLI-only report writer with no reusable API
C) A Web UI-only report view model with no export API
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
What should be the blocking PBT focus for this unit?

A) Report serialization round-trip, deterministic section ordering, schema invariants, sanitization idempotence, export stability, and trace coverage
B) Only example-based tests for a few report fixtures
C) PBT is not useful for reporting logic
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Recommended Answers

For this project, option **A** is the recommended answer for all questions. It preserves a single source of truth for reports, keeps CLI/Web UI exports consistent, and satisfies the enabled security and PBT constraints without exposing raw source, prompts, secrets, or unsafe rendered content.

## Content Validation Notes

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown structure uses standard headings, lists, and fenced inline references only.
- All questions include meaningful choices and mandatory `X) Other` options.

## Next Step

After answers are provided, validate completeness and consistency, then generate:

- `aidlc-docs/construction/uow-09-reporting-and-exports/functional-design/business-logic-model.md`
- `aidlc-docs/construction/uow-09-reporting-and-exports/functional-design/business-rules.md`
- `aidlc-docs/construction/uow-09-reporting-and-exports/functional-design/domain-entities.md`
