# Code Generation Plan - UOW-03 Angular Source Analysis

## Unit Context

- **Unit**: UOW-03 Angular Source Analysis
- **Primary Package**: `packages/source-angular`
- **Primary Owner Role**: Application Developer
- **Reviewer Roles**: Migration Engineer, Architect
- **Primary Stories**: US-003
- **Supporting Stories**: US-004, US-005, US-006, US-012
- **Prerequisites**: Functional Design, NFR Requirements, and NFR Design are complete.

## Purpose

Generate the Angular source analysis package, including scoped source inventory, TypeScript and Angular template parser adapters, route and style analysis helpers, dependency graph builder, safe diagnostic handling, stable IDs, PBT helpers, unit tests, and markdown summaries.

## Scope

### In Scope

- Package scaffold for `packages/source-angular`.
- Public analysis service entry points and request/result models.
- Path safety and workspace profiling helpers.
- Angular source inventory and file classification logic.
- TypeScript parser adapter, Angular template parser adapter, and route analyzer modules.
- Dependency graph assembly and stable ID helpers.
- Safe diagnostic builder and artifact mapper.
- Test generators for inventories, classified records, graph nodes/edges, diagnostics, and parser summaries.
- Unit tests for inventory determinism, classification idempotence, graph invariants, diagnostic stability, partial result behavior, and path safety.
- Markdown code summary under `aidlc-docs/construction/uow-03-angular-source-analysis/code/`.

### Out of Scope

- Core application orchestration.
- Angular-to-React transformation rules.
- Security masking implementation details beyond safe diagnostics and path validation.
- AI provider adapters.
- Frontend CLI/Web UI components.
- Database migration scripts.
- Deployment artifacts.
- Any code under `aidlc-docs/` other than markdown summaries.

## Story Traceability

| Story | Coverage in This Unit |
|---|---|
| US-003 Scan Angular Project Structure | Public analysis service, source inventory, file classification, dependency graph, diagnostics |
| US-004 Parse Angular Source Into Intermediate Representation | TypeScript and template parsing summaries, source refs, analysis handoff artifacts |
| US-005 Convert Components, Templates, Bindings, and Lifecycle | Component/template evidence and graph output used by downstream transformation rules |
| US-006 Convert Services, Dependency Injection, Routing, and State | Service and route evidence, DI metadata, state artifacts, graph output |
| US-012 Apply Property-Based Testing to Conversion-Sensitive Logic | Dedicated PBT generators and properties for inventory, classification, graph, diagnostics, and partial results |

## Target Paths

### Application Code

- `packages/source-angular/package.json`
- `packages/source-angular/tsconfig.json`
- `packages/source-angular/src/index.ts`
- `packages/source-angular/src/service/`
- `packages/source-angular/src/scanner/`
- `packages/source-angular/src/parser/`
- `packages/source-angular/src/templates/`
- `packages/source-angular/src/routes/`
- `packages/source-angular/src/graph/`
- `packages/source-angular/src/diagnostics/`
- `packages/source-angular/src/model/`
- `packages/source-angular/src/testing/`
- `packages/source-angular/tests/`

### Documentation

- `aidlc-docs/construction/uow-03-angular-source-analysis/code/summary.md`
- `aidlc-docs/construction/uow-03-angular-source-analysis/code/artifact-index.md`

## Generation Checklist

- [x] Step 1: Re-read unit design artifacts and confirm generation boundaries.
- [x] Step 2: Create the `packages/source-angular` package scaffold and public export surface.
- [x] Step 3: Generate analysis request/result models, path safety helpers, workspace profile detection, and public service entry points.
- [x] Step 4: Generate source inventory, file classification, and deterministic scan ordering modules.
- [x] Step 5: Generate TypeScript parser adapter, Angular template parser adapter, route analyzer, and style association helpers.
- [x] Step 6: Generate dependency graph builder, stable ID factory, safe diagnostic builder, and artifact mapper modules.
- [x] Step 7: Generate unit test support and PBT generators for inventory, classification, graph, diagnostics, and parser summaries.
- [x] Step 8: Generate unit tests for path safety, inventory determinism, classification idempotence, graph invariants, diagnostic stability, and partial result behavior.
- [x] Step 9: Generate markdown code summaries and artifact index documentation.
- [x] Step 10: Verify all application code lives in the workspace root and no generated code was placed in `aidlc-docs/`.

## Generation Notes

- This unit is source-analysis focused, so the API surface is the public analysis service layer.
- No React generation, provider adapter, reporting export, or deployment steps are expected for this unit.
- Generated code must remain framework-neutral, deterministic, and safe for reuse by later transformation and reporting units.

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- All file paths are ASCII and resolve under the workspace root or `aidlc-docs/construction/.../code/`.
