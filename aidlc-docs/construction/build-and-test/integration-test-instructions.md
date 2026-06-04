# Integration Test Instructions

## Purpose
Validate that the `@spa-bridge/core-model` package exports, schemas, generators, and helper modules work together as a coherent contract layer.

## Test Scenarios

### Scenario 1: Public Export Surface Integration
- **Description**: Verify that `packages/core-model/src/index.ts` re-exports the expected contract modules without path drift
- **Setup**: Install dependencies and build the package
- **Test Steps**:
  1. Run `npm run build`
  2. Import the package from a local consumer or from the built output
  3. Confirm core schemas, helpers, and generators are available from the public API
- **Expected Results**: Import succeeds and the public API exposes the shared contracts used by later units
- **Cleanup**: None

### Scenario 2: Schema and Generator Cooperation
- **Description**: Confirm generated fixtures are accepted by the matching Zod schemas
- **Setup**: No extra services required
- **Test Steps**:
  1. Run `npm test`
  2. Observe the property-based tests that generate domain objects and round-trip them through schemas
- **Expected Results**: Generator output validates successfully against the exported schemas
- **Cleanup**: None

## Setup Integration Test Environment

### 1. Start Required Services
```bash
# No services are required for UOW-01 integration checks.
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
- **Test Scenarios**: Public export surface, schema/generator cooperation
- **Expected Results**: Shared contract modules compose without circular imports or type drift
- **Logs Location**: Vitest console output

### 3. Cleanup
```bash
# No cleanup required.
```

## Notes
- Cross-unit integration tests will become meaningful once additional packages are generated.
- For now, the package-level smoke tests are the integration boundary for UOW-01.
