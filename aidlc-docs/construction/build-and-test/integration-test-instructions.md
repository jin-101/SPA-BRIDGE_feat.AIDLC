# Integration Test Instructions

## Purpose
Validate that the `@spa-bridge/core-model`, `@spa-bridge/core-security`, `@spa-bridge/core-application`, `@spa-bridge/core-quality`, `@spa-bridge/source-angular`, `@spa-bridge/adapters-ai`, `@spa-bridge/transform-angular-react`, and `@spa-bridge/target-react` packages work together as a coherent analysis, security, orchestration, quality, provider, transformation, and target-generation stack.

## Test Scenarios

### Scenario 1: Shared Contract Surface Integration
- **Description**: Verify that the security, application, quality, source-analysis, provider, and transformation packages consume the core-model exports without path drift or contract mismatch
- **Setup**: Install dependencies and build the workspace
- **Test Steps**:
  1. Run `npm run build`
  2. Import `@spa-bridge/core-model`, `@spa-bridge/core-application`, `@spa-bridge/core-quality`, `@spa-bridge/source-angular`, and `@spa-bridge/adapters-ai` from a local consumer or from the built output
  3. Confirm the security pipeline, application service, quality orchestration service, source-analysis service, and provider refinement service use the shared schemas, ports, and result contracts
- **Expected Results**: Imports succeed and the public API exposes the shared contracts used by security, quality orchestration, provider refinement, and source analysis
- **Cleanup**: None

### Scenario 2: Security, Orchestration, Quality, Provider, Transformation, and Target Generation Cooperation
- **Description**: Confirm `SecurityEvaluationPipeline`, `SecurityPolicyCoordinator`, `ConversionApplicationService`, `QualityOrchestrationService`, `SourceAngularAnalysisService`, `RefinementService`, `TransformationService`, and `TargetGenerationService` can cooperate using the in-memory test doubles
- **Setup**: No extra services required
- **Test Steps**:
  1. Run `npm test`
  2. Observe the security, application, quality, source-analysis, provider, transformation, and target-generation test coverage for config resolution, masking, policy gating, gate ordering, self-correction, start, status, resume, scan, graph, provider selection, context minimization, draft generation, target write-plan generation, and export flows
- **Expected Results**: Security evaluation, run manifest, and resolved config are written; quality evidence and gate summaries are produced; source inventory and graph output are produced; provider refinement drafts and review items are generated; React target write plans and file specs are generated; status lookups succeed; and report export handoff completes
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
- **Test Scenarios**: Shared contract surface, orchestration/workspace cooperation, Angular source analysis handoff, provider refinement handoff, transformation pipeline handoff, and React target-generation handoff
- **Expected Results**: `core-model`, `core-security`, `core-application`, `core-quality`, `source-angular`, `adapters-ai`, `transform-angular-react`, and `target-react` compose without circular imports, type drift, or workspace path regressions
- **Logs Location**: Vitest console output

### 3. Cleanup
```bash
# No cleanup required.
```

## Notes
- Package-level smoke tests are the integration boundary for this workspace.
- Cross-unit and UI integration work remains for later packages.
