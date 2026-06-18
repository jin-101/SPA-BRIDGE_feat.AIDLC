# V2-GAP-UOW-06 Animation Conversion Artifact Index

## Application Code

- `packages/source-angular/src/types.ts`
- `packages/source-angular/src/animations/animation-model-extractor.ts`
- `packages/source-angular/src/service/source-angular-analysis-service.ts`
- `packages/source-angular/src/index.ts`
- `packages/transform-angular-react/src/types.ts`
- `packages/transform-angular-react/src/context/context-normalizer.ts`
- `packages/transform-angular-react/src/converters/component-converter.ts`
- `packages/transform-angular-react/src/drafts/draft-builder.ts`
- `packages/transform-angular-react/src/pipeline/transformation-pipeline.ts`
- `packages/target-react/src/types.ts`
- `packages/target-react/src/drafts/react-draft-normalizer.ts`
- `packages/target-react/src/materializers/component-materializer.ts`
- `packages/target-react/src/materializers/animation-materializer.ts`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/dependencies/dependency-replacement-registry.ts`
- `packages/core-quality/src/types.ts`
- `packages/core-quality/src/runtime-parity/runtime-parity-quality-gate.ts`

## Tests

- `packages/source-angular/tests/source-angular.test.ts`
- `packages/target-react/tests/target-react.test.ts`
- Existing workspace tests through `npm test`.

## Generated Target Artifacts

- `src/animations/animations.css`
- `src/animations/{component-trigger}.ts`
- `src/review/animation-conversion-summary.json`
- `src/review/runtime-parity-quality.json`

## Verification

- Package tests for source, target, and quality packages.
- Workspace build.
- Workspace test suite.
