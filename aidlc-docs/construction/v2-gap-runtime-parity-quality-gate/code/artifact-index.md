# V2 Runtime Parity Target Update Artifact Index

## Application Code

- `packages/target-react/src/strategies/nextjs-typescript.ts`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/dependencies/dependency-manifest-builder.ts`
- `packages/target-react/src/dependencies/target-dependency-allowlist.ts`
- `packages/target-react/src/validation/target-generation-request-validator.ts`
- `packages/core-quality/src/runtime-parity/runtime-parity-quality-gate.ts`
- `packages/core-application/src/config/config.ts`
- `packages/core-application/src/types.ts`
- `packages/cli/src/bridges/application-bridge.ts`
- `packages/transform-angular-react/src/types.ts`

## Tests

- `packages/target-react/tests/target-react.test.ts`
- `packages/core-quality/tests/core-quality.test.ts`
- `packages/cli/tests/cli.test.ts`
- `packages/transform-angular-react/tests/transform-angular-react.test.ts`

## Generated Target Artifacts

- Next.js App Router scaffold files.
- `src/review/runtime-parity-quality.json`.

## Verification

- Workspace build: `npm run build`
- Workspace tests: `npm test`
