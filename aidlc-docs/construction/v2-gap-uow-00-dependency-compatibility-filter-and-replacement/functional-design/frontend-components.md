# V2-GAP-UOW-00 Interaction Components

## CLI Dependency Review Prompt

Purpose:
- Display dependency compatibility decisions before target files are written in interactive runs.

Inputs:
- dependency compatibility decisions.
- replacement rationale.
- usage-site review findings.

Actions:
- confirm decisions.
- cancel conversion.
- proceed with deterministic defaults.

States:
- `pending-review`
- `confirmed`
- `cancelled`
- `non-interactive-defaults-applied`

## Compatibility Diagnostics Report

Purpose:
- Provide persistent developer-facing explanation after conversion.

Sections:
- Carried dependencies.
- Removed Angular-only dependencies.
- Replaced dependencies.
- Review-required dependencies.
- WDS custom package migration.
- Suggested code changes from deterministic rules or Ollama advisory.

## Web Review Surface Future Hook

The Web UI review workflow can later surface the same compatibility report data.

Expected fields:
- package name.
- decision.
- rationale.
- source refs.
- suggested replacement.
- manual review status.

No Web UI implementation is required in this unit; this artifact defines the interaction model only.
