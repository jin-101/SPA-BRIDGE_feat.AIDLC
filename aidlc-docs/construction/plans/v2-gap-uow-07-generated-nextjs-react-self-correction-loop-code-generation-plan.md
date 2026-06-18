# V2-GAP-UOW-07 Generated Next.js/React Self-Correction Loop Code Generation Plan

## Purpose

Implement the generated Next.js/React self-correction loop defined by V2-GAP-FR-007. The generated target repository should move closer to the final product goal: after conversion, the user can run install and dev/build commands and receive either a working Next.js app or precise, safe manual-review diagnostics.

## Unit Context

- **Unit**: V2-GAP-UOW-07 Generated Next.js/React Self-Correction Loop
- **Primary Requirement**: V2-GAP-FR-007
- **Supporting Requirement**: V2-GAP-FR-008
- **Primary Packages**:
  - `packages/core-quality`
  - `packages/target-react`
  - `packages/cli`
  - `packages/core-reporting`
  - `packages/adapters-ai`
- **Existing Dependencies**:
  - UOW-05 provider policy and masking boundary.
  - UOW-06 local-first AI provider adapter.
  - UOW-07/Next.js target generation.
  - UOW-09 reporting.
  - UOW-10 CLI output.
  - V2-GAP-UOW-00 dependency compatibility filtering.
  - V2-GAP-UOW-QA Next.js target default and runtime parity quality scoring.

## Design Inputs

- `aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`
- `aidlc-docs/construction/v2-gap-uow-07-generated-nextjs-react-self-correction-loop/functional-design/domain-entities.md`
- `aidlc-docs/construction/v2-gap-uow-07-generated-nextjs-react-self-correction-loop/functional-design/business-rules.md`
- `aidlc-docs/construction/v2-gap-uow-07-generated-nextjs-react-self-correction-loop/functional-design/business-logic-model.md`
- `aidlc-docs/construction/v2-gap-uow-07-generated-nextjs-react-self-correction-loop/functional-design/frontend-components.md`

## Story Traceability

- **US-001**: CLI user runs conversion and receives actionable progress/result output.
- **US-002**: User receives a generated target project that is closer to install/dev readiness.
- **US-007**: AI assistance is local-first and policy-controlled.
- **US-009**: Sensitive content is protected during diagnostics and provider use.
- **US-011**: Quality validation and bounded self-correction are captured.
- **US-013**: Reports include quality results, diagnostics, and manual-review evidence.

## Application Code Locations

Application code must be created or modified only under workspace package directories:

- `packages/core-quality/src/self-correction/`
- `packages/core-quality/src/validation/`
- `packages/core-quality/src/runtime-parity/`
- `packages/core-quality/src/types.ts`
- `packages/target-react/src/generation/`
- `packages/target-react/src/materializers/`
- `packages/cli/src/output/`
- `packages/cli/src/bridges/`
- `packages/core-reporting/src/quality/`
- `packages/core-reporting/src/types.ts`
- Test files under package `tests/` directories.

Documentation summaries for this unit go under:

- `aidlc-docs/construction/v2-gap-uow-07-generated-nextjs-react-self-correction-loop/code/`

## Execution Steps

### Step 1: Core Quality Result Types And Command Plan Models

- [x] Extend or add `packages/core-quality/src/types.ts` models for generated target validation commands, command results, self-correction attempts, deterministic fixer records, AI repair request summaries, and quality artifact refs.
- [x] Add stable status values: `passed`, `degraded`, `blocked`, and `skipped`.
- [x] Export the new contracts from `packages/core-quality/src/index.ts`.

### Step 2: Safe Generated Target Command Planner

- [x] Add `packages/core-quality/src/self-correction/generated-target-command-planner.ts`.
- [x] Build deterministic command plans for npm install validation, typecheck, build, lint when configured, and optional smoke-start.
- [x] Enforce generated target root containment, command allowlist, non-interactive execution, timeout metadata, and safe environment metadata.
- [x] Reject arbitrary generated scripts by default.

### Step 3: Sanitized Validation Result Classifier

- [x] Add `packages/core-quality/src/self-correction/validation-result-classifier.ts`.
- [x] Classify failures into stable categories such as dependency install, Next.js client boundary, import resolution, helper missing, alias resolution, style/asset reference, unsafe command, timeout, and manual review.
- [x] Ensure outputs use safe refs and reason codes instead of raw stdout/stderr.

### Step 4: Deterministic Fixer Registry

- [x] Add `packages/core-quality/src/self-correction/deterministic-fixer-registry.ts`.
- [x] Implement idempotent fix planning for Next.js client boundaries, missing helper imports, package manifest gaps, dependency replacements, aliases, TypeScript config, import paths, style/module refs, and generated filename/path issues.
- [x] Represent fixer outputs as safe file patch descriptors or file-plan mutation descriptors, not direct command execution.

### Step 5: Self-Correction Orchestrator

- [x] Add `packages/core-quality/src/self-correction/generated-target-self-correction-service.ts`.
- [x] Orchestrate bounded validation, classification, deterministic fix selection, optional AI repair request creation, retry attempts, and final quality status.
- [x] Prefer deterministic fixes before AI repair.
- [x] Preserve generated output on failure.

### Step 6: Local-First AI Repair Boundary

- [x] Add `packages/core-quality/src/self-correction/ai-repair-boundary.ts` or equivalent adapter-facing contract.
- [x] Prepare minimized safe repair requests for local Ollama EXAONE 3.5.
- [x] Represent external provider use as disabled unless policy/masking/opt-in flags are satisfied.
- [x] Validate AI repair responses before accepting patch candidates.

### Step 7: Quality Artifact Materialization In Target Output

- [x] Update `packages/target-react/src/generation/target-generation-service.ts` and related materializers to include `.spa-bridge/quality-gate-results.json` when self-correction results are available.
- [x] Update runtime parity quality integration so `src/review/runtime-parity-quality.json` includes self-correction signals.
- [x] Keep artifact IDs and ordering deterministic.

### Step 8: CLI Output And Progress Integration

- [x] Update `packages/cli/src/output/progress-emitter.ts` and `packages/cli/src/output/cli-output-formatter.ts` to display safe self-correction progress and final quality status.
- [x] Update `packages/cli/src/bridges/application-bridge.ts` if needed so conversion results expose quality artifact refs and status.
- [x] Avoid printing raw command logs or provider prompts by default.

### Step 9: Reporting Integration

- [x] Update `packages/core-reporting/src/quality/quality-report-summary-builder.ts` and report types/renderers as needed.
- [x] Include validation status, correction attempt summary, deterministic fixer summary, AI repair policy status, remaining blockers, and quality artifact refs.
- [x] Ensure JSON, Markdown, and HTML reports remain safe-content compliant.

### Step 10: Tests And Property-Based Coverage

- [x] Add or update tests under `packages/core-quality/tests/` for command planning safety, path containment, deterministic fixer idempotence, bounded retries, sanitized diagnostics, policy enforcement, and quality artifact stability.
- [x] Add or update tests under `packages/target-react/tests/` for quality artifact materialization and runtime parity quality self-correction signals.
- [x] Add or update tests under `packages/cli/tests/` and `packages/core-reporting/tests/` when existing package test structure supports it.
- [x] Add property-style checks where practical using the existing test generator patterns.

### Step 11: Code Summary Artifacts

- [x] Create `aidlc-docs/construction/v2-gap-uow-07-generated-nextjs-react-self-correction-loop/code/summary.md`.
- [x] Create `aidlc-docs/construction/v2-gap-uow-07-generated-nextjs-react-self-correction-loop/code/artifact-index.md`.
- [x] Summarize modified/created application files, tests, and verification commands.

### Step 12: Verification

- [x] Run relevant package tests where practical.
- [x] Run workspace `npm run build`.
- [x] Run workspace `npm test`.
- [x] Record verification outcome in the code summary.

## Acceptance Criteria

- Generated target validation has safe command planning and bounded attempts.
- Deterministic fixes are represented and idempotent.
- AI repair is local-first and policy-controlled.
- Generated output can include `.spa-bridge/quality-gate-results.json`.
- Runtime parity quality includes self-correction status and blockers.
- CLI/reporting expose safe quality summaries.
- Tests cover safety, determinism, policy, and artifact behavior.
- Workspace build and test pass after implementation.

## Approval

This plan is the single source of truth for V2-GAP-UOW-07 code generation. Implementation must not start until this plan is explicitly approved.
