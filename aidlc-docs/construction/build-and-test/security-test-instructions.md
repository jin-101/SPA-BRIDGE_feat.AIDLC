# Security Test Instructions

## Purpose
Validate that the workspace maintains the security baseline for dependency hygiene, path safety, redaction-safe models, sensitive-data handling, provider policy gating, token vault safety, provider context minimization, and transformation pipeline safety.

## Security Test Scenarios

### Scenario 1: Dependency and Supply Chain Review
- **Description**: Confirm exact-pinned dependencies and basic vulnerability scanning across `core-model`, `core-security`, `core-application`, `source-angular`, `adapters-ai`, and `transform-angular-react`
- **Steps**:
  1. Run `npm audit --omit=dev`
  2. Review the dependency lists in `packages/core-model/package.json`, `packages/core-security/package.json`, `packages/core-application/package.json`, and `packages/adapters-ai/package.json`
  3. Confirm that no dependency is pulled from an untrusted registry
- **Expected Results**: No unresolved critical dependency findings for the current package set

### Scenario 2: Secret and Sensitive Data Scan
- **Description**: Confirm generated code and docs do not contain hardcoded secrets or raw sensitive values, including in security policy artifacts
- **Steps**:
  1. Search `packages/core-model/`, `packages/core-security/`, `packages/core-application/`, `packages/adapters-ai/`, and `aidlc-docs/construction/uow-05-security-masking-and-provider-policy/` for secret-like patterns
  2. Review `packages/core-security/src/audit/`, `packages/core-security/src/policy/`, `packages/core-security/src/masking/`, `packages/core-security/src/token-vault/`, `packages/core-application/src/policy/`, and `packages/adapters-ai/src/` for safe-display behavior
- **Expected Results**: No raw secrets, passwords, or tokens are present

### Scenario 3: Security-Aware Contract Review
- **Description**: Ensure orchestration, provider, and security contracts expose only safe, structured data
- **Steps**:
  1. Review `packages/core-application/src/policy/policy.ts`
  2. Review `packages/core-security/src/policy/provider-policy-gate.ts`, `packages/core-security/src/audit/safe-audit-event-builder.ts`, and `packages/core-application/src/policy/security-policy-coordinator.ts`
  3. Confirm safe display strings are used for user-visible fields, policy decisions, and provider audit events
- **Expected Results**: Orchestration, provider, and report contracts remain redaction-safe and non-leaky

### Scenario 4: Transformation Pipeline Safety Review
- **Description**: Confirm the Angular-to-React transformation package emits safe review diagnostics, uses provider-neutral mapping metadata, preserves path containment, and remains compatible with provider policy handoff
- **Steps**:
  1. Review `packages/transform-angular-react/src/`
  2. Confirm `TransformationRequestValidator`, `DraftValidator`, and `SafeReviewDiagnosticBuilder` reject unsafe or malformed inputs
  3. Confirm the package does not call external providers directly and keeps unresolved mappings as manual-review items
  4. Confirm provider refinement handoff uses minimized context and safe audit events
- **Expected Results**: Transformation output remains provider-neutral, redaction-safe, and fail-closed for invalid or unsupported mappings

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
rg -n "(api[_-]?key|secret|password|token|PRIVATE KEY)" packages/core-model packages/core-security packages/core-application packages/adapters-ai aidlc-docs/construction/uow-05-security-masking-and-provider-policy
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

## Notes
- UI hardening, auth, and production deployment rules are N/A for the current package-level workspace.
- Security Baseline compliance is primarily about dependency hygiene, path containment, safe display fields, provider-neutral transformation handling, and avoiding raw sensitive value leakage in this stage.
