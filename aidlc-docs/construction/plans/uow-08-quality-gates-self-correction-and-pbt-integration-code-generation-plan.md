# Code Generation Plan - UOW-08 Quality Gates, Self-Correction, and PBT Integration

## Plan Status

- **Unit**: UOW-08 Quality Gates, Self-Correction, and PBT Integration
- **Stage**: Code Generation Planning
- **Status**: Awaiting explicit approval before code generation
- **Application Code Location**: `packages/core-quality/`
- **Documentation Location**: `aidlc-docs/construction/uow-08-quality-gates-self-correction-and-pbt-integration/code/`

## Unit Context

- **Primary Package(s)**: `packages/core-quality`
- **Primary Story**: US-011 Run Self-Correction and Quality Gates
- **Supporting Stories**: US-012 Apply Property-Based Testing to Conversion-Sensitive Logic, US-005, US-006, US-007, US-009, US-013
- **Upstream Inputs**:
  - UOW-01 core model contracts, safe refs, diagnostics, result envelopes, and stable IDs.
  - UOW-04 conversion-sensitive outputs and deterministic quality candidates.
  - UOW-05 security policy expectations for safe summaries and fail-closed behavior.
  - UOW-06 provider refinement outputs and safe manual-review boundaries.
  - UOW-07 target generation outputs, write-plan summaries, dependency rationale, and trace refs.
- **Downstream Consumers**:
  - UOW-09 reporting consumes structured quality summaries, trace refs, evidence refs, and review items.
  - UOW-10 CLI surfaces quality execution commands and status summaries.
  - UOW-11 Web UI surfaces quality results and manual-review items.

## Generation Approach

Create `@spa-bridge/core-quality` as a dedicated TypeScript workspace package. The package will expose deterministic orchestration for build, lint, format, unit, integration, and property-based quality checks. It will coordinate bounded self-correction, safe diagnostics, evidence bundling, and manual-review escalation without leaking raw source content.

The initial implementation will keep execution deterministic and runner-abstracted, so the CLI and UI layers can later invoke the same quality orchestration without duplicating policy, correction, or PBT behavior.

## Story Traceability

| Story | Coverage in This Unit |
|---|---|
| US-011 Run Self-Correction and Quality Gates | Ordered gate registry, runner abstraction, bounded self-correction, summary builder, escalation coordinator |
| US-012 Apply Property-Based Testing to Conversion-Sensitive Logic | PBT coordinator, generator families, replay support, regression retention |
| US-005 Convert Components, Templates, Bindings, and Lifecycle | Quality checks for converted artifacts and deterministic failure capture |
| US-006 Convert Services, Dependency Injection, Routing, and State | Quality checks for route/state outputs and review preservation |
| US-007 Use Local/Internal LLM for Difficult Mappings | Quality coordination for upstream conversion outputs and safe failure handling |
| US-009 Mask Sensitive Information Before External LLM Calls | Safe diagnostics and evidence handling that avoid raw sensitive payloads |
| US-013 Generate Conversion Reports and Exports | Structured summaries, evidence refs, and report-friendly quality outputs |

## Planned Code Generation Steps

### Step 1: Package Scaffold
- [x] Create `packages/core-quality/package.json`.
- [x] Create `packages/core-quality/tsconfig.json`.
- [x] Create `packages/core-quality/src/index.ts`.
- [x] Add `@spa-bridge/core-quality` to root `build` and `test` scripts.

### Step 2: Core Types and Contracts
- [x] Create `packages/core-quality/src/types.ts`.
- [x] Define quality request, gate definition, gate run, run summary, correction plan, PBT plan, evidence bundle, manual-review item, diagnostic, and runner request/result contracts.
- [x] Reuse UOW-01 safe refs, diagnostics, and result conventions where practical.

### Step 3: Shared Errors and Result Helpers
- [x] Create `packages/core-quality/src/shared-errors.ts`.
- [x] Create deterministic status/result helpers and safe error constructors.
- [x] Define stable sort helpers and safe summary helpers local to the package where needed.

### Step 4: Request Validation and Validation Guard
- [x] Create `packages/core-quality/src/validation/quality-request-validator.ts`.
- [x] Create `packages/core-quality/src/validation/validation-guard.ts`.
- [x] Validate run IDs, artifact refs, gate filters, PBT seeds, and policy context.
- [x] Reject malformed requests with safe blocking diagnostics.

### Step 5: Gate Registry and Runner Abstractions
- [x] Create `packages/core-quality/src/gates/gate-registry.ts`.
- [x] Create `packages/core-quality/src/gates/gate-selection-policy.ts`.
- [x] Create `packages/core-quality/src/runners/runner-adapter.ts`.
- [x] Create `packages/core-quality/src/runners/runner-plan-builder.ts`.
- [x] Resolve gates deterministically and build stable runner invocation plans.

### Step 6: Self-Correction Planner
- [x] Create `packages/core-quality/src/correction/self-correction-planner.ts`.
- [x] Create `packages/core-quality/src/correction/correction-candidate-factory.ts`.
- [x] Bound retry attempts, reuse safe summaries, and stop deterministically on unresolved blockers.

### Step 7: PBT Coordinator and Generator Families
- [x] Create `packages/core-quality/src/pbt/pbt-coordinator.ts`.
- [x] Create `packages/core-quality/src/testing/generators.ts`.
- [x] Coordinate seeded property runs, shrinking, replay metadata, and regression case retention.

### Step 8: Evidence, Diagnostics, and Manual Review
- [x] Create `packages/core-quality/src/evidence/evidence-aggregator.ts`.
- [x] Create `packages/core-quality/src/diagnostics/quality-diagnostic-factory.ts`.
- [x] Create `packages/core-quality/src/review/manual-review-factory.ts`.
- [x] Ensure safe summaries, bounded evidence bundles, and display-safe review items.

### Step 9: Summary Builder and Traceability
- [x] Create `packages/core-quality/src/summary/run-summary-builder.ts`.
- [x] Create `packages/core-quality/src/traceability/quality-trace-builder.ts`.
- [x] Create `packages/core-quality/src/traceability/trace-coverage-validator.ts`.
- [x] Produce structured gate summaries, aggregate results, and safe trace refs.

### Step 10: Orchestration Service
- [x] Create `packages/core-quality/src/generation/quality-orchestration-service.ts`.
- [x] Wire validation, gate selection, runner execution, correction, PBT, evidence, and summary flow.
- [x] Export a deterministic public API for quality orchestration.

### Step 11: Testing Utilities and Test Suites
- [x] Create `packages/core-quality/src/testing/generators.ts` if not already created in Step 7.
- [x] Create `packages/core-quality/tests/core-quality.test.ts`.
- [x] Add example tests for gate ordering, bounded retries, evidence shape, and safe diagnostics.
- [x] Add PBT tests for deterministic ordering, retry bounds, seed reproducibility, generator validity, failure classification stability, and regression retention.

### Step 12: Documentation and Verification Artifacts
- [x] Create `aidlc-docs/construction/uow-08-quality-gates-self-correction-and-pbt-integration/code/summary.md`.
- [x] Create `aidlc-docs/construction/uow-08-quality-gates-self-correction-and-pbt-integration/code/artifact-index.md`.
- [x] Run `npm run build --workspace @spa-bridge/core-quality`.
- [x] Run `npm run test --workspace @spa-bridge/core-quality`.
- [x] Run workspace-level `npm run build`.
- [x] Run workspace-level `npm run test`.

### Step 13: Continue or Complete Generation
- [x] All steps complete. Proceed to present completion message.

## Expected Application Files

| Path | Purpose |
|---|---|
| `packages/core-quality/package.json` | Package definition and scripts |
| `packages/core-quality/tsconfig.json` | TypeScript config |
| `packages/core-quality/src/index.ts` | Public API |
| `packages/core-quality/src/types.ts` | Shared contracts |
| `packages/core-quality/src/generation/quality-orchestration-service.ts` | Main orchestration service |
| `packages/core-quality/src/gates/*` | Gate registry and selection |
| `packages/core-quality/src/runners/*` | Runner adapters and plans |
| `packages/core-quality/src/correction/*` | Bounded self-correction |
| `packages/core-quality/src/pbt/*` | PBT coordination |
| `packages/core-quality/src/evidence/*` | Evidence aggregation |
| `packages/core-quality/src/diagnostics/*` | Safe diagnostics |
| `packages/core-quality/src/review/*` | Manual-review records and stubs |
| `packages/core-quality/src/summary/*` | Structured summaries |
| `packages/core-quality/src/traceability/*` | Trace generation and validation |
| `packages/core-quality/src/testing/*` | fast-check generators |
| `packages/core-quality/tests/core-quality.test.ts` | Example and property-based tests |

## Expected Documentation Files

| Path | Purpose |
|---|---|
| `aidlc-docs/construction/uow-08-quality-gates-self-correction-and-pbt-integration/code/summary.md` | Code generation summary |
| `aidlc-docs/construction/uow-08-quality-gates-self-correction-and-pbt-integration/code/artifact-index.md` | Generated artifact index |

## Acceptance Criteria

- `@spa-bridge/core-quality` builds as a workspace package.
- The package exports a deterministic quality orchestration API.
- Gate ordering, runner selection, and retry behavior are deterministic.
- Safe diagnostics and bounded evidence bundles are generated for every run.
- PBT is integrated with seeded replay and regression retention.
- Blocking failures fail closed and unresolved blockers escalate to manual review.
- Example tests and PBT pass for the package.
- Workspace build and test scripts include `@spa-bridge/core-quality`.

## Approval Gate

This plan is the single source of truth for UOW-08 code generation. Code generation must not begin until this plan is explicitly approved.
