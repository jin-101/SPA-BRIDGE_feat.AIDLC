# UOW-07 Logical Components

## Component Overview

| Component | Package Area | Responsibility |
|---|---|---|
| `TargetGenerationRequestSchema` | `packages/target-react/src/validation` | Validate generation request, output root refs, strategy ID, overwrite policy, and draft refs |
| `TargetGenerationService` | `packages/target-react/src/generation` | Orchestrate request validation, strategy selection, draft normalization, write-plan creation, safety validation, and result packaging |
| `TargetStrategyDescriptorSchema` | `packages/target-react/src/strategy` | Validate target strategy descriptors |
| `TargetStrategyRegistry` | `packages/target-react/src/strategy` | Store validated strategies and reject duplicates |
| `TargetStrategySelectionPolicy` | `packages/target-react/src/strategy` | Select strategies deterministically |
| `ViteReactTypeScriptStrategy` | `packages/target-react/src/strategies/vite-react-typescript` | Generate default Vite + React + TypeScript scaffold and source file specs |
| `ReactDraftNormalizer` | `packages/target-react/src/drafts` | Normalize UOW-04 component, service, route, state, style, and trace drafts |
| `GeneratedFileSpecFactory` | `packages/target-react/src/write-plan` | Create stable generated file specs from scaffold and draft materialization |
| `WritePlanBuilder` | `packages/target-react/src/write-plan` | Sort file specs, assign stable refs, hash content, and detect duplicates |
| `StableFileRefFactory` | `packages/target-react/src/write-plan` | Create stable file refs from category, path, draft refs, and synthetic origin |
| `ContentHashService` | `packages/target-react/src/write-plan` | Compute stable per-file and aggregate write-plan hashes |
| `TargetPathGuard` | `packages/target-react/src/path` | Normalize target-relative paths and enforce target root containment |
| `OverwriteConflictPolicy` | `packages/target-react/src/path` | Evaluate preserve-by-default and explicit overwrite behavior |
| `TargetConflictDetector` | `packages/target-react/src/path` | Detect existing file, duplicate path, duplicate ref, unsafe path, and policy conflicts |
| `DependencyManifestBuilder` | `packages/target-react/src/dependencies` | Build exact-version allowlisted target dependency manifests |
| `TargetDependencyAllowlist` | `packages/target-react/src/dependencies` | Define approved dependencies for target, routing, and state strategies |
| `DependencyRationaleBuilder` | `packages/target-react/src/dependencies` | Produce safe dependency rationale for reporting |
| `RoutingOutputAdapter` | `packages/target-react/src/routing` | Materialize React Router-compatible route output |
| `StateOutputAdapterRegistry` | `packages/target-react/src/state` | Select React Context, Redux Toolkit, or Zustand state output adapters |
| `ReactContextOutputAdapter` | `packages/target-react/src/state` | Generate React Context state files |
| `ReduxToolkitOutputAdapter` | `packages/target-react/src/state` | Generate Redux Toolkit state files |
| `ZustandOutputAdapter` | `packages/target-react/src/state` | Generate Zustand state files |
| `TargetManualReviewFactory` | `packages/target-react/src/review` | Create stable manual-review records |
| `ReviewStubGenerator` | `packages/target-react/src/review` | Generate deterministic review stubs when needed |
| `TargetDiagnosticFactory` | `packages/target-react/src/diagnostics` | Create stable safe diagnostics |
| `TraceCoverageValidator` | `packages/target-react/src/traceability` | Require draft refs or synthetic origin for every generated file |
| `TargetTraceBuilder` | `packages/target-react/src/traceability` | Build target generation traces for reporting |
| `TargetEcosystemMetadataCatalog` | `packages/target-react/src/metadata` | Define generic ecosystem category metadata |
| `EcosystemMetadataPrivacyGuard` | `packages/target-react/src/metadata` | Reject customer-specific or raw metadata |
| `TargetPbtGenerators` | `packages/target-react/src/testing` | Provide fast-check generators for target-generation domains |

## Package Boundary

`packages/target-react` owns target strategy selection, Vite React TypeScript scaffold generation, React source materialization, write-plan construction, dependency manifest generation, path safety, conflict records, manual-review stubs, and target traces.

`packages/target-react` must not own:

- Angular project scanning or parsing.
- Deterministic Angular-to-React transformation rules.
- AI provider invocation.
- Security masking internals or token vault storage.
- Quality gate execution.
- CLI command parsing or Web UI rendering.
- Report rendering.
- Deployment of generated React projects.

## Component Interactions

| From | To | Data | Rule |
|---|---|---|---|
| UOW-02 Orchestration | `TargetGenerationService` | Generation request, target root, strategy ID, overwrite policy, draft refs | Service validates before any write-plan construction |
| `TargetGenerationService` | `TargetGenerationRequestSchema` | Request payload | Invalid request blocks generation |
| `TargetGenerationService` | `TargetStrategyRegistry` | Strategy selection request | Selection must be deterministic |
| `TargetStrategyRegistry` | `TargetStrategySelectionPolicy` | Strategy descriptors | Stable ordering is required |
| `TargetGenerationService` | `ReactDraftNormalizer` | UOW-04 draft refs and loaded draft bundle | No raw Angular re-transformation |
| `ReactDraftNormalizer` | Strategy adapters | Normalized draft bundle | Draft schemas must be valid |
| Strategy adapters | `GeneratedFileSpecFactory` | Scaffold and materialized draft data | File specs carry refs and category metadata |
| `GeneratedFileSpecFactory` | `WritePlanBuilder` | File specs | Builder sorts, hashes, and detects duplicates |
| `WritePlanBuilder` | `TargetPathGuard` | Target-relative paths | Unsafe paths block write readiness |
| `WritePlanBuilder` | `OverwriteConflictPolicy` | Existing file conflicts and overwrite config | Preserve-by-default is required |
| `WritePlanBuilder` | `DependencyManifestBuilder` | Strategy and draft summaries | Dependencies must be allowlisted |
| `WritePlanBuilder` | `TraceCoverageValidator` | Generated file specs and traces | Missing trace coverage blocks write readiness |
| `TargetGenerationService` | `TargetDiagnosticFactory` | Validation and materialization failures | Diagnostics are safe and stable |
| `TargetGenerationService` | UOW-08/UOW-09 | Write plan, diagnostics, dependencies, traces | Downstream gets safe structured artifacts |

## Public API Shape

| API | Input | Output |
|---|---|---|
| `generateReactTarget(request)` | `TargetGenerationRequest` | `TargetGenerationResult` |
| `createTargetStrategyRegistry(strategies)` | Strategy descriptors and generators | `Result<TargetStrategyRegistry, TargetGenerationError>` |
| `selectTargetStrategy(request)` | Registry and requested strategy | `TargetStrategySelection` |
| `normalizeReactDrafts(bundle)` | UOW-04 draft bundle | `Result<NormalizedReactDraftBundle, TargetGenerationError>` |
| `buildWritePlan(request)` | File specs, target root, conflict policy | `TargetWritePlanResult` |
| `validateTargetPath(path)` | Target root and candidate target path | `Result<SafeTargetPath, TargetGenerationError>` |
| `buildDependencyManifest(summary)` | Target, routing, and state strategy summary | `DependencyManifest` |
| `validateTraceCoverage(plan)` | Write plan and trace records | `Result<TargetTrace[], TargetGenerationError>` |
| `buildReviewStub(item)` | Manual-review item | `GeneratedFileSpec` |

## Data Models

| Model | Key Fields |
|---|---|
| `TargetGenerationRequest` | `runId`, `correlationId`, `targetRoot`, `targetStrategyId`, `overwritePolicy`, `draftArtifactRefs`, `generationOptions` |
| `TargetGenerationResult` | `status`, `strategySelection`, `writePlan`, `diagnostics`, `manualReviewItems`, `traces`, `artifactRefs` |
| `TargetStrategyDescriptor` | `strategyId`, `displayName`, `framework`, `projectType`, `default`, `priority`, `capabilities` |
| `TargetStrategySelection` | `strategyId`, `reasonCode`, `rationale`, `diagnostics` |
| `NormalizedReactDraftBundle` | `components`, `services`, `routes`, `state`, `styles`, `traces`, `manualReviewMarkers` |
| `GeneratedFileSpec` | `fileRef`, `targetPath`, `category`, `contentHash`, `content`, `sourceDraftRefs`, `syntheticOrigin` |
| `TargetWritePlan` | `planId`, `targetRootRef`, `files`, `conflicts`, `blockingDiagnostics`, `contentHash` |
| `TargetConflict` | `conflictId`, `fileRef`, `targetPath`, `conflictType`, `severity`, `diagnosticRef` |
| `DependencyManifest` | `dependencies`, `devDependencies`, `scripts`, `rationale`, `strategyRefs` |
| `StateOutputPlan` | `strategy`, `files`, `rationale`, `manualReviewItems` |
| `RoutingOutputPlan` | `routerKind`, `routeFiles`, `routeRefs`, `guardReviewItems`, `lazyLoadReviewItems` |
| `TargetGenerationTrace` | `traceId`, `sourceDraftRefs`, `generatedFileRef`, `strategyId`, `diagnosticRefs`, `confidence` |
| `TargetGenerationDiagnostic` | `diagnosticId`, `code`, `severity`, `safeMessage`, `fileRef`, `draftRefs`, `action` |

## Failure Boundaries

| Failure | Component | Result |
|---|---|---|
| Invalid generation request | `TargetGenerationRequestSchema` | Blocking diagnostic |
| Unknown target strategy | `TargetStrategySelectionPolicy` | Blocking diagnostic |
| Duplicate strategy ID | `TargetStrategyRegistry` | Registry construction error |
| Invalid draft schema | `ReactDraftNormalizer` | Blocking or manual-review diagnostic by severity |
| Unsafe target path | `TargetPathGuard` | Blocking diagnostic |
| Existing file without overwrite policy | `OverwriteConflictPolicy` | Conflict record; not write-ready |
| Duplicate file ref | `WritePlanBuilder` | Blocking diagnostic |
| Duplicate target path | `WritePlanBuilder` | Blocking diagnostic unless deterministic merge is declared |
| Non-allowlisted dependency | `DependencyManifestBuilder` | Blocking diagnostic |
| Missing trace coverage | `TraceCoverageValidator` | Blocking diagnostic |
| Unsupported route guard | `RoutingOutputAdapter` | Manual-review diagnostic and review stub when useful |
| Unsupported state effect | State output adapter | Manual-review diagnostic and partial state output |
| Customer-specific ecosystem metadata | `EcosystemMetadataPrivacyGuard` | Metadata validation diagnostic |

## PBT Support Components

| Generator/Model | Purpose |
|---|---|
| `targetGenerationRequestArbitrary` | Valid and invalid target requests, strategies, overwrite policies, and target roots |
| `targetStrategyDescriptorArbitrary` | Strategy descriptors, duplicates, defaults, priorities, and capability sets |
| `reactDraftBundleArbitrary` | Component, route, service, state, style, trace, and manual-review draft combinations |
| `generatedFileSpecArbitrary` | Scaffold, component, route, state, service, review, style, and config file specs |
| `targetPathArbitrary` | Safe paths, traversal paths, absolute paths, reserved names, and duplicate paths |
| `dependencyManifestArbitrary` | Strategy-compatible and non-allowlisted dependency combinations |
| `targetDiagnosticArbitrary` | Stable diagnostics for invalid request, unsafe path, conflict, schema, and trace failures |
| `targetTraceArbitrary` | Draft-derived traces and synthetic origin traces |
| `targetConflictArbitrary` | Existing file, duplicate ref, duplicate path, unsafe path, and policy-block conflicts |
| `ecosystemMetadataArbitrary` | Generic metadata and customer-specific data violation cases |

## Integration Notes

- UOW-04 produces React-oriented drafts and conversion traces consumed by UOW-07.
- UOW-07 produces write plans and generated file refs consumed by UOW-08 quality gates.
- UOW-09 reports dependency rationale, write-plan summaries, diagnostics, traces, and manual-review items.
- UOW-10 and UOW-11 later expose overwrite policy and review workflows using UOW-07-safe records.
- UOW-07 does not execute generated code or quality tools; it creates buildable project structure for later verification.

## Code Generation Notes

- Keep `packages/target-react` dependency-light.
- Reuse UOW-01 result, diagnostic, safe ref, and validation patterns.
- Prefer pure functions for strategy selection, dependency selection, path validation, and write-plan building.
- Keep file-system writes separate from write-plan construction where possible.
- Use exact schema validation for public request/result boundaries.
- Keep tests split between target fixtures and PBT suites.
