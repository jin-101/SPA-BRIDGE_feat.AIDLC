# V2 Gap Units of Work

## Purpose

This document decomposes `requirements_v2_gap_implementation_spec.md` into brownfield implementation units that extend the existing SPA-Bridge packages.

## V2-GAP-UOW-01 Dependency Alias and Path Mapping

### Covered Requirements

- V2-GAP-FR-006 Dependency Alias and Path Mapping

### Existing Package Impact

- `packages/source-angular`: extract `tsconfig` path aliases, baseUrl, Angular workspace libraries, and asset configuration.
- `packages/transform-angular-react`: normalize alias data into the transformation context.
- `packages/target-react`: generate Vite aliases, target `tsconfig` path aliases, and import rewrite hints.
- `packages/cli`: pass source dependency/alias metadata into target generation and report unresolved aliases.

### Deliverables

- Alias/path model.
- Source analyzer for `tsconfig` and Angular workspace path data.
- Target Vite/TypeScript alias generation.
- Tests for alias determinism and path containment.

## V2-GAP-UOW-02 Advanced Template Conversion

### Covered Requirements

- V2-GAP-FR-004 Advanced Template Conversion

### Existing Package Impact

- `packages/source-angular`: parse richer template structures or structured heuristics.
- `packages/transform-angular-react`: carry structured template nodes and pipe/custom component metadata.
- `packages/target-react`: emit JSX for structural directives, projection, refs, classes, styles, and custom component props.

### Deliverables

- Structured template conversion model.
- JSX generator for `*ngIf`, `*ngFor`, `ng-container`, and custom component I/O bindings.
- Pipe helper generation or diagnostics.
- Regression and PBT coverage.

## V2-GAP-UOW-03 Reactive Forms Conversion

### Covered Requirements

- V2-GAP-FR-003 Reactive Forms Conversion

### Existing Package Impact

- `packages/source-angular`: extract form model declarations and template form bindings.
- `packages/transform-angular-react`: normalize form groups, controls, arrays, validators, and submit handlers.
- `packages/target-react`: emit React controlled form state, validation helpers, and submit handlers.

### Deliverables

- Form IR.
- Validator conversion rules.
- React form hook/materializer.
- Diagnostics for custom and async validators.

## V2-GAP-UOW-04 RxJS Conversion

### Covered Requirements

- V2-GAP-FR-001 RxJS Conversion

### Existing Package Impact

- `packages/source-angular`: detect observable fields, subjects, subscriptions, pipe chains, operators, and cleanup patterns.
- `packages/transform-angular-react`: normalize RxJS stream behavior and cleanup intent.
- `packages/target-react`: generate observable hooks and subscription cleanup code.

### Deliverables

- RxJS stream model.
- `useObservable` or equivalent helper generation.
- Async pipe conversion support.
- Diagnostics for unsupported stream chains.

## V2-GAP-UOW-05 NgRx Conversion

### Covered Requirements

- V2-GAP-FR-002 NgRx Conversion

### Existing Package Impact

- `packages/source-angular`: detect NgRx actions, reducers, selectors, effects, entity adapters, and store usage.
- `packages/transform-angular-react`: normalize NgRx state artifacts into target state drafts.
- `packages/target-react`: generate Redux Toolkit slices, selectors, hooks, and effect/thunk scaffolds.

### Deliverables

- NgRx state model.
- Redux Toolkit materializer.
- Component-level store usage rewrite.
- State conversion diagnostics.

## V2-GAP-UOW-06 Animation Conversion

### Covered Requirements

- V2-GAP-FR-005 Animation Conversion

### Existing Package Impact

- `packages/source-angular`: extract Angular animation metadata and third-party animation usage.
- `packages/transform-angular-react`: normalize animation intents and asset refs.
- `packages/target-react`: emit CSS transitions, hook wrappers, or review adapters.

### Deliverables

- Animation metadata model.
- Target animation helper generation.
- Lottie/GSAP/animejs preservation rules.
- Diagnostics for complex Angular animation DSL.

## V2-GAP-UOW-07 Generated React Self-Correction Loop

### Covered Requirements

- V2-GAP-FR-007 Generated React Self-Correction Loop

### Existing Package Impact

- `packages/core-quality`: model quality gate execution and fixer results.
- `packages/adapters-ai`: support safe AI repair suggestions.
- `packages/cli`: execute configured target validation commands.
- `packages/target-react`: expose generated project metadata for validation.

### Deliverables

- Quality gate command runner.
- Deterministic fixer registry.
- Policy-controlled AI repair adapter.
- `.spa-bridge/quality-gate-results.json`.

