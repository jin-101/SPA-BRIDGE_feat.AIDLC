# Logical Components - UOW-10 CLI Interface

## Component Overview

`packages/cli` is organized around a thin orchestration layer that turns raw argv into validated, safe, deterministic command execution. It delegates conversion, reporting, quality, and security behavior to shared packages.

## Components

| Component | Responsibility | Key Inputs | Key Outputs |
|---|---|---|---|
| `CliCommandParser` | Parse argv into typed command requests and help requests | raw argv, env, defaults | `CliCommandRequest` |
| `CliOptionResolver` | Apply precedence across flags, config, environment, and defaults | `CliCommandRequest`, config data | `ResolvedCliOptions` |
| `WorkspacePathGuard` | Normalize paths and enforce containment | resolved options, workspace root | `ValidatedCliPathSet` |
| `CliCommandRegistry` | Map commands and subcommands to handlers | parsed command request | handler selection |
| `CliOrchestrator` | Sequence validation, dispatch, progress, and final summary | validated request, runtime context | `CliExecutionResult` |
| `CliOutputFormatter` | Render safe quiet/normal/verbose terminal output | execution result, verbosity | terminal-safe render model |
| `ExitCodeMapper` | Map outcomes to stable process exit codes | execution result | `CliExitCode` |
| `ApplicationBridge` | Call `core-application` use cases | validated command request | workflow result |
| `ReportBridge` | Delegate exports to `core-reporting` | report request, output options | report export result |
| `ProgressEmitter` | Emit deterministic progress snapshots | execution state | safe progress output |
| `ConfirmationCoordinator` | Handle only scoped interactive confirmations | command mode, command intent | confirmation decision |
| `CliGenerators` | Provide fast-check generators for CLI properties | generator config | command/path/output cases |

## Public API Shape

### CLI Entry Facade

The package should expose a small facade that:

- parses commands
- resolves options
- validates paths
- dispatches handlers
- renders safe output
- maps exit codes

Expected API shape:

```typescript
runCli(argv: string[], env?: NodeJS.ProcessEnv): Promise<CliRunResult>
```

### Command Handlers

Command handlers should remain small and composable:

- `convert`
- `validate`
- `report`
- `help`

Each handler delegates to shared application or reporting packages rather than re-implementing workflow logic.

### Output Formatting

Output formatting should consume structured results only:

- no raw source snippets
- no raw provider payloads
- no raw secrets
- no unsafe absolute paths

## Component Interactions

| Step | Component | Next Component |
|---|---|---|
| 1 | `CliCommandParser` | `CliOptionResolver` |
| 2 | `CliOptionResolver` | `WorkspacePathGuard` |
| 3 | `WorkspacePathGuard` | `CliCommandRegistry` |
| 4 | `CliCommandRegistry` | `CliOrchestrator` |
| 5 | `CliOrchestrator` | `ApplicationBridge` or `ReportBridge` |
| 6 | `ApplicationBridge` / `ReportBridge` | `ProgressEmitter` / `CliOutputFormatter` |
| 7 | `CliOutputFormatter` | `ExitCodeMapper` |

## Error Model

| Error Category | Source Component | Behavior |
|---|---|---|
| Parse error | `CliCommandParser` | fail closed with usage diagnostic |
| Configuration error | `CliOptionResolver` | fail closed with validation diagnostic |
| Path error | `WorkspacePathGuard` | fail closed before dispatch |
| Unsupported command | `CliCommandRegistry` | usage diagnostic, no side effects |
| Application failure | `CliOrchestrator` / `ApplicationBridge` | runtime diagnostic and stable runtime exit code |
| Report failure | `ReportBridge` | safe diagnostic and export failure category |
| Review-needed outcome | `CliOutputFormatter` | partial-success summary and review exit category |

## Package Directory Plan

| Directory | Purpose |
|---|---|
| `src/commands` | Command definitions and handlers |
| `src/parsing` | argv parsing and help resolution |
| `src/config` | configuration precedence and resolution |
| `src/path` | workspace containment and path normalization |
| `src/output` | safe terminal formatting |
| `src/bridges` | application and reporting bridges |
| `src/exit-codes` | outcome-to-exit-code mapping |
| `src/interaction` | scoped confirmations and interactive flow |
| `src/generation` | CLI generators for PBT |
| `tests` | example-based and property-based tests |

## Data Contracts

| Contract | Owner | Notes |
|---|---|---|
| `CliRunRequest` | `cli` | Parsed argv, env, and runtime context |
| `CliRunResult` | `cli` | Safe execution result with exit code and summary |
| `ResolvedCliConfig` | `cli` | Configuration after precedence resolution |
| `ValidatedWorkspacePaths` | `cli` | Path set that is safe for execution |
| `CliProgressEvent` | `cli` | Safe progress snapshot |
| `CliReportRequest` | `cli` | Request to generate or export a report |

## Dependency Boundaries

Allowed:

- `@spa-bridge/core-application`
- `@spa-bridge/core-reporting`
- `@spa-bridge/core-quality`
- `@spa-bridge/core-security`
- Node.js built-ins such as `node:path`, `node:fs`, and `node:process`
- existing workspace dev dependencies such as Vitest and fast-check

Avoided:

- browser or DOM rendering libraries
- remote command execution services
- broad CLI frameworks that obscure typed dispatch by default

## PBT Generator Families

| Generator Family | Purpose |
|---|---|
| argv vectors | validate parser and dispatch invariants |
| config maps | validate precedence behavior |
| workspace path cases | validate containment and traversal rejection |
| output mode cases | validate quiet/normal/verbose output |
| exit outcome cases | validate stable exit mapping |
| command request cases | validate handler selection |
| review states | validate partial-success summaries |
| safe summary cases | validate forbidden-field rejection |

## Example Test Families

- parse help and usage without workspace execution
- resolve precedence across flags, config, environment, and defaults
- reject traversal and out-of-root paths
- execute convert and report commands with safe progress output
- verify stable exit categories for usage, validation, runtime, and review cases
- verify safe summaries never include forbidden fields

## Design Constraints

- Application code belongs in `packages/cli`, not `aidlc-docs`.
- The CLI must not implement conversion, reporting, or quality rules directly.
- The CLI must remain automation-friendly by default.
- Output must remain safe even when verbose mode is enabled.
