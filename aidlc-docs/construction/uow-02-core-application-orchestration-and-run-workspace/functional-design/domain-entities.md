# UOW-02 Domain Entities

## Entity Overview

| Entity | Purpose | Key Relationships |
|---|---|---|
| `StartConversionRequest` | Caller input from CLI/Web UI. | Produces `ResolvedConversionConfig` and `ConversionRun`. |
| `ConversionRun` | Runtime aggregate for a conversion execution. | Owns run ID, status, manifest ref, workspace, and report state. |
| `ConversionRunId` | Stable identifier for a run. | Used by workspace paths, manifest, and status APIs. |
| `ResolvedConversionConfig` | Effective validated config after applying precedence. | Drives workflow coordination and target/provider choices. |
| `ConfigOverrideSet` | CLI/Web UI override values. | Applied over project config. |
| `RunWorkspace` | File-based run workspace under `.spa-bridge/runs/<runId>`. | Contains manifest, diagnostics, artifacts, reports, checkpoints. |
| `RunManifestState` | Application-layer view of UOW-01 run manifest plus orchestration metadata. | Updated throughout lifecycle. |
| `WorkflowStep` | Ordered orchestration step definition. | Produces `WorkflowStepResult`. |
| `WorkflowStepResult` | Result of a workflow step. | Carries diagnostics, artifact refs, status, checkpoints. |
| `ProviderPolicyDecision` | Decision record for provider access. | Blocks or allows provider-adjacent workflow steps. |
| `ReportState` | Canonical report-facing state held by the application layer. | Feeds report exporter port and UI status. |
| `ManualReviewState` | Collection of review items and statuses. | Read by CLI/Web UI and included in report state. |
| `ResumePlan` | Plan for continuing a recoverable run. | Derived from validated manifest and checkpoints. |

## Core Entities

### StartConversionRequest

| Field | Description |
|---|---|
| `inputPath` | Angular project path to convert. |
| `outputPath` | Target React output path. |
| `configPath` | Optional project config path. |
| `overrides` | CLI/Web UI override values. |
| `requestedBy` | Optional caller identity or interface label. |
| `correlationId` | Optional ID for logging/audit correlation. |

Business rules:
- Must validate paths before workspace mutation.
- Overrides must not bypass security policy.
- Caller type must not change orchestration semantics.

### ConversionRun

| Field | Description |
|---|---|
| `runId` | Unique run identifier. |
| `status` | Current status: pending, running, completed, failed, cancelled. |
| `config` | Effective resolved config snapshot. |
| `workspace` | Derived run workspace object. |
| `manifestState` | Current manifest-facing lifecycle state. |
| `reportState` | Current report-facing state. |
| `lastCheckpoint` | Last safe checkpoint for resume. |

Business rules:
- A run starts in `running` after workspace and manifest creation.
- Terminal statuses cannot transition back to `running` except through an explicit resume that creates a new continuation event.
- Failed runs retain partial state.

### ResolvedConversionConfig

| Field | Description |
|---|---|
| `inputPath` | Validated source project root. |
| `outputPath` | Validated target output path. |
| `targetProjectStrategy` | User-selected or default target strategy. |
| `stateStrategy` | User-selected or default state strategy. |
| `providerMode` | Local/internal/external provider mode. |
| `qualityOptions` | Compile/lint/test/self-correction preferences. |
| `reportOptions` | Export formats and report output location. |
| `sourcePrecedence` | Evidence of project config plus override precedence. |

Business rules:
- CLI/UI overrides win over project config.
- Defaults are normalized before validation completes.
- Unsafe provider settings produce blocking diagnostics.

### RunWorkspace

| Field | Description |
|---|---|
| `root` | `.spa-bridge/runs/<runId>` path. |
| `manifestPath` | `manifest.json` path. |
| `resolvedConfigPath` | `config.resolved.json` path. |
| `diagnosticsPath` | `diagnostics.json` path. |
| `artifactsDir` | Directory for step artifacts. |
| `reportsDir` | Directory for report exports. |
| `checkpointsDir` | Directory for recoverable checkpoints. |

Business rules:
- All derived paths remain under workspace root.
- Workspace is separate from target output path.
- Workspace creation is idempotent for an existing recoverable run only when resume is requested.

### RunManifestState

| Field | Description |
|---|---|
| `schemaVersion` | Manifest schema version. |
| `runId` | Run identity. |
| `status` | Current run lifecycle state. |
| `startedAt` | Run start timestamp. |
| `updatedAt` | Last manifest update timestamp. |
| `completedAt` | Optional completion timestamp. |
| `artifactRefs` | References to generated or intermediate artifacts. |
| `diagnosticRefs` | References to diagnostic artifacts. |
| `checkpointRefs` | References to safe resume points. |

Business rules:
- Updated after every step.
- Must validate before resume.
- Must include enough information for report reconstruction.

## Workflow Entities

### WorkflowStep

| Field | Description |
|---|---|
| `id` | Stable step identifier. |
| `name` | Safe display name. |
| `required` | Whether failure blocks the workflow. |
| `requiresPolicyDecision` | Whether policy must allow execution. |
| `inputArtifactRefs` | Expected input artifacts. |
| `outputArtifactKinds` | Expected output categories. |

Approved initial step categories:
- Configuration resolution
- Workspace initialization
- Source analysis invocation
- Transformation invocation
- Target generation invocation
- Quality gate invocation
- Report state update
- Export handoff

### WorkflowStepResult

| Field | Description |
|---|---|
| `stepId` | Step identifier. |
| `status` | succeeded, failed, skipped, blocked. |
| `diagnostics` | Step diagnostics. |
| `artifactRefs` | Artifacts emitted by the step. |
| `checkpointRef` | Optional safe checkpoint. |
| `policyDecision` | Optional policy result. |

Business rules:
- Required step failure triggers fail-fast.
- Non-blocking diagnostics may still allow continuation.
- Security-blocker diagnostics always stop unsafe provider or export behavior.

## Policy and Reporting Entities

### ProviderPolicyDecision

| Field | Description |
|---|---|
| `decisionId` | Stable policy decision identifier. |
| `providerMode` | local, internal, external, or disabled. |
| `allowed` | Whether provider access is allowed. |
| `reason` | Safe display rationale. |
| `securityDiagnostics` | Diagnostics produced by policy checks. |

Business rules:
- Provider calls require an allowed decision.
- External provider use fails closed when masking/policy status is incomplete.
- Decision state is reportable without raw sensitive values.

### ReportState

| Field | Description |
|---|---|
| `runSummary` | Current run summary. |
| `convertedFiles` | Conversion output records. |
| `diagnostics` | Aggregated diagnostics. |
| `qualityResults` | Quality gate results. |
| `traceabilityRef` | Traceability artifact reference. |
| `aiDecisionRecords` | Provider decision/AI assistance records. |
| `securityEvents` | Security and masking events. |
| `manualReviewState` | Review queue and status. |

Business rules:
- Canonical report state exists before export rendering.
- Exporter ports consume canonical state.
- CLI/Web UI read the same report-facing state.

### ManualReviewState

| Field | Description |
|---|---|
| `items` | Manual review items. |
| `openCount` | Number of unresolved items. |
| `resolvedCount` | Number of resolved items. |
| `deferredCount` | Number of deferred items. |
| `updatedAt` | Last update timestamp. |

Business rules:
- Manual review items are persisted even if conversion fails.
- CLI/Web UI can display and update item status in later units.
- Review state is included in report-facing state.

## Resume Entities

### ResumePlan

| Field | Description |
|---|---|
| `runId` | Run to resume. |
| `manifestRef` | Validated manifest artifact. |
| `resumeFromCheckpoint` | Last safe checkpoint. |
| `stepsToReplay` | Steps that must be rerun. |
| `preservedArtifactRefs` | Artifact refs that remain valid. |
| `reason` | Safe display explanation. |

Business rules:
- Resume requires a valid manifest and checkpoint.
- Corrupt or missing checkpoints force a new run.
- Resume must not silently discard diagnostics or manual review state.

## Domain Relationships

| Relationship | Description |
|---|---|
| `StartConversionRequest` creates `ConversionRun` | Request validation and config resolution create the run aggregate. |
| `ConversionRun` owns `RunWorkspace` | Workspace paths are derived from run ID. |
| `ConversionRun` updates `RunManifestState` | Manifest tracks lifecycle, artifacts, and checkpoints. |
| `WorkflowStep` emits `WorkflowStepResult` | Results update manifest, diagnostics, report state, and checkpoints. |
| `ProviderPolicyDecision` gates workflow steps | Provider-adjacent steps cannot execute without policy allow. |
| `ReportState` includes `ManualReviewState` | Review items are shared across report, CLI, and Web UI. |
| `ResumePlan` derives from `RunManifestState` | Recoverability depends on manifest and checkpoint consistency. |
