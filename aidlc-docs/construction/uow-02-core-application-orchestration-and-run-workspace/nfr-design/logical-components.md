# UOW-02 Logical Components

## Component Overview

| Component | Responsibility | Directory |
|---|---|---|
| Conversion Application Service | Public in-process service for CLI/Web UI callers. | `src/application` |
| Config Pipeline | Load, merge, normalize, and validate conversion config. | `src/config` |
| PathGuard | Canonical path refs and containment validation. | `src/workspace` |
| Run Workspace Manager | Create and resolve `.spa-bridge/runs/<runId>` structure. | `src/workspace` |
| AtomicArtifactWriter | Port-backed atomic artifact write semantics. | `src/workspace` |
| Manifest State Machine | Run lifecycle transition validation and checkpoint metadata. | `src/run` |
| Run Status Reader | Read run status by direct runId path. | `src/run` |
| Workflow Coordinator | Execute ordered workflow steps through unit-facing contracts. | `src/workflow` |
| PolicyGate | Provider-adjacent allow/deny/block decisions. | `src/policy` |
| Report Handoff | Maintain report state and request exporter port output. | `src/report` |
| Structured Event Publisher | Publish safe events to logger/audit ports. | `src/events` |
| ResumePlanner | Derive deterministic resume plans from validated state. | `src/resume` |
| PBT Test Models | Reusable generators and stateful test models. | `src/testing` |

## Package Organization

Recommended directories:

| Directory | Contents |
|---|---|
| `src/application` | `ConversionApplicationService`, public request/response models. |
| `src/config` | Config schemas, raw/effective config models, merge and normalize pipeline. |
| `src/workspace` | Path refs, `PathGuard`, run workspace layout, atomic writer. |
| `src/run` | Run aggregate, lifecycle status, manifest state machine, status reader. |
| `src/workflow` | Workflow step contracts, coordinator, step result handling. |
| `src/policy` | Policy decision models, `PolicyGate`, provider-adjacent step guards. |
| `src/report` | Report state model, export handoff requests. |
| `src/events` | Structured event schemas and publisher. |
| `src/resume` | Resume plan models and `ResumePlanner`. |
| `src/testing` | Test builders, fast-check generators, stateful PBT models. |

## Component Details

### Conversion Application Service

Responsibilities:
- Accept `StartConversionRequest`, `GetRunStatusRequest`, `ResumeRunRequest`, and report export requests.
- Coordinate config, workspace, manifest, workflow, policy, events, and report handoff components.
- Return typed `Result` values for all public operations.

Public operations:
- `startConversion`
- `getRunStatus`
- `resumeRun`
- `exportReport`

NFR responsibilities:
- Keep CLI and Web UI behavior consistent.
- Avoid direct dependency on concrete filesystem, security, provider, reporting, or quality implementations.

### Config Pipeline

Responsibilities:
- Load raw project config.
- Overlay CLI/Web UI overrides.
- Normalize defaults.
- Validate effective config.
- Emit safe diagnostics for invalid fields.

NFR responsibilities:
- Schema-first validation.
- Deterministic precedence.
- Idempotent normalization.

### PathGuard

Responsibilities:
- Canonicalize path-like inputs.
- Enforce workspace containment rules.
- Produce typed path refs.
- Reject traversal before ports are invoked.

Typed refs:
- `WorkspaceRootRef`
- `InputProjectPathRef`
- `OutputPathRef`
- `RunWorkspacePathRef`
- `ArtifactPathRef`

NFR responsibilities:
- Security boundary validation.
- PBT-friendly path derivation invariants.

### Run Workspace Manager

Responsibilities:
- Derive `.spa-bridge/runs/<runId>` layout.
- Create standard run subdirectories.
- Reject duplicate active run IDs.
- Maintain per-run isolation metadata.

Standard layout:
- `manifest.json`
- `config.resolved.json`
- `diagnostics.json`
- `artifacts/`
- `reports/`
- `checkpoints/`
- `locks/` or lock metadata file

### AtomicArtifactWriter

Responsibilities:
- Write manifest, config, diagnostics, checkpoint, and report-state artifacts through validated temp/promotion semantics.
- Emit structured events for write success/failure.
- Clean up stale temp artifacts where possible.

NFR responsibilities:
- Reduce corrupted state risk.
- Keep atomic semantics testable through fake ports.

### Manifest State Machine

Responsibilities:
- Define allowed status transitions.
- Validate transition commands.
- Preserve checkpoint and artifact refs.
- Reject invalid transitions without mutation.

States:
- `pending`
- `running`
- `completed`
- `failed`
- `cancelled`

NFR responsibilities:
- Recovery correctness.
- Stateful PBT support.

### Run Status Reader

Responsibilities:
- Derive status snapshot path from runId.
- Read only the requested manifest/status snapshot.
- Return safe caller-facing status.

NFR responsibilities:
- Avoid directory-wide scans.
- Support under-50ms typical status lookup.

### Workflow Coordinator

Responsibilities:
- Execute ordered workflow steps.
- Apply fail-fast behavior for required failures and security blockers.
- Update manifest and events after each step.
- Preserve partial artifact refs.

NFR responsibilities:
- Adapter-agnostic orchestration.
- Deterministic step state and checkpoint handling.

### PolicyGate

Responsibilities:
- Accept provider-adjacent step context.
- Return explicit `allow`, `deny`, or `block` decision.
- Record safe policy rationale.

NFR responsibilities:
- Fail closed on unknown policy/masking state.
- Keep security implementation details in later units.

### Report Handoff

Responsibilities:
- Maintain report-facing state during the run.
- Request JSON/Markdown/HTML export through report exporter ports.
- Preserve manual review state.

NFR responsibilities:
- Keep canonical report state available before completion.
- Avoid report rendering logic inside core application.

### Structured Event Publisher

Responsibilities:
- Validate event schemas.
- Publish through logger/audit ports.
- Carry correlation/run/step/status fields.
- Prevent raw sensitive payloads.

NFR responsibilities:
- Centralized observability.
- Security-safe audit events.

### ResumePlanner

Responsibilities:
- Validate manifest and checkpoints.
- Determine preserved artifacts.
- Determine steps to replay.
- Return deterministic resume plan or typed non-recoverable result.

NFR responsibilities:
- Recovery reliability.
- PBT replay/model testing.

### PBT Test Models

Responsibilities:
- Provide generators for raw configs, overrides, path refs, manifest commands, checkpoints, and resume inputs.
- Provide model-based/stateful tests for manifest lifecycle.
- Support seed-based replay through fast-check/Vitest.

## Logical Dependency Map

| Component | Depends On |
|---|---|
| Conversion Application Service | Config Pipeline, Run Workspace Manager, Workflow Coordinator, Run Status Reader, ResumePlanner, Report Handoff, Event Publisher |
| Config Pipeline | UOW-01 validation/result/diagnostics |
| PathGuard | UOW-01 result/diagnostics |
| Run Workspace Manager | PathGuard, AtomicArtifactWriter, UOW-01 ports |
| AtomicArtifactWriter | UOW-01 ports, validation/result |
| Manifest State Machine | UOW-01 manifest/result/diagnostics |
| Run Status Reader | PathGuard, UOW-01 ports, Manifest State Machine |
| Workflow Coordinator | Manifest State Machine, PolicyGate, Event Publisher, AtomicArtifactWriter |
| PolicyGate | UOW-01 diagnostics/report-safe fields |
| Report Handoff | UOW-01 report/exporter port |
| Structured Event Publisher | UOW-01 logger/audit ports, safe display fields |
| ResumePlanner | Manifest State Machine, PathGuard, UOW-01 validation/result |
| PBT Test Models | fast-check/Vitest, UOW-02 domain models |

## Performance Design Notes

| Concern | Design Control |
|---|---|
| Run status lookup | Derive and read status by runId path only. |
| Config resolution | Single pipeline pass; no downstream execution. |
| Manifest update | Write only the active run artifact. |
| Concurrent runs | Isolated run contexts and runId directories. |

## Security Design Notes

| Concern | Design Control |
|---|---|
| Path traversal | Centralized PathGuard rejects unsafe paths before port calls. |
| Provider bypass | PolicyGate controls provider-adjacent steps. |
| Sensitive event payloads | Event schemas use safe display fields and artifact refs. |
| Supply chain | No additional runtime dependencies by default. |

## PBT Design Notes

| Property Area | Component |
|---|---|
| Config precedence | Config Pipeline + generators |
| Path containment | PathGuard + path ref generators |
| Manifest transitions | Manifest State Machine + stateful command model |
| Resume determinism | ResumePlanner + checkpoint generators |
| Status lookup scope | Run Status Reader + fake workspace model |

## Security and PBT Findings

- **Security Findings**: None.
- **PBT Findings**: None.
