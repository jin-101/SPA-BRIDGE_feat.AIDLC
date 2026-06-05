# UOW-07 React Target Generation Artifact Index

## Application Code

- `packages/target-react/package.json` - workspace package definition and scripts
- `packages/target-react/tsconfig.json` - TypeScript project configuration
- `packages/target-react/src/index.ts` - public API exports
- `packages/target-react/src/types.ts` - target generation types and schemas
- `packages/target-react/src/generation/target-generation-service.ts` - orchestration service
- `packages/target-react/src/validation/target-generation-request-validator.ts` - request validation
- `packages/target-react/src/strategy/target-strategy-registry.ts` - strategy registry
- `packages/target-react/src/strategy/target-strategy-selection-policy.ts` - deterministic strategy selection
- `packages/target-react/src/strategies/vite-react-typescript.ts` - default scaffold strategy
- `packages/target-react/src/drafts/react-draft-normalizer.ts` - draft normalization
- `packages/target-react/src/materializers/component-materializer.ts` - component file materialization
- `packages/target-react/src/materializers/service-materializer.ts` - service file materialization
- `packages/target-react/src/routing/routing-output-adapter.ts` - route materialization
- `packages/target-react/src/state/state-output-adapters.ts` - state materialization
- `packages/target-react/src/path/target-path-guard.ts` - path containment guard
- `packages/target-react/src/path/overwrite-conflict-policy.ts` - overwrite handling policy
- `packages/target-react/src/path/target-conflict-detector.ts` - conflict detection
- `packages/target-react/src/write-plan/write-plan-builder.ts` - deterministic write plan builder
- `packages/target-react/src/write-plan/generated-file-spec-factory.ts` - file spec factory
- `packages/target-react/src/write-plan/content-hash-service.ts` - content hashing
- `packages/target-react/src/write-plan/stable-file-ref-factory.ts` - stable file refs
- `packages/target-react/src/dependencies/dependency-manifest-builder.ts` - dependency manifest generation
- `packages/target-react/src/dependencies/target-dependency-allowlist.ts` - exact version allowlist
- `packages/target-react/src/dependencies/dependency-rationale-builder.ts` - dependency rationale
- `packages/target-react/src/diagnostics/target-diagnostic-factory.ts` - safe diagnostics
- `packages/target-react/src/review/target-manual-review-factory.ts` - manual review items
- `packages/target-react/src/review/review-stub-generator.ts` - review stub files
- `packages/target-react/src/metadata/target-ecosystem-metadata-catalog.ts` - ecosystem metadata
- `packages/target-react/src/metadata/ecosystem-metadata-privacy-guard.ts` - metadata privacy guard
- `packages/target-react/src/traceability/target-trace-builder.ts` - trace link builder
- `packages/target-react/src/traceability/trace-coverage-validator.ts` - trace coverage validator
- `packages/target-react/src/testing/generators.ts` - fast-check generators
- `packages/target-react/tests/target-react.test.ts` - example and property-based tests

## Documentation

- `aidlc-docs/construction/uow-07-react-target-generation/code/summary.md` - generation summary
- `aidlc-docs/construction/uow-07-react-target-generation/code/artifact-index.md` - artifact index
