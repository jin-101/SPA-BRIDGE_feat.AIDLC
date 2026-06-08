# Code Generation Plan - UOW-09 Reporting and Exports

## Plan Metadata

- **Unit**: UOW-09 Reporting and Exports
- **Primary Package**: `packages/core-reporting`
- **Stage**: Code Generation
- **Status**: Pending Approval
- **Primary Story**: US-013 Generate Conversion Reports and Exports
- **Supporting Stories**: US-001, US-003, US-007, US-008, US-009, US-011, US-012

## Objective

Generate the reusable `@spa-bridge/core-reporting` workspace package that builds canonical conversion reports and deterministic JSON, Markdown, and sanitized HTML exports for later CLI and Web UI units.

## Unit Context

UOW-09 owns reporting and export business logic. It must not run conversions, quality gates, providers, or UI workflows. It consumes typed, safe input bundles and emits canonical report/export artifacts.

### Dependencies

| Dependency | Use |
|---|---|
| `@spa-bridge/core-model` | Shared `Result`, validation, diagnostics, traceability, redaction-safe values, and existing report contracts |
| Node.js `node:crypto` | Stable content hashes |
| Vitest | Example-based tests |
| fast-check | Property-based tests |

### Public Package Boundary

`@spa-bridge/core-reporting` should expose:

- report/domain types
- report input validation
- safe content and ref validation
- section normalization
- diagnostic/manual-review grouping
- quality report summary builder
- trace coverage validation
- canonical report builder
- schema validator
- sanitized view-model builder
- JSON, Markdown, and HTML renderers
- export metadata builder
- `generateConversionReport` facade
- fast-check generators for report PBT

## Story Traceability

| Story | Coverage in This Plan |
|---|---|
| US-013 | Canonical reports, machine-readable/human-readable exports, quality status, traceability, manual review items |
| US-001 | Report output includes run ID and correlation ID for CLI/Web UI start workflows |
| US-003 | Source inventory and source diagnostics section support |
| US-007 | Provider-neutral AI-assisted decision summaries |
| US-008 | Manual review groupings and view-model support for Web UI review |
| US-009 | No raw sensitive values, prompts, source snippets, or masked originals |
| US-011 | Quality gate, PBT, evidence, and self-correction summary support |
| US-012 | PBT generator and property coverage for reporting-sensitive logic |

## Generation Steps

### Step 1: Package Scaffold

- [x] Create `packages/core-reporting/package.json`.
- [x] Create `packages/core-reporting/tsconfig.json`.
- [x] Create `packages/core-reporting/src/index.ts`.
- [x] Align package scripts and compiler options with existing workspace packages.

### Step 2: Shared Types and Error Model

- [x] Create `packages/core-reporting/src/types.ts`.
- [x] Create `packages/core-reporting/src/shared-errors.ts`.
- [x] Define canonical report, input bundle, section, diagnostic, review, AI decision, quality, traceability, export, request, result, and error types.
- [x] Include schema and renderer version fields in relevant types.

### Step 3: Validation Layer

- [x] Create `packages/core-reporting/src/validation/report-input-validator.ts`.
- [x] Create `packages/core-reporting/src/validation/report-safe-content-guard.ts`.
- [x] Create `packages/core-reporting/src/validation/report-ref-validator.ts`.
- [x] Create `packages/core-reporting/src/validation/report-schema-validator.ts`.
- [x] Enforce required sections, safe refs, forbidden raw content, unique IDs, bounded quality scores, and version compatibility.

### Step 4: Normalization and Grouping

- [x] Create `packages/core-reporting/src/normalization/report-section-normalizer.ts`.
- [x] Create `packages/core-reporting/src/grouping/report-grouping-service.ts`.
- [x] Implement stable section defaults, stable sorting, severity precedence, diagnostic grouping, and manual review grouping.

### Step 5: Quality and Traceability Components

- [x] Create `packages/core-reporting/src/quality/quality-report-summary-builder.ts`.
- [x] Create `packages/core-reporting/src/traceability/trace-coverage-validator.ts`.
- [x] Implement 85 percent default quality target evaluation, bounded evidence summaries, and generated-ref coverage checks.

### Step 6: Canonical Report Builder

- [x] Create `packages/core-reporting/src/builder/canonical-report-builder.ts`.
- [x] Build stable canonical reports from normalized sections.
- [x] Use caller-controlled timestamps and stable IDs.
- [x] Keep required sections present even when empty.

### Step 7: Sanitized View Model

- [x] Create `packages/core-reporting/src/view-model/report-view-model-builder.ts`.
- [x] Project canonical reports into renderer-safe summaries.
- [x] Preserve stable grouping and safe refs for CLI/Web UI reuse.

### Step 8: Export Renderers

- [x] Create `packages/core-reporting/src/renderers/json-report-serializer.ts`.
- [x] Create `packages/core-reporting/src/renderers/markdown-report-renderer.ts`.
- [x] Create `packages/core-reporting/src/renderers/html-report-renderer.ts`.
- [x] Render deterministic JSON, Markdown, and escaped HTML.
- [x] Reject raw HTML and unsafe content before rendering.

### Step 9: Export Metadata and Hashing

- [x] Create `packages/core-reporting/src/export/report-export-metadata-builder.ts`.
- [x] Implement content hashes, renderer version metadata, export format metadata, canonical report refs, and caller-controlled export timestamps.

### Step 10: Report Generation Facade

- [x] Create `packages/core-reporting/src/generation/report-generation-service.ts`.
- [x] Orchestrate the fail-closed staged pipeline.
- [x] Support partial report behavior only for safe non-fatal section issues.
- [x] Return safe diagnostics and structured `Result` objects.

### Step 11: Test Utilities and PBT Generators

- [x] Create `packages/core-reporting/src/testing/generators.ts`.
- [x] Provide fast-check generators for report inputs, canonical reports, diagnostics, review items, AI decisions, traceability links, render options, safe refs, and unsafe-content cases.

### Step 12: Unit and Property-Based Tests

- [x] Create `packages/core-reporting/tests/core-reporting.test.ts`.
- [x] Cover successful report generation, partial report behavior, unsafe content rejection, absolute path rejection, deterministic Markdown/HTML rendering, quality target pass/fail, export metadata, and trace coverage failure.
- [x] Cover PBT properties for JSON round-trip, normalization idempotence, grouping invariants, deterministic ordering, sanitization idempotence, export byte stability, and trace coverage.

### Step 13: Workspace Integration

- [x] Update root `package.json` build script to include `@spa-bridge/core-reporting`.
- [x] Update root `package.json` test script to include `@spa-bridge/core-reporting`.
- [x] Ensure no runtime dependencies are added unless necessary.

### Step 14: Verification

- [x] Run `npm run build --workspace @spa-bridge/core-reporting`.
- [x] Run `npm run test --workspace @spa-bridge/core-reporting`.
- [x] Run `npm run build`.
- [x] Run `npm run test`.

### Step 15: Code Documentation

- [x] Create `aidlc-docs/construction/uow-09-reporting-and-exports/code/summary.md`.
- [x] Create `aidlc-docs/construction/uow-09-reporting-and-exports/code/artifact-index.md`.
- [x] Summarize generated application code, tests, and verification results.

### Step 16: Completion Review

- [x] Confirm every generation step is checked.
- [x] Confirm UOW-09 story coverage is implemented.
- [x] Confirm Security Baseline and PBT extension findings are non-blocking.
- [x] Move AI-DLC state to UOW-09 Code Generation Review.

## Expected Application Code Paths

- `packages/core-reporting/package.json`
- `packages/core-reporting/tsconfig.json`
- `packages/core-reporting/src/index.ts`
- `packages/core-reporting/src/types.ts`
- `packages/core-reporting/src/shared-errors.ts`
- `packages/core-reporting/src/validation/`
- `packages/core-reporting/src/normalization/`
- `packages/core-reporting/src/grouping/`
- `packages/core-reporting/src/quality/`
- `packages/core-reporting/src/traceability/`
- `packages/core-reporting/src/builder/`
- `packages/core-reporting/src/view-model/`
- `packages/core-reporting/src/renderers/`
- `packages/core-reporting/src/export/`
- `packages/core-reporting/src/generation/`
- `packages/core-reporting/src/testing/`
- `packages/core-reporting/tests/core-reporting.test.ts`

## Expected Documentation Paths

- `aidlc-docs/construction/uow-09-reporting-and-exports/code/summary.md`
- `aidlc-docs/construction/uow-09-reporting-and-exports/code/artifact-index.md`

## Approval Gate

This plan is the single source of truth for UOW-09 Code Generation. Code generation must not begin until this plan is explicitly approved.
