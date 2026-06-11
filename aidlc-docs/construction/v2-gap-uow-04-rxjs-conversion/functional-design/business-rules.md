# V2-GAP-UOW-04 Business Rules

## Runtime Parity Rules

- Generated React output should preserve visible Angular behavior where a safe RxJS mapping exists.
- Observable subscriptions must be created inside React effects or local hooks, never during render.
- Every generated subscription must have a cleanup path.
- Source `rxjs` dependency should remain in the target dependency manifest when source code uses RxJS.
- Project-local hooks are preferred over adding a new React observable library.

## Stream Extraction Rules

- Members with `Observable<T>` type text map to `AngularRxStreamModel`.
- Members with `$` suffix and observable-like initializer map to `AngularRxStreamModel`.
- `Subject`, `BehaviorSubject`, `ReplaySubject`, and `AsyncSubject` initializers map to `AngularRxSubjectModel`.
- `BehaviorSubject(initial)` preserves the safe initial value text when available.
- Stream and subject IDs must be stable across runs.
- Extraction must not execute source initializers, callbacks, operators, or observables.

## Subscription Rules

- `.subscribe(next)` maps to `useSubscriptionEffect` when the source expression is stable.
- `.subscribe({ next, error, complete })` preserves callback categories.
- Simple `next` callbacks that assign emitted values to component fields may map to React state setters.
- Callback bodies that call external APIs, mutate complex objects, or trigger navigation are preserved with manual-review diagnostics.
- Inline subscriptions in constructors, `ngOnInit`, methods, and lifecycle hooks are modeled before target generation.

## Cleanup Rules

- `takeUntil(this.destroy$)` is cleanup evidence and should become React effect cleanup.
- `ngOnDestroy` patterns calling `destroy$.next()` and `destroy$.complete()` identify destroy subjects.
- `subscription.unsubscribe()` in `ngOnDestroy` is cleanup evidence.
- Missing cleanup on long-lived subscriptions produces a warning and generated cleanup fallback where safe.
- Generated cleanup must be idempotent.

## Operator Rules

- Known projection and filter operators such as `map` and `filter` may remain in RxJS chains when the target keeps RxJS.
- `tap` is side-effect evidence and should emit a review diagnostic unless the side effect is clearly local state assignment.
- Timing operators such as `debounceTime` and `distinctUntilChanged` preserve operator intent.
- `catchError` preserves error handling metadata and may expose hook error state.
- `shareReplay` preserves sharing intent and emits review metadata when cache semantics matter.
- Unknown operators produce stable diagnostics and do not block adjacent safe conversion.

## Flattening Operator Rules

- `switchMap`, `mergeMap`, `concatMap`, and similar operators are business-critical async behavior.
- Flattening operators preserve operator intent in IR.
- Simple transparent cases may keep the RxJS chain and bind the resulting observable with `useObservable`.
- Non-trivial flattening chains emit manual-review diagnostics rather than being rewritten to Promises.

## Async Pipe Rules

- `{{ stream$ | async }}` maps to a generated hook value such as `{streamValue}`.
- `[prop]="stream$ | async"` maps to `prop={streamValue}`.
- Async pipe bindings must resolve to stream IR when possible.
- Unresolved async pipe expressions preserve JSX structure and emit local plus central diagnostics.
- Async pipe conversion must preserve fallback/null-safe behavior where source template includes it.

## Subject Rules

- `BehaviorSubject` may expose initial state through `useSubjectValue`.
- Plain `Subject` is event-like and review-required when its current value is read.
- `.next(value)` can map to local setter metadata only when the target state relationship is clear.
- `.error()` and `.complete()` semantics are review-required unless they only support cleanup.
- Destroy subjects should not become user-visible state.

## Uncertainty Rules

- Unsupported RxJS patterns must not prevent safe neighboring streams from converting.
- Generated code may include local `AIDLC_MANUAL_REVIEW_RXJS` comments at uncertain hook or callback sites.
- Diagnostics must use safe source refs and generated refs, not raw proprietary source snippets.
- Review diagnostics must distinguish unsupported behavior from converted behavior.

