# V2-GAP-UOW-04 Artifact Index

## Application Code

- `packages/source-angular/src/types.ts`
- `packages/source-angular/src/rxjs/rxjs-model-extractor.ts`
- `packages/source-angular/src/service/source-angular-analysis-service.ts`
- `packages/source-angular/src/index.ts`
- `packages/source-angular/tests/source-angular.test.ts`
- `packages/transform-angular-react/src/types.ts`
- `packages/transform-angular-react/src/context/context-normalizer.ts`
- `packages/transform-angular-react/src/converters/component-converter.ts`
- `packages/transform-angular-react/src/testing/benchmark-fixture-factory.ts`
- `packages/target-react/src/materializers/component-materializer.ts`
- `packages/target-react/src/materializers/template-jsx-renderer.ts`
- `packages/target-react/src/materializers/rxjs-runtime-materializer.ts`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/index.ts`
- `packages/target-react/src/testing/generators.ts`
- `packages/target-react/tests/target-react.test.ts`

## Generated Target Artifact Shape

- `src/utils/rxjs/useObservable.ts`
- `src/utils/rxjs/useSubjectValue.ts`
- `src/utils/rxjs/useSubscriptionEffect.ts`
- `src/utils/rxjs/index.ts`
- React component hook calls for observable and subscription drafts.

## Documentation

- `aidlc-docs/construction/v2-gap-uow-04-rxjs-conversion/code/summary.md`
- `aidlc-docs/construction/v2-gap-uow-04-rxjs-conversion/code/artifact-index.md`

## Verification

- `npm run test --workspace @spa-bridge/source-angular`
- `npm run test --workspace @spa-bridge/transform-angular-react`
- `npm run test --workspace @spa-bridge/target-react`
- `npm run build`
- `npm test`

