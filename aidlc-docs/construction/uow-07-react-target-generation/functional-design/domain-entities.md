# UOW-07 Domain Entities

## TargetGenerationRequest

Request to generate a React target project.

| Field | Description |
|---|---|
| `runId` | Conversion run identifier |
| `correlationId` | Request correlation identifier |
| `targetRoot` | Safe configured target output root |
| `targetStrategyId` | Optional requested target strategy |
| `overwritePolicy` | File replacement policy |
| `draftArtifactRefs` | UOW-04 target draft artifact refs |
| `generationOptions` | Safe target generation options |

## TargetGenerationResult

Final result returned by the target generation unit.

| Field | Description |
|---|---|
| `status` | `succeeded`, `partial`, `blocked`, or `manual-review` |
| `strategySelection` | Selected target strategy and rationale |
| `writePlan` | Deterministic write plan |
| `diagnostics` | Safe generation diagnostics |
| `manualReviewItems` | Manual-review records |
| `traces` | Source draft to generated file traceability |
| `artifactRefs` | Generated artifact references |

## TargetStrategyDescriptor

Describes a target generator strategy.

| Field | Description |
|---|---|
| `strategyId` | Stable target strategy identifier |
| `displayName` | Safe display name |
| `framework` | Target framework label |
| `projectType` | Project scaffold type |
| `default` | Whether this strategy is the default |
| `priority` | Deterministic selection priority |
| `capabilities` | Supported component, routing, state, style, and config capabilities |

## TargetStrategyRegistry

Collection of available target strategy descriptors and generators.

| Field | Description |
|---|---|
| `strategies` | Validated strategy descriptors |
| `defaultStrategyId` | Default target strategy ID |
| `selectionPolicy` | Deterministic target selection rules |

## TargetStrategySelection

Outcome of target strategy selection.

| Field | Description |
|---|---|
| `strategyId` | Selected strategy ID |
| `reasonCode` | Safe selection reason |
| `rationale` | Safe rationale for reports |
| `diagnostics` | Selection diagnostics |

## ReactTargetDraftBundle

Normalized UOW-04 draft input for UOW-07.

| Field | Description |
|---|---|
| `components` | React component drafts |
| `services` | Service and DI drafts |
| `routes` | Route drafts |
| `state` | State drafts and selected strategy evidence |
| `styles` | Style draft refs |
| `traces` | Conversion traces from UOW-04 |
| `manualReviewMarkers` | Existing review markers |

## TargetWritePlan

Deterministic plan for generated file writes.

| Field | Description |
|---|---|
| `planId` | Stable write plan ID |
| `targetRootRef` | Safe target root reference |
| `files` | Sorted generated file specs |
| `conflicts` | Conflict records |
| `blockingDiagnostics` | Diagnostics that prevent writing |
| `contentHash` | Aggregate write plan content hash |

## GeneratedFileSpec

Represents one generated target file.

| Field | Description |
|---|---|
| `fileRef` | Stable generated file reference |
| `targetPath` | Normalized target-relative path |
| `category` | `scaffold`, `component`, `route`, `state`, `service`, `style`, `review`, or `config` |
| `contentHash` | Stable hash of generated content |
| `content` | Generated file content when materialized in memory |
| `sourceDraftRefs` | Related UOW-04 draft refs |
| `syntheticOrigin` | Explicit origin for scaffold-only files |

## TargetConflict

Represents a write-plan conflict.

| Field | Description |
|---|---|
| `conflictId` | Stable conflict ID |
| `fileRef` | Related generated file ref |
| `targetPath` | Target-relative path |
| `conflictType` | `existing-file`, `duplicate-path`, `unsafe-path`, or `policy-blocked` |
| `severity` | Blocking or manual-review severity |
| `diagnosticRef` | Related diagnostic ref |

## DependencyManifest

Selected package metadata dependencies.

| Field | Description |
|---|---|
| `dependencies` | Runtime dependency map |
| `devDependencies` | Development dependency map |
| `scripts` | Target package scripts |
| `rationale` | Safe dependency selection rationale |
| `strategyRefs` | Related target/state/routing strategy refs |

## StateOutputPlan

Generated state files for the selected strategy.

| Field | Description |
|---|---|
| `strategy` | `react-context`, `redux-toolkit`, or `zustand` |
| `files` | Generated state file specs |
| `rationale` | Safe strategy rationale |
| `manualReviewItems` | State-related review items |

## RoutingOutputPlan

Generated routing output.

| Field | Description |
|---|---|
| `routerKind` | Target router kind, initially React Router-compatible |
| `routeFiles` | Generated route file specs |
| `routeRefs` | Route refs from UOW-04 |
| `guardReviewItems` | Manual-review items for guard semantics |
| `lazyLoadReviewItems` | Manual-review items for dynamic lazy loading |

## TargetGenerationTrace

Traceability link from draft to generated target output.

| Field | Description |
|---|---|
| `traceId` | Stable trace ID |
| `sourceDraftRefs` | UOW-04 draft refs |
| `generatedFileRef` | Generated file ref |
| `strategyId` | Target strategy ID |
| `diagnosticRefs` | Related diagnostic refs |
| `confidence` | Confidence or certainty level when available |

## TargetGenerationDiagnostic

Safe diagnostic emitted by UOW-07.

| Field | Description |
|---|---|
| `diagnosticId` | Stable diagnostic identifier |
| `code` | Stable reason code |
| `severity` | `info`, `warning`, `manual-review`, or `blocking` |
| `safeMessage` | Safe display message |
| `fileRef` | Optional generated file ref |
| `draftRefs` | Related source draft refs |
| `action` | Recommended next action |
