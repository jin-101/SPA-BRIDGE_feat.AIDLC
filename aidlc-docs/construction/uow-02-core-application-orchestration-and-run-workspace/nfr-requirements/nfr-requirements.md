# UOW-02 NFR Requirements

## Scope

This document defines non-functional requirements for `packages/core-application`, the shared in-process orchestration layer used by CLI and Web UI. UOW-02 coordinates runs, configuration, workspace state, manifest updates, provider policy decisions, report handoff, and resume behavior while keeping concrete parsing, transformation, security, AI provider, quality, reporting, CLI, and Web UI implementations in later units.

## Requirement Summary

| Area | Requirement |
|---|---|
| Runtime Dependencies | Depend on UOW-01 only by default; no additional runtime dependency unless explicitly approved. |
| Validation | Reuse UOW-01 Zod/schema-first validation and `Result` contracts. |
| Path Safety | Normalize and validate all input, output, and run workspace paths relative to workspace root; reject traversal. |
| Manifest Reliability | Use atomic write behavior for manifest, resolved config, diagnostics, and report-facing state. |
| Status Performance | Single run status lookup should typically complete under 50 ms. |
| Concurrency | Support multiple concurrent runs in a workspace through runId directory isolation. |
| Recovery | Valid manifest plus checkpoint must produce a deterministic resume plan. |
| Provider Policy | Provider-adjacent steps fail closed when policy or masking status is unclear. |
| Observability | Emit structured safe events with `correlationId`, `runId`, `stepId`, `status`, and safe message. |
| Testing | PBT/stateful PBT required for config merge, path derivation, manifest transitions, and resume plan. |

## Performance Requirements

| Requirement ID | Requirement | Target |
|---|---|---|
| UOW02-PERF-01 | Single run status lookup must avoid scanning unrelated runs. | Typical under 50 ms. |
| UOW02-PERF-02 | Workspace path derivation must be deterministic and lightweight. | Constant-time string/path computation per run. |
| UOW02-PERF-03 | Config resolution must complete before workflow execution without blocking on downstream unit work. | Typical under 100 ms for normal config files. |
| UOW02-PERF-04 | Manifest update operations must write only the affected run state. | No workspace-wide rewrite. |

## Scalability and Concurrency Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW02-SCALE-01 | Multiple runs may exist under `.spa-bridge/runs/` at the same time. | CLI and Web UI users may start independent conversions. |
| UOW02-SCALE-02 | Run isolation is based on unique runId directories. | Prevents artifact and manifest collisions. |
| UOW02-SCALE-03 | Status lookup is scoped to a runId. | Keeps UI polling and CLI inspection predictable. |
| UOW02-SCALE-04 | Shared services must not use mutable process-global run state. | Enables safe concurrent run orchestration. |

## Reliability Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW02-REL-01 | Manifest, resolved config, diagnostics, and report-facing state use atomic write behavior. | Reduces corruption risk during interruption. |
| UOW02-REL-02 | Fail-fast workflow preserves diagnostics, partial artifacts, and last safe checkpoint. | Supports debugging and recovery. |
| UOW02-REL-03 | Resume plans are deterministic from validated manifest and checkpoint state. | Prevents ambiguous restart behavior. |
| UOW02-REL-04 | Invalid or corrupt manifests must not be resumed. | Avoids compounding partial-state errors. |
| UOW02-REL-05 | Required workflow step failure transitions the run to a terminal failed state. | Keeps run lifecycle unambiguous. |

## Security Requirements

| Requirement ID | Requirement | Rationale |
|---|---|---|
| UOW02-SEC-01 | Validate all caller-supplied paths and config values before use. | Satisfies boundary validation and blocks unsafe inputs. |
| UOW02-SEC-02 | Reject path traversal and paths that escape validated workspace/output boundaries. | Prevents unintended reads/writes. |
| UOW02-SEC-03 | Provider-adjacent steps fail closed when policy or masking status is unknown. | Prevents accidental external data exposure. |
| UOW02-SEC-04 | Structured events must use safe display strings and avoid raw sensitive payloads. | Prevents diagnostic/audit leakage. |
| UOW02-SEC-05 | Core application must depend on policy interfaces, not concrete provider or masking implementations. | Preserves separation of concerns. |

## Observability and Audit Requirements

| Requirement ID | Requirement | Fields |
|---|---|---|
| UOW02-OBS-01 | Every workflow step emits structured progress events. | `correlationId`, `runId`, `stepId`, `status`, `message` |
| UOW02-OBS-02 | Policy decisions are reportable as safe events. | `decisionId`, `runId`, `providerMode`, `allowed`, `reason` |
| UOW02-OBS-03 | Failure events include safe diagnostics and checkpoint state. | `runId`, `stepId`, `diagnosticRefs`, `checkpointRef` |
| UOW02-OBS-04 | Caller-facing status must be readable by CLI and Web UI through one service contract. | `runId`, `status`, `updatedAt`, `summary` |

## Maintainability Requirements

| Requirement ID | Requirement |
|---|---|
| UOW02-MAINT-01 | Orchestration code must remain adapter-agnostic and use UOW-01 ports/contracts. |
| UOW02-MAINT-02 | Config resolution, workspace management, manifest lifecycle, policy coordination, and report handoff should be separate logical modules. |
| UOW02-MAINT-03 | Public service methods require doc comments and stable request/response models. |
| UOW02-MAINT-04 | Workflow steps must be individually testable without filesystem or provider concrete implementations. |

## Test Requirements

| Requirement ID | Requirement | Test Type |
|---|---|---|
| UOW02-TEST-01 | Config merge obeys precedence for generated project config and overrides. | PBT + example-based |
| UOW02-TEST-02 | Workspace path derivation is stable and rejects traversal. | PBT + example-based |
| UOW02-TEST-03 | Manifest lifecycle rejects invalid state transitions. | Stateful PBT + example-based |
| UOW02-TEST-04 | Resume plan is deterministic for valid manifest/checkpoint pairs. | PBT + example-based |
| UOW02-TEST-05 | Provider-adjacent steps fail closed without policy allow. | Example-based security tests |
| UOW02-TEST-06 | Status lookup avoids unrelated run scans. | Performance/unit test |

## Security Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Structured event requirements include correlation/run/step/status and safe message fields. |
| SECURITY-05 | Compliant | Path and config validation are mandatory at the shared application boundary. |
| SECURITY-08 | N/A | UOW-02 is an in-process package; Web endpoint authorization belongs to UOW-11. |
| SECURITY-10 | Compliant | Runtime dependency policy limits supply-chain surface to UOW-01 by default. |
| SECURITY-11 | Compliant | Security-critical provider policy is coordinated through dedicated interfaces and fail-closed behavior. |
| SECURITY-13 | Compliant | Provider-adjacent behavior is gated by policy and validated state. |
| SECURITY-14 | N/A | Monitoring/alerting infrastructure is outside this local library unit. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Functional design identified properties, and NFR requirements carry them forward. |
| PBT-02 | N/A | UOW-02 has no new inverse serialization pair beyond UOW-01 schemas. |
| PBT-03 | Compliant | Path containment, override precedence, and manifest lifecycle invariants are required. |
| PBT-04 | Compliant | Config normalization and path derivation idempotence are required. |
| PBT-06 | Compliant | Manifest transitions and resume behavior require stateful PBT. |
| PBT-07 | N/A | Generator organization is finalized during Code Generation. |
| PBT-08 | Compliant | Deterministic resume and PBT replay requirements imply seed-based reproducibility in tests. |
| PBT-09 | Compliant | UOW-01 selected fast-check/Vitest; UOW-02 reuses that stack. |
| PBT-10 | Compliant | Critical paths require both example-based and property-based coverage. |

## Blocking Findings

- **Security Findings**: None.
- **PBT Findings**: None.
