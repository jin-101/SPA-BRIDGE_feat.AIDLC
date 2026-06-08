# Domain Entities - UOW-10 CLI Interface

## Overview

The CLI domain focuses on typed command requests, resolved configuration, validated paths, execution results, and terminal render models. It translates user intent from argv into application-service calls and safe output.

## Entity Catalog

| Entity | Purpose | Key Fields |
|---|---|---|
| `CliCommandRequest` | Represents a parsed top-level command and subcommand. | `commandName`, `subcommand`, `args`, `rawArgv` |
| `CliOptions` | Holds command options before precedence resolution. | `workspacePath`, `outputPath`, `configPath`, `verbosity`, `interactive` |
| `ResolvedCliOptions` | Holds the final merged options after precedence rules. | `workspacePath`, `outputPath`, `verbosity`, `interactive`, `reportFormat` |
| `ValidatedCliPathSet` | Represents workspace-safe input and output paths. | `workspaceRoot`, `inputPath`, `outputPath`, `isContained` |
| `CliExecutionRequest` | Input to the CLI execution adapter. | `commandName`, `resolvedOptions`, `runId`, `requestedArtifacts` |
| `CliExecutionResult` | Result from a conversion/validation/reporting command. | `status`, `exitCode`, `summary`, `reportRef`, `warnings`, `reviewItems` |
| `CliReportCommandResult` | Specialization for report/export commands. | `reportRef`, `exportPaths`, `exportFormats`, `traceRefs` |
| `CliRenderModel` | Safe terminal presentation model. | `headline`, `sections`, `progressItems`, `warnings`, `reviewItems` |
| `CliExitCode` | Stable process exit code category. | `code`, `category`, `description` |
| `CliHelpContent` | Structured help text for commands. | `usage`, `commands`, `flags`, `examples` |

## Entity Relationships

- `CliCommandRequest` is produced from raw argv and raw environment input.
- `CliOptions` is resolved into `ResolvedCliOptions` after precedence rules are applied.
- `ResolvedCliOptions` is validated into `ValidatedCliPathSet` before execution.
- `CliExecutionRequest` is sent to the shared application service via the CLI adapter layer.
- `CliExecutionResult` is converted into a `CliRenderModel` for terminal output and into a `CliExitCode` for process exit.
- `CliReportCommandResult` references canonical report exports from `core-reporting`.

## Entity Invariants

| Entity | Invariant |
|---|---|
| `CliCommandRequest` | Must preserve raw argv for traceability, but not display it unsafely. |
| `ResolvedCliOptions` | Must reflect the documented precedence order with no ambiguous overrides. |
| `ValidatedCliPathSet` | Must remain within the permitted workspace root. |
| `CliExecutionResult` | Must provide a deterministic exit category and safe summary. |
| `CliRenderModel` | Must not contain raw secrets or raw source snippets. |
| `CliExitCode` | Must be stable for equivalent outcome categories. |

## Value Objects and Supporting Types

| Type | Purpose |
|---|---|
| `VerbosityLevel` | Represents quiet, normal, and verbose terminal output modes. |
| `CommandMode` | Represents non-interactive or interactive execution behavior. |
| `ReportFormat` | Represents JSON, Markdown, and HTML export options. |
| `PathRef` | Safe, normalized workspace-relative or output-relative reference. |
| `ReviewSummary` | Safe summary of manual-review items and unresolved warnings. |
| `ProgressSnapshot` | Safe progress state emitted during command execution. |

## Functional Boundaries

- The CLI domain does not own conversion algorithms, report schema, or quality gate logic.
- The CLI domain does not persist workspace state beyond command execution.
- The CLI domain must treat raw sensitive data as forbidden display content.

## Testability Notes

- CLI entities should be easy to construct from fixtures and generators.
- Invariants should be enforceable without shelling out to a real terminal.
- Render models should be deterministic for equivalent execution results.
