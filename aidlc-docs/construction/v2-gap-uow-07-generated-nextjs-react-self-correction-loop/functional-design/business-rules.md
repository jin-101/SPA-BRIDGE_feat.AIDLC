# V2-GAP-UOW-07 Business Rules

## Validation Scope

- The self-correction loop validates the generated Next.js target, not the SPA-Bridge workspace.
- Default validation includes dependency install planning/validation, TypeScript typecheck, target build, lint when configured, and optional smoke-start checks.
- Validation commands must execute from the generated target root.
- Package manager behavior defaults to `npm`; compatible package-manager hints may be detected only when deterministic and safe.

## Command Safety

- Only allowlisted commands and script keys may run.
- Commands must be non-interactive and time-bounded.
- Command working directories must remain inside the generated target root.
- Environment variables must be limited to a safe allowlist and redacted from diagnostics.
- The loop must never execute arbitrary generated scripts just because they exist in `package.json`.

## Correction Ordering

- Deterministic fixers run before AI refinement.
- Fixers must be idempotent and traceable.
- Known first-pass fixer categories are:
  - Next.js client boundaries for hooks, browser APIs, animation usage, form state, and event handlers.
  - Missing helper imports and generated utility imports.
  - Package manifest gaps and dependency replacement mismatches.
  - TypeScript path aliases and config options.
  - Import path extensions and generated source path normalization.
  - Style, asset, and module reference issues.
  - Generated filename length and path containment issues.
- The loop stops after a configured maximum attempt count.

## AI Refinement Policy

- Local Ollama EXAONE 3.5 is the default AI repair provider.
- AI refinement receives only minimized safe context: diagnostic category, safe file refs, narrow generated excerpts, and target framework metadata.
- External LLM providers are disabled unless UOW-05 policy checks, masking, and explicit opt-in pass.
- AI repair output must be schema-validated before becoming a file patch.
- AI repair cannot silently invent missing business behavior; uncertain changes become manual-review diagnostics.

## Failure Handling

- Generated output is preserved when validation fails.
- Failed validation produces structured diagnostics with command kind, sanitized error category, safe refs, applied fixes, remaining blockers, and manual-review actions.
- Full raw stdout/stderr is not persisted by default.
- If a blocker cannot be fixed safely, the quality gate status becomes `degraded` or `blocked`.
- The final report must distinguish deterministic fixes, AI-assisted suggestions, skipped validations, and unresolved manual-review work.

## Quality Artifacts

- The generated target includes `.spa-bridge/quality-gate-results.json`.
- The generated target updates `src/review/runtime-parity-quality.json` with self-correction signals.
- CLI and reporting exports include validation and correction summaries.
- Artifact ordering, IDs, and diagnostic lists are stable for identical generated inputs.

## Test And Acceptance Rules

- Tests must cover command plan safety, path containment, deterministic fixer idempotence, bounded retries, diagnostic sanitization, provider policy enforcement, quality artifact stability, and generated Next.js sample validation.
- Property-based checks should verify that generated command plans cannot escape target root and that repeated fixer application is stable.
- The implementation is not complete unless workspace `npm run build` and `npm test` pass after code generation.
