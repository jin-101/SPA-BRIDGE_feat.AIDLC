# Security Test Instructions

## Purpose
Validate that the workspace maintains the security baseline for dependency hygiene, path safety, redaction-safe models, sensitive-data handling, provider policy gating, token vault safety, provider context minimization, quality-evidence safety, reporting safety, transformation pipeline safety, target-generation write-plan safety, and CLI output safety.

## Security Test Scenarios

### Scenario 1: Dependency and Supply Chain Review
- **Description**: Confirm exact-pinned dependencies and basic vulnerability scanning across `core-model`, `core-security`, `core-application`, `core-quality`, `core-reporting`, `source-angular`, `adapters-ai`, `transform-angular-react`, `target-react`, and `cli`
- **Steps**:
  1. Run `npm audit --omit=dev`
  2. Review the dependency lists in `packages/core-model/package.json`, `packages/core-security/package.json`, `packages/core-application/package.json`, `packages/core-quality/package.json`, and `packages/adapters-ai/package.json`
  3. Confirm that no dependency is pulled from an untrusted registry
- **Expected Results**: No unresolved critical dependency findings for the current package set

### Scenario 2: Secret and Sensitive Data Scan
- **Description**: Confirm generated code and docs do not contain hardcoded secrets or raw sensitive values, including in security policy and reporting artifacts
- **Steps**:
  1. Search `packages/core-model/`, `packages/core-security/`, `packages/core-application/`, `packages/core-quality/`, `packages/core-reporting/`, `packages/adapters-ai/`, `packages/cli/`, and `aidlc-docs/construction/uow-05-security-masking-and-provider-policy/` for secret-like patterns
  2. Review `packages/core-security/src/audit/`, `packages/core-security/src/policy/`, `packages/core-security/src/masking/`, `packages/core-security/src/token-vault/`, `packages/core-application/src/policy/`, `packages/core-reporting/src/`, `packages/adapters-ai/src/`, and `packages/cli/src/` for safe-display behavior
- **Expected Results**: No raw secrets, passwords, or tokens are present

### Scenario 3: Security-Aware Contract Review
- **Description**: Ensure orchestration, quality, reporting, provider, and security contracts expose only safe, structured data
- **Steps**:
  1. Review `packages/core-application/src/policy/policy.ts`
  2. Review `packages/core-security/src/policy/provider-policy-gate.ts`, `packages/core-security/src/audit/safe-audit-event-builder.ts`, `packages/core-application/src/policy/security-policy-coordinator.ts`, `packages/core-quality/src/`, and `packages/cli/src/output/`
  3. Confirm safe display strings are used for user-visible fields, policy decisions, quality evidence, report exports, and provider audit events
- **Expected Results**: Orchestration, quality, provider, and report contracts remain redaction-safe and non-leaky

### Scenario 4: Transformation Pipeline Safety Review
- **Description**: Confirm the Angular-to-React transformation package emits safe review diagnostics, uses provider-neutral mapping metadata, preserves path containment, and remains compatible with provider policy handoff
- **Steps**:
  1. Review `packages/transform-angular-react/src/`
  2. Confirm `TransformationRequestValidator`, `DraftValidator`, and `SafeReviewDiagnosticBuilder` reject unsafe or malformed inputs
  3. Confirm the package does not call external providers directly and keeps unresolved mappings as manual-review items
  4. Confirm provider refinement handoff uses minimized context and safe audit events
- **Expected Results**: Transformation output remains provider-neutral, redaction-safe, and fail-closed for invalid or unsupported mappings

### Scenario 5: React Target Generation Safety Review
- **Description**: Confirm the target-generation package enforces path containment, exact dependency pinning, safe diagnostics, and stable write plans
- **Steps**:
  1. Review `packages/target-react/src/`
  2. Confirm `TargetGenerationRequestValidator`, `TargetPathGuard`, `WritePlanBuilder`, and `TraceCoverageValidator` reject unsafe or malformed inputs
  3. Confirm `generateReactTarget` produces safe manual-review items instead of silently dropping unresolved materialization cases
  4. Confirm dependency manifests remain exact-pinned and allowlisted
- **Expected Results**: Target generation remains path-safe, redaction-safe, deterministic, and fail-closed for invalid or unsupported mappings

### Scenario 6: CLI Output Safety Review
- **Description**: Confirm CLI parsing, option resolution, and terminal rendering never leak raw sensitive values or unsafe paths
- **Steps**:
  1. Review `packages/cli/src/`
  2. Confirm `CliCommandParser`, `CliOptionResolver`, `WorkspacePathGuard`, and `CliOutputFormatter` reject unsafe inputs and sanitize display output
  3. Confirm help text, progress output, and error rendering remain safe for non-interactive shells
- **Expected Results**: CLI output remains path-safe, redaction-safe, and deterministic for validation and runtime errors

## Setup Security Test Environment

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Scanners
```bash
# No external scanners are required for the current instruction set.
```

## Run Security Tests

### 1. Execute Dependency Scan
```bash
npm audit --omit=dev
```

### 2. Execute Secret Scan
```bash
rg -n "(api[_-]?key|secret|password|token|PRIVATE KEY)" packages/core-model packages/core-security packages/core-application packages/core-quality packages/core-reporting packages/adapters-ai packages/cli aidlc-docs/construction/uow-05-security-masking-and-provider-policy
```

### 3. Review Security-Sensitive Modules
- `packages/core-application/src/policy/policy.ts`
- `packages/core-application/src/events/events.ts`
- `packages/core-application/src/report/report.ts`
- `packages/core-application/src/workspace/workspace.ts`
- `packages/adapters-ai/src/refinement/refinement-service.ts`
- `packages/adapters-ai/src/context/provider-context-minimizer.ts`
- `packages/adapters-ai/src/audit/provider-audit-event-builder.ts`
- `packages/transform-angular-react/src/pipeline/transformation-pipeline.ts`
- `packages/transform-angular-react/src/validation/transformation-request-validator.ts`
- `packages/transform-angular-react/src/validation/draft-validator.ts`
- `packages/transform-angular-react/src/diagnostics/safe-review-diagnostic-builder.ts`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/path/target-path-guard.ts`
- `packages/target-react/src/write-plan/write-plan-builder.ts`
- `packages/cli/src/parsing/cli-command-parser.ts`
- `packages/cli/src/path/workspace-path-guard.ts`
- `packages/cli/src/output/cli-output-formatter.ts`

## Notes
- UI hardening, auth, and production deployment rules are N/A for the current package-level workspace.
- Security Baseline compliance is primarily about dependency hygiene, path containment, safe display fields, provider-neutral transformation handling, report export safety, and avoiding raw sensitive value leakage in this stage.
