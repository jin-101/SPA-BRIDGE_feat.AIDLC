# V2-GAP-UOW-01 Artifact Index

## Source Analysis

- `packages/source-angular/src/aliases/alias-analyzer.ts`: extracts and classifies Angular/TypeScript alias metadata.
- `packages/source-angular/src/types.ts`: defines `SourceAliasModel`, path aliases, workspace project aliases, and alias diagnostics.
- `packages/source-angular/src/service/source-angular-analysis-service.ts`: adds alias analysis to `AngularAnalysisResult`.

## Transformation

- `packages/transform-angular-react/src/types.ts`: adds alias metadata to transformation context and React draft set.
- `packages/transform-angular-react/src/context/context-normalizer.ts`: carries alias metadata and emits transformation review diagnostics for unsupported aliases.
- `packages/transform-angular-react/src/drafts/draft-builder.ts`: preserves alias metadata in finalized draft sets.

## Target Generation

- `packages/target-react/src/strategies/vite-react-typescript.ts`: generates alias-aware `tsconfig.json`, `vite.config.ts`, and `src/metadata/alias-mapping.json`.
- `packages/target-react/src/generation/target-generation-service.ts`: includes alias counts in target summary.
- `packages/target-react/src/drafts/react-draft-normalizer.ts`: preserves alias metadata in normalized target bundles.

## CLI

- `packages/cli/src/bridges/application-bridge.ts`: writes `.spa-bridge/alias-mapping-summary.json` and includes alias counts in conversion reports.

## Tests

- `packages/source-angular/tests/source-angular.test.ts`
- `packages/target-react/tests/target-react.test.ts`
- existing transformation and CLI tests verify pipeline compatibility.

