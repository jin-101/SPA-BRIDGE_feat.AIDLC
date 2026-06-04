# UOW-01 Artifact Index

## Application Code

- `package.json`
- `tsconfig.base.json`
- `packages/core-model/package.json`
- `packages/core-model/tsconfig.json`
- `packages/core-model/src/index.ts`
- `packages/core-model/src/diagnostics/diagnostics.ts`
- `packages/core-model/src/ir/ir.ts`
- `packages/core-model/src/manifest/manifest.ts`
- `packages/core-model/src/masking/masking.ts`
- `packages/core-model/src/migration/migration.ts`
- `packages/core-model/src/ports/ports.ts`
- `packages/core-model/src/redaction/redaction.ts`
- `packages/core-model/src/report/report.ts`
- `packages/core-model/src/result/result.ts`
- `packages/core-model/src/source-model/angular-source-model.ts`
- `packages/core-model/src/testing/generators/generators.ts`
- `packages/core-model/src/traceability/traceability.ts`
- `packages/core-model/src/validation/validation.ts`
- `packages/core-model/tests/core-model.test.ts`

## Documentation

- `aidlc-docs/construction/uow-01-core-model-and-ports-foundation/code/summary.md`

## Coverage Notes

- The generated code covers the primary story set for UOW-01.
- PBT generators are centralized for reuse by later units.
- Canonical JSON serialization and validation contracts are represented by Zod schemas.
