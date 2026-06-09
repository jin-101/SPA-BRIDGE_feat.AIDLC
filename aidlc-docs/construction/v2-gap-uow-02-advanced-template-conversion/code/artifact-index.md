# V2-GAP-UOW-02 Artifact Index

## Source Analysis

- `packages/source-angular/src/templates/template-ir-builder.ts`: builds lightweight template IR from Angular template text.
- `packages/source-angular/src/templates/angular-template-parser-adapter.ts`: attaches template IR to `TemplateParseSummary`.
- `packages/source-angular/src/types.ts`: defines template IR entities and diagnostics.

## Transformation

- `packages/transform-angular-react/src/types.ts`: carries template IR on normalized and React template/component drafts.
- `packages/transform-angular-react/src/context/context-normalizer.ts`: preserves source template IR.
- `packages/transform-angular-react/src/converters/template-converter.ts`: emits review handoff for unsupported pipes and IR diagnostics.
- `packages/transform-angular-react/src/converters/component-converter.ts`: attaches template IR to component drafts.

## Target Generation

- `packages/target-react/src/materializers/template-jsx-renderer.ts`: renders advanced Angular template constructs into JSX intent.
- `packages/target-react/src/materializers/component-materializer.ts`: delegates template conversion to the renderer and emits required helpers.

## Tests

- `packages/source-angular/tests/source-angular.test.ts`
- `packages/target-react/tests/target-react.test.ts`

