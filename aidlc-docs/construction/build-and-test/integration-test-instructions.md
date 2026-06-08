# Integration Test Instructions

## Purpose
Validate that the `@spa-bridge/core-model`, `@spa-bridge/core-security`, `@spa-bridge/core-application`, `@spa-bridge/core-quality`, `@spa-bridge/core-reporting`, `@spa-bridge/source-angular`, `@spa-bridge/adapters-ai`, `@spa-bridge/transform-angular-react`, `@spa-bridge/target-react`, `@spa-bridge/cli`, and `@spa-bridge/web` packages work together as a coherent analysis, security, orchestration, quality, reporting, provider, transformation, target-generation, CLI, and browser review stack.

## Test Scenarios

### Scenario 1: Shared Contract Surface Integration
- **Description**: Verify that the security, application, quality, reporting, source-analysis, provider, transformation, target-generation, CLI, and browser review packages consume the core-model exports without path drift or contract mismatch
- **Setup**: Install dependencies and build the workspace
- **Test Steps**:
  1. Run `npm run build`
  2. Import `@spa-bridge/core-model`, `@spa-bridge/core-application`, `@spa-bridge/core-quality`, `@spa-bridge/core-reporting`, `@spa-bridge/source-angular`, `@spa-bridge/adapters-ai`, `@spa-bridge/target-react`, `@spa-bridge/cli`, and `@spa-bridge/web` from a local consumer or from the built output
  3. Confirm the security pipeline, application service, quality orchestration service, report generation service, source-analysis service, provider refinement service, target-generation service, CLI service, and browser review workflow use the shared schemas, ports, and result contracts
- **Expected Results**: Imports succeed and the public API exposes the shared contracts used by security, quality orchestration, reporting, provider refinement, source analysis, target generation, CLI dispatch, and browser review
- **Cleanup**: None

### Scenario 2: Security, Orchestration, Quality, Provider, Transformation, Target Generation, CLI, and Web Cooperation
- **Description**: Confirm `SecurityEvaluationPipeline`, `SecurityPolicyCoordinator`, `ConversionApplicationService`, `QualityOrchestrationService`, `ReportGenerationService`, `SourceAngularAnalysisService`, `RefinementService`, `TransformationService`, `TargetGenerationService`, `runCli`, and the web review workflow can cooperate using the in-memory test doubles
- **Setup**: No extra services required
- **Test Steps**:
  1. Run `npm test`
  2. Observe the security, application, quality, reporting, source-analysis, provider, transformation, target-generation, CLI, and web test coverage for config resolution, masking, policy gating, gate ordering, self-correction, run summary generation, canonical report generation, source scan, graph, provider selection, context minimization, draft generation, target write-plan generation, CLI parsing, CLI dispatch, web review state mapping, access gating, remediation confirmation, and export flows
- **Expected Results**: Security evaluation, run manifest, and resolved config are written; quality evidence and gate summaries are produced; canonical reports and exports are produced; source inventory and graph output are produced; provider refinement drafts and review items are generated; React target write plans and file specs are generated; CLI status lookups and exit-code mapping succeed; web review state and safe render models are produced; and report export handoff completes
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
- **Test Scenarios**: Shared contract surface, orchestration/workspace cooperation, Angular source analysis handoff, reporting handoff, provider refinement handoff, transformation pipeline handoff, React target-generation handoff, CLI dispatch handoff, and browser review handoff
- **Expected Results**: `core-model`, `core-security`, `core-application`, `core-quality`, `core-reporting`, `source-angular`, `adapters-ai`, `transform-angular-react`, `target-react`, `cli`, and `web` compose without circular imports, type drift, or workspace path regressions
- **Logs Location**: Vitest console output

### 3. Cleanup
```bash
# No cleanup required.
```

## Notes
- Package-level smoke tests are the integration boundary for this workspace.
- Cross-unit and UI integration work remains for later packages.
