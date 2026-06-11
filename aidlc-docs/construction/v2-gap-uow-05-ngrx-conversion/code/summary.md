# V2-GAP-UOW-05 NgRx Conversion Code Summary

## Scope

Implemented NgRx conversion support across the SPA-Bridge pipeline:

- Source analysis extracts NgRx actions, reducers, reducer handlers, selectors, effects, entity adapters, router-store evidence, and component Store usage.
- Transformation carries normalized NgRx IR into React drafts and creates Redux Toolkit draft metadata.
- Target generation emits Redux Toolkit store files, typed React Redux hooks, slices, selectors, effect handoff files, dependency manifest entries, and component hook usage.

## Runtime Strategy

NgRx is mapped to Redux Toolkit and React Redux:

- `createAction` and `createReducer` evidence becomes generated slice actions and reducers.
- `createFeatureSelector` and `createSelector` evidence becomes generated selector files.
- `createEntityAdapter` evidence becomes Redux Toolkit entity adapter declarations with custom `selectId` and `sortComparer` retained as review comments.
- `createEffect` evidence becomes effect handoff files that preserve operator and service-call intent without moving app-wide effects into component render code.
- Component `store.select(...)` evidence becomes `useAppSelector(...)` usage.
- Component `store.dispatch(...)` evidence becomes `useAppDispatch()` dispatch usage or local dispatch wrappers.

## Safety

The implementation does not execute Angular source code, reducers, selectors, effects, entity adapters, or RxJS streams. It extracts safe text evidence and emits manual-review diagnostics/comments for uncertain mappings.

## Residual Limitations

- Complex reducer bodies are preserved as review-required metadata rather than fully interpreted.
- Effects with navigation, browser APIs, multi-stream composition, or unclear dispatch behavior require manual review.
- Generated selector/component rewrites favor a runnable target over perfect semantic reconstruction when source dependency resolution is incomplete.
- Router-store coupling is detected and marked for route-state parity review.
