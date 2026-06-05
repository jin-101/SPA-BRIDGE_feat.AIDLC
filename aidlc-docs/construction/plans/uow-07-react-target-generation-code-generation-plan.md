# Code Generation Plan - UOW-07 React Target Generation

## Plan Status

- **Unit**: UOW-07 React Target Generation
- **Stage**: Code Generation Planning
- **Status**: Awaiting explicit approval before code generation
- **Application Code Location**: `packages/target-react/`
- **Documentation Location**: `aidlc-docs/construction/uow-07-react-target-generation/code/`

## Unit Context

- **Primary Package(s)**: `packages/target-react`
- **Primary Story**: US-002 Choose Target Project and State Strategy
- **Supporting Stories**: US-005, US-006, US-011, US-013, US-014
- **Upstream Inputs**:
  - UOW-01 shared refs, diagnostics, safe display strings, result-style model conventions.
  - UOW-04 React-oriented target drafts and conversion traces.
  - UOW-05 security expectations for safe diagnostics, dependency safety, and fail-closed behavior.
  - UOW-06 refined suggestions may affect upstream draft quality, but UOW-07 consumes validated drafts only.
- **Downstream Consumers**:
  - UOW-08 quality gates consume generated project structure and file refs.
  - UOW-09 reporting consumes write-plan summaries, traces, dependency rationale, diagnostics, and manual-review items.
  - UOW-10 CLI and UOW-11 Web UI later consume overwrite/conflict/review records.

## Generation Approach

Create `@spa-bridge/target-react` as a dedicated TypeScript workspace package. The package will expose a deterministic target generation API that turns UOW-04 draft sets into write-ready Vite + React + TypeScript file specs and write plans.

The initial implementation will generate in-memory write plans and file content specs. It will keep file-system writes separate so CLI/Web UI can later decide when and how to apply a write plan.

## Story Traceability

| Story | Coverage in This Unit |
|---|---|
| US-002 Choose Target Project and State Strategy | Target strategy registry, default Vite React TypeScript strategy, state output adapters, dependency rationale |
| US-005 Convert Components, Templates, Bindings, and Lifecycle | Component/template draft materialization into `.tsx` file specs |
| US-006 Convert Services, DI, Routing, and State | Service, route, and state output adapters with manual-review preservation |
| US-011 Run Self-Correction and Quality Gates | Build/test-ready project structure and write-plan artifacts for UOW-08 |
| US-013 Generate Conversion Reports and Exports | Trace records, dependency rationale, diagnostics, write-plan summaries for UOW-09 |
| US-014 Preserve Extensible Architecture Evidence | Strategy registry, reusable generator interfaces, stable traceability |

## Planned Code Generation Steps

### Step 1: Package Scaffold
- [x] Create `packages/target-react/package.json`.
- [x] Create `packages/target-react/tsconfig.json`.
- [x] Create `packages/target-react/src/index.ts`.
- [x] Add `@spa-bridge/target-react` to root `build` and `test` scripts.

### Step 2: Core Types and Schemas
- [x] Create `packages/target-react/src/types.ts`.
- [x] Define target generation request/result, strategy descriptors, normalized draft bundle, generated file specs, write plan, conflicts, dependencies, traces, diagnostics, and error schemas.
- [x] Reuse UOW-01 safe refs and diagnostics where practical.

### Step 3: Shared Errors and Utilities
- [x] Create `packages/target-react/src/shared-errors.ts`.
- [x] Create stable error helpers and result helpers.
- [x] Define stable sorting and safe string helpers local to the package where needed.

### Step 4: Request Validation
- [x] Create `packages/target-react/src/validation/target-generation-request-validator.ts`.
- [x] Validate run ID, correlation ID, target root, strategy ID, overwrite policy, generation options, and draft artifact refs.
- [x] Reject malformed requests with safe blocking diagnostics.

### Step 5: Target Strategy Registry
- [x] Create `packages/target-react/src/strategy/target-strategy-registry.ts`.
- [x] Create `packages/target-react/src/strategy/target-strategy-selection-policy.ts`.
- [x] Reject duplicate strategy IDs.
- [x] Select strategies deterministically by explicit ID, default marker, priority, and strategy ID.

### Step 6: Vite React TypeScript Strategy
- [x] Create `packages/target-react/src/strategies/vite-react-typescript.ts`.
- [x] Generate base scaffold specs for `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, and `src/App.tsx`.
- [x] Expose strategy metadata and dependency summary.

### Step 7: Draft Normalization
- [x] Create `packages/target-react/src/drafts/react-draft-normalizer.ts`.
- [x] Normalize UOW-04 `ReactTargetDraftSet` into component, service, route, state, style, trace, and manual-review groups.
- [x] Preserve manual-review markers without raw source snippets.

### Step 8: Component, Service, Route, and State Materializers
- [x] Create `packages/target-react/src/materializers/component-materializer.ts`.
- [x] Create `packages/target-react/src/materializers/service-materializer.ts`.
- [x] Create `packages/target-react/src/routing/routing-output-adapter.ts`.
- [x] Create `packages/target-react/src/state/state-output-adapters.ts`.
- [x] Materialize deterministic `.tsx` and `.ts` file specs for supported drafts.
- [x] Preserve unsupported behavior as manual-review diagnostics and review stubs.

### Step 9: Path Safety and Conflict Policy
- [x] Create `packages/target-react/src/path/target-path-guard.ts`.
- [x] Create `packages/target-react/src/path/overwrite-conflict-policy.ts`.
- [x] Create `packages/target-react/src/path/target-conflict-detector.ts`.
- [x] Enforce target root containment, traversal rejection, duplicate path detection, and preserve-by-default conflict behavior.

### Step 10: Write Plan Builder
- [x] Create `packages/target-react/src/write-plan/stable-file-ref-factory.ts`.
- [x] Create `packages/target-react/src/write-plan/content-hash-service.ts`.
- [x] Create `packages/target-react/src/write-plan/generated-file-spec-factory.ts`.
- [x] Create `packages/target-react/src/write-plan/write-plan-builder.ts`.
- [x] Sort file specs, compute hashes, assign stable file refs, and reject duplicate refs/paths.

### Step 11: Dependency Manifest Builder
- [x] Create `packages/target-react/src/dependencies/target-dependency-allowlist.ts`.
- [x] Create `packages/target-react/src/dependencies/dependency-manifest-builder.ts`.
- [x] Create `packages/target-react/src/dependencies/dependency-rationale-builder.ts`.
- [x] Generate exact-pinned allowlisted dependencies for React, React DOM, Vite, TypeScript, React Router, Redux Toolkit, and Zustand when selected.

### Step 12: Diagnostics, Review, Metadata, and Traceability
- [x] Create `packages/target-react/src/diagnostics/target-diagnostic-factory.ts`.
- [x] Create `packages/target-react/src/review/target-manual-review-factory.ts`.
- [x] Create `packages/target-react/src/review/review-stub-generator.ts`.
- [x] Create `packages/target-react/src/metadata/target-ecosystem-metadata-catalog.ts`.
- [x] Create `packages/target-react/src/metadata/ecosystem-metadata-privacy-guard.ts`.
- [x] Create `packages/target-react/src/traceability/target-trace-builder.ts`.
- [x] Create `packages/target-react/src/traceability/trace-coverage-validator.ts`.

### Step 13: Target Generation Service
- [x] Create `packages/target-react/src/generation/target-generation-service.ts`.
- [x] Orchestrate validation, strategy selection, draft normalization, scaffold/materialization, dependency manifest building, write-plan creation, path/conflict validation, trace validation, and result packaging.
- [x] Export `generateReactTarget` from the package public API.

### Step 14: Test Generators and Unit/PBT Tests
- [x] Create `packages/target-react/src/testing/generators.ts`.
- [x] Create `packages/target-react/tests/target-react.test.ts`.
- [x] Add example tests for scaffold generation, strategy selection, dependency manifest, path safety, conflict behavior, and trace coverage.
- [x] Add PBT tests for write-plan determinism, path containment, idempotence, dependency stability, diagnostic stability, and trace coverage.

### Step 15: Code Documentation and Verification
- [x] Create `aidlc-docs/construction/uow-07-react-target-generation/code/summary.md`.
- [x] Create `aidlc-docs/construction/uow-07-react-target-generation/code/artifact-index.md`.
- [x] Run `npm run build --workspace @spa-bridge/target-react`.
- [x] Run `npm run test --workspace @spa-bridge/target-react`.
- [x] Run workspace-level `npm run build`.
- [x] Run workspace-level `npm run test`.
- [x] Mark all completed plan steps `[x]` during generation.

## Expected Application Files

| Path | Purpose |
|---|---|
| `packages/target-react/package.json` | Package definition and scripts |
| `packages/target-react/tsconfig.json` | TypeScript config |
| `packages/target-react/src/index.ts` | Public API |
| `packages/target-react/src/types.ts` | Schemas and exported types |
| `packages/target-react/src/generation/target-generation-service.ts` | Main orchestration service |
| `packages/target-react/src/strategy/*` | Strategy registry and selection |
| `packages/target-react/src/strategies/vite-react-typescript.ts` | Default target strategy |
| `packages/target-react/src/drafts/*` | Draft normalization |
| `packages/target-react/src/materializers/*` | Component/service file materialization |
| `packages/target-react/src/routing/*` | Route output |
| `packages/target-react/src/state/*` | State strategy adapters |
| `packages/target-react/src/path/*` | Path guard and conflict policy |
| `packages/target-react/src/write-plan/*` | File specs, hashes, refs, and write plans |
| `packages/target-react/src/dependencies/*` | Dependency manifest and rationale |
| `packages/target-react/src/diagnostics/*` | Stable safe diagnostics |
| `packages/target-react/src/review/*` | Manual-review records and stubs |
| `packages/target-react/src/metadata/*` | Generic ecosystem metadata |
| `packages/target-react/src/traceability/*` | Trace generation and validation |
| `packages/target-react/src/testing/*` | fast-check generators |
| `packages/target-react/tests/target-react.test.ts` | Example and property-based tests |

## Expected Documentation Files

| Path | Purpose |
|---|---|
| `aidlc-docs/construction/uow-07-react-target-generation/code/summary.md` | Code generation summary |
| `aidlc-docs/construction/uow-07-react-target-generation/code/artifact-index.md` | Generated artifact index |

## Acceptance Criteria

- `@spa-bridge/target-react` builds as a workspace package.
- The package exports a deterministic `generateReactTarget` API.
- Default Vite React TypeScript scaffold generation is available.
- Target strategy selection is deterministic.
- Write plans are stable, sorted, hash-backed, and trace-covered.
- Unsafe paths and duplicate refs/paths fail closed.
- Dependency manifests use exact-pinned allowlisted dependencies only.
- Unsupported drafts produce safe manual-review diagnostics instead of silent drops.
- Example tests and PBT pass for the package.
- Workspace build and test scripts include `@spa-bridge/target-react`.

## Approval Gate

This plan is the single source of truth for UOW-07 code generation. Code generation must not begin until this plan is explicitly approved.
