# V2-GAP-UOW-05 Business Logic Model

## Overview

NgRx conversion uses a six-layer pipeline:

1. Extract actions, reducers, selectors, effects, entity adapters, router-store usage, and component store usage from Angular TypeScript.
2. Link actions to reducers, reducers to features, selectors to feature state, and component usages to selectors/actions.
3. Normalize NgRx source models into transformation IR.
4. Generate Redux Toolkit target drafts.
5. Materialize store setup, slices, selectors, effects, entity adapter files, and typed hooks.
6. Rewrite component store usage into React Redux hook usage where traceable.

## Source Extraction

Inputs:
- TypeScript parse summaries.
- imports and references.
- property initializers.
- method bodies.
- constructor dependencies.
- RxJS operator chains from V2-GAP-UOW-04.

Outputs:
- `AngularNgrxActionModel`
- `AngularNgrxReducerModel`
- `AngularNgrxSelectorModel`
- `AngularNgrxEffectModel`
- `AngularNgrxEntityAdapterModel`
- `AngularNgrxComponentUsageModel`
- diagnostics and source refs.

## Normalization

The transformation stage creates:

- stable feature names.
- target slice names.
- target action names.
- selector dependency graphs.
- effect conversion safety classification.
- component hook rewrite intents.

Normalization should prefer compile-safe Redux Toolkit output over comment-only preservation.

## Target Generation

When NgRx models are detected, target generation emits:

- `src/store/index.ts`
- `src/store/hooks.ts`
- `src/store/slices/{feature}.ts`
- `src/store/selectors/{feature}.ts`
- `src/store/effects/{feature}.ts` when safe enough.

Generated components import `useAppDispatch`, `useAppSelector`, target actions, and selectors only when needed.

## Component Rewrite Flow

Angular:

```ts
items$ = this.store.select(selectItems);
select(id: string) {
  this.store.dispatch(loadItem({ id }));
}
```

React:

```tsx
const dispatch = useAppDispatch();
const items = useAppSelector(selectItems);

const select = (id: string) => {
  dispatch(loadItem({ id }));
};
```

If selector/action resolution is ambiguous, generated code preserves a local review comment.

## Effects Flow

Simple effects can map to thunks or listener middleware:

- `ofType(loadItems)`
- service call through RxJS flattening operator.
- success/failure action mapping.

Complex effects remain review-required:

- navigation side effects.
- multiple action streams.
- long operator chains.
- custom schedulers.
- external browser APIs.

## Dependency Flow

The dependency compatibility layer removes `@ngrx/*`. NgRx model detection should cause target generation to add:

- `@reduxjs/toolkit`
- `react-redux`

The target dependency rationale must explain that Redux Toolkit is used to preserve NgRx state behavior.

## Diagnostics

Diagnostics are emitted for:

- unresolved action references.
- reducer handlers that call complex helpers.
- selector dependency cycles or unresolved selectors.
- effects with side-effect-heavy operators.
- entity adapter custom behavior.
- component `store.select` or `dispatch` calls that cannot be resolved.

Diagnostics must be deterministic, safe, and traceable.

