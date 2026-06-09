# V2-GAP-UOW-01 Dependency Alias and Path Mapping Code Generation Plan

## Unit

V2-GAP-UOW-01 Dependency Alias and Path Mapping

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-006 Dependency Alias and Path Mapping

## Goal

Implement source-to-target alias preservation so Angular workspace aliases, TypeScript `baseUrl`/`paths`, and Angular project roots can be carried into the generated React project.

The generated React target must include compatible `tsconfig.json` paths, Vite `resolve.alias` settings, deterministic diagnostics for unsupported mappings, and CLI/report artifacts that make unresolved aliases visible.

## Brownfield Code Locations

Application code must be modified in-place under the workspace root:

- `packages/source-angular/src/`
- `packages/transform-angular-react/src/`
- `packages/target-react/src/`
- `packages/cli/src/`
- corresponding `tests/` directories under each package

Documentation summaries may be added under:

- `aidlc-docs/construction/v2-gap-uow-01-dependency-alias-and-path-mapping/code/`

## Dependencies

This unit builds on:

- Existing Angular analysis service and source model.
- Existing transformation context and React target draft set.
- Existing React target generation service, scaffold templates, and write plan.
- Existing CLI conversion bridge and report output.
- Existing security path containment and deterministic output patterns.

## Story And Requirement Traceability

- V2-GAP-FR-006: Dependency Alias and Path Mapping
- Global V2 acceptance: deterministic generation, target-root containment, traceability, safe diagnostics, workspace build/test pass.

## Implementation Plan

### Step 1. Source Alias Model Types

- [x] Extend `packages/source-angular/src/types.ts` with alias model types:
  - `SourceAliasModel`
  - `PathAliasMapping`
  - `AngularWorkspaceProjectAlias`
  - `AliasDiagnostic`
- [x] Add `aliasModel` to `AngularAnalysisResult`.
- [x] Add alias counts to the analysis summary when practical.

### Step 2. Source Alias Analyzer

- [x] Create `packages/source-angular/src/aliases/alias-analyzer.ts`.
- [x] Parse `tsconfig.json`, `tsconfig.base.json`, `tsconfig.app.json`, and safely followed `extends` chains.
- [x] Extract `compilerOptions.baseUrl` and `compilerOptions.paths`.
- [x] Extract Angular workspace project roots from `angular.json`.
- [x] Classify alias entries as supported, unresolved, external, or unsafe.
- [x] Enforce workspace/source-root containment and stable ordering.

### Step 3. Source Analysis Integration

- [x] Wire the alias analyzer into `packages/source-angular/src/service/source-angular-analysis-service.ts`.
- [x] Include alias diagnostics in the existing analysis diagnostic flow without raw source snippets.
- [x] Export alias analyzer/types through `packages/source-angular/src/index.ts`.

### Step 4. Transformation Carry-Through

- [x] Extend `packages/transform-angular-react/src/types.ts` so `TransformationContext` and `ReactTargetDraftSet` can carry alias metadata.
- [x] Update `packages/transform-angular-react/src/context/context-normalizer.ts` to normalize source alias metadata.
- [x] Update `packages/transform-angular-react/src/drafts/draft-builder.ts` and pipeline finalization to preserve alias metadata.
- [x] Add transformation diagnostics for ambiguous alias mappings instead of rewriting blindly.

### Step 5. Target Alias Materialization

- [x] Extend `packages/target-react/src/types.ts` and normalized draft/request structures with alias metadata.
- [x] Update target scaffold generation to include compatible `compilerOptions.paths` in `tsconfig.json`.
- [x] Update Vite config generation to include compatible `resolve.alias` entries.
- [x] Generate a safe metadata artifact such as `src/metadata/alias-mapping.json` or `.spa-bridge/alias-mapping-summary.json`.
- [x] Ensure target aliases cannot escape the target root.

### Step 6. CLI Reporting

- [x] Extend `packages/cli/src/bridges/application-bridge.ts` to pass alias metadata from analysis through transformation and target generation.
- [x] Add CLI/report output fields for alias count, generated alias count, and unresolved alias count.
- [x] Ensure reports use safe refs and do not include raw source snippets.

### Step 7. Example-Based Tests

- [x] Add a source-angular fixture with `baseUrl`, `paths`, `tsconfig` inheritance, and Angular workspace library roots.
- [x] Test source alias extraction and deterministic ordering.
- [x] Test transformation alias carry-through.
- [x] Test target `tsconfig.json` and `vite.config.ts` alias materialization.
- [x] Test CLI alias summary artifact generation.

### Step 8. Property-Based Tests

- [x] Add generator coverage for alias keys, target path lists, duplicate aliases, and unsafe paths.
- [x] Assert alias ordering remains deterministic.
- [x] Assert generated target aliases remain target-root contained.
- [x] Assert unsupported alias diagnostics are stable for equivalent input.

### Step 9. Documentation Summary

- [x] Create `aidlc-docs/construction/v2-gap-uow-01-dependency-alias-and-path-mapping/code/summary.md`.
- [x] Create `aidlc-docs/construction/v2-gap-uow-01-dependency-alias-and-path-mapping/code/artifact-index.md`.
- [x] Record implemented files, tests, diagnostics, and residual limitations.

### Step 10. Verification

- [x] Run package-level tests for affected packages where available:
  - `npm run test --workspace @spa-bridge/source-angular`
  - `npm run test --workspace @spa-bridge/transform-angular-react`
  - `npm run test --workspace @spa-bridge/target-react`
  - `npm run test --workspace @spa-bridge/cli`
- [x] Run workspace build:
  - `npm run build`
- [x] Run workspace tests:
  - `npm test`
- [x] Update this plan checklist immediately as steps complete.

## Security Baseline Compliance

- Alias parsing must not execute workspace code.
- Diagnostics and reports must use safe path/ref values only.
- `extends` resolution and alias targets must block traversal and root escape.
- External or unresolved aliases must be reported as manual-review diagnostics.

## Property-Based Testing Compliance

Required properties:

- Stable alias ordering for equivalent inputs.
- Target-root containment for generated aliases.
- Deterministic diagnostics for unsupported aliases.
- Stable precedence when duplicate aliases are normalized.

## Approval Gate

Status: Code generation executed. Awaiting review approval to continue to the next V2 gap unit.
