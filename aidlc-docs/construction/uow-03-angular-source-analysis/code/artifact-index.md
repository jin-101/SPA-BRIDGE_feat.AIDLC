# UOW-03 Artifact Index

## Application Code

- [`packages/source-angular/package.json`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/package.json>)
- [`packages/source-angular/tsconfig.json`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/tsconfig.json>)
- [`packages/source-angular/src/index.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/index.ts>)
- [`packages/source-angular/src/types.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/types.ts>)
- [`packages/source-angular/src/service/source-angular-analysis-service.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/service/source-angular-analysis-service.ts>)
- [`packages/source-angular/src/scanner/source-inventory-builder.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/scanner/source-inventory-builder.ts>)
- [`packages/source-angular/src/parser/typescript-parser-adapter.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/parser/typescript-parser-adapter.ts>)
- [`packages/source-angular/src/templates/angular-template-parser-adapter.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/templates/angular-template-parser-adapter.ts>)
- [`packages/source-angular/src/routes/route-analyzer.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/routes/route-analyzer.ts>)
- [`packages/source-angular/src/graph/graph-builder.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/graph/graph-builder.ts>)
- [`packages/source-angular/src/diagnostics/safe-diagnostic-builder.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/diagnostics/safe-diagnostic-builder.ts>)
- [`packages/source-angular/src/model/stable-id-factory.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/model/stable-id-factory.ts>)
- [`packages/source-angular/src/model/artifact-mapper.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/model/artifact-mapper.ts>)
- [`packages/source-angular/src/testing/generators.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/src/testing/generators.ts>)
- [`packages/source-angular/tests/source-angular.test.ts`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/packages/source-angular/tests/source-angular.test.ts>)

## Documentation

- [`aidlc-docs/construction/uow-03-angular-source-analysis/code/summary.md`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/aidlc-docs/construction/uow-03-angular-source-analysis/code/summary.md>)
- [`aidlc-docs/construction/uow-03-angular-source-analysis/code/artifact-index.md`](</Users/jhan/Desktop/test/ai-dlc/spa-bridge/aidlc-docs/construction/uow-03-angular-source-analysis/code/artifact-index.md>)

## Package-Level Notes

- `packages/source-angular` is the public analysis package for Angular source discovery and modeling.
- `@spa-bridge/core-model` is the shared contract dependency.
- Template parsing currently uses a deterministic heuristic path so the package can execute in the present workspace without a bundled Angular compiler runtime.
