# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

### 2. Review Test Results
- **Expected**: `@spa-bridge/core-model`, `@spa-bridge/core-security`, `@spa-bridge/core-application`, `@spa-bridge/core-quality`, `@spa-bridge/core-reporting`, `@spa-bridge/source-angular`, `@spa-bridge/adapters-ai`, `@spa-bridge/transform-angular-react`, `@spa-bridge/target-react`, `@spa-bridge/cli`, and `@spa-bridge/web` test suites pass with 0 failures
- **Test Coverage**: Broad coverage for schemas, invariants, orchestration behavior, reporting/export formatting, and helper utilities; coverage tooling is not configured yet
- **Test Report Location**: Console output from Vitest

### 3. Fix Failing Tests
If tests fail:
1. Review the failing assertion and stack trace in the Vitest output
2. Fix the relevant module in `packages/core-model/src/`, `packages/core-security/src/`, `packages/core-application/src/`, `packages/core-quality/src/`, `packages/core-reporting/src/`, `packages/source-angular/src/`, `packages/adapters-ai/src/`, `packages/transform-angular-react/src/`, `packages/target-react/src/`, `packages/cli/src/`, or `packages/web/src/`
3. Rerun `npm test` until the suite passes

## Notes
- The current suite includes both example-based and property-based tests.
- Property-based failures should be replayed using the reported seed and shrunk case.
