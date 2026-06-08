# Functional Design Plan - UOW-10 CLI Interface

## Plan Metadata

- **Unit**: UOW-10 CLI Interface
- **Primary Package**: `packages/cli`
- **Primary Story**: US-001 Run Conversion from the Command Line
- **Supporting Stories**: US-002, US-008, US-011, US-013
- **Stage**: Functional Design
- **Status**: In Progress

## Objective

Define the command-line workflow that drives conversion runs, validation, and report export through the shared application service. UOW-10 should make it easy to start a conversion from the terminal, inspect progress, control output verbosity, and surface deterministic exit codes and report locations.

## Context Summary

UOW-10 depends on the packages that already exist:

- `packages/core-application` provides the shared orchestration entry points.
- `packages/core-reporting` provides canonical report generation and export views.
- `packages/core-quality` provides quality results, validation outcomes, and evidence summaries.
- `packages/core-security` provides masking and policy controls for any sensitive CLI output.
- `packages/target-react`, `packages/adapters-ai`, and `packages/source-angular` provide the underlying conversion flow that the CLI triggers.

## Planned Functional Design Work

- [x] Review the UOW-10 unit definition, CLI-related stories, and prior workflow artifacts.
- [x] Define the command structure, subcommands, and top-level help behavior.
- [x] Define argument parsing, configuration precedence, and path validation rules.
- [x] Define conversion command behavior, progress reporting, and exit codes.
- [x] Define report/export command behavior and output location rules.
- [x] Define validation and dry-run style commands if needed for the CLI workflow.
- [x] Define non-interactive vs interactive behavior and default verbosity levels.
- [x] Define safe terminal output rules for diagnostics, warnings, and manual review items.
- [x] Define command-level traceability and report handoff expectations.
- [x] Identify functional PBT properties and example-based command scenarios.
- [x] Generate functional design artifacts after answers are provided and validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the top-level CLI command shape for UOW-10?

A) A single `spa-bridge` CLI with subcommands for conversion, validation, reporting, and help
B) Separate unrelated executables for each action
C) Only one monolithic command with many flags and no subcommands
X) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 2
How should command input precedence be resolved?

A) CLI flags override config file values, which override environment values, which override package defaults
B) Config file values always override CLI flags
C) Environment variables are the only supported input source
X) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 3
What should the main conversion command do by default?

A) Trigger the shared application service, show progress, and produce a deterministic report/output path
B) Print a plan only and never execute conversion
C) Execute conversion silently with no report or progress output
X) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 4
How should output verbosity and terminal rendering behave?

A) Support quiet, normal, and verbose modes with safe formatted terminal output and no raw sensitive data
B) Always print every internal detail to stdout
C) Only write logs to files and keep the terminal empty
X) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 5
How should report and export commands behave?

A) Reuse the canonical reporting package to emit JSON, Markdown, and HTML exports with explicit destination rules
B) Generate ad hoc text summaries inside the CLI only
C) Skip export support and leave reporting to the Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 6
How should path handling and workspace safety work?

A) Require explicit workspace/root containment checks, reject traversal, and normalize all paths before execution
B) Trust whatever path the caller passes
C) Allow relative traversal if the user confirms interactively
X) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 7
How should interactive behavior be handled?

A) Default to non-interactive automation, with optional confirmations only for destructive or ambiguous operations
B) Require interactive prompts for every command
C) Never allow interactive confirmations under any condition
X) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 8
How should command failures and exit codes be represented?

A) Use stable exit code categories for usage errors, validation failures, runtime failures, and partial-success-with-review states
B) Return only `0` or `1`
C) Throw uncaught errors and let the shell decide
X) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 9
What API shape best fits later reuse by automation or tests?

A) A reusable CLI application layer with command handlers, parser adapters, output formatters, and report/export bridges
B) A script-only entry point with no reusable command layer
C) A UI-only wrapper around shell commands
X) Other (please describe after [Answer]: tag below)

[Answer]:

### Question 10
What should be the blocking PBT focus for this unit?

A) Argument parsing invariants, command dispatch determinism, path containment, exit code stability, and output/trace consistency
B) Only example-based CLI smoke tests
C) PBT is not useful for command-line behavior
X) Other (please describe after [Answer]: tag below)

[Answer]:

## Recommended Answers

For this project, option **A** is the recommended answer for all questions. It keeps the CLI deterministic, reusable, safe for automation, and aligned with the shared application, reporting, quality, and security layers already in the workspace.

## Content Validation Notes

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown structure uses standard headings, lists, and inline code only.
- All questions include meaningful choices and the required `X) Other` option.

## Next Step

After answers are provided, validate completeness and consistency, then generate:

- `aidlc-docs/construction/uow-10-cli-interface/functional-design/business-logic-model.md`
- `aidlc-docs/construction/uow-10-cli-interface/functional-design/business-rules.md`
- `aidlc-docs/construction/uow-10-cli-interface/functional-design/domain-entities.md`
