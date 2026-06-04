# UOW-02 NFR Design Patterns

## Design Summary

UOW-02 applies explicit, local-first patterns for deterministic orchestration, safe file-backed run state, policy-gated provider coordination, and testable recovery behavior. The design keeps runtime dependencies limited to UOW-01 contracts while separating config, path, manifest, workflow, policy, events, reporting, and resume responsibilities into focused components.

## Pattern Overview

| Pattern | Purpose | Primary NFRs |
|---|---|---|
| Schema-First Config Pipeline | Resolve and validate effective config deterministically. | Validation, maintainability, PBT |
| PathGuard | Canonicalize and validate workspace/input/output paths. | Security, reliability, PBT |
| AtomicArtifactWriter | Persist critical run artifacts using temp/validate/promote semantics. | Reliability, recovery |
| Manifest State Machine | Enforce allowed run lifecycle transitions. | Reliability, stateful PBT |
| Per-Run Context | Isolate concurrent runs and avoid global mutable state. | Concurrency, scalability |
| Status Snapshot Lookup | Read status by runId without scanning all runs. | Performance |
| PolicyGate | Fail closed before provider-adjacent workflow steps. | Security, provider safety |
| Structured Event Publisher | Emit safe events through logger/audit ports. | Observability, audit |
| ResumePlanner | Build deterministic resume plans from validated state. | Recovery, PBT |
| PBT Test Model Layer | Centralize generators and state machines for invariants. | PBT, regression quality |

## Schema-First Config Pipeline

Pipeline:

1. Load raw project config through the configured file/artifact port.
2. Parse raw config into `RawConversionConfig`.
3. Overlay CLI/Web UI overrides.
4. Normalize defaults for target strategy, state strategy, provider mode, output path, and report options.
5. Validate the effective config with UOW-01 schema-first validation.
6. Return `Result<ResolvedConversionConfig, ValidationError | DiagnosticError>`.

Design rules:
- Overrides always win over project config.
- Normalization must be deterministic and idempotent.
- Validation diagnostics must use safe display strings.
- Invalid config must block run creation before workspace mutation whenever possible.

PBT coverage:
- Generated raw config plus override sets always resolve deterministically.
- Overlapping override values always appear in effective config.
- Normalizing an already-normalized config yields the same result.

## PathGuard

`PathGuard` owns path normalization and containment decisions.

Responsibilities:
- Canonicalize workspace root, input path, output path, run workspace, and artifact paths.
- Reject traversal and paths that escape approved boundaries.
- Return typed refs such as `WorkspaceRootRef`, `InputProjectPathRef`, `OutputPathRef`, `RunWorkspacePathRef`, and `ArtifactPathRef`.
- Keep path validation centralized rather than repeated inside orchestration methods.

Design rules:
- Run workspace paths must remain under `.spa-bridge/runs/<runId>`.
- Internal run metadata must not be written into the generated React output path.
- No workflow step receives raw unvalidated path strings.

Security coverage:
- Satisfies boundary input validation and path traversal prevention.
- Keeps path safety independent of concrete `FileSystemPort` implementations.

## AtomicArtifactWriter

`AtomicArtifactWriter` defines port-backed persistence semantics for manifest, resolved config, diagnostics, report state, and checkpoint artifacts.

Write sequence:

1. Serialize candidate artifact.
2. Validate serialized artifact.
3. Write to a temp path in the same run workspace.
4. Promote temp artifact to the target artifact path.
5. Clean up stale temp artifacts where possible.
6. Emit success/failure structured event.

Design rules:
- Failed validation blocks promotion.
- Promotion failure leaves prior target artifact intact where the adapter can guarantee it.
- Writer returns typed `Result`.
- Concrete temp write/rename mechanics remain adapter-owned.

## Manifest State Machine

The manifest lifecycle is modeled as an explicit state machine.

Allowed transitions:

| From | To | Condition |
|---|---|---|
| `pending` | `running` | Workspace and initial manifest are created. |
| `running` | `completed` | All required workflow steps succeed. |
| `running` | `failed` | Required step fails or blocking diagnostic appears. |
| `running` | `cancelled` | Caller cancellation is accepted. |
| `failed` | `running` | Explicit resume creates a continuation from a safe checkpoint. |
| `completed` | None | Terminal. |
| `cancelled` | None | Terminal unless a future restart creates a new run. |

Design rules:
- State transitions are validated before manifest writes.
- Each completed required step may produce checkpoint metadata.
- Failed runs preserve prior artifact refs and diagnostic refs.
- Invalid transition returns a typed error, not a partially written manifest.

Stateful PBT coverage:
- Random valid commands never produce invalid states.
- Invalid commands are rejected without mutating model state.
- Failed required steps preserve previous checkpoint refs.

## Per-Run Context And Isolation

`RunContext` holds all run-specific state needed by orchestration.

Included state:
- `runId`
- resolved config
- workspace refs
- manifest state
- report state refs
- correlation ID
- lock/checkpoint metadata

Design rules:
- No process-global mutable run state.
- Multiple runs in one workspace are isolated by runId directory.
- Duplicate active runId is rejected.
- Lock metadata is scoped to the run workspace.

## Status Snapshot Lookup

Status lookup reads only the requested run's manifest/status snapshot.

Design rules:
- Status API accepts `runId`.
- Lookup derives status path directly from runId.
- Lookup must not scan `.spa-bridge/runs`.
- Returned status includes safe summary fields only.

Performance rationale:
- Keeps typical single-run status lookup under 50 ms.
- Supports CLI polling and Web UI refresh without growing with run history.

## PolicyGate

`PolicyGate` returns explicit provider-adjacent execution decisions.

Decision values:
- `allow`
- `deny`
- `block`

Design rules:
- Unknown policy state produces `block`.
- Unknown masking state for external/provider-adjacent work produces `block`.
- Decisions are safe, reportable records.
- Workflow steps never call provider ports without an `allow` decision.

Security rationale:
- Implements fail-closed behavior.
- Keeps concrete security and provider implementations in UOW-05/UOW-06.

## Structured Event Publisher

The in-process event publisher centralizes observability and audit emission.

Required fields:
- `correlationId`
- `runId`
- `stepId` where applicable
- `status`
- safe display message

Design rules:
- Event schemas are safe by construction.
- Logger and audit ports are called by the publisher, not ad hoc from every component.
- Events may include artifact refs and diagnostic refs, not raw sensitive payloads.
- Publishing failures must not mask primary workflow failures.

## ResumePlanner

`ResumePlanner` derives deterministic resume plans from validated manifest, checkpoints, and completed step list.

Design rules:
- Manifest schema validation is required before planning.
- Checkpoint consistency is required before planning.
- Resume plan lists preserved artifacts and steps to replay.
- Corrupt manifest/checkpoint state returns a typed non-recoverable result.

PBT coverage:
- Same manifest/checkpoints always produce the same resume plan.
- Missing checkpoints produce non-recoverable results.
- Resume never discards diagnostics or manual review state.

## PBT Test Model Layer

Dedicated reusable test models/generators are part of the design.

Generator targets:
- Raw project configs
- Override sets
- Typed path refs
- Manifest state machine commands
- Checkpoint sets
- Resume plan inputs

Test model targets:
- Config merge model
- Path containment model
- Manifest transition model
- Resume planning model

## Security and PBT Findings

- **Security Findings**: None.
- **PBT Findings**: None.
