# V2-GAP-UOW-07 Frontend And User-Facing Behavior

## CLI User Flow

The CLI conversion flow gains a post-generation validation phase:

1. User runs `spa-bridge convert`.
2. SPA-Bridge generates the Next.js target repository.
3. CLI reports that validation is starting.
4. CLI shows safe progress events for install/typecheck/build/lint/smoke-start.
5. CLI reports deterministic fixes as high-level categories, not raw source content.
6. CLI reports whether local Ollama AI repair was used.
7. CLI finishes with quality status: passed, degraded, blocked, or skipped.

## CLI Output Requirements

CLI output should show:

- Target root.
- Validation commands by category.
- Attempt count.
- Fix categories applied.
- AI provider mode: none, local Ollama, or external policy-approved.
- Final quality status.
- Path to `.spa-bridge/quality-gate-results.json`.
- Path to `src/review/runtime-parity-quality.json`.

CLI output must not show:

- Full raw command logs by default.
- Sensitive environment values.
- External provider prompts or responses.
- Unredacted source snippets.

## Report Integration

Generated reports should include:

- Validation status table.
- Correction attempt summary.
- Deterministic fixer summary.
- AI repair summary with provider mode and policy status.
- Remaining manual-review actions.
- Quality artifact refs.

Report readers should be able to answer:

- Did the generated Next.js project install?
- Did it typecheck?
- Did it build?
- What did the tool fix automatically?
- What remains for a developer to review?

## Web Review Workflow

If surfaced in the Web UI, UOW-07 data should appear as:

- A quality gate summary panel.
- Per-command result rows.
- Applied fix timeline.
- Manual-review action list.
- Safe artifact download links.

The Web UI must not expose raw logs unless an explicit safe-log export is later designed.

## Generated Project Review Files

The generated target repository should contain:

- `.spa-bridge/quality-gate-results.json` for machine-readable validation and correction results.
- `src/review/runtime-parity-quality.json` for runtime parity scoring.
- Existing review markdown files for manual mappings, with filename length bounded.

These review files are part of the user's output and should help them move from generated code to a runnable Next.js app.
