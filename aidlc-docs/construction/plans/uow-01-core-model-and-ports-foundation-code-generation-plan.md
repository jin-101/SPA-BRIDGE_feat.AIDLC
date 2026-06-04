# Code Generation Plan - UOW-01 Core Model and Ports Foundation

## Unit Context

- **Unit**: UOW-01 Core Model and Ports Foundation
- **Primary Package**: `packages/core-model`
- **Primary Owner Role**: Architect
- **Reviewer Roles**: Migration Engineer, Application Developer, Security Reviewer
- **Primary Stories**: US-004, US-014
- **Supporting Stories**: US-003, US-009, US-012, US-013
- **Prerequisites**: Functional Design, NFR Requirements, and NFR Design are complete.

## Purpose

Generate the foundational shared contracts for SPA-Bridge: framework-neutral IR, diagnostics, traceability, report and manifest schemas, port contracts, masking token types, validation utilities, migration registry, redaction-safe types, and PBT generators.

## Scope

### In Scope

- Package scaffold for `packages/core-model`.
- Public module exports and internal component directories.
- Core schemas and inferred types for IR, diagnostics, traceability, report, manifest, and masking tokens.
- Minimal Result type, typed validation helpers, migration registry, and redaction-safe string helpers.
- Port contracts for file system, artifact storage, tool runner, LLM provider, report exporter, logger/audit, clock, and randomness.
- Domain-specific fast-check generators and fixture helpers.
- Unit tests for serialization, invariants, port contracts, and migration behavior.
- Markdown code summary under `aidlc-docs/construction/uow-01-core-model-and-ports-foundation/code/`.

### Out of Scope

- Repository layer generation, because UOW-01 has no persistence repository implementation.
- Frontend component generation.
- Database migration scripts.
- Deployment artifacts.
- Any code under `aidlc-docs/` other than markdown summaries.

## Story Traceability

| Story | Coverage in This Unit |
|---|---|
| US-004 Parse Angular Source Into Intermediate Representation | Core IR contracts, source boundary types, traceability model, serialization contracts |
| US-014 Preserve Extensible Architecture Evidence | Port contracts, schema versioning, redaction-safe models, plugin-friendly boundaries |
| US-003 Scan Angular Project Structure | Supporting diagnostics and traceability refs consumed by source analysis |
| US-009 Mask Sensitive Information Before External LLM Calls | Mask token types and report-safe redaction fields |
| US-012 Apply Property-Based Testing to Conversion-Sensitive Logic | PBT generators and invariant-focused test fixtures |
| US-013 Generate Conversion Reports and Exports | Canonical report and manifest schemas, exporter port contract |

## Target Paths

### Application Code

- `package.json`
- `tsconfig.base.json`
- `packages/core-model/package.json`
- `packages/core-model/tsconfig.json`
- `packages/core-model/src/index.ts`
- `packages/core-model/src/ir/`
- `packages/core-model/src/diagnostics/`
- `packages/core-model/src/traceability/`
- `packages/core-model/src/report/`
- `packages/core-model/src/manifest/`
- `packages/core-model/src/masking/`
- `packages/core-model/src/ports/`
- `packages/core-model/src/result/`
- `packages/core-model/src/validation/`
- `packages/core-model/src/migration/`
- `packages/core-model/src/redaction/`
- `packages/core-model/src/testing/generators/`
- `packages/core-model/tests/`

### Documentation

- `aidlc-docs/construction/uow-01-core-model-and-ports-foundation/code/summary.md`
- `aidlc-docs/construction/uow-01-core-model-and-ports-foundation/code/artifact-index.md`

## Generation Checklist

- [x] Step 1: Re-read unit design artifacts and confirm generation boundaries.
- [x] Step 2: Create the `packages/core-model` package scaffold and public export surface.
- [x] Step 3: Generate core schemas and types for IR, diagnostics, traceability, report, manifest, and masking tokens.
- [x] Step 4: Generate Result, validation, migration, and redaction utility modules.
- [x] Step 5: Generate port contracts and typed error models.
- [x] Step 6: Generate exported fast-check domain generators and fixture helpers.
- [x] Step 7: Generate unit tests for round-trip serialization, invariants, and port contract behavior.
- [x] Step 8: Generate markdown code summaries and artifact index documentation.
- [x] Step 9: Verify all application code lives in the workspace root and no generated code was placed in `aidlc-docs/`.
- [x] Step 10: Mark completed steps and story coverage in the plan during generation.

## Generation Notes

- This unit is model and contract focused, so API surface generation is the public module export layer.
- No repository, frontend, database migration, or deployment steps are expected for this unit.
- Generated code must remain framework-neutral and safe for reuse by all later units.

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- All file paths are ASCII and resolve under the workspace root or `aidlc-docs/construction/.../code/`.
