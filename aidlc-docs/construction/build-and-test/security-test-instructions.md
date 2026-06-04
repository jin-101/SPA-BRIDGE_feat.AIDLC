# Security Test Instructions

## Purpose
Validate that UOW-01 maintains the security baseline for contract definitions, dependency hygiene, redaction-safe models, and sensitive-data handling.

## Security Test Scenarios

### Scenario 1: Dependency and Supply Chain Review
- **Description**: Confirm exact-pinned dependencies and basic vulnerability scanning
- **Steps**:
  1. Run `npm audit --omit=dev`
  2. Review the dependency list in `packages/core-model/package.json`
  3. Confirm that no dependency is pulled from an untrusted registry
- **Expected Results**: No critical unresolved dependency findings for the current package set

### Scenario 2: Secret and Sensitive Data Scan
- **Description**: Confirm generated code and docs do not contain hardcoded secrets or raw sensitive values
- **Steps**:
  1. Search `packages/core-model/` and `aidlc-docs/construction/uow-01-core-model-and-ports-foundation/` for secret-like patterns
  2. Review `src/redaction/`, `src/masking/`, and `src/report/` for safe-display behavior
- **Expected Results**: No raw secrets, passwords, or tokens are present

### Scenario 3: Security-Aware Contract Review
- **Description**: Ensure port contracts and diagnostics expose only safe, structured data
- **Steps**:
  1. Review `src/ports/ports.ts`
  2. Review `src/diagnostics/diagnostics.ts` and `src/report/report.ts`
  3. Confirm safe display strings are used for user-visible fields
- **Expected Results**: Port and report contracts remain redaction-safe and non-leaky

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
rg -n "(api[_-]?key|secret|password|token|PRIVATE KEY)" packages/core-model aidlc-docs/construction/uow-01-core-model-and-ports-foundation
```

### 3. Review Security-Sensitive Modules
- `packages/core-model/src/redaction/redaction.ts`
- `packages/core-model/src/masking/masking.ts`
- `packages/core-model/src/diagnostics/diagnostics.ts`
- `packages/core-model/src/report/report.ts`

## Notes
- Web application and runtime hardening rules are N/A for the current library-only unit.
- Security Baseline compliance is primarily about dependency hygiene, safe display fields, and avoiding raw sensitive value leakage in this stage.
