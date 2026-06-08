# Business Rules - UOW-10 CLI Interface

## Command Structure Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| CLI-001 | The CLI must expose a single top-level `spa-bridge` command with subcommands for conversion, validation, reporting, and help. | Reject unknown top-level entry points. |
| CLI-002 | Each subcommand must have stable, documented flags and positional arguments. | Validate argv before execution. |
| CLI-003 | Help output must be available without requiring a workspace path. | Return help text without side effects. |

## Configuration and Input Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| CLI-101 | Configuration precedence is `flags > config file > environment > defaults`. | Merge values deterministically. |
| CLI-102 | Workspace and output paths must be validated against allowed roots before execution. | Reject traversal and out-of-root paths. |
| CLI-103 | Path normalization must occur before command execution and before any report/export destination is resolved. | Use canonical safe refs only. |
| CLI-104 | Ambiguous or incomplete command inputs must fail fast with a usage diagnostic. | Do not guess missing required values. |

## Execution Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| CLI-201 | The main conversion command must invoke the shared application service. | The CLI must not reimplement core workflow logic. |
| CLI-202 | Conversion commands must emit safe progress and a deterministic final summary. | Use the selected verbosity mode. |
| CLI-203 | Report/export commands must delegate to the canonical reporting package. | Do not create ad hoc report formats. |
| CLI-204 | Non-interactive mode is the default for automation and CI. | No prompts unless explicitly needed. |
| CLI-205 | Interactive confirmations are allowed only for destructive or ambiguous operations. | Prompt only when required by policy. |

## Output Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| CLI-301 | Terminal output must honor quiet, normal, and verbose modes. | Format output according to the selected mode. |
| CLI-302 | The CLI must not print raw secrets, raw provider payloads, or raw source snippets. | Use safe summaries and redacted values only. |
| CLI-303 | Report/export commands must show deterministic destination paths or refs. | Include safe report locations in the summary. |
| CLI-304 | Warnings and manual-review items must be rendered as safe, structured summaries. | Use stable ordering and reason codes. |

## Exit Code Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| CLI-401 | Usage and parsing errors must use a stable usage-failure exit category. | Return a deterministic code for invalid argv. |
| CLI-402 | Validation failures must use a distinct exit category from usage errors. | Distinguish bad input from runtime failure. |
| CLI-403 | Runtime failures must map to a runtime-failure exit category. | Surface a clear summary without raw internals. |
| CLI-404 | Partial-success-with-review outcomes must be distinguishable from hard failures. | Return a stable review-needed exit category. |

## Traceability and Reporting Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| CLI-501 | Every completed command must preserve run and report references. | Include safe refs in the final summary. |
| CLI-502 | Command output must never bypass the canonical report when reporting is requested. | Always use the reporting package for exports. |
| CLI-503 | CLI diagnostics must stay consistent with the report's canonical summary. | Render from shared result data. |

## PBT Rules

| Rule ID | Rule | Property Category |
|---|---|---|
| CLI-PBT-001 | Equivalent argv and config inputs must resolve to equivalent command handlers. | Determinism |
| CLI-PBT-002 | Path validation must reject traversal and out-of-root inputs. | Invariant |
| CLI-PBT-003 | Exit code mapping must be stable for equivalent outcomes. | Invariant |
| CLI-PBT-004 | Output rendering must be stable for equivalent results and verbosity modes. | Determinism |
| CLI-PBT-005 | Safe summaries must not include forbidden fields. | Invariant |

## Review Completion Criteria

Functional design for UOW-10 is complete when:

- Command hierarchy and option precedence are defined.
- Conversion and report/export command behavior is explicit.
- Non-interactive automation and safe terminal output rules are defined.
- Path containment and exit code rules are explicit.
- PBT properties are identified for CLI-sensitive behavior.
