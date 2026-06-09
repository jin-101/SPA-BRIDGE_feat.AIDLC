# V2-GAP-UOW-01 Dependency Alias and Path Mapping Functional Design Plan

## Unit

V2-GAP-UOW-01 Dependency Alias and Path Mapping

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-006 Dependency Alias and Path Mapping

## Problem Statement

The generated React project must preserve source dependency resolution behavior so converted imports still resolve after `npm install` and `npm run dev`.

The current implementation carries over some source package dependencies, but it does not yet fully model:

- `tsconfig` `baseUrl`.
- `tsconfig` `paths`.
- nested `tsconfig.*.json` inheritance.
- Angular workspace library project paths.
- Vite `resolve.alias`.
- unresolved alias diagnostics.
- alias-aware generated import rewriting.

## Proposed Functional Design

### 1. Source Alias Extraction

Add a source analyzer capability in `packages/source-angular` that reads:

- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.base.json`
- `angular.json`

The analyzer should produce a stable alias model containing:

- `baseUrl`
- `paths`
- Angular workspace project roots
- asset roots
- unresolved or unsupported alias entries

### 2. Transformation Context Carry-Through

Extend `packages/transform-angular-react` types so alias metadata flows from Angular analysis to React target generation.

The transformation stage should not rewrite aliases blindly. It should preserve source evidence and generate diagnostics when the target mapping is ambiguous.

### 3. Target Alias Materialization

Extend `packages/target-react` to generate:

- `tsconfig.json` `paths` where compatible.
- `vite.config.ts` `resolve.alias`.
- package manifest carry-over for internal packages.
- diagnostics for aliases that point outside supported project boundaries.

### 4. CLI Reporting

Extend `packages/cli` conversion output to include:

- alias count
- generated alias count
- unresolved alias count
- `.spa-bridge/alias-mapping-summary.json`

### 5. Tests

Add:

- example-based tests for a fixture Angular project with `@app/*` and `@shared/*`.
- property-based tests for stable alias ordering and path containment.
- integration assertion that generated `vite.config.ts` and `tsconfig.json` include compatible aliases.

## Acceptance Criteria

- [ ] Source analysis extracts `baseUrl` and `paths` from source tsconfig files.
- [ ] Source analysis extracts Angular workspace library project roots from `angular.json`.
- [ ] Transformation result carries alias metadata without losing traceability.
- [ ] Target `tsconfig.json` includes compatible alias mappings.
- [ ] Target `vite.config.ts` includes compatible `resolve.alias` mappings.
- [ ] Unsupported aliases produce safe diagnostics and manual-review items.
- [ ] Alias output is deterministic.
- [ ] Alias paths cannot escape the source root or target root.
- [ ] Package-level tests pass.
- [ ] Workspace `npm run build` passes.
- [ ] Workspace `npm test` passes.

## Security Baseline Compliance

- Alias diagnostics must not include raw source snippets.
- Alias paths in reports must use safe path/reference values.
- Path traversal and target-root escape must be blocked.

## Property-Based Testing Compliance

Required PBT properties:

- Alias mapping order is deterministic.
- Generated target aliases remain target-root contained.
- Unsupported alias diagnostics are stable for equivalent input.
- Duplicate aliases resolve by stable precedence.

## Plan Checklist

- [x] Identify source requirement and affected packages.
- [x] Define functional design.
- [x] Define acceptance criteria.
- [x] Define security and PBT expectations.
- [x] Receive explicit approval to create the code generation plan.
- [x] Create V2-GAP-UOW-01 code generation plan.
- [ ] Implement source alias extraction.
- [ ] Implement alias carry-through.
- [ ] Implement target alias materialization.
- [ ] Implement CLI alias summary.
- [ ] Add tests.
- [ ] Run build/test verification.

## Approval Gate

Status: Approved. V2-GAP-UOW-01 code generation plan has been created and is awaiting execution approval.
