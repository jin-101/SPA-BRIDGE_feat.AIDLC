# V2-GAP-UOW-04 RxJS Conversion Code Generation Plan

## Unit

V2-GAP-UOW-04 RxJS Conversion

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-001 RxJS Conversion

Supporting requirements:
- V2-GAP-FR-004 Advanced Template Conversion handoff markers for `async` pipe.
- V2-GAP-FR-007 Generated React Self-Correction Loop will later validate generated hook output.
- Global V2 acceptance goal: generated React projects should install and run with `npm run dev` while preserving Angular behavior as closely as deterministic conversion can safely support.

## Goal

Implement Angular RxJS stream, subject, subscription, operator-chain, cleanup, and async pipe conversion so generated React components use project-local observable hooks, latest-value state, effect cleanup, and traceable manual-review diagnostics.

The implementation must prefer runnable React output over comment-only preservation while still avoiding unsafe guesses for side-effect-heavy or business-critical stream logic.

## Brownfield Code Locations

Application code must be modified in-place under the workspace root:

- `packages/source-angular/src/types.ts`
- `packages/source-angular/src/rxjs/`
- `packages/source-angular/src/service/source-angular-analysis-service.ts`
- `packages/source-angular/src/templates/`
- `packages/transform-angular-react/src/types.ts`
- `packages/transform-angular-react/src/context/context-normalizer.ts`
- `packages/transform-angular-react/src/converters/`
- `packages/target-react/src/types.ts`
- `packages/target-react/src/drafts/react-draft-normalizer.ts`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/materializers/`
- `packages/target-react/src/dependencies/`
- affected package tests under `packages/*/tests/`

Documentation summaries may be added under:

- `aidlc-docs/construction/v2-gap-uow-04-rxjs-conversion/code/`

## Dependencies

This unit builds on:

- Existing Angular TypeScript parse summaries.
- Existing lifecycle/property/method preservation.
- Existing advanced template conversion and async pipe handoff diagnostics.
- Existing React component materializer and template JSX renderer.
- Existing dependency compatibility layer that keeps `rxjs` when source uses it.
- Existing deterministic diagnostics, manual-review stubs, and path-containment patterns.

## Story And Requirement Traceability

- V2-GAP-FR-001: Convert RxJS observables, subjects, subscriptions, operators, async pipe, and cleanup.
- V2-GAP-FR-004: Consume async pipe template evidence for JSX binding.
- V2-GAP-FR-007: Prepare generated hooks for later install/build self-correction.
- Security Baseline: no source code execution, no observable execution, safe diagnostics only.
- Property-Based Testing: stable RxJS IR, deterministic operator normalization, stable diagnostics, valid generated hook names.

## Implementation Plan

### Step 1. Source RxJS Model Types

- [x] Extend `packages/source-angular/src/types.ts` with RxJS model types:
  - `AngularRxStreamModel`
  - `AngularRxSubjectModel`
  - `AngularRxSubscriptionModel`
  - `AngularRxOperatorChain`
  - `AngularRxOperatorModel`
  - `AngularAsyncPipeBinding`
- [x] Include stable IDs, owner IDs, source refs, type text, initializer text, cleanup evidence, side-effect levels, and diagnostics.
- [x] Keep source expressions as safe text references only; do not execute RxJS code, operators, callbacks, or observables.

### Step 2. RxJS Model Extractor

- [x] Create `packages/source-angular/src/rxjs/rxjs-model-extractor.ts`.
- [x] Detect observable-like members by `Observable<T>` type text, `$` suffix, and observable-like initializers.
- [x] Detect `Subject`, `BehaviorSubject`, `ReplaySubject`, and `AsyncSubject` declarations.
- [x] Extract subject `.next(...)`, `.error(...)`, and `.complete()` call refs.
- [x] Detect `.subscribe(...)` calls in constructors, methods, and lifecycle hooks.
- [x] Detect `.pipe(...)` chains and normalize known operators.
- [x] Detect `takeUntil(this.destroy$)`, `unsubscribe()`, and `ngOnDestroy` cleanup evidence.
- [x] Produce stable sorted models and diagnostics.

### Step 3. Async Pipe Binding Extraction

- [x] Extend template integration to detect `| async` usages in interpolation and property bindings.
- [x] Create `AngularAsyncPipeBinding` entries with owner component, expression text, binding kind, and safe template refs.
- [x] Match async pipe expressions to extracted stream models when possible.
- [x] Emit stable diagnostics for unresolved streams while preserving JSX structure.

### Step 4. Source Analysis Integration

- [x] Wire the RxJS extractor into `SourceAngularAnalysisService`.
- [x] Add RxJS models to `AngularAnalysisResult`.
- [x] Update source summary counts for streams, subjects, subscriptions, operator chains, async pipe bindings, and diagnostics.
- [x] Ensure extraction remains deterministic by sorting streams, subjects, subscriptions, operators, bindings, and diagnostics.

### Step 5. Transformation Carry-Through

- [x] Extend transformation types with normalized RxJS metadata:
  - `NormalizedRxStreamModel`
  - `NormalizedRxSubjectModel`
  - `NormalizedRxSubscriptionModel`
  - `NormalizedRxOperatorChain`
  - `NormalizedAsyncPipeBinding`
  - `ReactRxHookDraft`
- [x] Update `ContextNormalizer` to preserve source RxJS models.
- [x] Update component/template converters so `ReactComponentDraft` can carry associated RxJS hook drafts.
- [x] Keep unsupported stream/operator diagnostics traceable to safe source and generated refs.

### Step 6. React RxJS Runtime Utilities

- [x] Add generation support for project-local target utilities:
  - `src/utils/rxjs/useObservable.ts`
  - `src/utils/rxjs/useSubjectValue.ts`
  - `src/utils/rxjs/useSubscriptionEffect.ts`
  - `src/utils/rxjs/index.ts`
- [x] Implement latest-value state, loading/error/completed metadata where practical.
- [x] Ensure every subscription helper unsubscribes during cleanup.
- [x] Keep helpers TypeScript-safe and local to the generated React target.

### Step 7. Component Materializer Integration

- [x] Update `ComponentMaterializer` to import generated RxJS helpers only when used.
- [x] Generate hook calls for observable streams near the top of the component body.
- [x] Convert simple subscription callbacks that assign emitted values into React state setter logic.
- [x] Preserve side-effect-heavy or ambiguous callbacks with local `AIDLC_MANUAL_REVIEW_RXJS` comments.
- [x] Ensure generated effects are never placed inside render branches or loops.

### Step 8. Async Pipe JSX Integration

- [x] Update template JSX rendering to replace `{{ stream$ | async }}` with generated hook values.
- [x] Convert `[prop]="stream$ | async"` into JSX property values.
- [x] Preserve null-safe or fallback behavior where source template evidence exists.
- [x] Emit central diagnostics and local comments for unresolved async pipe expressions.

### Step 9. Dependency Manifest Integration

- [x] Ensure generated target dependencies keep `rxjs` when source RxJS models or source dependency manifest indicate RxJS usage.
- [x] Avoid adding a new external React observable library by default.
- [x] Add dependency rationale explaining local React hook integration around carried RxJS.

### Step 10. Tests

- [x] Add source-angular example tests for observable properties, subjects, subscriptions, `pipe(...)` chains, `takeUntil`, `ngOnDestroy`, and async pipe binding extraction.
- [x] Add transform-angular-react tests for RxJS IR carry-through and hook draft generation.
- [x] Add target-react tests for generated RxJS runtime utilities and component materialization.
- [x] Add async pipe JSX tests for interpolation and property bindings.
- [x] Add diagnostic tests for unsupported operators, flattening chains, missing cleanup, subject semantic gaps, and unresolved async pipes.
- [x] Add property-based tests for deterministic RxJS IR, operator normalization, stable diagnostics, and valid generated hook identifiers.

### Step 11. Documentation Summary

- [x] Create `aidlc-docs/construction/v2-gap-uow-04-rxjs-conversion/code/summary.md`.
- [x] Create `aidlc-docs/construction/v2-gap-uow-04-rxjs-conversion/code/artifact-index.md`.
- [x] Record implemented files, tests, runtime helper strategy, cleanup behavior, diagnostics, and residual limitations.

### Step 12. Verification

- [x] Run affected package tests:
  - `npm run test --workspace @spa-bridge/source-angular`
  - `npm run test --workspace @spa-bridge/transform-angular-react`
  - `npm run test --workspace @spa-bridge/target-react`
- [x] Run workspace build:
  - `npm run build`
- [x] Run workspace tests:
  - `npm test`
- [x] Update this plan checklist immediately as implementation steps complete.

## Security Baseline Compliance

- RxJS extraction must not execute source code, observables, callbacks, operator functions, or subscriptions.
- Diagnostics must use safe source refs and generated refs, not raw sensitive snippets.
- Generated hooks must include cleanup paths wherever subscriptions are created.
- Target files must remain contained under the generated React output root.
- External provider or Ollama advisory must not be required for deterministic RxJS conversion.

## Property-Based Testing Compliance

Required properties:

- Equivalent stream declarations produce stable RxJS IR.
- Operator chain normalization is deterministic.
- Unsupported operators produce stable diagnostics.
- Generated hook names remain valid TypeScript identifiers.
- Generated observable helper files remain target-root contained.

## Approval Gate

Status: Code generation executed. Awaiting review approval to continue to V2-GAP-UOW-05.
