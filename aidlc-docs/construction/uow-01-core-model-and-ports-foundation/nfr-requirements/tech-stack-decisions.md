# UOW-01 Tech Stack Decisions

## Unit

- **Unit**: UOW-01 Core Model and Ports Foundation
- **Package**: `packages/core-model`

## Decisions

| Area | Decision | Rationale |
|---|---|---|
| Primary language | TypeScript | Matches SPA-Bridge monorepo and Angular/React ecosystem. |
| Runtime/schema validation | Zod | Provides TypeScript-friendly runtime validation and schema composition. |
| Package build format | Source TypeScript inside monorepo; build format decided later | Keeps early design flexible while package boundaries are refined. |
| PBT framework | fast-check with Vitest | Satisfies PBT-09 and integrates well with TypeScript. |
| Error handling | Result type (`Ok`/`Err`) for all port calls | Makes failures explicit and testable across adapters. |
| Dependency policy | Zero runtime dependencies except validation library | Keeps core model stable and low-risk. |
| Schema versioning | Explicit schema versions and migrations for all persisted schema versions | Supports artifact compatibility and future evolution. |
| Redaction model | Core schemas forbid raw sensitive values in diagnostics/reports | Reduces leakage risk and supports Security Baseline. |
| Documentation | Public model/port APIs require doc comments and examples | Improves maintainability for downstream units. |

## Proposed Package Dependency Policy

Allowed runtime dependencies:
- `zod`

Allowed development/test dependencies:
- `typescript`
- `vitest`
- `fast-check`
- Type checking/linting/formatting tools selected by later NFR/Code Generation stages

Restricted:
- General-purpose utility runtime dependencies unless explicitly approved later.
- Runtime dependencies that duplicate Zod validation behavior.
- Dependencies that introduce I/O, network, or provider behavior into `core-model`.

## Validation Strategy

- Define TypeScript types and Zod schemas together.
- Persisted artifacts must validate before storage and after read.
- Validation errors must produce typed `Err` results.
- Schema validation must support representative benchmark tests.

## Testing Strategy

Example-based tests:
- Fixed valid/invalid IR fixtures.
- Fixed valid/invalid report fixtures.
- Diagnostics severity and blocker examples.
- Version migration fixtures.

Property-based tests:
- IR JSON round-trip.
- Report JSON round-trip.
- Mask token map JSON round-trip.
- Traceability link integrity.
- Diagnostic normalization/idempotence.
- Schema validation determinism.

## Migration Strategy

- Every persisted artifact type includes `schemaVersion`.
- Migration functions use typed Result values.
- Unsupported versions return a typed error.
- MVP must support explicit migrations for all persisted schema versions introduced by the package.

## Performance Strategy

- Target validation under 100ms for typical artifacts.
- Design schemas and validation flow for projects with 500+ components.
- Add benchmark fixtures during Code Generation or Build/Test.
- Avoid eager repeated validation in inner loops unless safety-critical.

## Security Strategy

- Diagnostics and reports use redacted/sanitized string types.
- Raw sensitive values are disallowed in diagnostic/report schemas.
- Logger/audit ports include redaction metadata and correlation IDs.
- Mask token maps contain token metadata and restoration policy references, not raw secret leakage paths.

## Open Items for Later Stages

- Final monorepo build format.
- Exact `Result` type implementation shape.
- Exact Zod schema file organization.
- Benchmark fixture sizes for 500+ component projects.
- Generated API documentation tooling.

