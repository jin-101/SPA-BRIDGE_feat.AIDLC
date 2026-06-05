# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

### 2. Review Test Results
- **Expected**: `@spa-bridge/core-model`, `@spa-bridge/core-application`, and `@spa-bridge/source-angular` test suites pass with 0 failures
- **Test Coverage**: Broad coverage for schemas, invariants, orchestration behavior, and helper utilities; coverage tooling is not configured yet
- **Test Report Location**: Console output from Vitest

### 3. Fix Failing Tests
If tests fail:
1. Review the failing assertion and stack trace in the Vitest output
2. Fix the relevant module in `packages/core-model/src/`, `packages/core-application/src/`, or `packages/source-angular/src/`
3. Rerun `npm test` until the suite passes

## Notes
- The current suite includes both example-based and property-based tests.
- Property-based failures should be replayed using the reported seed and shrunk case.
