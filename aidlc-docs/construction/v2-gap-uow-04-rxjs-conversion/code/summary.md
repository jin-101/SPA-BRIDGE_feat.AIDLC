# V2-GAP-UOW-04 Code Summary

## Implemented Scope

V2-GAP-UOW-04 adds first-class RxJS extraction, transformation carry-through, and React target hook generation.

The implementation is designed around the V2 runtime-parity goal: generated React projects should preserve Angular stream behavior as far as deterministic conversion can safely support, while producing manual-review diagnostics for risky stream semantics.

## Key Behaviors

- Extracts observable-like properties from `Observable<T>` type text, `$` suffixes, and observable-like initializers.
- Extracts `Subject`, `BehaviorSubject`, `ReplaySubject`, and `AsyncSubject` metadata.
- Extracts `.subscribe(...)` calls from Angular methods and lifecycle hooks.
- Extracts `pipe(...)` operator chains and classifies known operators.
- Detects `takeUntil`, `unsubscribe`, and `ngOnDestroy` cleanup evidence.
- Detects template `| async` expressions and matches them to extracted streams.
- Carries normalized RxJS IR through transformation into React component drafts.
- Generates local target helpers under `src/utils/rxjs/`.
- Materializes `useObservable`, `useSubjectValue`, and `useSubscriptionEffect` usage in generated React components.
- Rewrites async pipe interpolation and property expressions to hook value identifiers where available.

## Generated Runtime Strategy

Generated React targets receive project-local helpers:

- `src/utils/rxjs/useObservable.ts`
- `src/utils/rxjs/useSubjectValue.ts`
- `src/utils/rxjs/useSubscriptionEffect.ts`
- `src/utils/rxjs/index.ts`

The helpers subscribe inside React effects and unsubscribe during cleanup. No new external React observable library is added.

## Safety And Diagnostics

- Source code, observables, operators, and callbacks are never executed during conversion.
- Side-effect-heavy or ambiguous subscriptions receive local `AIDLC_MANUAL_REVIEW_RXJS` comments.
- Flattening and unknown operators are preserved as review-required metadata.
- Async pipe expressions that cannot be resolved produce stable manual-review diagnostics.

## Tests

Added tests covering:

- RxJS source extraction for streams, subjects, subscriptions, cleanup evidence, operator chains, and async pipe bindings.
- Property-based deterministic RxJS extraction.
- React target runtime helper generation.
- Async pipe JSX binding to generated observable hook values.
- RxJS dependency carry-through through the dependency compatibility layer.

## Residual Limitations

- Complex subscription callback rewriting is conservative.
- Flattening operators are preserved/reviewed unless they can safely remain as RxJS chains.
- Subject `.next/error/complete` API parity is not fully rewritten in this unit.
- Later NgRx and self-correction units should validate generated stream behavior inside larger converted projects.

