# UOW-08 Domain Entities

## QualityRunRequest

Request to execute quality gates for a workspace run.

| Field | Description |
|---|---|
| `runId` | Conversion run identifier |
| `correlationId` | Request correlation identifier |
| `workspaceRoot` | Root path of the workspace under evaluation |
| `selectedGates` | Ordered or filtered quality gate requests |
| `artifactRefs` | Artifact refs for generated code, tests, and reports |
| `seed` | Optional seed for reproducible PBT execution |
| `policyContext` | Safe quality policy context |

## QualityGateDefinition

A single quality gate that can be scheduled and executed.

| Field | Description |
|---|---|
| `gateId` | Stable gate identifier |
| `displayName` | Safe display label |
| `order` | Deterministic execution order |
| `kind` | `build`, `lint`, `format`, `unit`, `integration`, `property` |
| `blocking` | Whether failure blocks continuation |
| `toolRef` | Abstract runner/tool reference |
| `summaryTemplate` | Safe summary shape for reporting |

## QualityGateRun

Execution record for one quality gate.

| Field | Description |
|---|---|
| `gateId` | Related quality gate |
| `status` | `passed`, `failed`, `skipped`, or `blocked` |
| `startedAt` | Start timestamp |
| `finishedAt` | Finish timestamp |
| `durationMs` | Measured duration |
| `safeSummary` | Safe display summary |
| `diagnosticRefs` | Related diagnostic refs |
| `traceRefs` | Related trace refs |

## QualityRunSummary

Aggregate result for the whole quality execution.

| Field | Description |
|---|---|
| `runId` | Conversion run identifier |
| `overallStatus` | `passed`, `partial`, `blocked`, or `manual-review` |
| `totalGates` | Number of gates evaluated |
| `passedGates` | Number of passing gates |
| `failedGates` | Number of failed gates |
| `blockedGates` | Number of blocked gates |
| `manualReviewCount` | Number of manual review items |
| `seed` | PBT seed used in the run |

## SelfCorrectionPlan

Bounded correction plan used when a gate fails.

| Field | Description |
|---|---|
| `planId` | Stable plan identifier |
| `targetGateId` | Gate being corrected |
| `retryBudget` | Maximum retry count |
| `correctionCandidates` | Safe candidate summaries |
| `stopReason` | Safe stop reason if correction ends early |
| `traceRefs` | Trace refs to the failing context |

## PropertyTestPlan

Property-based test plan for a conversion-sensitive function or artifact.

| Field | Description |
|---|---|
| `planId` | Stable plan identifier |
| `subject` | Function or artifact under test |
| `generatorFamily` | Domain-specific generator family |
| `propertyName` | Stable property name |
| `seed` | Reproducibility seed |
| `shrinkStrategy` | Shrinking/replay behavior |
| `exampleRegressions` | Example-based regressions preserved from failures |

## PropertyTestRun

Result of running a property-based test plan.

| Field | Description |
|---|---|
| `planId` | Related PBT plan |
| `status` | `passed`, `failed`, or `skipped` |
| `seed` | Seed used for the run |
| `counterexample` | Minimal failing case when available |
| `shrunk` | Whether shrinking produced a smaller case |
| `diagnosticRefs` | Related diagnostic refs |

## QualityEvidenceBundle

Evidence package for downstream reporting and audit.

| Field | Description |
|---|---|
| `evidenceId` | Stable evidence identifier |
| `runRef` | Related run ref |
| `gateRefs` | Related gate run refs |
| `summaryRef` | Safe summary ref |
| `traceRefs` | Safe trace refs |
| `diagnosticRefs` | Related diagnostic refs |

## ManualReviewItem

Quality issue requiring human review.

| Field | Description |
|---|---|
| `reviewId` | Stable review item identifier |
| `title` | Safe display title |
| `description` | Safe display description |
| `sourceRefs` | Safe source or artifact refs |
| `status` | `open`, `resolved`, or `deferred` |
| `reasonCode` | Stable reason code |

## QualityDiagnostic

Safe diagnostic emitted by the unit.

| Field | Description |
|---|---|
| `diagnosticId` | Stable diagnostic identifier |
| `code` | Stable reason code |
| `severity` | `info`, `warning`, `manual-review`, or `blocking` |
| `message` | Safe display message |
| `gateId` | Related gate identifier |
| `traceRefs` | Related trace refs |
| `remediationHint` | Safe remediation guidance |

## ToolRunnerRequest

Abstract request to a build/lint/test/format runner.

| Field | Description |
|---|---|
| `toolKind` | `build`, `lint`, `format`, `unit`, `integration`, or `property` |
| `commandRef` | Abstract command reference |
| `args` | Safe runner arguments |
| `workspaceRoot` | Target workspace root |
| `seed` | Optional reproducibility seed |

## ToolRunnerResult

Abstract result returned by a tool runner.

| Field | Description |
|---|---|
| `exitCode` | Process or command exit code |
| `status` | `passed`, `failed`, `skipped`, or `blocked` |
| `durationMs` | Execution duration |
| `safeSummary` | Safe summary message |
| `diagnosticRefs` | Diagnostic refs generated from the run |
| `traceRefs` | Trace refs to relevant artifacts |

