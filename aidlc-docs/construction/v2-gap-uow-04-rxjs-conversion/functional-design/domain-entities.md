# V2-GAP-UOW-04 Domain Entities

## AngularRxStreamModel

Represents an observable-like source member extracted from Angular TypeScript.

Fields:
- `id`: stable stream ID derived from owner, member name, and safe source ref.
- `ownerId`: owning component or service ID.
- `ownerKind`: `component`, `service`, `store-effect`, or `unknown`.
- `sourceRef`: safe source reference.
- `memberName`: source member name such as `passengers$`.
- `valueName`: React-friendly value name such as `passengersValue`.
- `typeText`: extracted type text such as `Observable<Passenger[]>`.
- `initializerText`: safe initializer expression text, never executed.
- `operatorChainIds`: ordered references to operator chains.
- `asyncPipeBindingIds`: template async pipe bindings that read from the stream.
- `diagnostics`: extraction and conversion findings.

## AngularRxSubjectModel

Represents subject-like state and event streams.

Fields:
- `id`: stable subject ID.
- `subjectKind`: `Subject`, `BehaviorSubject`, `ReplaySubject`, `AsyncSubject`, or `unknown`.
- `memberName`: source member name such as `destroy$`.
- `initialValueText`: safe initial value expression for `BehaviorSubject` where present.
- `nextCallRefs`: safe references to `.next(...)` call sites.
- `errorCallRefs`: safe references to `.error(...)` call sites.
- `completeCallRefs`: safe references to `.complete()` call sites.
- `cleanupRole`: `destroy-signal`, `state-source`, `event-source`, or `unknown`.
- `reviewRequired`: true when subject semantics cannot be represented by local state alone.

## AngularRxSubscriptionModel

Represents a subscription setup in a method, lifecycle hook, constructor, or property initializer.

Fields:
- `id`: stable subscription ID.
- `ownerId`: owning component or service ID.
- `sourceExpression`: safe expression text before `.subscribe(...)`.
- `nextCallbackText`: safe callback body or expression text.
- `errorCallbackText`: optional error callback text.
- `completeCallbackText`: optional complete callback text.
- `assignmentTarget`: inferred target state/property when callback assigns emitted values.
- `cleanupEvidence`: `takeUntil`, `subscription-add`, `ngOnDestroy-unsubscribe`, `none`, or `unknown`.
- `operatorChainId`: associated chain when subscription source is `pipe(...)`.
- `sideEffectLevel`: `none`, `state-assignment`, `method-call`, `external-effect`, or `unknown`.

## AngularRxOperatorChain

Represents an ordered `pipe(...)` chain without executing operators.

Fields:
- `id`: stable chain ID.
- `sourceExpression`: safe source expression before `.pipe(...)`.
- `operators`: ordered `AngularRxOperatorModel` entries.
- `hasFlattening`: true for `switchMap`, `mergeMap`, `concatMap`, or similar.
- `hasErrorHandling`: true when `catchError` or equivalent is present.
- `hasCleanupOperator`: true when `takeUntil`, `take`, `first`, or equivalent is present.
- `conversionSafety`: `safe`, `review-required`, or `unsupported`.

## AngularRxOperatorModel

Represents a single RxJS operator call.

Fields:
- `name`: operator name.
- `argumentText`: safe argument text.
- `operatorKind`: `projection`, `filter`, `side-effect`, `flattening`, `error-handling`, `timing`, `sharing`, `cleanup`, or `unknown`.
- `reviewRequired`: true when conversion may alter behavior.

## AngularAsyncPipeBinding

Represents template usage of the `async` pipe.

Fields:
- `id`: stable binding ID.
- `ownerComponentId`: owning component ID.
- `templateSourceRef`: safe template source ref.
- `expressionText`: expression before `| async`.
- `streamId`: matched `AngularRxStreamModel` ID when resolved.
- `bindingKind`: `interpolation`, `property`, `attribute`, `structural`, or `unknown`.
- `fallbackValueText`: optional fallback expression when available.
- `reviewRequired`: true when stream resolution is ambiguous.

## ReactRxHookDraft

Represents target hook usage that will be materialized into React component code.

Fields:
- `id`: stable hook draft ID.
- `ownerComponentId`: target component ID.
- `hookKind`: `useObservable`, `useSubjectValue`, or `useSubscriptionEffect`.
- `sourceStreamId`: source stream or subscription ID.
- `valueName`: state variable name emitted by the hook.
- `initialValueText`: target-safe initial value.
- `dependencyExpressions`: stable effect dependency list.
- `cleanupRequired`: true when a subscription is created.
- `reviewComments`: local review notes to emit near generated hook code.

## ReactObservableRuntimeContract

Project-local runtime helpers generated when RxJS patterns are present.

Required helpers:
- `useObservable`: subscribes to an observable and exposes the latest value.
- `useSubjectValue`: bridges subject-like values into React state while preserving review metadata.
- `useSubscriptionEffect`: runs subscription setup in `useEffect` and always returns cleanup.

Required behavior:
- never subscribe during render.
- always unsubscribe or complete cleanup on unmount.
- preserve initial value fallback.
- expose `value`, `error`, `completed`, and `loading` where useful.
- keep RxJS dependency local and explicit when source uses RxJS.

