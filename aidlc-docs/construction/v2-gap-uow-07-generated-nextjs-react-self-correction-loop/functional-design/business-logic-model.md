# V2-GAP-UOW-07 Business Logic Model

## Overview

The self-correction loop turns generated Next.js output into a validated, reviewable target repository. Its business logic is intentionally staged: plan safe commands, run validation, classify failures, apply deterministic fixes, optionally invoke policy-controlled AI repair, rerun validation, and publish quality artifacts.

## Processing Flow

1. Receive a generated target project from target generation.
2. Build a `ValidationCommandPlan` using target strategy, package manager, package scripts, and allowlist policy.
3. Run the first validation pass inside the generated target root.
4. Convert command failures into sanitized `ValidationResult` diagnostics.
5. Match diagnostics against deterministic fixers.
6. Apply safe deterministic file-plan changes.
7. Rerun only the affected or configured validation sequence.
8. If blockers remain and policy allows, prepare minimized local Ollama repair requests.
9. Validate AI repair responses and apply only schema-valid safe patches.
10. Stop when validation passes, the attempt limit is reached, or remaining failures require manual review.
11. Emit `.spa-bridge/quality-gate-results.json`, update `src/review/runtime-parity-quality.json`, and attach summaries to CLI/reporting exports.

## Command Planning Logic

The command planner derives commands from the generated project:

- `install`: verifies package manifest readiness using npm by default.
- `typecheck`: runs the configured TypeScript check when present or a deterministic generated fallback.
- `build`: runs the generated Next.js build script.
- `lint`: runs only when generated/configured safely.
- `smoke-start`: optional bounded start/readiness check, disabled unless supported by configuration.

The planner rejects commands that:
- Use unsupported package managers without explicit compatibility.
- Reference paths outside the generated target root.
- Require interactive prompts.
- Invoke unknown package scripts.

## Diagnostic Classification Logic

Validation failures are classified into stable categories:

- `dependency-install-failure`
- `next-client-boundary-missing`
- `typescript-import-resolution`
- `typescript-helper-missing`
- `typescript-alias-resolution`
- `next-build-config`
- `style-or-asset-reference`
- `lint-or-format`
- `unsafe-command`
- `timeout`
- `manual-review-required`

Each diagnostic includes a safe ref, reason code, severity, suggested action, and optional fixer candidate ID.

## Deterministic Fixer Logic

Fixers operate on generated file plans:

- Client-boundary fixer adds `"use client"` when React hooks, browser APIs, event handlers, animation classes, or form state require a client component.
- Import fixer adds generated helper imports, normalizes relative imports, and resolves source-path-preserved component imports.
- Manifest fixer adds missing safe runtime dependencies and removes Angular-only leftovers already known to compatibility policy.
- Alias fixer aligns `tsconfig.json`, Next.js config, and generated import paths.
- Style/asset fixer rewrites generated references to copied assets and style modules.
- Filename fixer shortens review artifact names while preserving traceability in metadata.

Fixers produce trace entries and can be reapplied without changing already-correct output.

## AI Repair Logic

AI repair is a later-stage assist, not the primary engine:

- The local Ollama adapter receives a narrow repair request with safe refs, error category, and generated target framework constraints.
- External adapters are only considered after explicit provider policy approval.
- The response must provide structured patch candidates, rationale category, confidence, and affected safe refs.
- Low-confidence or schema-invalid responses are rejected and turned into manual-review diagnostics.

## Quality Result Logic

Final quality status is computed as:

- `passed`: all required validations passed after zero or more safe corrections.
- `degraded`: output exists and some non-blocking checks remain unresolved.
- `blocked`: install/build/typecheck failed after bounded safe correction attempts.
- `skipped`: validation was intentionally skipped by configuration.

Quality signals include:
- Install readiness.
- Build readiness.
- Typecheck readiness.
- Lint readiness.
- Smoke-start readiness.
- Applied deterministic fix count.
- AI repair request count.
- Manual-review blocker count.
- Remaining Angular-only syntax or package residue.

## Traceability

Every validation result, fix, AI repair request, and quality artifact links back to generated target refs and conversion trace IDs where available. Traceability must not expose raw customer source snippets.
