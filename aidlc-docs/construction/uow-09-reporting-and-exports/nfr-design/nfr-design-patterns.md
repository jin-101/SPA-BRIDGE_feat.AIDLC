# NFR Design Patterns - UOW-09 Reporting and Exports

## Purpose

This document translates UOW-09 NFR requirements into concrete design patterns for deterministic, secure, scalable, and reusable reporting.

## Pattern 1: Fail-Closed Report Generation Pipeline

### Intent

Ensure unsafe or malformed report data cannot be rendered or exported while preserving safe partial evidence when possible.

### Pipeline Stages

| Order | Stage | Responsibility | Failure Behavior |
|---|---|---|---|
| 1 | Input bundle validation | Validate required typed inputs, run metadata, and section shape | Fail closed for malformed required inputs |
| 2 | Safe content guard | Reject raw prompts, raw source snippets, unsafe HTML, secrets, masked originals, and absolute paths | Fail closed for unsafe content |
| 3 | Section normalization | Normalize empty sections, sort items, and derive stable section structure | Safe diagnostics for non-fatal section issues |
| 4 | Canonical report build | Create `CanonicalConversionReport` with stable IDs and caller-controlled timestamp | Fail closed for duplicate IDs or missing required sections |
| 5 | Schema and compatibility validation | Validate schema version, required sections, and additive compatibility | Fail closed for schema errors |
| 6 | Trace coverage validation | Require generated refs to have source refs or synthetic origins | Fail closed for missing required trace coverage |
| 7 | View model projection | Build sanitized view models for Markdown and HTML | Fail closed for unsafe rendered fields |
| 8 | Export rendering | Render JSON, Markdown, and escaped HTML deterministically | Safe diagnostics for renderer failures |
| 9 | Export metadata build | Add renderer version, timestamp, content hashes, and canonical report refs | Fail closed if hashes cannot be produced |

### Design Notes

- Partial reports are allowed only after unsafe fields are rejected or removed.
- Required sections must always be present.
- Report generation must not read arbitrary workspace files.
- Report generation must not unmask or restore sensitive values.

## Pattern 2: Deterministic Canonical Report Builder

### Intent

Produce stable reports and exports for equivalent inputs, making CLI output, Web UI views, snapshots, and PBT replay reliable.

### Design Elements

| Element | Design |
|---|---|
| Section order | Fixed canonical order in the builder |
| Item order | Stable sort by severity, refs, category, story area, and ID |
| IDs | Stable hash or deterministic ID builder from safe refs and item content |
| Timestamps | Provided by caller through build options |
| Hashes | Derived using stable string serialization and Node.js crypto |
| Empty sections | Emitted as empty sections, not omitted |

### Stability Rules

- No hidden `Date.now()` in core report generation.
- No reliance on unbounded object iteration for meaningful output order.
- JSON, Markdown, and HTML exports must be byte-stable for equivalent canonical reports and render options.

## Pattern 3: Versioned Schema Validation

### Intent

Allow CLI, Web UI, and future dashboards to consume one report model safely as it evolves.

### Design Elements

| Element | Design |
|---|---|
| Schema version | Stored on every canonical report |
| Renderer version | Stored in export metadata |
| Compatibility | Additive changes preferred |
| Breaking changes | Require explicit schema version increment |
| Validation | Required sections, known severity values, bounded quality score, unique IDs, safe refs |

### Failure Behavior

- Unknown optional fields are tolerated if they do not affect required rendering.
- Unknown required shape or missing required sections fail closed.
- Duplicate IDs fail closed.

## Pattern 4: Safe Content and Ref Guard

### Intent

Prevent reporting from becoming a leakage path for sensitive source, provider, path, or HTML content.

### Forbidden Content

- raw prompts
- raw provider responses
- raw source snippets
- secrets, tokens, passwords, API keys
- masked original values
- unsafe HTML
- absolute filesystem paths
- traversal-like refs

### Allowed Content

- safe source-relative refs
- safe target-relative refs
- artifact refs
- reason codes
- redacted display values
- bounded counts
- safe summaries
- policy statuses

### Design Notes

- UOW-09 repeats privacy validation even though UOW-05 owns masking and provider policy.
- Rendering uses sanitized view models only.
- Report builders never unmask values.

## Pattern 5: Sanitized Markdown and HTML Rendering

### Intent

Generate human-readable exports that are deterministic and safe for local review.

### Markdown Renderer

- Consumes sanitized view model only.
- Escapes table delimiters and unsafe inline content.
- Uses stable heading and table order.
- Does not embed raw HTML.

### HTML Renderer

- Consumes sanitized view model only.
- Escapes all text content.
- Does not accept raw HTML sections.
- Uses simple deterministic markup.
- Represents links as safe refs rather than arbitrary paths.

### Export Stability

- Equivalent report and render options produce byte-identical Markdown and HTML.
- Renderer version changes are recorded in export metadata.

## Pattern 6: Export Metadata and Integrity

### Intent

Make report exports auditable and comparable across runs.

### Metadata Fields

| Field | Purpose |
|---|---|
| `format` | JSON, Markdown, or HTML |
| `rendererVersion` | Renderer version used |
| `generatedAt` | Caller-controlled export timestamp |
| `contentHash` | Stable hash of rendered content |
| `canonicalReportRef` | Stable reference to canonical report |
| `partial` | Whether export was derived from a partial report |

### Integrity Rules

- Every export gets a content hash.
- Hashes are derived from rendered content after sanitization.
- Export metadata must not contain raw source paths or unsafe content.

## Pattern 7: Bounded Evidence and Lazy Export Materialization

### Intent

Keep reporting scalable for large projects while preserving useful stakeholder evidence.

### Design Elements

| Element | Design |
|---|---|
| Evidence | Store counts, refs, hashes, safe summaries, and bounded snippets only when explicitly safe |
| Logs | Store log refs and summary counts, not full logs |
| Source | Store source refs, not source bodies |
| Provider data | Store safe decision summaries, not prompts or responses |
| Exports | Materialize export strings on demand where API design allows |

### Scalability Notes

- 100+ component reports must generate in seconds.
- 500+ component reports are benchmark scope.
- Grouping should avoid avoidable quadratic behavior.

## Pattern 8: Partial Report Safety

### Intent

Allow useful reports for incomplete conversions without weakening privacy or schema guarantees.

### Rules

- Partial status must be explicit.
- Required sections still exist.
- Unsafe sections are not rendered.
- Safe diagnostics explain omitted or partial sections.
- Missing required trace coverage remains blocking.
- Unsafe raw fields are never allowed because a report is partial.

## Pattern 9: PBT-Backed Reporting Properties

### Intent

Use property-based tests to cover report behavior that is sensitive to ordering, normalization, schema, sanitization, and export stability.

### Required Properties

| Property | Requirement |
|---|---|
| JSON round-trip | Canonical report survives serialization/deserialization |
| Normalization idempotence | Normalizing normalized input is stable |
| Grouping invariants | Grouping preserves diagnostic and review item counts |
| Ordering determinism | Equivalent input produces equivalent section and item order |
| Sanitization idempotence | Safe values remain stable after repeated sanitization |
| Export byte stability | Equivalent reports render byte-identical exports |
| Trace coverage | Generated refs have source refs or synthetic origins |

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Safe diagnostics and metadata avoid raw logs or sensitive output. |
| SECURITY-05 | Compliant | Input bundle, schema, ref, and safe-content validators protect report generation inputs. |
| SECURITY-10 | Compliant | The design prefers no new runtime dependencies and requires exact-pinned additions if needed. |
| SECURITY-11 | Compliant | Validation, sanitization, trace coverage, and fail-closed behavior provide layered controls. |
| SECURITY-13 | Compliant | Schema validation and export content hashes support artifact integrity. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Reporting properties are identified and carried into design. |
| PBT-02 | Compliant | Canonical JSON round-trip is required. |
| PBT-03 | Compliant | Grouping and trace coverage invariants are required. |
| PBT-04 | Compliant | Normalization and sanitization idempotence are required. |
| PBT-07 | Compliant | Generator families are required for report inputs and unsafe-content cases. |
| PBT-08 | Compliant | Existing fast-check shrinking and seed replay remain part of the package test strategy. |
| PBT-09 | Compliant | fast-check remains the selected TypeScript PBT framework. |
| PBT-10 | Compliant | Example-based rendering and rejection tests complement PBT. |
