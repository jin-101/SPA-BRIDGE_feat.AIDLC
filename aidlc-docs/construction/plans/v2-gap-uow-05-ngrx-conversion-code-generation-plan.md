# V2-GAP-UOW-05 NgRx Conversion Code Generation Plan

## Unit

V2-GAP-UOW-05 NgRx Conversion

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-002 NgRx Conversion

Supporting requirements:
- V2-GAP-FR-001 RxJS Conversion for effect/operator model handoff.
- V2-GAP-FR-007 Generated React Self-Correction Loop for generated Redux build validation.
- Global V2 acceptance goal: generated React projects should install and run with `npm run dev` while preserving Angular behavior as closely as deterministic conversion can safely support.

## Goal

Implement NgRx extraction, normalized transformation carry-through, Redux Toolkit target generation, component store usage rewriting, dependency manifest integration, diagnostics, and tests.

The implementation should favor runnable Redux Toolkit output over comment-only preservation, while marking complex effects, entity behavior, router-store coupling, and ambiguous store usage for manual review.

## Brownfield Code Locations

Application code must be modified in-place under the workspace root:

- `packages/source-angular/src/types.ts`
- `packages/source-angular/src/ngrx/`
- `packages/source-angular/src/service/source-angular-analysis-service.ts`
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

- `aidlc-docs/construction/v2-gap-uow-05-ngrx-conversion/code/`

## Dependencies

This unit builds on:

- Existing Angular TypeScript parse summaries.
- Existing component property/method preservation.
- Existing RxJS operator-chain extraction from V2-GAP-UOW-04.
- Existing target state output adapters.
- Existing dependency compatibility filtering from V2-GAP-UOW-00.
- Existing deterministic diagnostics, manual-review stubs, and path-containment patterns.

## Story And Requirement Traceability

- V2-GAP-FR-002: Convert NgRx actions, reducers, selectors, effects, entity adapters, router-store usage, and component Store usage.
- V2-GAP-FR-001: Reuse RxJS model evidence for effects.
- Security Baseline: no source code execution, no reducer/effect/selector execution, safe diagnostics only.
- Property-Based Testing: stable NgRx IR, deterministic selector normalization, stable diagnostics, valid generated Redux identifiers.

## Implementation Plan

### Step 1. Source NgRx Model Types

- [x] Extend `packages/source-angular/src/types.ts` with NgRx model types:
  - `AngularNgrxActionModel`
  - `AngularNgrxReducerModel`
  - `AngularNgrxReducerHandlerModel`
  - `AngularNgrxSelectorModel`
  - `AngularNgrxEffectModel`
  - `AngularNgrxEntityAdapterModel`
  - `AngularNgrxComponentUsageModel`
  - `AngularNgrxModel`
- [x] Include stable IDs, safe source refs, feature names, payload metadata, selector dependencies, effect safety, component usage intents, and diagnostics.
- [x] Keep source expressions as safe text references only; do not execute actions, reducers, selectors, effects, or entity adapters.

### Step 2. NgRx Model Extractor

- [x] Create `packages/source-angular/src/ngrx/ngrx-model-extractor.ts`.
- [x] Detect `createAction`, `props`, and action groups.
- [x] Detect `createReducer` and `on(...)` handlers.
- [x] Detect `createFeatureSelector`, `createSelector`, selector dependencies, and projector expressions.
- [x] Detect `createEffect`, `ofType`, dispatch behavior, and effect operator intent.
- [x] Detect `createEntityAdapter`, adapter selectors, and adapter helper usage.
- [x] Detect `Store<T>` constructor injection.
- [x] Detect component `store.select(...)` and `store.dispatch(...)` usages.
- [x] Detect `@ngrx/router-store` imports or selector usage.
- [x] Produce stable sorted models and diagnostics.

### Step 3. Source Analysis Integration

- [x] Wire the NgRx extractor into `SourceAngularAnalysisService`.
- [x] Add `ngrxModel` to `AngularAnalysisResult`.
- [x] Update source summary counts for actions, reducers, selectors, effects, entity adapters, component usages, and diagnostics.
- [x] Ensure extraction remains deterministic by sorting all NgRx models and diagnostics.

### Step 4. Transformation Carry-Through

- [x] Extend transformation types with normalized NgRx metadata:
  - `NormalizedNgrxActionModel`
  - `NormalizedNgrxReducerModel`
  - `NormalizedNgrxSelectorModel`
  - `NormalizedNgrxEffectModel`
  - `NormalizedNgrxEntityAdapterModel`
  - `NormalizedNgrxComponentUsageModel`
  - `ReactReduxToolkitDraft`
- [x] Update `ContextNormalizer` to preserve source NgRx models.
- [x] Update component/state converters so `ReactComponentDraft` and `ReactTargetDraftSet` can carry Redux Toolkit draft metadata.
- [x] Keep unsupported effect/entity/router-store diagnostics traceable to safe source and generated refs.

### Step 5. Redux Toolkit Target Runtime

- [x] Add generation support for store files:
  - `src/store/index.ts`
  - `src/store/hooks.ts`
  - `src/store/slices/{feature}.ts`
  - `src/store/selectors/{feature}.ts`
  - `src/store/effects/{feature}.ts` where safe enough.
- [x] Generate `configureStore`, `RootState`, `AppDispatch`, `useAppDispatch`, and `useAppSelector`.
- [x] Generate slices for safely converted reducers.
- [x] Generate selectors for safely converted selector graphs.
- [x] Preserve review comments for complex reducers/effects/entity adapters.

### Step 6. Component Store Usage Rewriter

- [x] Update `ComponentMaterializer` to import Redux hooks/actions/selectors only when used.
- [x] Rewrite `store.select(selector)` source evidence into `useAppSelector(selector)` hook state.
- [x] Rewrite `store.dispatch(action(payload))` evidence into `dispatch(action(payload))` handlers where traceable.
- [x] Remove Angular `Store<T>` constructor dependency from generated component shape.
- [x] Preserve ambiguous usages with local `AIDLC_MANUAL_REVIEW_NGRX` comments.

### Step 7. Entity Adapter Mapping

- [x] Map simple `createEntityAdapter<T>()` to Redux Toolkit `createEntityAdapter<T>()`.
- [x] Generate entity adapter selectors where source selector refs are traceable.
- [x] Preserve custom `selectId` and `sortComparer` as safe text and review-required metadata.
- [x] Emit diagnostics for complex entity reducer helper usage that cannot be safely mapped.

### Step 8. Effect Conversion

- [x] Convert simple action-to-service-call effects to thunk or listener middleware drafts.
- [x] Preserve `ofType` and RxJS operator intent from V2-GAP-UOW-04 where available.
- [x] Emit manual-review diagnostics for navigation, external browser APIs, multi-stream composition, custom schedulers, and ambiguous dispatch behavior.
- [x] Avoid moving app-wide effects into component render/effect code.

### Step 9. Dependency Manifest Integration

- [x] Ensure generated target dependencies include `@reduxjs/toolkit` and `react-redux` when NgRx models are detected.
- [x] Ensure generated target dependencies exclude all `@ngrx/*` packages.
- [x] Add dependency rationale explaining Redux Toolkit/react-redux as the React runtime for converted NgRx behavior.

### Step 10. Tests

- [x] Add source-angular example tests for actions, reducers, selectors, effects, entity adapters, router-store, and component store usage extraction.
- [x] Add transform-angular-react tests for NgRx IR carry-through and Redux Toolkit draft generation.
- [x] Add target-react tests for generated store setup, typed hooks, slices, selectors, and component store usage rewrites.
- [x] Add diagnostic tests for unsupported effects, unresolved selectors/actions, entity adapter custom behavior, and router-store coupling.
- [x] Add property-based tests for deterministic NgRx IR, selector dependency normalization, stable diagnostics, and valid generated Redux identifiers.

### Step 11. Documentation Summary

- [x] Create `aidlc-docs/construction/v2-gap-uow-05-ngrx-conversion/code/summary.md`.
- [x] Create `aidlc-docs/construction/v2-gap-uow-05-ngrx-conversion/code/artifact-index.md`.
- [x] Record implemented files, tests, runtime strategy, component rewrite behavior, diagnostics, and residual limitations.

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

- NgRx extraction must not execute source code, actions, reducers, selectors, effects, entity adapters, or RxJS streams.
- Diagnostics must use safe source refs and generated refs, not raw sensitive snippets.
- Generated Redux code must avoid dynamic eval and unsafe code execution.
- Target files must remain contained under the generated React output root.
- External provider or Ollama advisory must not be required for deterministic NgRx conversion.

## Property-Based Testing Compliance

Required properties:

- Equivalent action/reducer declarations produce stable NgRx IR.
- Selector dependency normalization is deterministic.
- Unsupported effects produce stable diagnostics.
- Generated slice/action/hook names remain valid TypeScript identifiers.
- Generated Redux helper files remain target-root contained.

## Approval Gate

Status: Code generation complete. Awaiting review approval to continue to the next V2-GAP unit.
