# V2-GAP-UOW-05 Business Rules

## Runtime Parity Rules

- NgRx-heavy source projects should generate Redux Toolkit target state by default.
- Generated React targets must not install `@ngrx/*`.
- Generated React targets should install `@reduxjs/toolkit` and `react-redux` when NgRx models are detected.
- Component store usage should become typed React Redux hook usage where traceable.
- Unsafe effect or entity adapter mappings must preserve partial output and emit manual-review diagnostics.

## Action Rules

- `createAction('[Feature] Event')` maps to a Redux Toolkit action/case name derived from the event.
- `props<T>()` metadata must be preserved as safe payload text.
- Action groups produce stable grouped action names.
- Action type strings must remain traceable in diagnostics and reports.
- Action creators must not be executed during conversion.

## Reducer Rules

- `createReducer(initialState, on(...))` maps to a feature slice where the feature key can be inferred.
- Reducer initial state is preserved as safe text and emitted into target state with fallback review comments if needed.
- Simple immutable return handlers may become Redux Toolkit reducer cases.
- Reducer logic that mutates nested structures or calls helper functions is review-required unless deterministic conversion rules exist.
- Adjacent safe handlers must still convert when one handler is ambiguous.

## Selector Rules

- `createFeatureSelector` maps to a feature selector.
- `createSelector` maps to target selector functions with input selector dependencies.
- Entity selectors map to Redux Toolkit entity selectors where adapter metadata is available.
- Router-store selectors map to React Router-derived selector intent only when route data mapping is clear.
- Complex selector projector logic may remain as safe expression text with review diagnostics.

## Effect Rules

- Simple action-to-service-call effects may map to thunk or listener middleware.
- Effects with `ofType`, `switchMap`, `mergeMap`, `concatMap`, `catchError`, and `map` preserve operator intent.
- Effects that navigate, call external APIs directly, depend on schedulers, or combine multiple streams are review-required by default.
- Effects must not be moved into React components unless the original behavior is component-local.
- Effect conversion builds on the RxJS conversion model from V2-GAP-UOW-04.

## Entity Adapter Rules

- `createEntityAdapter<T>()` maps to Redux Toolkit `createEntityAdapter<T>()` where type metadata is available.
- `adapter.getSelectors(...)` maps to generated selectors.
- Custom `selectId` and `sortComparer` are preserved as safe text and review-required unless transparent.
- Entity adapter reducer helpers such as `addOne`, `upsertMany`, and `removeOne` map to equivalent Redux Toolkit adapter calls where traceable.

## Component Store Usage Rules

- Constructor-injected `Store<T>` is removed from React component props/constructors.
- `store.select(selector)` maps to `useAppSelector(selector)`.
- `store.dispatch(action(payload))` maps to `dispatch(action(payload))` after `const dispatch = useAppDispatch()`.
- Store observable fields may reuse RxJS hook conversion if selector resolution is unclear.
- Ambiguous selectors/actions produce local review comments and central diagnostics.

## Uncertainty Rules

- Unsupported NgRx artifacts must not block safe action/reducer/selector output.
- Generated code may include `AIDLC_MANUAL_REVIEW_NGRX` comments near uncertain cases.
- Diagnostics must use safe source refs and generated refs, not raw proprietary source snippets.
- Review diagnostics must distinguish between unsupported, partially converted, and safely converted state behavior.

