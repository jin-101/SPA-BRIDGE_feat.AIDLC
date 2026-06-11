# V2-GAP-UOW-05 Frontend Components Design

## Component Store Hook Integration

Generated React components should initialize Redux hooks near the top of the component body.

Example:

```tsx
const dispatch = useAppDispatch();
const passengers = useAppSelector(selectPassengers);
```

Hook names and imports must be deterministic.

## Selector Usage

Angular:

```ts
passengers$ = this.store.select(selectPassengers);
```

React:

```tsx
const passengers = useAppSelector(selectPassengers);
```

Template async pipe usage over selector observables should bind to the selector hook value when resolution is available.

## Dispatch Usage

Angular:

```ts
this.store.dispatch(loadPassengers({ flightId }));
```

React:

```tsx
dispatch(loadPassengers({ flightId }));
```

Generated handlers should preserve original parameters and event flow.

## Store Injection Removal

Angular constructor DI:

```ts
constructor(private readonly store: Store<AppState>) {}
```

React:

```tsx
const dispatch = useAppDispatch();
```

No constructor or `Store<T>` prop should be generated for function components.

## Entity State Rendering

Entity selector output should be rendered like normal selector state:

```tsx
const passengerEntities = useAppSelector(selectPassengerEntities);
const passengers = useAppSelector(selectAllPassengers);
```

If adapter selectors are unresolved, the generated component should include a local `AIDLC_MANUAL_REVIEW_NGRX` comment.

## Effect Awareness

Components should dispatch actions and let generated store effects/thunks handle async work. Effects should not be moved directly into component render or event handlers unless the original behavior is component-local and safe.

## Review Comments

When conversion is uncertain, generated code may include:

```tsx
/* AIDLC_MANUAL_REVIEW_NGRX: selector dependency could not be resolved */
```

The comment must be local to the uncertain selector, dispatch, or state binding and paired with a central diagnostic.

