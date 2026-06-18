# V2-GAP-UOW-08 Artifact Index

## Application Code

- `packages/target-react/src/enterprise/npmrc-parser.ts`
- `packages/target-react/src/enterprise/registry-migration-planner.ts`
- `packages/target-react/src/enterprise/source-script-translator.ts`
- `packages/target-react/src/enterprise/environment-contract-builder.ts`
- `packages/target-react/src/enterprise/package-manager-parity-planner.ts`
- `packages/target-react/src/enterprise/enterprise-artifact-materializer.ts`
- `packages/target-react/src/types.ts`
- `packages/target-react/src/index.ts`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/strategies/nextjs-typescript.ts`
- `packages/cli/src/bridges/application-bridge.ts`
- `packages/core-quality/src/types.ts`
- `packages/core-quality/src/runtime-parity/runtime-parity-quality-gate.ts`
- `packages/core-quality/src/self-correction/generated-target-command-planner.ts`
- `packages/core-reporting/src/types.ts`
- `packages/core-reporting/src/view-model/report-view-model-builder.ts`

## Tests

- `packages/target-react/tests/target-react.test.ts`
- `packages/core-quality/tests/core-quality.test.ts`

## Documentation

- `aidlc-docs/construction/plans/v2-gap-uow-08-private-registry-environment-and-script-parity-code-generation-plan.md`
- `aidlc-docs/construction/v2-gap-uow-08-private-registry-environment-and-script-parity/code/summary.md`
- `aidlc-docs/construction/v2-gap-uow-08-private-registry-environment-and-script-parity/code/artifact-index.md`

## Verification

- `npm run test --workspace @spa-bridge/target-react`
- `npm run test --workspace @spa-bridge/cli`
- `npm run test --workspace @spa-bridge/core-reporting`
- `npm run test --workspace @spa-bridge/core-quality`
- `npm test`
- `npm run build`
