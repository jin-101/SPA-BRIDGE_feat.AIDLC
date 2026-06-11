# V2-GAP-UOW-04 Business Logic Model

## Overview

RxJS conversion uses a five-layer pipeline:

1. Extract RxJS streams, subjects, subscriptions, operator chains, and cleanup evidence from Angular TypeScript.
2. Match template async pipe expressions to extracted streams.
3. Normalize RxJS source models into transformation IR.
4. Generate React hook drafts and project-local RxJS runtime helpers.
5. Materialize components with hook state, effect cleanup, async pipe values, and diagnostics.

## Source Extraction

Inputs:
- TypeScript class summaries.
- imports and type text.
- property initializers.
- constructor and method body text.
- Angular lifecycle method bodies.
- template raw text and template conversion metadata.

Outputs:
- `AngularRxStreamModel`
- `AngularRxSubjectModel`
- `AngularRxSubscriptionModel`
- `AngularRxOperatorChain`
- `AngularAsyncPipeBinding`
- diagnostics and source refs.

Extraction detects:
- `Observable<T>` properties.
- `$`-suffixed observable-like properties.
- subject constructors and subject method calls.
- `.pipe(...)` chains and known operators.
- `.subscribe(...)` calls.
- `takeUntil(this.destroy$)` cleanup patterns.
- `ngOnDestroy` subject completion and unsubscribe calls.
- template `| async` expressions.

## Normalization

The transformation stage creates normalized RxJS IR:

- stable stream and subscription IDs.
- React-friendly value names.
- hook draft ownership by component.
- operator chain classification.
- cleanup evidence classification.
- async pipe binding resolution.

Normalization should prefer a compile-safe partial target over comment-only output.

## Target Generation

When RxJS patterns are detected, target generation emits project-local helpers:

- `src/utils/rxjs/useObservable.ts`
- `src/utils/rxjs/useSubjectValue.ts`
- `src/utils/rxjs/useSubscriptionEffect.ts`
- `src/utils/rxjs/index.ts`

Generated components then import helpers only when needed.

Example target shape:

```tsx
const passengersValue = useObservable(passengers$, []);

useSubscriptionEffect(() => selectedPassenger$.subscribe((value) => {
  setSelectedPassenger(value);
}), [selectedPassenger$]);
```

## Async Pipe Handoff

Template conversion should treat async pipe as a target expression rewrite:

Angular:

```html
{{ passengers$ | async }}
```

React:

```tsx
{passengersValue}
```

Unresolved source streams produce:

- visible JSX fallback.
- local review comment.
- central diagnostic.

## Cleanup Model

Angular:

```ts
this.data$.pipe(takeUntil(this.destroy$)).subscribe(...)
```

React:

```tsx
useEffect(() => {
  const subscription = data$.subscribe(...);
  return () => subscription.unsubscribe();
}, [data$]);
```

`destroy$` is treated as cleanup evidence rather than user-visible state.

## Operator Handling

Known safe operators remain as RxJS chain metadata or source expressions when retaining RxJS is safer than rewriting.

Review-required operators:
- flattening operators with business logic callbacks.
- side-effect-heavy `tap`.
- custom operators.
- error handling that returns alternate streams.

Unsupported operators do not erase the chain; they produce review diagnostics and preserve source intent.

## Diagnostics

Diagnostics are emitted for:
- unresolved stream for async pipe.
- subscription without cleanup evidence.
- side-effect-heavy subscription callback.
- unsupported or custom operator.
- subject semantics that cannot map to plain state.
- flattening chain that requires business review.

Diagnostics must be stable, safe, and traceable.

