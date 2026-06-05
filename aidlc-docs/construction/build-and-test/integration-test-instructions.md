# Integration Test Instructions

## Purpose
Validate that the `@spa-bridge/core-model`, `@spa-bridge/core-application`, and `@spa-bridge/source-angular` packages work together as a coherent analysis and orchestration stack.

## Test Scenarios

### Scenario 1: Shared Contract Surface Integration
- **Description**: Verify that the application and source-analysis packages consume the core-model exports without path drift or contract mismatch
- **Setup**: Install dependencies and build the workspace
- **Test Steps**:
  1. Run `npm run build`
  2. Import `@spa-bridge/core-model`, `@spa-bridge/core-application`, and `@spa-bridge/source-angular` from a local consumer or from the built output
  3. Confirm the application service and source-analysis service use the shared schemas, ports, and result contracts
- **Expected Results**: Imports succeed and the public API exposes the shared contracts used by orchestration and source analysis
- **Cleanup**: None

### Scenario 2: Orchestration and Workspace Cooperation
- **Description**: Confirm `ConversionApplicationService` and `SourceAngularAnalysisService` can cooperate using the in-memory test doubles
- **Setup**: No extra services required
- **Test Steps**:
  1. Run `npm test`
  2. Observe the application and source-analysis test coverage for start, status, resume, scan, graph, and export flows
- **Expected Results**: Run manifest and resolved config are written, source inventory and graph output are produced, status lookups succeed, and report export handoff completes
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
- **Test Scenarios**: Shared contract surface, orchestration/workspace cooperation, and Angular source analysis handoff
- **Expected Results**: `core-model`, `core-application`, and `source-angular` compose without circular imports, type drift, or workspace path regressions
- **Logs Location**: Vitest console output

### 3. Cleanup
```bash
# No cleanup required.
```

## Notes
- Package-level smoke tests are the integration boundary for this workspace.
- Cross-unit and UI integration work remains for later packages.
