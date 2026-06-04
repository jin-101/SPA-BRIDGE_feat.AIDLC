# UOW-01 Logical Components

## Component Overview

UOW-01 includes both artifact-specific components and cross-cutting utilities.

| Component | Responsibility | Directory |
|---|---|---|
| IR Schema Component | Zod schemas and inferred types for Core IR. | `src/ir` |
| Diagnostics Component | Diagnostic schemas, severity model, tags, and blocker rules. | `src/diagnostics` |
| Traceability Component | Trace map schemas, trace links, refs, and derived index builders. | `src/traceability` |
| Report Schema Component | Canonical conversion report schema and report-safe field types. | `src/report` |
| Manifest Schema Component | Run manifest schema and artifact refs. | `src/manifest` |
| Mask Token Component | Mask token and token map schemas. | `src/masking` |
| Port Contract Component | File, artifact, tool, LLM, report exporter, logger/audit, clock, randomness ports. | `src/ports` |
| Result Component | Minimal Result union and constructors. | `src/result` |
| Validation Component | Validation helpers and typed validation errors. | `src/validation` |
| Migration Component | Versioned migration registries and migration errors. | `src/migration` |
| Redaction Component | Branded safe display/redacted string schemas and helpers. | `src/redaction` |
| PBT Generator Component | Exported domain-specific fast-check generators. | `src/testing/generators` |

## Package Organization

Recommended directories:

| Directory | Contents |
|---|---|
| `src/ir` | IR schemas, inferred types, IR refs, extension slot types. |
| `src/report` | Conversion report schemas, report sections, AI decision records, manual review state. |
| `src/diagnostics` | Diagnostic schema, severity enum, diagnostic tags, blocker helpers. |
| `src/traceability` | Source/IR/generated refs, trace links, trace maps, index builders. |
| `src/manifest` | Run manifest schema, artifact refs, status models. |
| `src/masking` | Mask token and token map model types. |
| `src/ports` | Port interfaces and port error types. |
| `src/result` | Minimal Result type and basic constructors. |
| `src/validation` | Zod validation wrappers, validation errors, schema registry helpers. |
| `src/migration` | Migration registries and migration functions. |
| `src/redaction` | Safe display/redacted branded string types and constructors. |
| `src/testing/generators` | fast-check arbitrary generators for domain entities. |

## Artifact-Specific Components

### IR Schema Component

Responsibilities:
- Define comprehensive Core IR schemas.
- Infer TypeScript types from schemas.
- Include `schemaVersion`.
- Use extension slots without depending on raw Angular AST nodes.

NFR responsibilities:
- JSON round-trip compatibility.
- Schema validation under target performance threshold.
- Versioned migration registry.

### Diagnostics Component

Responsibilities:
- Define diagnostic severities: `info`, `warning`, `error`, `manual-review`, `security-blocker`.
- Define diagnostic tags and remediation hints.
- Enforce safe display strings for messages.

NFR responsibilities:
- Preserve security-blocker semantics.
- Prevent raw sensitive strings in diagnostic display fields.
- Support diagnostic invariants and PBT generators.

### Traceability Component

Responsibilities:
- Define source refs, IR refs, generated refs, and trace links.
- Persist canonical JSON arrays.
- Build derived in-memory indexes by source, IR, and generated refs.

NFR responsibilities:
- Support 500-component typical and 1000-component stress fixtures.
- Validate referential integrity.
- Provide invariant test hooks.

### Report Schema Component

Responsibilities:
- Define canonical JSON report.
- Include run summary, converted files, diagnostics, quality results, traceability map ref, AI decisions, security events, and manual review state.
- Use redaction-safe fields.

NFR responsibilities:
- Prevent report schema divergence.
- Support JSON round-trip and schema validation.
- Preserve security event metadata without raw sensitive values.

### Manifest Schema Component

Responsibilities:
- Define run manifest fields and artifact refs.
- Include schema version and run status.
- Support future migration.

NFR responsibilities:
- Provide stable run-state references for downstream units.
- Validate artifact refs and version compatibility.

### Mask Token Component

Responsibilities:
- Define token metadata and token map structure.
- Store restoration policy references without implementing masking logic.

NFR responsibilities:
- Preserve stable placeholder identity.
- Avoid raw sensitive value leakage.
- Support token map round-trip properties.

## Cross-Cutting Utility Components

### Port Contract Component

Ports:
- `ArtifactStoragePort`
- `FileSystemPort`
- `ToolRunnerPort`
- `LlmProviderPort`
- `ReportExporterPort`
- `LoggerPort`
- `AuditPort`
- `ClockPort`
- `RandomnessPort`

Rules:
- All port calls return `Result`.
- Port errors are typed.
- Ports describe behavior, not implementation.

### Validation Component

Responsibilities:
- Wrap Zod validation.
- Convert Zod errors to typed validation errors.
- Provide boundary validation helpers.
- Support benchmark fixtures.

### Migration Component

Responsibilities:
- Maintain migration registry per artifact type.
- Return typed migration Result.
- Validate migration outputs.
- Reject unsupported schema versions.

### Redaction Component

Responsibilities:
- Define branded redaction-safe types.
- Provide constructors for safe display fields.
- Reject raw strings for diagnostic/report display fields where possible.

### PBT Generator Component

Responsibilities:
- Export fast-check domain generators.
- Support generator reuse by downstream packages.
- Include edge cases for large artifacts, empty artifacts, redaction fields, and invalid refs where appropriate.

## Logical Dependency Map

| Component | Depends On |
|---|---|
| IR Schema Component | Result, Validation, Migration |
| Diagnostics Component | Redaction, Result, Validation |
| Traceability Component | Result, Validation, Migration |
| Report Schema Component | Diagnostics, Traceability refs, Redaction, Validation |
| Manifest Schema Component | Result, Validation, Migration |
| Mask Token Component | Redaction, Validation |
| Port Contract Component | Result, Diagnostics/Errors |
| Validation Component | Zod, Result |
| Migration Component | Result, Validation |
| Redaction Component | Zod, Result |
| PBT Generator Component | fast-check, artifact schemas |

## Benchmark Fixture Design

| Fixture | Size | Purpose |
|---|---|---|
| Typical IR fixture | 500 components | Validate normal large-project target. |
| Stress IR fixture | 1000 components | Explore upper-bound behavior. |
| Typical traceability fixture | 500 components with file/symbol/binding/generated refs | Validate derived index construction. |
| Stress traceability fixture | 1000 components with dense trace links | Stress referential integrity validation. |
| Typical report fixture | 500-component report with diagnostics and quality results | Validate report schema and serialization. |
| Stress report fixture | 1000-component report with dense diagnostics | Stress report validation behavior. |

## Security and PBT Findings

- **Security Findings**: None.
- **PBT Findings**: None.

