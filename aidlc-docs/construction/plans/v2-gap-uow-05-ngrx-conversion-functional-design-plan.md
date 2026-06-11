# V2-GAP-UOW-05 NgRx Conversion Functional Design Plan

## Unit

V2-GAP-UOW-05 NgRx Conversion

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-002 NgRx Conversion

Supporting requirements:
- V2-GAP-FR-001 RxJS Conversion for effects and observable selector usage.
- V2-GAP-FR-007 Generated React Self-Correction Loop for generated Redux build validation.
- Global V2 acceptance goal: generated React projects should install and run with `npm run dev` while preserving Angular behavior as closely as deterministic conversion can safely support.

## Goal

Convert NgRx-heavy Angular state artifacts into React-compatible Redux Toolkit output with typed hooks, slices, selectors, thunk/listener-style effects where practical, and traceable manual-review diagnostics for business-critical effect or entity patterns.

## Current Brownfield Baseline

Existing implementation already has:

- Local/store state scaffolding in `packages/target-react`.
- RxJS stream extraction and hook runtime from V2-GAP-UOW-04.
- Dependency compatibility filtering that removes Angular/NgRx packages from target dependencies.
- Basic state strategy converter and target state output adapters.

Known gap:

- NgRx actions, reducers, selectors, effects, store injection, `store.select`, `store.dispatch`, and entity adapters are not extracted as first-class models.
- Generated React components do not yet rewrite NgRx selector/dispatch usage into typed Redux hooks.
- Target dependency replacement does not yet add Redux Toolkit/react-redux specifically because NgRx source evidence is not modeled.

## Proposed Functional Design

### 1. NgRx Source Model

Add NgRx extraction in `packages/source-angular`:

- detect `createAction`, `props`, and action groups.
- detect `createReducer` and `on(...)` handlers.
- detect `createSelector`, feature selectors, and selector dependencies.
- detect `createEffect` and effect observable chains.
- detect `Store<T>` constructor injection.
- detect `store.select(...)` and `store.dispatch(...)` component usage.
- detect `@ngrx/entity` adapter declarations and generated selector usage.
- detect `@ngrx/router-store` usage.

### 2. NgRx IR Carry-Through

Extend transformation model with:

- `AngularNgrxActionModel`
- `AngularNgrxReducerModel`
- `AngularNgrxSelectorModel`
- `AngularNgrxEffectModel`
- `AngularNgrxEntityAdapterModel`
- `AngularNgrxComponentUsageModel`
- `NormalizedNgrxStateModel`
- `ReactReduxToolkitDraft`

### 3. React Target Model

Generate Redux Toolkit target files where NgRx patterns are detected:

- `src/store/index.ts`
- `src/store/hooks.ts`
- `src/store/slices/*.ts`
- `src/store/selectors/*.ts`
- `src/store/effects/*.ts` where safe.

The target should use Redux Toolkit and `react-redux` typed hooks.

### 4. Component Integration

Map component usages:

- `store.select(selector)` to `useAppSelector(selector)`.
- `store.dispatch(action(payload))` to `dispatch(action(payload))`.
- constructor-injected `Store<T>` to local `dispatch` and selector hook usage.
- async selector values may use existing RxJS conversion handoff when direct Redux hook conversion is not safe.

### 5. Diagnostics And Safety

Unsupported or lossy mappings should:

- preserve safe source refs and generated refs.
- never execute reducers, selectors, effects, action factories, or entity adapters.
- generate manual-review diagnostics for effects with external side effects or complex RxJS flattening.
- preserve partial generated Redux slices/selectors where safe.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the default target state strategy for NgRx-heavy projects?

A) Generate Redux Toolkit slices, selectors, store setup, and typed React Redux hooks
B) Convert NgRx state into local component state only
C) Preserve NgRx state references as comments and require manual rewrite
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It best supports runtime parity for NgRx-heavy Angular applications.

### Question 2
How should NgRx actions be represented?

A) Extract action creators with stable IDs, type strings, props payload metadata, source refs, and target action names
B) Extract only action type strings
C) Ignore actions until reducer conversion
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. Reducers, effects, and dispatch rewrites need action payload metadata.

### Question 3
How should reducers be converted?

A) Map `createReducer` and `on(...)` handlers into Redux Toolkit `createSlice` or reducer builder cases where safe
B) Generate empty placeholder reducers
C) Preserve reducer code as comments only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It preserves state transitions in generated React output.

### Question 4
How should selectors be converted?

A) Emit selector functions with dependency metadata and rewrite component `store.select(selector)` to `useAppSelector(selector)`
B) Inline selector expressions inside components
C) Ignore selectors and expose full state only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It keeps component behavior and state access traceable.

### Question 5
How should NgRx effects be treated?

A) Convert simple effects to thunks or listener middleware and emit review diagnostics for side-effect-heavy or ambiguous effects
B) Convert every effect to a plain `useEffect` inside components
C) Drop effects and require manual rewrite
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. Effects often encode business workflows, so safe conversion plus review is the right balance.

### Question 6
How should `@ngrx/entity` adapters be handled?

A) Map simple entity adapter state/selectors to Redux Toolkit entity adapter and review complex custom entity behavior
B) Flatten entities into arrays only
C) Mark all entity adapter usage unsupported
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. Redux Toolkit has a close entity adapter equivalent.

### Question 7
How should `@ngrx/router-store` be handled?

A) Preserve route-state intent and map simple selectors to React Router-derived selectors with diagnostics for complex router-store coupling
B) Remove router-store usage silently
C) Keep `@ngrx/router-store` as a target dependency
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. React targets should not install NgRx router-store, but route-state behavior should be accounted for.

### Question 8
How should target dependencies be handled?

A) Add `@reduxjs/toolkit` and `react-redux` when NgRx models are detected, while excluding `@ngrx/*`
B) Keep `@ngrx/*` dependencies in the React target
C) Avoid all Redux dependencies and rely only on local state
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. NgRx-heavy apps need a React state runtime with close semantics.

### Question 9
How should component store injection be converted?

A) Rewrite constructor-injected Store usage into `useAppDispatch` and `useAppSelector` hook usage where traceable
B) Keep Store injection as a constructor parameter in React components
C) Remove store usage and add TODOs only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It moves Angular DI/store usage into idiomatic React component code.

### Question 10
What should be the blocking test focus for this unit?

A) NgRx model extraction, action/reducer/selector/effect conversion, component store usage rewrites, entity adapter diagnostics, deterministic output, and PBT invariants
B) Only example-based tests for one reducer
C) No blocking tests until self-correction is complete
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. State conversion is behavior-critical and needs broad verification.

## Plan Checklist

- [x] Identify source requirement and affected packages.
- [x] Define functional design scope.
- [x] Define proposed NgRx conversion model.
- [x] Generate functional design questions.
- [x] Collect user answers.
- [x] Analyze answers for ambiguity.
- [x] Generate functional design artifacts.
- [x] Present functional design completion for approval.

## Security Baseline Compliance

- NgRx extraction must not execute action creators, reducers, selectors, effects, entity adapters, RxJS streams, or source code.
- Diagnostics must use safe source refs and generated refs.
- Generated Redux files must avoid dynamic eval and unsafe code execution.
- Unsupported effects must produce manual-review diagnostics instead of unsafe guessed behavior.

## Property-Based Testing Compliance

Required properties:

- Equivalent action/reducer declarations produce stable NgRx IR.
- Selector dependency normalization is deterministic.
- Unsupported effects produce stable diagnostics.
- Generated slice/action/hook names remain valid identifiers.
- Generated Redux helper files remain target-root contained.

## Approval Gate

Status: Functional design artifacts generated. Awaiting explicit approval to continue to code generation planning.
