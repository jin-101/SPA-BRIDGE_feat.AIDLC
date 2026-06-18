# V2-GAP-UOW-07 Domain Entities

## Purpose

This unit models the generated-output validation and correction loop that runs after SPA-Bridge writes a Next.js target project. The entities below keep validation deterministic, safe, reportable, and policy-aware.

## Entities

### GeneratedTargetProject

Represents the generated Next.js repository root.

Fields:
- `targetRoot`: Absolute or workspace-resolved path to the generated output directory.
- `packageManager`: Selected package manager, defaulting to `npm`.
- `targetStrategy`: Expected to default to `nextjs-typescript`.
- `manifestRefs`: Safe references to generated `package.json`, config files, source files, quality artifacts, and review artifacts.
- `pathPolicy`: Containment policy proving all validation and fixes remain inside `targetRoot`.

Rules:
- All commands and file edits must stay within `targetRoot`.
- The generated project is preserved even when validation fails.
- Source snippets and sensitive values are not stored in this entity.

### ValidationCommandPlan

Defines the command sequence that may run against the generated target.

Fields:
- `commands`: Ordered command descriptors such as install validation, typecheck, build, lint, and optional smoke-start.
- `allowlist`: Permitted command names, arguments, and script keys.
- `timeoutMs`: Per-command timeout.
- `environmentPolicy`: Safe environment keys and redaction rules.
- `workingDirectory`: The generated target root.

Rules:
- Commands are non-interactive.
- Arbitrary generated scripts are not executed unless explicitly allowlisted.
- Command ordering is stable.

### ValidationResult

Captures sanitized command outcomes.

Fields:
- `commandKind`: Install, typecheck, build, lint, test, or smoke-start.
- `status`: Passed, failed, skipped, timed-out, or blocked.
- `exitCode`: Numeric exit code when available.
- `durationMs`: Runtime measurement.
- `diagnostics`: Sanitized validation diagnostics.
- `safeOutputSummary`: Redacted and categorized summary, not raw logs.

Rules:
- Raw stdout/stderr is never persisted by default.
- Diagnostics carry safe refs, categories, and suggested actions.

### DeterministicFixer

Represents a known, repeatable correction.

Fields:
- `fixerId`: Stable unique identifier.
- `category`: Next.js client boundary, imports, package manifest, aliases, TypeScript config, style/module reference, filename, or dependency replacement.
- `applicability`: Predicate over validation diagnostics and generated files.
- `apply`: Deterministic file plan mutation.
- `idempotenceKey`: Stable key for preventing repeated edits.

Rules:
- Fixers must be idempotent.
- Fixers cannot guess business behavior.
- Each applied fix must produce a trace entry and updated quality result.

### CorrectionAttempt

Represents one iteration of validation and correction.

Fields:
- `attemptNumber`: Zero-based or one-based stable attempt index.
- `validationResults`: Results before or after fixes.
- `appliedFixes`: Fixes applied in the attempt.
- `aiRefinementRequests`: Policy-approved local or external AI requests.
- `remainingBlockers`: Diagnostics that remain unresolved.

Rules:
- Attempt count is bounded by configuration.
- Deterministic fixers run before AI refinement.
- AI refinement receives minimized safe context only.

### AiRepairRequest

Represents a bounded, policy-controlled repair request.

Fields:
- `providerId`: Local Ollama by default, external only if policy allows.
- `model`: Default local model family such as EXAONE 3.5.
- `contextRefs`: Safe refs and minimized file excerpts.
- `diagnosticRefs`: Sanitized validation diagnostic IDs.
- `policyDecision`: Provider policy outcome from security rules.

Rules:
- Local Ollama is preferred.
- External providers require masking, policy approval, and explicit opt-in.
- Full generated projects are not sent wholesale.

### QualityGateResult

Represents final self-correction loop outcome.

Fields:
- `status`: Passed, degraded, blocked, or skipped.
- `validationSummary`: Command-level status matrix.
- `correctionSummary`: Attempts, applied fix categories, and remaining blockers.
- `runtimeParitySignals`: Install readiness, build readiness, client-boundary health, dependency health, and manual-review count.
- `artifactRefs`: `.spa-bridge/quality-gate-results.json`, `src/review/runtime-parity-quality.json`, and report integration refs.

Rules:
- Result ordering and IDs are deterministic.
- Manual-review diagnostics must be actionable.
- Sensitive content is excluded.

## Relationships

- `GeneratedTargetProject` owns one `ValidationCommandPlan`.
- `ValidationCommandPlan` produces ordered `ValidationResult` instances.
- `ValidationResult` selects zero or more `DeterministicFixer` instances.
- `CorrectionAttempt` groups validation results, fixes, and optional AI refinement.
- `AiRepairRequest` is only created after deterministic fixers are insufficient and provider policy passes.
- `QualityGateResult` summarizes the whole loop for CLI, reports, and review artifacts.
