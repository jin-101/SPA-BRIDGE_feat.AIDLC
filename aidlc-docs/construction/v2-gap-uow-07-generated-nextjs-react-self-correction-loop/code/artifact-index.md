# V2-GAP-UOW-07 Artifact Index

## Application Code

| Path | Purpose |
|---|---|
| `packages/core-quality/src/self-correction/generated-target-command-planner.ts` | Builds safe generated target command plans. |
| `packages/core-quality/src/self-correction/validation-result-classifier.ts` | Converts command failures into sanitized diagnostic categories. |
| `packages/core-quality/src/self-correction/deterministic-fixer-registry.ts` | Plans idempotent deterministic fixes. |
| `packages/core-quality/src/self-correction/ai-repair-boundary.ts` | Creates minimized local-first AI repair request summaries. |
| `packages/core-quality/src/self-correction/generated-target-self-correction-service.ts` | Orchestrates planning, classification, fix planning, AI repair summary, and final quality status. |
| `packages/core-quality/src/runtime-parity/runtime-parity-quality-gate.ts` | Adds self-correction signals to runtime parity scoring. |
| `packages/target-react/src/generation/target-generation-service.ts` | Emits `.spa-bridge/quality-gate-results.json` and passes self-correction data into runtime parity scoring. |
| `packages/cli/src/bridges/application-bridge.ts` | Adds self-correction artifact and status to CLI conversion reporting. |
| `packages/core-reporting/src/types.ts` | Adds optional self-correction summary to report quality section. |
| `packages/core-reporting/src/view-model/report-view-model-builder.ts` | Renders self-correction status in report view models. |

## Tests

| Path | Coverage |
|---|---|
| `packages/core-quality/tests/core-quality.test.ts` | Command planning, safe diagnostics, fixer idempotence, self-correction result summaries. |
| `packages/target-react/tests/target-react.test.ts` | Generated self-correction artifact and runtime parity signals. |

## Documentation

| Path | Purpose |
|---|---|
| `aidlc-docs/construction/plans/v2-gap-uow-07-generated-nextjs-react-self-correction-loop-code-generation-plan.md` | Executed code generation plan and checklist. |
| `aidlc-docs/construction/v2-gap-uow-07-generated-nextjs-react-self-correction-loop/code/summary.md` | Implementation and verification summary. |
| `aidlc-docs/construction/v2-gap-uow-07-generated-nextjs-react-self-correction-loop/code/artifact-index.md` | Traceable artifact list. |
