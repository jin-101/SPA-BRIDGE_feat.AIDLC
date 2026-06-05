# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

### 2. Review Test Results
- **Expected**: `@spa-bridge/core-model`, `@spa-bridge/core-security`, `@spa-bridge/core-application`, `@spa-bridge/source-angular`, `@spa-bridge/adapters-ai`, and `@spa-bridge/transform-angular-react` test suites pass with 0 failures
- **Test Coverage**: Broad coverage for schemas, invariants, orchestration behavior, and helper utilities; coverage tooling is not configured yet
- **Test Report Location**: Console output from Vitest

### 3. Fix Failing Tests
If tests fail:
1. Review the failing assertion and stack trace in the Vitest output
2. Fix the relevant module in `packages/core-model/src/`, `packages/core-security/src/`, `packages/core-application/src/`, `packages/source-angular/src/`, `packages/adapters-ai/src/`, or `packages/transform-angular-react/src/`
3. Rerun `npm test` until the suite passes

## Notes
- The current suite includes both example-based and property-based tests.
- Property-based failures should be replayed using the reported seed and shrunk case.
