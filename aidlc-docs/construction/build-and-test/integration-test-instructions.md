# Integration Test Instructions

## Purpose
Validate that the `@spa-bridge/core-model` and `@spa-bridge/core-application` packages work together as a coherent orchestration stack.

## Test Scenarios

### Scenario 1: Shared Contract Surface Integration
- **Description**: Verify that the application package consumes the core-model exports without path drift or contract mismatch
- **Setup**: Install dependencies and build the workspace
- **Test Steps**:
  1. Run `npm run build`
  2. Import `@spa-bridge/core-model` and `@spa-bridge/core-application` from a local consumer or from the built output
  3. Confirm the application service uses the shared schemas, ports, and result contracts
- **Expected Results**: Imports succeed and the public API exposes the shared contracts used by the orchestration layer
- **Cleanup**: None

### Scenario 2: Orchestration and Workspace Cooperation
- **Description**: Confirm `ConversionApplicationService` can start a run, persist workspace files, and export a report using the in-memory test doubles
- **Setup**: No extra services required
- **Test Steps**:
  1. Run `npm test`
  2. Observe the application test coverage for start, status, resume, and export flows
- **Expected Results**: Run manifest and resolved config are written, status lookups succeed, and report export handoff completes
- **Cleanup**: None

## Setup Integration Test Environment

### 1. Start Required Services
```bash
# No services are required for the current workspace integration checks.
```

### 2. Configure Service Endpoints
```bash
# No external endpoints are required.
```

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
```

### 2. Verify Service Interactions
- **Test Scenarios**: Shared contract surface, orchestration/workspace cooperation
- **Expected Results**: `core-model` and `core-application` compose without circular imports, type drift, or workspace path regressions
- **Logs Location**: Vitest console output

### 3. Cleanup
```bash
# No cleanup required.
```

## Notes
- Package-level smoke tests are the integration boundary for this workspace.
- Cross-unit and UI integration work remains for later packages.
