import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  createDefaultGateRegistry,
  createDeterministicRunnerAdapter,
  generateQualityOrchestration,
  GateRegistry,
  PbtCoordinator,
  QualityOrchestrationService,
  QualityRequestValidator,
  RunnerAdapter,
  RunnerPlanBuilder,
  SelfCorrectionPlanner,
  TraceCoverageValidator,
  createQualityGateTraceId,
  propertyTestPlanArbitrary,
  qualityRequestArbitrary,
} from '../src/index.js';
import type { PropertyTestPlan, QualityRequest, RunnerResult } from '../src/index.js';

const expectOk = <T, E>(result: { ok: true; value: T } | { ok: false; error: E }): T => {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('Expected ok result');
  }

  return result.value;
};

const createFixtureRequest = (): QualityRequest => ({
  runId: 'run-001',
  correlationId: 'corr-001',
  workspaceRoot: '/workspace/spa-bridge',
  selectedGateIds: ['build', 'unit', 'property'],
  artifactRefs: [{ kind: 'generated', path: 'quality/run-001/summary.json', segment: 'summary' }],
  seed: 20260605,
  policyContext: { mode: 'deterministic' },
});

const createFailingRunnerAdapter = (): RunnerAdapter => {
  const adapter = new RunnerAdapter();
  adapter.register({
    kind: 'build',
    run: () => ({
      exitCode: 0,
      status: 'passed',
      durationMs: 2,
      safeSummary: 'build passed',
      diagnosticRefs: [],
      traceRefs: [],
    }),
  });
  adapter.register({
    kind: 'unit',
    run: () => ({
      exitCode: 1,
      status: 'failed',
      durationMs: 3,
      safeSummary: 'unit failed',
      diagnosticRefs: ['unit-diagnostic'],
      traceRefs: [],
    }),
  });
  adapter.register({
    kind: 'property',
    run: () => ({
      exitCode: 0,
      status: 'passed',
      durationMs: 1,
      safeSummary: 'property passed',
      diagnosticRefs: [],
      traceRefs: [],
    }),
  });

  return adapter;
};

describe('core-quality package', () => {
  it('validates quality requests before orchestration', () => {
    const validator = new QualityRequestValidator();
    const validation = validator.validate(createFixtureRequest());

    expect(validation.ok).toBe(true);
  });

  it('keeps gate registry ordering deterministic', () => {
    const registry = createDefaultGateRegistry();
    const gateIds = registry.list().map((gate) => gate.gateId);

    expect(gateIds).toEqual(['build', 'lint', 'format', 'unit', 'integration', 'property']);
  });

  it('builds stable runner plans from the deterministic registry', () => {
    const registry = createDefaultGateRegistry();
    const selected = registry.resolve(['property', 'build', 'unit']);
    const plan = new RunnerPlanBuilder().build(createFixtureRequest(), selected);

    expect(plan.map((entry) => entry.gateId)).toEqual(['build', 'unit', 'property']);
    expect(plan.map((entry) => entry.request.commandRef)).toEqual(['npm run build', 'npm run test:unit', 'npm run test:property']);
  });

  it('plans bounded self-correction for blocking failures', () => {
    const planner = new SelfCorrectionPlanner();
    const gate = createDefaultGateRegistry().get('unit');
    if (!gate) {
      throw new Error('Expected unit gate');
    }

    const plan = planner.plan(gate, {
      gateId: 'unit',
      status: 'failed',
      startedAt: '2026-06-05T00:00:00.000Z',
      finishedAt: '2026-06-05T00:00:01.000Z',
      durationMs: 1,
      safeSummary: 'unit failed',
      diagnosticRefs: ['unit-diagnostic'],
      traceRefs: ['trace-unit'],
      attempts: 1,
    }, { retryBudget: 1 });

    expect(plan?.retryBudget).toBe(1);
    expect(plan?.correctionCandidates[0]?.summary).toBe('unit failed');
  });

  it('produces deterministic orchestration results across repeated runs', async () => {
    const service = new QualityOrchestrationService();
    const first = expectOk(await service.run(createFixtureRequest()));
    const second = expectOk(await service.run(createFixtureRequest()));

    expect(first.summary).toStrictEqual(second.summary);
    expect(first.evidenceBundle).toStrictEqual(second.evidenceBundle);
    expect(first.gateRuns).toStrictEqual(second.gateRuns);
    expect(first.traces).toStrictEqual(second.traces);
  });

  it('fails closed and emits manual review items for unresolved blocking gates', async () => {
    const service = new QualityOrchestrationService();
    const result = expectOk(await service.run(createFixtureRequest(), { runnerAdapter: createFailingRunnerAdapter(), retryBudget: 1 }));

    expect(result.summary.overallStatus).toBe('blocked');
    expect(result.manualReviewItems.length).toBeGreaterThan(0);
    expect(result.diagnostics.some((diagnostic) => diagnostic.severity === 'security-blocker')).toBe(true);
    expect(result.gateRuns.some((gateRun) => gateRun.status === 'blocked')).toBe(true);
  });

  it('keeps trace coverage stable for generated trace ids', () => {
    const gateTraceId = createQualityGateTraceId('run-001', 'unit');
    expect(gateTraceId.startsWith('trace-')).toBe(true);
  });
});

describe('property-based quality orchestration', () => {
  it('keeps orchestration outputs deterministic across repeated executions', async () => {
    await fc.assert(
      fc.asyncProperty(qualityRequestArbitrary, async (request) => {
        const first = expectOk(await generateQualityOrchestration(request));
        const second = expectOk(await generateQualityOrchestration(request));

        expect(first.summary).toStrictEqual(second.summary);
        expect(first.evidenceBundle).toStrictEqual(second.evidenceBundle);
        expect(first.gateRuns).toStrictEqual(second.gateRuns);
      }),
      { numRuns: 20, seed: 20260605 },
    );
  });

  it('keeps property plans reproducible with domain generators', async () => {
    await fc.assert(
      fc.asyncProperty(propertyTestPlanArbitrary, async (plan) => {
        const coordinator = new PbtCoordinator(
          new Map([
            [
              'property',
              {
                kind: 'property' as const,
                run: (): RunnerResult => ({
                  exitCode: 0,
                  status: 'passed',
                  durationMs: 1,
                  safeSummary: 'property ok',
                  diagnosticRefs: [],
                  traceRefs: [],
                }),
              },
            ],
          ]),
        );

        const first = await coordinator.runPlans([plan]);
        const second = await coordinator.runPlans([plan]);

        expect(first).toStrictEqual(second);
      }),
      { numRuns: 20, seed: 20260605 },
    );
  });

  it('validates generated requests before orchestration', async () => {
    await fc.assert(
      fc.asyncProperty(qualityRequestArbitrary, async (request) => {
        const validation = new QualityRequestValidator().validate(request);
        expect(validation.ok).toBe(true);
        const result = await generateQualityOrchestration(request);
        expect(result.ok).toBe(true);
      }),
      { numRuns: 20, seed: 20260605 },
    );
  });
});

describe('trace coverage validator', () => {
  it('requires trace refs for gate runs and evidence', () => {
    const validator = new TraceCoverageValidator();
    const request = createFixtureRequest();
    const result = validator.validate(
      request,
      [
        {
          gateId: 'build',
          status: 'passed',
          startedAt: '2026-06-05T00:00:00.000Z',
          finishedAt: '2026-06-05T00:00:01.000Z',
          durationMs: 1,
          safeSummary: 'build passed',
          diagnosticRefs: [],
          traceRefs: [createQualityGateTraceId('run-001', 'build')],
          attempts: 1,
        },
      ],
      [createQualityGateTraceId('run-001', 'build'), 'trace-summary'],
    );

    expect(result).toBe(true);
  });
});
