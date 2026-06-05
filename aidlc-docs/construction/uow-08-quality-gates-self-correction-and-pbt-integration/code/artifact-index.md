# UOW-08 Artifact Index

## Workspace Code

| Path | Kind | Notes |
|---|---|---|
| `packages/core-quality/package.json` | Package manifest | Workspace package definition and scripts |
| `packages/core-quality/tsconfig.json` | TypeScript config | Build configuration |
| `packages/core-quality/src/index.ts` | Public API | Package exports |
| `packages/core-quality/src/types.ts` | Types | Quality request, gate, summary, evidence, and runner contracts |
| `packages/core-quality/src/shared-errors.ts` | Utility | Stable errors, deterministic hashing, and result helpers |
| `packages/core-quality/src/validation/quality-request-validator.ts` | Validation | Request validation |
| `packages/core-quality/src/validation/validation-guard.ts` | Validation | Validation guard facade |
| `packages/core-quality/src/gates/gate-registry.ts` | Gate registry | Deterministic gate definitions |
| `packages/core-quality/src/gates/gate-selection-policy.ts` | Gate selection | Deterministic gate filtering |
| `packages/core-quality/src/runners/runner-adapter.ts` | Runner abstraction | Deterministic execution adapter |
| `packages/core-quality/src/runners/runner-plan-builder.ts` | Runner planning | Stable runner invocation plans |
| `packages/core-quality/src/correction/correction-candidate-factory.ts` | Correction support | Safe correction candidates |
| `packages/core-quality/src/correction/self-correction-planner.ts` | Correction | Bounded self-correction planner |
| `packages/core-quality/src/pbt/pbt-coordinator.ts` | PBT coordination | Seeded property execution |
| `packages/core-quality/src/testing/generators.ts` | Test utilities | fast-check generators |
| `packages/core-quality/src/evidence/evidence-aggregator.ts` | Evidence | Bounded evidence bundle builder |
| `packages/core-quality/src/diagnostics/quality-diagnostic-factory.ts` | Diagnostics | Safe structured diagnostics |
| `packages/core-quality/src/review/manual-review-factory.ts` | Review | Manual-review item generation |
| `packages/core-quality/src/summary/run-summary-builder.ts` | Summary | Structured run summaries |
| `packages/core-quality/src/traceability/quality-trace-builder.ts` | Traceability | Synthetic trace creation |
| `packages/core-quality/src/traceability/trace-coverage-validator.ts` | Traceability | Coverage validation |
| `packages/core-quality/src/generation/quality-orchestration-service.ts` | Orchestration | Main quality execution service |
| `packages/core-quality/tests/core-quality.test.ts` | Tests | Example-based and property-based tests |

## Documentation

| Path | Kind | Notes |
|---|---|---|
| `aidlc-docs/construction/uow-08-quality-gates-self-correction-and-pbt-integration/code/summary.md` | Summary | Code generation summary |
| `aidlc-docs/construction/uow-08-quality-gates-self-correction-and-pbt-integration/code/artifact-index.md` | Index | Generated artifact index |

