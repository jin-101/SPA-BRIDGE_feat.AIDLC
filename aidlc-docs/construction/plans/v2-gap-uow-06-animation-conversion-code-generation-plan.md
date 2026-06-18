# V2-GAP-UOW-06 Animation Conversion Code Generation Plan

## Purpose

This plan is the single source of truth for implementing V2-GAP-UOW-06 Animation Conversion.

The target output strategy is Next.js App Router + React 18 + TypeScript. Implementation must preserve runtime parity where practical and emit safe manual-review diagnostics for unsupported animation behavior.

## Unit Context

Requirement coverage:
- V2-GAP-FR-005 Animation Conversion
- Supports V2-GAP-FR-004 Advanced Template Conversion
- Supports V2-GAP-FR-008 Next.js Target Default And Runtime Parity Quality Scoring

Primary packages:
- `packages/source-angular`
- `packages/transform-angular-react`
- `packages/target-react`
- `packages/core-quality`

Design inputs:
- `aidlc-docs/construction/v2-gap-uow-06-animation-conversion/functional-design/domain-entities.md`
- `aidlc-docs/construction/v2-gap-uow-06-animation-conversion/functional-design/business-rules.md`
- `aidlc-docs/construction/v2-gap-uow-06-animation-conversion/functional-design/business-logic-model.md`
- `aidlc-docs/construction/v2-gap-uow-06-animation-conversion/functional-design/frontend-components.md`

Dependencies:
- V2-GAP-UOW-00 dependency compatibility filtering and replacement.
- V2-GAP-UOW-01 alias/path mapping.
- V2-GAP-UOW-02 template conversion.
- V2-GAP-UOW-03 forms conversion.
- V2-GAP-UOW-04 RxJS conversion.
- V2-GAP-UOW-05 NgRx conversion.
- Next.js target default and runtime parity quality gate.

## Story Traceability

- Supports US-002 by generating a target project that can be installed and run.
- Supports US-005 and US-006 by improving visual/runtime behavior parity.
- Supports US-011 and US-012 by adding quality signals and deterministic tests.
- Supports US-013 by producing reviewable diagnostics and traceable artifacts.

## Implementation Steps

### Step 1: Source Angular Animation Types And Extraction

- [x] Extend `packages/source-angular/src/types.ts` with animation declaration, trigger, state, transition, binding, third-party usage, asset ref, and diagnostic types.
- [x] Add an animation metadata extractor under `packages/source-angular/src/animations/`.
- [x] Detect `@Component({ animations: [...] })` metadata from parsed TypeScript source.
- [x] Detect template animation bindings such as `[@trigger]`, `@trigger.start`, and `@trigger.done`.
- [x] Detect third-party animation imports and package usages for `lottie-web`, `ngx-lottie`, `gsap`, and `animejs`.
- [x] Preserve safe source refs and stable IDs without storing raw sensitive snippets.

### Step 2: Source Analysis Service Integration

- [x] Wire animation extraction into `packages/source-angular/src/service/source-angular-analysis-service.ts`.
- [x] Attach extracted animation models to component or analysis-level source output.
- [x] Add safe diagnostics for unsupported or partially parsed animation metadata.
- [x] Update `packages/source-angular/src/index.ts` exports as needed.

### Step 3: Transformation Draft Carry-Through

- [x] Extend `packages/transform-angular-react/src/types.ts` with animation target draft models.
- [x] Add animation conversion logic under `packages/transform-angular-react/src/converters/`.
- [x] Map simple Angular state transitions to CSS transition target plans.
- [x] Map template trigger bindings to JSX class/helper binding plans.
- [x] Map imperative third-party library usages to React helper or adapter plans where safe.
- [x] Emit manual-review diagnostics for complex DSL constructs such as `query`, `stagger`, `group`, wildcard states, and dynamic timing.
- [x] Integrate animation conversion into the transformation pipeline and draft builder.

Note: Animation conversion is implemented inside `ComponentConverter` so animation drafts can be attached directly to their owner component while still being collected as top-level target drafts.

### Step 4: Next.js Target Materialization

- [x] Add an animation materializer under `packages/target-react/src/materializers/`.
- [x] Generate deterministic CSS classes in `src/app/globals.css` or a stable helper CSS file.
- [x] Generate client-side helper modules under `src/animations/` when hooks, refs, browser APIs, or third-party libraries are required.
- [x] Ensure animation-bearing component files include `"use client"` when necessary.
- [x] Preserve/copy animation asset references into safe target paths where the existing resource pipeline can do so.
- [x] Add manual-review stubs for unresolved animation behavior and assets.

### Step 5: Dependency Compatibility Integration

- [x] Update dependency compatibility behavior for animation packages where needed.
- [x] Carry framework-neutral packages such as `lottie-web`, `gsap`, and `animejs` when compatible.
- [x] Treat Angular wrappers such as `ngx-lottie` as replacement/review candidates rather than blindly carrying them.
- [x] Add dependency rationale and compatibility report entries for animation library decisions.

### Step 6: Runtime Parity Quality Signals

- [x] Extend `packages/core-quality/src/types.ts` with animation quality fields.
- [x] Update `packages/core-quality/src/runtime-parity/runtime-parity-quality-gate.ts` to count animation trigger totals, converted triggers, unresolved triggers, missing assets, client-boundary requirements, and manual-review counts.
- [x] Ensure generated `src/review/runtime-parity-quality.json` includes animation quality signals.
- [x] Keep scoring deterministic and snippet-safe.

### Step 7: Tests

- [x] Add source analyzer tests for Angular animation metadata extraction.
- [x] Add source analyzer tests for template animation binding detection.
- [x] Add transformation tests for CSS transition target plans and manual-review diagnostics.
- [x] Add target generation tests for CSS/helper output, `"use client"` behavior, and review files.
- [x] Add dependency compatibility tests for animation packages and Angular wrapper handling.
- [x] Add runtime parity quality tests for animation scoring fields.
- [x] Add property-based or generator-backed determinism tests where practical.

### Step 8: Documentation And Code Summary

- [x] Create `aidlc-docs/construction/v2-gap-uow-06-animation-conversion/code/summary.md`.
- [x] Create `aidlc-docs/construction/v2-gap-uow-06-animation-conversion/code/artifact-index.md`.
- [x] Update `aidlc-docs/aidlc-state.md` with completion details.
- [x] Update `aidlc-docs/audit.md` with implementation completion and verification results.

### Step 9: Verification

- [x] Run package-level tests affected by source, transform, target, and quality packages.
- [x] Run workspace `npm run build`.
- [x] Run workspace `npm test`.
- [x] Fix failures without broad unrelated refactors.
- [x] Mark every completed plan checkbox immediately after the work is completed.

## Expected Application Code Touchpoints

- `packages/source-angular/src/types.ts`
- `packages/source-angular/src/animations/*`
- `packages/source-angular/src/service/source-angular-analysis-service.ts`
- `packages/transform-angular-react/src/types.ts`
- `packages/transform-angular-react/src/converters/*`
- `packages/transform-angular-react/src/pipeline/transformation-pipeline.ts`
- `packages/target-react/src/materializers/*`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/dependencies/*`
- `packages/core-quality/src/types.ts`
- `packages/core-quality/src/runtime-parity/runtime-parity-quality-gate.ts`
- Package test files under `packages/*/tests/`

## Completion Criteria

- Angular animation metadata and template animation bindings are extracted into structured source models.
- Simple state/transition animations are converted to deterministic Next.js/React target artifacts.
- Complex or lossy mappings produce safe manual-review diagnostics.
- Third-party animation dependencies and wrappers are classified safely.
- Runtime parity quality output includes animation-specific signals.
- Workspace `npm run build` and `npm test` pass.
