# Security Test Instructions

## Purpose
Validate that the workspace maintains the security baseline for dependency hygiene, path safety, redaction-safe models, and sensitive-data handling.

## Security Test Scenarios

### Scenario 1: Dependency and Supply Chain Review
- **Description**: Confirm exact-pinned dependencies and basic vulnerability scanning
- **Steps**:
  1. Run `npm audit --omit=dev`
  2. Review the dependency lists in `packages/core-model/package.json` and `packages/core-application/package.json`
  3. Confirm that no dependency is pulled from an untrusted registry
- **Expected Results**: No unresolved critical dependency findings for the current package set

### Scenario 2: Secret and Sensitive Data Scan
- **Description**: Confirm generated code and docs do not contain hardcoded secrets or raw sensitive values
- **Steps**:
  1. Search `packages/core-model/`, `packages/core-application/`, and `aidlc-docs/construction/uow-02-core-application-orchestration-and-run-workspace/` for secret-like patterns
  2. Review `src/redaction/`, `src/policy/`, `src/report/`, and `src/events/` for safe-display behavior
- **Expected Results**: No raw secrets, passwords, or tokens are present

### Scenario 3: Security-Aware Contract Review
- **Description**: Ensure orchestration contracts and diagnostics expose only safe, structured data
- **Steps**:
  1. Review `packages/core-application/src/policy/policy.ts`
  2. Review `packages/core-application/src/events/events.ts` and `packages/core-application/src/report/report.ts`
  3. Confirm safe display strings are used for user-visible fields
- **Expected Results**: Orchestration and report contracts remain redaction-safe and non-leaky

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
rg -n "(api[_-]?key|secret|password|token|PRIVATE KEY)" packages/core-model packages/core-application aidlc-docs/construction/uow-02-core-application-orchestration-and-run-workspace
```

### 3. Review Security-Sensitive Modules
- `packages/core-application/src/policy/policy.ts`
- `packages/core-application/src/events/events.ts`
- `packages/core-application/src/report/report.ts`
- `packages/core-application/src/workspace/workspace.ts`

## Notes
- UI hardening, auth, and production deployment rules are N/A for the current package-level workspace.
- Security Baseline compliance is primarily about dependency hygiene, path containment, safe display fields, and avoiding raw sensitive value leakage in this stage.
