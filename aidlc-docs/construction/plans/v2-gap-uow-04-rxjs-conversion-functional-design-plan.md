# V2-GAP-UOW-04 RxJS Conversion Functional Design Plan

## Unit

V2-GAP-UOW-04 RxJS Conversion

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-001 RxJS Conversion

Supporting requirements:
- V2-GAP-FR-004 Advanced Template Conversion handoff markers for `async` pipe.
- V2-GAP-FR-007 Generated React Self-Correction Loop will later validate generated hook output.

## Goal

Convert common Angular RxJS stream, subscription, and async pipe patterns into React-compatible hooks, state updates, cleanup behavior, and traceable diagnostics.

The converter should support common source patterns:

- `Observable<T>` properties.
- `Subject`, `BehaviorSubject`, `ReplaySubject`, and `AsyncSubject`.
- `.subscribe(...)` calls.
- `pipe(...)` chains.
- Operators such as `map`, `filter`, `tap`, `switchMap`, `mergeMap`, `concatMap`, `catchError`, `debounceTime`, `distinctUntilChanged`, `takeUntil`, and `shareReplay`.
- Template `async` pipe usage.
- Subscription cleanup in `ngOnDestroy`.

## Current Brownfield Baseline

Existing implementation already preserves:

- Angular property initializers and method bodies.
- Angular lifecycle hook names and basic `useEffect` review stubs.
- Template pipe usage and `async-pipe-handoff` diagnostics.
- Component draft carry-through from source analysis to React materialization.

Known gap:

- Observable, Subject, and subscription patterns are not extracted as first-class source models.
- `async` pipe output is not wired to generated React hook state.
- `takeUntil(this.destroy$)` and subscription cleanup are not modeled.
- Operator chains are not represented for deterministic target review or conversion.

## Proposed Functional Design

### 1. RxJS Source Model

Add RxJS extraction in `packages/source-angular`:

- detect observable-like properties by name/type/initializer.
- detect subject-like properties and initial values.
- detect `.subscribe(...)` calls in methods and lifecycle hooks.
- detect `pipe(...)` chains and known operators.
- detect `takeUntil` and destroy subject cleanup patterns.
- associate template `async` pipe expressions with source streams.

### 2. RxJS IR Carry-Through

Extend transformation model with:

- `AngularRxStreamModel`
- `AngularRxSubjectModel`
- `AngularRxSubscriptionModel`
- `AngularRxOperatorChain`
- `AngularAsyncPipeBinding`
- `NormalizedRxStreamModel`
- `ReactRxHookDraft`

### 3. React Target Model

Generate project-local observable utilities where RxJS patterns are detected:

- `useObservable`
- `useSubjectValue`
- `useSubscriptionEffect`

The target should use `useEffect` cleanup for subscriptions and expose latest emitted values through `useState`.

### 4. Template Integration

Map template async pipe expressions:

- `{{ data$ | async }}` should read from generated hook state such as `dataValue`.
- `[value]="data$ | async"` should bind to the hook value.
- async pipe expressions with unsupported operator chains should preserve visible JSX and emit manual-review diagnostics.

### 5. Diagnostics And Safety

Unsupported or lossy mappings should:

- preserve safe source refs and generated refs.
- never execute observables, operator functions, callbacks, or source code.
- generate manual-review diagnostics for side-effect-heavy streams.
- preserve partial generated hooks where safe.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the default React RxJS conversion approach?

A) Generate project-local hooks that subscribe to source observables and expose latest values through React state
B) Keep RxJS in generated React components with direct `.subscribe(...)` calls inline
C) Preserve RxJS references as comments only and require manual rewrite
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It provides runtime behavior while keeping subscription lifecycle centralized and reviewable.

### Question 2
How should `Observable<T>` properties and `$`-suffixed streams be represented?

A) Extract a stream IR with stable IDs, source refs, inferred value name, type text, initializer, and owning component/service
B) Detect only `$`-suffixed property names and ignore type/initializer metadata
C) Do not create stream IR until target generation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. Runtime parity needs both source metadata and stable transformation traces.

### Question 3
How should Subjects be converted?

A) Map `BehaviorSubject`/`ReplaySubject`/`Subject`/`AsyncSubject` to local hook state plus reviewable subject adapter metadata
B) Convert every Subject to plain `useState` and drop `next/error/complete` semantics
C) Mark all Subject usage unsupported
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It preserves visible behavior and still flags semantic gaps.

### Question 4
How should `.subscribe(...)` calls be converted?

A) Generate `useEffect` subscription setup with cleanup and map simple `next` callbacks to React state setters
B) Convert subscriptions to one-shot async calls without cleanup
C) Leave subscriptions inside generated React render functions
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. This is the safest React lifecycle equivalent.

### Question 5
How should `pipe(...)` operator chains be handled?

A) Preserve known operator chain metadata, convert simple safe chains, and emit diagnostics for side-effect-heavy or unsupported chains
B) Drop all operators and subscribe to the original source only
C) Attempt to inline every operator into React code regardless of complexity
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It balances useful conversion with safety.

### Question 6
How should flattening operators such as `switchMap`, `mergeMap`, and `concatMap` be treated?

A) Preserve operator intent, generate manual-review diagnostics by default, and only convert simple transparent cases
B) Convert all flattening operators to nested Promises
C) Ignore flattening operators
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. These often encode business-critical async behavior and should not be guessed.

### Question 7
How should `takeUntil(this.destroy$)` and `ngOnDestroy` cleanup be represented?

A) Convert to React `useEffect` cleanup and recognize destroy-subject patterns as cleanup evidence
B) Ignore Angular cleanup because React unmount handles it automatically
C) Preserve cleanup as comments only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. Subscription cleanup is essential for parity and leak prevention.

### Question 8
How should template `async` pipe usage be converted?

A) Bind `async` pipe expressions to generated observable hook values and preserve fallback diagnostics for unresolved streams
B) Convert all async pipe expressions to `String(observable)` placeholders
C) Leave the `async` pipe syntax unchanged
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. This directly addresses visible UI behavior.

### Question 9
How should target runtime dependencies be handled?

A) Keep existing/carried RxJS dependency when source uses RxJS and generate local React hooks around it
B) Remove RxJS from generated React output and rewrite all streams to native Promises
C) Add a new external React observable library by default
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. Source projects already use RxJS, and local hooks keep React integration clear.

### Question 10
What should be the blocking test focus for this unit?

A) RxJS model extraction, subscription cleanup, async pipe binding, operator diagnostics, deterministic output, and PBT invariants
B) Only example-based tests for one observable component
C) No blocking tests until NgRx conversion is complete
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. RxJS conversion is stateful and lifecycle-sensitive, so broad tests are worth it.

## Plan Checklist

- [x] Identify source requirement and affected packages.
- [x] Define functional design scope.
- [x] Define proposed RxJS conversion model.
- [x] Generate functional design questions.
- [x] Collect user answers.
- [x] Analyze answers for ambiguity.
- [x] Generate functional design artifacts.
- [x] Present functional design completion for approval.

## Security Baseline Compliance

- RxJS extraction must not execute source code, observables, callbacks, or operators.
- Diagnostics must use safe source refs and generated refs.
- Generated hooks must include cleanup paths where subscriptions are created.
- Unsupported streams must produce manual-review diagnostics instead of unsafe guessed behavior.

## Property-Based Testing Compliance

Required properties:

- Equivalent stream declarations produce stable RxJS IR.
- Operator chain normalization is deterministic.
- Unsupported operators produce stable diagnostics.
- Generated hook names remain valid identifiers.
- Generated observable helper files remain target-root contained.

## Approval Gate

Status: Functional design artifacts generated. Awaiting explicit approval to continue to code generation planning.
