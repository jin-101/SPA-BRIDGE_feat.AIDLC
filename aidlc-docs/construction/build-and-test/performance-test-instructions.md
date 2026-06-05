# Performance Test Instructions

## Purpose
Validate that run orchestration, security evaluation, config resolution, manifest handling, provider selection, and status lookup remain efficient for the target fixture sizes defined in UOW-02, UOW-05, and UOW-06.

## Performance Requirements
- **Response Time**: Target under 50 ms for typical run status lookup
- **Throughput**: Security evaluation, config resolution, and manifest updates should remain stable across repeated runs
- **Concurrent Users**: Multiple runs in the same workspace must remain isolated by runId
- **Error Rate**: 0% for valid deterministic run/workspace inputs
- **Transformation Draft Throughput**: UOW-04 draft generation should remain deterministic for benchmark fixtures up to the configured generator size
- **Provider Selection Throughput**: UOW-06 provider registry lookup and response validation should remain deterministic and bounded for local/internal and mock providers

## Setup Performance Test Environment

### 1. Prepare Test Environment
```bash
# No special services are required.
```

### 2. Configure Test Parameters
- **Test Duration**: 5-10 minutes per benchmark pass
- **Ramp-up Time**: Not applicable
- **Virtual Users**: Not applicable

## Run Performance Tests

### 1. Execute Load Tests
```bash
# Performance harness is not yet generated for this workspace.
# Use the run workspace helpers in:
# packages/core-application/src/
# and the benchmark fixture factory in:
# packages/transform-angular-react/src/testing/
# plus the provider test generators in:
# packages/adapters-ai/src/testing/
# to construct a benchmark runner in a later unit.
```

### 2. Execute Stress Tests
```bash
# Stress testing is deferred until a dedicated benchmark script exists.
```

### 3. Analyze Performance Results
- **Response Time**: Pending benchmark runner
- **Throughput**: Pending benchmark runner
- **Error Rate**: Pending benchmark runner
- **Bottlenecks**: None measured yet
- **Results Location**: Console output from the future benchmark command

## Performance Optimization

If performance does not meet requirements:
1. Profile config resolution, manifest serialization, and run status lookup
2. Reduce object allocation in orchestration and provider-selection hot paths
3. Re-run the benchmark harness with the same seed or fixture set
