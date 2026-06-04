# UOW-02 Business Logic Model

## Unit Purpose

UOW-02 defines the shared in-process application layer for SPA-Bridge. It is the entry point used by the CLI and Web UI to start, inspect, resume, and export conversion runs. It coordinates domain services through UOW-01 ports and models while keeping parsing, transformation, security implementation, target generation, quality checks, and report rendering in their own units.

## Core Business Capabilities

| Capability | Description | Primary Outputs |
|---|---|---|
| Conversion Run Start | Accept run requests from CLI/Web UI and create a validated execution context. | `ConversionRun`, `ConversionRunId`, initialized manifest |
| Configuration Resolution | Load project config, merge CLI/UI overrides, normalize, and validate effective config. | `ResolvedConversionConfig`, config diagnostics |
| Run Workspace Management | Create and manage `.spa-bridge/runs/<runId>` directories and artifact references. | `RunWorkspace`, artifact paths, workspace manifest |
| Manifest Lifecycle | Create manifest at start, update progress, preserve partial state, finalize terminal status. | `RunManifest`, manifest events |
| Workflow Coordination | Invoke downstream capabilities through ports and unit-facing interfaces in a controlled sequence. | `WorkflowStepResult`, diagnostics, partial artifacts |
| Provider Policy Coordination | Enforce policy gates before AI/provider use while delegating masking and provider behavior to later units. | `ProviderPolicyDecision`, security diagnostics |
| Report Handoff | Maintain canonical report state and request markdown/html export through report exporter ports. | `ReportExportRequest`, export artifact refs |
| Run Resume | Load recoverable manifests and resume from the last safe checkpoint. | `ResumePlan`, resumed run context |
| Manual Review State | Persist manual review items in manifest/report-facing state for CLI/Web UI display. | `ManualReviewState`, review item updates |

## Primary Workflow

### Start Conversion

1. CLI or Web UI submits a `StartConversionRequest`.
2. The application service validates input paths and caller-provided options.
3. Configuration is loaded from project config and then overlaid with CLI/UI overrides.
4. A new run ID is assigned.
5. `.spa-bridge/runs/<runId>` is created.
6. The run manifest is created in `running` status.
7. The workflow coordinator runs ordered domain steps through ports and unit-facing contracts.
8. The manifest is updated after each step.
9. On success, the manifest is finalized as `completed`.
10. On failure, the manifest is finalized as `failed` while preserving diagnostics and partial artifacts.

### Configuration Resolution

1. Discover project config file from the input project root.
2. Parse file content into raw config.
3. Apply CLI/Web UI overrides with higher precedence.
4. Normalize defaults for target selection, state strategy, provider mode, output path, and quality options.
5. Validate the effective config.
6. Emit diagnostics for missing, unsupported, or unsafe options.

### Run Workspace Lifecycle

| Stage | Behavior |
|---|---|
| Initialize | Create `.spa-bridge/runs/<runId>` and standard subdirectories. |
| Write Manifest | Persist initial manifest with config snapshot and artifact refs. |
| Record Progress | Update manifest after each workflow step. |
| Preserve Failure State | Retain diagnostics, partial artifacts, and last safe checkpoint on fail-fast termination. |
| Finalize | Mark run terminal status and report/export refs. |

Recommended workspace structure:

```text
.spa-bridge/runs/<runId>/
  manifest.json
  config.resolved.json
  diagnostics.json
  artifacts/
  reports/
  checkpoints/
```

## Workflow Coordination Boundaries

| Domain Area | UOW-02 Responsibility | Out of Scope |
|---|---|---|
| Source Analysis | Invoke source analysis capability and store emitted refs/diagnostics. | Parsing Angular source directly. |
| Transformation | Coordinate transformation step and persist outputs. | Implementing conversion rules. |
| Security/Masking | Enforce policy decision points and record security diagnostics. | Detecting/masking sensitive values directly. |
| AI Provider | Ensure provider calls happen only through policy-gated ports. | Implementing provider adapters. |
| Target Generation | Pass target strategy and output workspace context. | Writing React project files directly. |
| Quality | Trigger quality gates through unit-facing service/ports. | Implementing quality tools or correction loops. |
| Reporting | Maintain canonical report state and request exports. | Rendering markdown/html directly. |

## Error and Recovery Model

UOW-02 uses fail-fast orchestration with state preservation:

- Validation failures stop before workspace mutation when possible.
- After workspace creation, every step records progress before invoking the next step.
- Step failures emit diagnostics and update the manifest to `failed`.
- Partial artifacts remain referenced from the manifest.
- A run is recoverable only when it has a valid manifest and last safe checkpoint.
- Resume uses manifest state rather than reinterpreting the workspace directory.

## Report and Manual Review Flow

1. Workflow steps emit diagnostics, AI decision records, quality results, security events, and review items.
2. UOW-02 aggregates report-facing state using UOW-01 contracts.
3. Manual review items are persisted with status `open`, `resolved`, or `deferred`.
4. CLI/Web UI read this state through the shared application service.
5. Markdown/HTML exports are requested through the report exporter port when export is requested or when the run finalizes.

## PBT Property Candidates

| Property | Category | Candidate Scope |
|---|---|---|
| Config merge precedence is deterministic | Idempotence / invariant | Applying the same config file and overrides repeatedly yields the same resolved config. |
| Overrides always win over project config | Invariant | For every overlapping option, CLI/UI override value appears in the resolved config. |
| Manifest status transitions are valid | Stateful / invariant | Random valid step sequences never produce invalid status transitions. |
| Workspace path derivation is stable | Idempotence | Same root/runId always derives the same workspace paths. |
| Resume plan uses last safe checkpoint | Invariant | Recoverable manifest yields resume plan at the latest completed checkpoint. |
| Fail-fast preserves partial state | Invariant | Failing step records diagnostics and preserves previous artifact refs. |

## Security Considerations

- Provider use is fail-closed: no provider call is allowed unless policy approval exists.
- Config validation is a boundary security control for CLI/Web UI inputs.
- Manifest and report state must not include raw sensitive values.
- Workspace paths must remain under the project workspace root unless explicitly validated by later design.
- Manual review and diagnostics must use safe display fields from UOW-01.
