# UOW-10 Business Logic Model

## Purpose

UOW-10 provides the command-line interface for SPA-Bridge. It accepts user commands, resolves configuration precedence, validates workspace and path inputs, invokes the shared application service, and surfaces deterministic progress, exit codes, and report locations.

The unit does not own conversion logic, reporting semantics, or quality execution. Those responsibilities live in `packages/core-application`, `packages/core-reporting`, `packages/core-quality`, `packages/core-security`, and the conversion packages. UOW-10 is the orchestration and user-entry layer that makes those capabilities accessible from the terminal.

## Approved Scope

| Decision Area | Approved Choice | Design Effect |
|---|---|---|
| Top-level shape | Single `spa-bridge` CLI with subcommands | Keeps the user interface coherent and scriptable. |
| Configuration precedence | Flags > config file > environment > defaults | Gives automation explicit control without hiding defaults. |
| Main conversion behavior | Trigger shared application service and emit deterministic progress/output | Ensures the CLI actually runs the workflow rather than only describing it. |
| Output modes | Quiet, normal, and verbose modes with safe terminal output | Balances automation needs with human-readable feedback. |
| Report/export behavior | Reuse canonical reporting package for JSON, Markdown, and HTML exports | Keeps CLI and UI outputs aligned. |
| Path safety | Enforce workspace containment and reject traversal | Prevents accidental execution outside the allowed workspace. |
| Interactivity | Default to non-interactive automation with optional confirmations for ambiguous operations | Makes the CLI suitable for CI and scripts while still supporting manual use. |
| Exit codes | Stable categories for usage, validation, runtime, and partial-success-with-review states | Makes automation predictable. |
| Reuse | Reusable CLI command layer with handlers and adapters | Supports tests, future automation, and maintainable command expansion. |
| PBT focus | Parsing, dispatch, containment, exit code, and output consistency | Protects the command layer from regressions. |

## Core Business Capabilities

| Capability | Responsibility | Primary Output |
|---|---|---|
| Command Registration | Define the CLI surface and subcommand catalog | `CliCommandDefinition[]` |
| Configuration Resolution | Merge flags, config, environment, and defaults deterministically | `ResolvedCliOptions` |
| Workspace Validation | Validate input and output paths before execution | `ValidatedCliPathSet` |
| Conversion Invocation | Call the shared application service and stream progress safely | `CliExecutionResult` |
| Report Export Launch | Request reporting/export flows and resolve destination paths | `CliReportCommandResult` |
| Output Formatting | Format progress, warnings, and summaries for terminal output | `CliRenderModel` |
| Exit Code Mapping | Map outcomes to deterministic process exit codes | `CliExitCode` |

## End-to-End CLI Flow

1. Parse the top-level command and subcommand with typed arguments.
2. Load command defaults, config file values, environment variables, and CLI flags in precedence order.
3. Validate workspace paths, output paths, and command-specific options.
4. Resolve whether the command is interactive or non-interactive.
5. Invoke the shared application service for conversion, validation, or reporting.
6. Stream safe progress and warnings to the terminal using the selected verbosity mode.
7. Convert application, quality, and reporting outcomes into structured CLI results.
8. Map the result to a deterministic exit code and, if relevant, a report location.
9. Emit final summaries without leaking raw secrets or unsafe source content.
10. Return control to the shell with a stable command result.

## CLI Subsystems

| Subsystem | Function |
|---|---|
| Command Parser | Converts argv into typed command requests. |
| Config Resolver | Applies precedence across flags, config, environment, and defaults. |
| Path Guard | Prevents traversal and enforces workspace containment. |
| Execution Adapter | Bridges CLI requests to the shared application service. |
| Output Formatter | Produces safe, human-readable terminal text. |
| Report Bridge | Connects conversion outcomes to report generation and export. |
| Exit Code Mapper | Assigns stable process exit codes by outcome category. |

## Testable Properties

| Property | Category | Candidate Scope |
|---|---|---|
| Command dispatch is deterministic | Determinism | The same argv and config state resolve to the same command handler. |
| Configuration precedence is stable | Invariant | Flags always override config, environment, and defaults in that order. |
| Path validation rejects traversal | Safety invariant | Inputs outside workspace containment fail before execution. |
| Exit codes are stable | Invariant | Equivalent results map to the same exit code category. |
| Output mode selection is idempotent | Idempotence | Reapplying the same mode resolution does not change the render model. |
| Report handoff references remain traceable | Traceability | CLI outputs preserve report and run references without unsafe content. |

## Traceability and Reporting Boundaries

- CLI command results must include safe refs to the run, report, and output locations.
- The CLI must not render raw prompts, raw provider responses, raw source snippets, or secrets.
- Terminal output may summarize results, but canonical evidence remains in the shared reporting layer.

## Security and PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | Compliant | The CLI validates inputs before execution and avoids leaking unsafe data in output. |
| SECURITY-03 | Compliant | Terminal output is structured and safe-display oriented. |
| SECURITY-05 | Compliant | Path and command options are validated before invoking the application service. |
| SECURITY-10 | Compliant | Command execution is deterministic and routed through explicit adapters. |
| SECURITY-13 | Compliant | CLI results preserve traceability without unsafe mutation semantics. |
| SECURITY-14 | Compliant | The CLI surfaces quality/report results rather than suppressing them. |
| PBT-01 | Compliant | Deterministic dispatch and output behavior are explicit PBT targets. |
| PBT-03 | Compliant | Configuration precedence and exit codes are stable invariants. |
| PBT-04 | Compliant | Mode and path resolution idempotence are modeled. |
| PBT-07 | Compliant | Generator families can model argv, config, and workspace permutations. |
| PBT-08 | Compliant | Failing cases can be reproduced from recorded argv and configuration inputs. |
| PBT-09 | Compliant | TypeScript-native PBT tooling is appropriate for the CLI layer. |
| PBT-10 | Compliant | Example-based command smoke tests remain valuable alongside PBT. |
| SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12 | N/A | This functional design does not define deployment, network, auth/session, or UI-specific flows. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not define round-trip codecs, oracle-backed algorithms, or mutable state machines as primary behavior. |

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown is limited to plain lists and tables for parse safety.
