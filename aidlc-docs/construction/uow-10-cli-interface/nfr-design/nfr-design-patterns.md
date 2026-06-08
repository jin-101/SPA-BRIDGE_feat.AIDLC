# NFR Design Patterns - UOW-10 CLI Interface

## Purpose

This document translates UOW-10 NFR requirements into concrete design patterns for a deterministic, safe, automation-friendly CLI layer.

## Pattern 1: Fail-Closed CLI Processing Pipeline

### Intent

Ensure that every command is parsed, resolved, validated, and dispatched in a predictable order before any side effects occur.

### Pipeline Stages

| Order | Stage | Responsibility | Failure Behavior |
|---|---|---|---|
| 1 | Parse argv | Parse top-level command, subcommand, flags, and positional arguments into a typed request | Fail closed for invalid syntax or unknown commands |
| 2 | Resolve options | Merge flags, config file values, environment values, and defaults using the documented precedence order | Fail closed for ambiguous or missing required values |
| 3 | Validate paths | Normalize workspace and output paths and enforce containment rules | Fail closed for traversal or out-of-root paths |
| 4 | Resolve command mode | Determine interactive vs non-interactive execution and verbosity level | Fail closed for invalid mode combinations |
| 5 | Dispatch handler | Route to the command handler or application bridge | Fail closed for unsupported command combinations |
| 6 | Render safe output | Produce quiet, normal, or verbose terminal output without raw sensitive data | Safe diagnostics only |
| 7 | Map exit code | Convert the final outcome into a stable process exit category | Fail closed for unknown failure states |

### Design Notes

- Validation must occur before command execution.
- The CLI must not perform conversion, reporting, or quality logic itself.
- Safe summaries and deterministic progress output are required for long-running commands.

## Pattern 2: Deterministic Command Registry and Option Resolution

### Intent

Make command dispatch and configuration precedence stable for automation, CI, and repeatable local workflows.

### Design Elements

| Element | Design |
|---|---|
| Command registry | Explicit typed registry for top-level commands and subcommands |
| Dispatch | Stable resolution from parsed command to handler |
| Option precedence | `flags > config file > environment > defaults` |
| Help output | Available without requiring workspace execution |
| Unknown inputs | Usage diagnostic, no side effects |

### Stability Rules

- Equivalent argv and configuration inputs must resolve to the same handler.
- Equivalent inputs must produce the same merged options.
- Help and usage text must remain stable across equivalent inputs.

## Pattern 3: Workspace Path Guard

### Intent

Prevent command execution outside the intended workspace and reject traversal before any side effects occur.

### Design Elements

| Element | Design |
|---|---|
| Normalization | Canonicalize workspace and output paths before execution |
| Containment | Enforce workspace/root containment for all command paths |
| Traversal rejection | Reject `..`-style traversal and equivalent out-of-root refs |
| Safe refs | Use normalized safe refs in summaries and report handoffs |

### Failure Behavior

- Invalid paths fail closed with a usage or validation diagnostic.
- The CLI does not trust caller-supplied paths without validation.

## Pattern 4: Safe Terminal Output and Verbosity Rendering

### Intent

Keep the terminal useful without leaking raw source, raw provider data, or secrets.

### Output Modes

| Mode | Behavior |
|---|---|
| Quiet | Minimal progress and final status only |
| Normal | Summary plus safe warnings and report location |
| Verbose | More detail about command flow, still limited to safe summaries |

### Design Rules

- Render from structured safe data, not raw command internals.
- Never print raw prompts, raw provider payloads, raw source snippets, or secrets.
- Use stable ordering for warnings and review summaries.

## Pattern 5: Stable Exit Code Mapping

### Intent

Provide deterministic exit categories that automation can interpret reliably.

### Exit Categories

| Category | Meaning |
|---|---|
| Usage | Invalid command shape, missing required input, or parse failure |
| Validation | Workspace/path/config validation failure |
| Runtime | Shared application or command execution failure |
| Review | Partial success that requires manual review |
| Success | Command completed successfully |

### Design Notes

- The same outcome category must always map to the same exit code.
- Partial-success-with-review must remain distinguishable from a hard failure.

## Pattern 6: Shared Application and Reporting Bridges

### Intent

Keep the CLI thin by delegating workflow execution and reporting to the shared packages.

### Design Elements

| Bridge | Function |
|---|---|
| Application bridge | Invokes `core-application` for conversion, validation, and workflow actions |
| Report bridge | Invokes `core-reporting` for JSON, Markdown, and HTML exports |
| Quality bridge | Uses `core-quality` results for safe summaries and exit decisions |
| Security bridge | Applies `core-security` rules indirectly through shared services |

### Boundary Rules

- The CLI must not rebuild report schemas or output renderers.
- The CLI must not embed transformation logic.
- The CLI must not duplicate quality gate behavior.

## Pattern 7: Non-Interactive Default with Scoped Confirmation

### Intent

Keep the CLI suitable for CI and scripts while still supporting interactive users when needed.

### Design Rules

- Non-interactive execution is the default.
- Confirmations are reserved for destructive or ambiguous operations.
- Interactive prompts must never be required for ordinary conversion or reporting commands.

## Pattern 8: PBT-Backed CLI Properties

### Intent

Use property-based tests to keep parsing, dispatch, safety, and output stable as the CLI evolves.

### Required Properties

| Property | Requirement |
|---|---|
| Parsing invariants | Equivalent argv values produce equivalent parsed command requests |
| Dispatch determinism | Equivalent parsed requests resolve to the same handler |
| Workspace containment | Generated path cases outside the workspace are rejected |
| Exit code stability | Equivalent outcomes map to the same exit code category |
| Output consistency | Equivalent inputs and verbosity modes produce stable safe output |
| Safe summary invariants | Forbidden fields never appear in terminal summaries |

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | Compliant | Commands are validated and contained before execution. |
| SECURITY-03 | Compliant | Terminal output is safe-summary oriented. |
| SECURITY-05 | Compliant | Paths and options are validated before shared service invocation. |
| SECURITY-10 | Compliant | The CLI uses minimal, explicit runtime dependencies. |
| SECURITY-13 | Compliant | Safe refs and deterministic summaries preserve traceability. |
| SECURITY-14 | Compliant | The CLI surfaces quality/report outcomes instead of hiding them. |
| SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12 | N/A | This design does not define deployment, network, auth/session, or UI-specific flows. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Deterministic dispatch and output behavior are explicit targets. |
| PBT-03 | Compliant | Path containment, dispatch, and exit code stability are invariants. |
| PBT-04 | Compliant | Output mode resolution and rendering are modeled as idempotent/stable behaviors. |
| PBT-07 | Compliant | Generators can cover argv, config, path, and verbosity permutations. |
| PBT-08 | Compliant | Failures can be replayed from recorded argv/config cases. |
| PBT-09 | Compliant | The TypeScript test stack is appropriate for CLI property testing. |
| PBT-10 | Compliant | Example-based smoke tests remain useful alongside PBT. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not define round-trip codecs, oracle-backed algorithms, or mutable state machines as primary behavior. |
