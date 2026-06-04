# UOW-02 Tech Stack Decisions

## Decision Summary

| Decision Area | Choice | Status |
|---|---|---|
| Package | `packages/core-application` | Approved |
| Runtime Dependencies | UOW-01 only by default | Approved |
| Validation | UOW-01 Zod/schema-first validation pattern | Approved |
| Result Handling | UOW-01 `Result` contracts for boundary operations | Approved |
| Filesystem Access | UOW-01 `FileSystemPort` / `ArtifactStoragePort` abstractions | Approved |
| Atomic Writes | Implement through port-backed temp write plus rename behavior | Approved |
| Testing | Vitest + fast-check, reusing UOW-01 test stack | Approved |
| Observability | Structured safe event models and logger/audit ports | Approved |

## Runtime Dependency Policy

UOW-02 should not introduce new runtime dependencies by default. It will depend on UOW-01 contracts and use platform APIs through ports. Any future runtime dependency must be justified by an NFR need that cannot be met with the existing model/port layer.

Rationale:
- Keeps the orchestration layer small and auditable.
- Minimizes supply-chain exposure.
- Makes CLI/Web UI reuse simpler.
- Preserves testability through port implementations.

## Validation Stack

UOW-02 reuses UOW-01 validation patterns:

| Concern | Decision |
|---|---|
| Config schema | Zod schema-first |
| Request validation | Zod schema-first plus typed diagnostics |
| Path safety | Dedicated path normalization helpers returning `Result` |
| Manifest validation | UOW-01 manifest schema plus UOW-02 lifecycle invariants |
| Resume validation | Manifest schema validation plus checkpoint consistency checks |

## Package Organization

Recommended UOW-02 directories:

| Directory | Purpose |
|---|---|
| `src/config` | Config schemas, merge precedence, normalization, validation diagnostics. |
| `src/workspace` | Run workspace path derivation, directory layout, path safety. |
| `src/run` | Run aggregate, status models, manifest lifecycle. |
| `src/workflow` | Workflow coordinator and step contracts. |
| `src/policy` | Provider policy coordination interfaces and decision models. |
| `src/report` | Report state handoff and export request models. |
| `src/events` | Structured event and audit/log models. |
| `src/resume` | Resume plan derivation and checkpoint validation. |
| `src/testing` | Test builders, fast-check generators, state machine models. |

## Atomic Write Approach

UOW-02 should model atomic writes through ports rather than direct filesystem calls:

1. Serialize candidate state.
2. Validate serialized state.
3. Write to a temporary artifact path in the same run workspace.
4. Rename or promote the temporary artifact to the target artifact path.
5. Record success or failure as a structured event.

The concrete atomic filesystem behavior can be implemented by adapters later, but UOW-02 should define the required semantics.

## Concurrency Model

| Concern | Decision |
|---|---|
| Isolation unit | `runId` directory under `.spa-bridge/runs/` |
| Shared mutable state | Avoid process-global run state |
| Status lookup | Scoped to a single run workspace |
| Collision handling | Reject duplicate active runId |
| Locking | Design for per-run lock/checkpoint metadata; implementation detail finalized in Code Generation/NFR Design |

## Observability Model

Structured events should include:

| Field | Requirement |
|---|---|
| `correlationId` | Required for caller-initiated flows; generated if absent. |
| `runId` | Required after run creation. |
| `stepId` | Required for workflow step events. |
| `status` | Required event status. |
| `message` | Safe display string only. |
| `diagnosticRefs` | Optional artifact refs, not raw sensitive values. |

## Testing Stack

UOW-02 reuses the existing UOW-01 testing choices:

| Test Type | Tooling |
|---|---|
| Example-based unit tests | Vitest |
| Property-based tests | fast-check |
| Stateful PBT | fast-check command/model style tests |
| Port contract tests | Vitest with in-memory fake ports |
| Performance smoke tests | Vitest benchmark-style timing assertions or dedicated script later |

## Security and Supply Chain Decisions

| Concern | Decision |
|---|---|
| Extra runtime dependencies | Not allowed by default. |
| External provider behavior | Fail closed if policy/masking status is unknown. |
| Path traversal | Reject before port calls. |
| Sensitive data in events | Use safe display strings and artifact refs. |
| Logging | Use structured logger/audit ports rather than ad hoc output. |

## Deferred Decisions

| Decision | Deferred To | Rationale |
|---|---|---|
| Concrete filesystem atomic rename implementation | Code Generation / adapter implementation | UOW-02 defines semantics through ports. |
| Concrete policy implementation | UOW-05 | Security/masking unit owns policy internals. |
| Concrete provider registry | UOW-06 | Adapter package owns provider implementations. |
| Report markdown/html rendering | UOW-09 | Reporting package owns exporters. |
| Web authorization hooks | UOW-11 | Web UI package owns endpoint/access-control behavior. |

## Compliance Summary

- **Security Baseline**: Compliant for applicable requirements; no blocking findings.
- **Property-Based Testing**: Compliant for applicable requirements; no blocking findings.
