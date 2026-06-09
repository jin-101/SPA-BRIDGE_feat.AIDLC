# V2-GAP-UOW-00 Dependency Compatibility Filter and Replacement Code Generation Plan

## Unit

V2-GAP-UOW-00 Dependency Compatibility Filter and Replacement

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-000 Dependency Compatibility Filter And Replacement

## Goal

Implement deterministic source dependency classification and target dependency replacement so generated React projects avoid Angular-only install conflicts. The implementation must include the custom WDS package mapping:

- `@wds/wc-angular-lib@0.1.43` -> `@wds/wc-react-lib@0.1.43`

The dependency-level replacement is allowed, but usage-site API compatibility must remain review-required unless explicit rewrite rules verify compatibility.

## Brownfield Code Locations

Application code must be modified in-place under the workspace root:

- `packages/target-react/src/dependencies/`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/review/`
- `packages/target-react/src/types.ts`
- `packages/target-react/src/index.ts`
- `packages/target-react/tests/target-react.test.ts`
- `packages/target-react/src/testing/generators.ts`
- optionally `packages/cli/src/bridges/application-bridge.ts` if CLI reporting needs direct summary fields.

Documentation summaries may be added under:

- `aidlc-docs/construction/v2-gap-uow-00-dependency-compatibility-filter-and-replacement/code/`

## Dependencies

This unit builds on:

- Existing `TargetGenerationRequest.sourceDependencies` and `sourceDevDependencies`.
- Existing `DependencyManifestBuilder`.
- Existing `TargetGenerationService`.
- Existing review stub/report generation.
- Existing security policy and local-first AI provider architecture.

The first code pass should prioritize deterministic registry behavior. Shared Ollama advisory integration should be represented by an adapter boundary and schema-safe fallback behavior, but it must not block deterministic package filtering or require network access.

## Story And Requirement Traceability

- V2-GAP-FR-000: dependency compatibility filtering and replacement.
- V2 global acceptance: generated React projects should install more reliably and avoid known Angular-only packages.
- Security Baseline: no package fetching, no script execution, no registry credential exposure.
- Property-Based Testing: deterministic classification, stable replacement output, unique package keys, stable diagnostics.

## Implementation Plan

### Step 1. Dependency Compatibility Types

- [x] Extend `packages/target-react/src/types.ts` with:
  - `DependencyCompatibilityDecision`
  - `DependencyReplacementRule`
  - `DependencyCompatibilityReport`
  - `UsageSiteCompatibilityFinding`
  - `DependencyCompatibilityRiskLevel`
  - `DependencyCompatibilityAction`
- [x] Keep the types serializable and report-friendly.

### Step 2. Replacement Registry

- [x] Create `packages/target-react/src/dependencies/dependency-replacement-registry.ts`.
- [x] Add deterministic remove patterns for:
  - `@angular/*`
  - `@ngrx/*`
  - `@angular-devkit/*`
  - `@schematics/*`
  - `zone.js`
  - Angular-only build packages.
- [x] Add high-risk wrapper patterns:
  - `ngx-*`
  - `angularx-*`
- [x] Add framework-neutral carry allowlist examples:
  - `dayjs`
  - `mapbox-gl`
  - `lottie-web`
  - `uuid`
  - `js-cookie`
  - `rxjs`
- [x] Add custom WDS replacement rule:
  - source: `@wds/wc-angular-lib`
  - target: `@wds/wc-react-lib`
  - version policy: preserve
  - usage-site review policy: when-unverified

### Step 3. Dependency Classifier

- [x] Create `packages/target-react/src/dependencies/dependency-compatibility-classifier.ts`.
- [x] Classify each source dependency into exactly one bucket:
  - carry
  - replace
  - remove
  - review
- [x] Enforce deterministic registry precedence:
  - explicit replacement
  - explicit removal
  - carry allowlist
  - high-risk pattern
  - advisory fallback boundary
  - default review
- [x] Produce stable sorted decisions and diagnostics.

### Step 4. Ollama Advisory Boundary

- [x] Add a schema-oriented advisory interface that can later call the shared Ollama client.
- [x] Keep this unit deterministic by default: no network calls and no live Ollama calls in tests.
- [x] Parse advisory JSON defensively and degrade invalid/low-confidence output to `review`.
- [x] Preserve AI-generated rationale only as report enrichment, never as override of deterministic registry decisions.

### Step 5. Target Manifest Integration

- [x] Replace `TargetGenerationService.filterSourceDependencies` with classifier-driven manifest building.
- [x] Exclude removed packages from target dependencies.
- [x] Insert replacement packages into target dependencies.
- [x] Preserve target React/core dependencies as authoritative.
- [x] Preserve dev dependency filtering with the same compatibility classifier rules.
- [x] Ensure target manifest has no duplicate package names.

### Step 6. Compatibility Report Materialization

- [x] Create a report materializer under `packages/target-react/src/dependencies/` or `packages/target-react/src/review/`.
- [x] Generate a durable Markdown report file in the target write plan, such as:
  - `src/review/dependency-compatibility.md`
- [x] Include sections for:
  - Carried
  - Replaced
  - Removed
  - Review Required
  - WDS Custom Package Compatibility
  - Suggested Code Changes
- [x] Avoid private registry token or credential output.

### Step 7. Usage-Site Review Diagnostics

- [x] Inspect draft imports, source package refs, template external refs, or available source dependency evidence for replaced package names.
- [x] Emit manual-review items for WDS and other replaced package usage sites unless explicit rewrite rules exist.
- [x] Include safe source refs and replacement rationale.
- [x] Do not claim import/props/events parity for `@wds/wc-angular-lib`.

### Step 8. Tests

- [x] Add example tests for Angular-only package removal.
- [x] Add example tests for `ngx-*` and `angularx-*` exclusion/review behavior.
- [x] Add example tests for `@wds/wc-angular-lib@0.1.43` -> `@wds/wc-react-lib@0.1.43`.
- [x] Add tests for framework-neutral carry behavior.
- [x] Add report generation tests.
- [x] Add PBT for deterministic classification, no duplicate target package keys, and stable unknown diagnostics.

### Step 9. Documentation Summary

- [x] Create `aidlc-docs/construction/v2-gap-uow-00-dependency-compatibility-filter-and-replacement/code/summary.md`.
- [x] Create `aidlc-docs/construction/v2-gap-uow-00-dependency-compatibility-filter-and-replacement/code/artifact-index.md`.
- [x] Record implemented files, tests, WDS replacement policy, Ollama boundary behavior, and residual limitations.

### Step 10. Verification

- [x] Run affected package tests:
  - `npm run test --workspace @spa-bridge/target-react`
- [x] Run workspace build:
  - `npm run build`
- [x] Run workspace tests:
  - `npm test`
- [x] Update this plan checklist immediately as implementation steps complete.

## Security Baseline Compliance

- No dependency classifier code may fetch packages or execute package scripts.
- Reports must not include private registry credentials or auth tokens.
- Ollama advisory input must be limited to package names, versions, safe usage snippets, and non-sensitive rationale context.
- Deterministic registry decisions override AI advisory suggestions.

## Property-Based Testing Compliance

Required properties:

- Same dependency manifest input produces the same classification output.
- Every source package is classified exactly once.
- Replacement output has no duplicate package names.
- Removed Angular-only packages do not appear in target dependencies.
- Unknown high-risk package diagnostics remain stable.

## Approval Gate

Status: Code generation executed. Awaiting review approval to resume V2-GAP-UOW-04.
