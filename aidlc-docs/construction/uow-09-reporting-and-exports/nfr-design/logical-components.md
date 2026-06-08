# Logical Components - UOW-09 Reporting and Exports

## Component Overview

`packages/core-reporting` is organized around a deterministic report pipeline. Each component owns one clear responsibility so CLI and Web UI can consume the same canonical report and derived exports.

## Components

| Component | Responsibility | Key Inputs | Key Outputs |
|---|---|---|---|
| `ReportInputValidator` | Validate typed report input bundles and required metadata | `ReportInputBundle` | validation result |
| `ReportSafeContentGuard` | Reject raw prompts, raw source, unsafe HTML, secrets, masked originals, and unsafe paths | report input sections | safe-content result |
| `ReportRefValidator` | Validate source-relative, target-relative, and artifact refs | source/generated/artifact refs | ref validation result |
| `ReportSectionNormalizer` | Normalize required sections, empty sections, and stable item ordering | validated input bundle | normalized sections |
| `ReportGroupingService` | Group diagnostics and manual review items by severity, refs, story area, and category | diagnostics, review items | review groups |
| `QualityReportSummaryBuilder` | Build quality target evaluation and bounded quality summaries | quality inputs, target options | quality section |
| `TraceCoverageValidator` | Ensure generated refs have source refs or synthetic origins | traceability section | coverage result |
| `CanonicalReportBuilder` | Build canonical report with stable IDs, section order, and caller timestamp | normalized sections, options | canonical report |
| `ReportSchemaValidator` | Validate schema version, required sections, IDs, and compatibility | canonical report | schema validation result |
| `ReportViewModelBuilder` | Project canonical report into sanitized render view models | canonical report | view model |
| `MarkdownReportRenderer` | Render deterministic sanitized Markdown | view model | Markdown export |
| `HtmlReportRenderer` | Render deterministic escaped HTML | view model | HTML export |
| `JsonReportSerializer` | Serialize canonical JSON deterministically | canonical report | JSON export |
| `ReportExportMetadataBuilder` | Build export metadata and content hashes | rendered exports, options | export metadata |
| `ReportGenerationService` | Orchestrate the fail-closed reporting pipeline | report request | report/export result |
| `ReportGenerators` | Provide fast-check generators for report PBT | generator config | generated report cases |

## Public API Shape

### ReportGenerationService

Primary package facade for consumers.

Responsibilities:

- validate input bundle
- build canonical report
- render requested exports
- attach export metadata
- return safe diagnostics

Expected API shape:

```typescript
generateConversionReport(request: ReportGenerationRequest): Result<ReportGenerationResult, ReportError>
```

### CanonicalReportBuilder

Builds the canonical report object only after validation and normalization.

Responsibilities:

- stable section order
- stable report ID
- stable item IDs
- caller-controlled timestamps
- empty required sections

### ReportExportRenderers

Rendering is split by format:

- `JsonReportSerializer`
- `MarkdownReportRenderer`
- `HtmlReportRenderer`

All renderers consume only canonical report or sanitized view models. No renderer reads arbitrary files.

## Component Interactions

| Step | Component | Next Component |
|---|---|---|
| 1 | `ReportGenerationService` | `ReportInputValidator` |
| 2 | `ReportInputValidator` | `ReportSafeContentGuard` |
| 3 | `ReportSafeContentGuard` | `ReportRefValidator` |
| 4 | `ReportRefValidator` | `ReportSectionNormalizer` |
| 5 | `ReportSectionNormalizer` | `ReportGroupingService` |
| 6 | `ReportGroupingService` | `QualityReportSummaryBuilder` |
| 7 | `QualityReportSummaryBuilder` | `TraceCoverageValidator` |
| 8 | `TraceCoverageValidator` | `CanonicalReportBuilder` |
| 9 | `CanonicalReportBuilder` | `ReportSchemaValidator` |
| 10 | `ReportSchemaValidator` | `ReportViewModelBuilder` |
| 11 | `ReportViewModelBuilder` | renderers |
| 12 | renderers | `ReportExportMetadataBuilder` |

## Error Model

| Error Category | Source Component | Behavior |
|---|---|---|
| Invalid input | `ReportInputValidator` | fail closed |
| Unsafe content | `ReportSafeContentGuard` | fail closed for affected report |
| Unsafe refs | `ReportRefValidator` | fail closed |
| Duplicate IDs | `CanonicalReportBuilder` or `ReportSchemaValidator` | fail closed |
| Missing trace coverage | `TraceCoverageValidator` | fail closed |
| Non-fatal safe section issue | `ReportSectionNormalizer` | partial report with safe diagnostics |
| Renderer issue | Markdown/HTML renderer | safe diagnostic; export omitted if unsafe |

## Package Directory Plan

| Directory | Purpose |
|---|---|
| `src/types` | Public report, section, export, and error types |
| `src/validation` | Input, schema, safe-content, and ref validators |
| `src/normalization` | Section normalization and stable sorting |
| `src/grouping` | Diagnostic and review grouping |
| `src/quality` | Quality section and target summary builder |
| `src/traceability` | Trace coverage validator |
| `src/builder` | Canonical report builder |
| `src/view-model` | Sanitized report view model builder |
| `src/renderers` | JSON, Markdown, and HTML renderers |
| `src/export` | Export metadata and hash builder |
| `src/generation` | Report generation facade |
| `src/testing` | fast-check generators and fixtures |
| `tests` | Example-based and property-based tests |

## Data Contracts

| Contract | Owner | Notes |
|---|---|---|
| `ReportGenerationRequest` | `core-reporting` | Includes input bundle, build options, and requested export formats |
| `CanonicalConversionReport` | `core-reporting` | Versioned report aggregate |
| `ReportExportSet` | `core-reporting` | JSON/Markdown/HTML exports plus metadata |
| `ReportDiagnostic` | `core-reporting` | Safe reporting diagnostics |
| `ReportViewModel` | `core-reporting` | Sanitized model for CLI/Web UI and renderers |
| `ReportError` | `core-reporting` | Safe structured error object |

## Dependency Boundaries

Allowed:

- `@spa-bridge/core-model`
- existing workspace package type contracts where needed
- Node.js built-ins such as `node:crypto`
- dev dependencies already used by the workspace, including Vitest and fast-check

Avoided:

- browser DOM renderers
- remote report generation
- broad template/rendering libraries by default
- any renderer that accepts raw HTML snippets from inputs

## PBT Generator Families

| Generator Family | Purpose |
|---|---|
| report input bundles | validate end-to-end report generation properties |
| canonical reports | test serialization, schema, renderers, and export metadata |
| diagnostics | test grouping invariants and stable severity ordering |
| manual review items | test grouping and trace refs |
| AI-assisted decisions | test safe summaries and forbidden raw fields |
| traceability links | test trace coverage |
| render options | test byte-stable exports |
| unsafe-content cases | test fail-closed privacy behavior |
| safe refs | test ref validation and path safety |

## Example Test Families

- successful report generation with all sections
- partial report with safe diagnostics
- unsafe raw prompt rejection
- unsafe absolute path rejection
- deterministic Markdown rendering
- deterministic HTML escaping
- quality target pass and fail
- trace coverage failure

## Design Constraints

- Application code belongs in `packages/core-reporting`, not `aidlc-docs`.
- Documentation belongs in `aidlc-docs`.
- Reports do not execute conversion, quality gates, or provider calls.
- Reports do not unmask sensitive values.
- Report output must remain useful without exposing raw customer code.
