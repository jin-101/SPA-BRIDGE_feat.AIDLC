# Code Generation Plan - UOW-10 CLI Interface

## Plan Metadata

- **Unit**: UOW-10 CLI Interface
- **Primary Package**: `packages/cli`
- **Stage**: Code Generation
- **Status**: Completed
- **Primary Story**: US-001 Run Conversion from the Command Line
- **Supporting Stories**: US-002, US-008, US-011, US-013

## Objective

Generate the reusable `@spa-bridge/cli` workspace package that exposes the command-line interface for conversion, validation, and reporting workflows while preserving deterministic behavior, safe terminal output, and stable exit code handling.

## Unit Context

UOW-10 is the terminal entry layer over the shared application workflow. It must stay thin and delegate core work to other packages:

- `packages/core-application` owns orchestration and use cases.
- `packages/core-reporting` owns canonical report generation and exports.
- `packages/core-quality` owns validation, quality outcomes, and review-worthy summaries.
- `packages/core-security` owns masking and policy-aware safety concerns.
- `packages/target-react`, `packages/adapters-ai`, and `packages/source-angular` provide the underlying conversion flow that the CLI triggers.

### Dependencies

| Dependency | Use |
|---|---|
| `@spa-bridge/core-application` | Run orchestration and workflow execution |
| `@spa-bridge/core-reporting` | Canonical JSON/Markdown/HTML report exports |
| `@spa-bridge/core-quality` | Safe quality results and review summaries |
| `@spa-bridge/core-security` | Safe output and policy-aware boundaries |
| Node.js built-ins (`node:path`, `node:fs`, `node:process`) | Path resolution and runtime interaction |
| Vitest | Example-based tests |
| fast-check | Property-based tests |

### Public Package Boundary

`@spa-bridge/cli` should expose:

- CLI command definitions and handlers
- argv parsing and help resolution
- configuration precedence resolution
- workspace/path validation
- safe output formatting
- application and reporting bridges
- exit code mapping
- scoped confirmation support
- fast-check generators and CLI test helpers

## Story Traceability

| Story | Coverage in This Plan |
|---|---|
| US-001 | Main conversion command, report/export commands, safe execution summaries |
| US-002 | Report and export command handoff to shared reporting package |
| US-008 | Non-interactive workflow and review-oriented command flow |
| US-011 | Quality and review summaries surfaced through CLI output |
| US-013 | Canonical report generation and export launch support |

## Generation Steps

### Step 1: Package Scaffold

- [x] Create `packages/cli/package.json`.
- [x] Create `packages/cli/tsconfig.json`.
- [x] Create `packages/cli/src/index.ts`.
- [x] Align package scripts and compiler options with existing workspace packages.

### Step 2: Shared Types and Error Model

- [x] Create `packages/cli/src/types.ts`.
- [x] Create `packages/cli/src/shared-errors.ts`.
- [x] Define command request, resolved config, validated path set, execution result, render model, and exit code types.

### Step 3: Parsing and Help Resolution

- [x] Create `packages/cli/src/parsing/cli-command-parser.ts`.
- [x] Create `packages/cli/src/parsing/help-content-builder.ts`.
- [x] Define top-level command/subcommand parsing and help handling.

### Step 4: Configuration Resolution

- [x] Create `packages/cli/src/config/cli-option-resolver.ts`.
- [x] Implement precedence across flags, config file, environment, and defaults.

### Step 5: Workspace and Path Guard

- [x] Create `packages/cli/src/path/workspace-path-guard.ts`.
- [x] Normalize paths and enforce workspace containment before dispatch.

### Step 6: Command Registry and Handlers

- [x] Create `packages/cli/src/commands/cli-command-registry.ts`.
- [x] Create `packages/cli/src/commands/convert-command-handler.ts`.
- [x] Create `packages/cli/src/commands/validate-command-handler.ts`.
- [x] Create `packages/cli/src/commands/report-command-handler.ts`.
- [x] Create `packages/cli/src/commands/help-command-handler.ts`.

### Step 7: Shared Bridges

- [x] Create `packages/cli/src/bridges/application-bridge.ts`.
- [x] Create `packages/cli/src/bridges/report-bridge.ts`.
- [x] Integrate command handlers with `core-application` and `core-reporting`.

### Step 8: Output Formatting

- [x] Create `packages/cli/src/output/cli-output-formatter.ts`.
- [x] Create `packages/cli/src/output/progress-emitter.ts`.
- [x] Render quiet, normal, and verbose terminal output safely.

### Step 9: Exit Code Mapping

- [x] Create `packages/cli/src/exit-codes/exit-code-mapper.ts`.
- [x] Define stable usage, validation, runtime, review, and success categories.

### Step 10: Interaction Handling

- [x] Create `packages/cli/src/interaction/confirmation-coordinator.ts`.
- [x] Support non-interactive default behavior with scoped confirmations.

### Step 11: CLI Facade

- [x] Create `packages/cli/src/generation/cli-service.ts`.
- [x] Expose a small `runCli` facade for terminal entry and test reuse.

### Step 12: Test Utilities and PBT Generators

- [x] Create `packages/cli/src/generation/generators.ts`.
- [x] Provide fast-check generators for argv, config maps, workspace paths, output modes, and exit outcomes.

### Step 13: Unit and Property-Based Tests

- [x] Create `packages/cli/tests/cli.test.ts`.
- [x] Cover parsing, precedence, path containment, safe output, exit codes, help handling, and report handoff.
- [x] Cover PBT properties for parsing invariants, dispatch determinism, containment, exit stability, and output consistency.

### Step 14: Workspace Integration

- [x] Update root `package.json` build script to include `@spa-bridge/cli`.
- [x] Update root `package.json` test script to include `@spa-bridge/cli`.

### Step 15: Verification

- [x] Run `npm run build --workspace @spa-bridge/cli`.
- [x] Run `npm run test --workspace @spa-bridge/cli`.
- [x] Run `npm run build`.
- [x] Run `npm run test`.

### Step 16: Code Documentation

- [x] Create `aidlc-docs/construction/uow-10-cli-interface/code/summary.md`.
- [x] Create `aidlc-docs/construction/uow-10-cli-interface/code/artifact-index.md`.
- [x] Summarize generated application code, tests, and verification results.

### Step 17: Completion Review

- [x] Confirm every generation step is checked.
- [x] Confirm UOW-10 story coverage is implemented.
- [x] Confirm Security Baseline and PBT extension findings are non-blocking.
- [x] Move AI-DLC state to UOW-10 Code Generation Review.

## Expected Application Code Paths

- `packages/cli/package.json`
- `packages/cli/tsconfig.json`
- `packages/cli/src/index.ts`
- `packages/cli/src/types.ts`
- `packages/cli/src/shared-errors.ts`
- `packages/cli/src/parsing/`
- `packages/cli/src/config/`
- `packages/cli/src/path/`
- `packages/cli/src/commands/`
- `packages/cli/src/bridges/`
- `packages/cli/src/output/`
- `packages/cli/src/exit-codes/`
- `packages/cli/src/interaction/`
- `packages/cli/src/generation/`
- `packages/cli/tests/cli.test.ts`

## Expected Documentation Paths

- `aidlc-docs/construction/uow-10-cli-interface/code/summary.md`
- `aidlc-docs/construction/uow-10-cli-interface/code/artifact-index.md`

## Approval Gate

This plan is the single source of truth for UOW-10 Code Generation. Code generation must not begin until this plan is explicitly approved.
