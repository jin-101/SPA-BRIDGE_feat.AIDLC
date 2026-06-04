# UOW-01 NFR Design Patterns

## Unit

- **Unit**: UOW-01 Core Model and Ports Foundation
- **Package**: `packages/core-model`

## Design Pattern Summary

| NFR Area | Pattern | Decision |
|---|---|---|
| Type safety and validation | Schema-first validation | Zod schemas define types via inference. |
| Error handling | Minimal Result union | `{ ok: true, value } | { ok: false, error }`. |
| Schema evolution | Versioned migration registry | Migration registry per artifact type. |
| Redaction safety | Branded safe strings | `RedactedString`, `SafeDisplayString`. |
| Traceability scalability | Canonical JSON plus derived indexes | Persist plain canonical JSON, derive indexes in memory. |
| Validation performance | Boundary validation plus benchmark fixture suite | 500-component typical, 1000-component stress fixtures. |
| PBT reuse | Exported domain generators | Downstream packages can reuse model generators. |
| Package organization | Separate concern directories | `src/ir`, `src/report`, `src/ports`, `src/validation`, `src/migration`. |

## Schema-First Zod Pattern

Design:
- Define persisted artifact schemas in Zod.
- Infer TypeScript types from schemas.
- Keep helper-only in-memory types as TypeScript-only where no persistence boundary exists.
- Export schema and inferred type together.

Pattern shape:

```typescript
const DiagnosticSchema = z.object({
  id: DiagnosticIdSchema,
  severity: DiagnosticSeveritySchema,
  message: SafeDisplayStringSchema,
});

type Diagnostic = z.infer<typeof DiagnosticSchema>;
```

Rules:
- Persisted entities must have schemas.
- Public persisted types should be inferred from schemas.
- Validation errors must be converted to typed `Err` results.
- Schema files must not import concrete adapters.

## Minimal Result Pattern

Design:
- Use a small internal discriminated union for all port and validation outcomes.
- Avoid external Result libraries to preserve the zero-runtime-dependency policy except Zod.

Pattern shape:

```typescript
type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E> = Ok<T> | Err<E>;
```

Rules:
- Port methods return `Promise<Result<T, E>>` for async operations.
- Validation and migration functions return `Result<T, ValidationError | MigrationError>`.
- Consumers must handle both branches explicitly.
- Unexpected adapter exceptions are caught at adapter boundaries and converted to `Err`.

## Versioned Migration Registry Pattern

Design:
- Each persisted artifact type owns a registry from source schema version to migration function.
- Current-version validation remains schema-first.
- Unsupported versions return typed migration errors.

Pattern shape:

| Artifact | Registry |
|---|---|
| IR | `IrMigrationRegistry` |
| Report | `ReportMigrationRegistry` |
| Manifest | `ManifestMigrationRegistry` |
| Diagnostics | `DiagnosticsMigrationRegistry` |
| Traceability | `TraceabilityMigrationRegistry` |
| Mask Token Map | `MaskTokenMigrationRegistry` |

Rules:
- Every persisted artifact includes `schemaVersion`.
- Migration functions are pure and return `Result`.
- Migration output must validate against the target schema.
- Migration tests include example fixtures and PBT-generated compatible artifacts where practical.

## Redaction-Safe Branded Type Pattern

Design:
- Raw sensitive strings are forbidden in diagnostics and reports.
- Displayable content uses branded safe types.

Core branded types:
- `SafeDisplayString`
- `RedactedString`
- `SensitivePlaceholder`

Rules:
- Diagnostic and report schemas accept only safe display/redacted types for message fields that may reach users.
- `MaskTokenMap` stores token metadata, not raw sensitive values.
- Converting raw strings into safe display strings requires a validation/sanitization helper.
- Security-sensitive APIs should make unsafe conversion explicit and reviewable.

## Canonical JSON plus Derived Indexes Pattern

Design:
- Persist traceability as canonical JSON arrays for portability and stable reports.
- Build in-memory indexes for performance-sensitive lookups.

Derived indexes:
- By source ref.
- By IR ref.
- By generated artifact ref.
- By diagnostic id.

Rules:
- Canonical JSON remains the persisted source of truth.
- Derived indexes are rebuilt from validated canonical artifacts.
- Index construction must preserve referential integrity.
- Large-map operations should use derived indexes rather than repeated array scans.

## Validation Performance Pattern

Design:
- Validate at persistence boundaries.
- Add benchmark fixtures for typical and stress artifact sizes.
- Do not add production timing instrumentation in UOW-01 unless later profiling requires it.

Fixture targets:
- Typical: 500 components.
- Stress: 1000 components.

Rules:
- Typical artifact validation target is under 100ms per artifact under reference test conditions.
- Benchmarks should cover IR, traceability map, report, and diagnostics collection.
- Benchmark failures should be visible in build/test instructions.

## PBT Generator Pattern

Design:
- Export domain-specific test generators for downstream packages.
- Keep generators in a test-support area that does not become production runtime dependency.

Generator families:
- IR generators.
- Diagnostic generators.
- Traceability generators.
- Report generators.
- Mask token map generators.
- Schema version/migration generators.

Rules:
- Generators must produce structurally valid domain objects.
- Generators include edge cases such as empty collections, many components, missing optional refs, and redaction fields.
- PBT failures must expose seed and shrunk failing input.
- PBT complements example-based fixture tests.

## Security Baseline Compliance

| Rule | Status | Pattern Coverage |
|---|---|---|
| SECURITY-03 | Compliant | Logger/audit port models require structured, redaction-aware event records. |
| SECURITY-09 | Compliant | Redaction-safe branded types prevent raw sensitive diagnostics/report fields. |
| SECURITY-10 | Compliant | Dependency policy keeps runtime dependencies restricted to Zod. |
| SECURITY-11 | Compliant | Redaction, validation, migration, and Result patterns separate security-sensitive concerns. |
| SECURITY-13 | Compliant | Schema validation and migration registry support artifact integrity. |
| SECURITY-15 | Compliant | Result ports and security-blocker diagnostics support fail-safe defaults. |

## PBT Compliance

| Rule | Status | Pattern Coverage |
|---|---|---|
| PBT-01 | Compliant | Testable properties are identified for UOW-01. |
| PBT-02 | Compliant | Round-trip patterns defined for IR, report, traceability, and token maps. |
| PBT-03 | Compliant | Traceability and diagnostic invariants are defined. |
| PBT-04 | Compliant | Validation and migration idempotence/determinism are included. |
| PBT-05 | N/A | No reference algorithm required in this unit. |
| PBT-06 | N/A | No mutable stateful component in this unit. |
| PBT-07 | Compliant | Domain-specific generator families are required. |
| PBT-08 | Compliant | Seed and shrinking requirements are included. |
| PBT-09 | Compliant | fast-check with Vitest selected in NFR Requirements. |
| PBT-10 | Compliant | Example fixtures remain required alongside PBT. |

