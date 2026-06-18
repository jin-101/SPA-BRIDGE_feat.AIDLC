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
  RuntimeParityQualityGate,
  GeneratedTargetCommandPlanner,
  ValidationResultClassifier,
  DeterministicFixerRegistry,
  GeneratedTargetSelfCorrectionService,
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

  it('scores Next.js runtime parity artifacts with required files and residue findings', () => {
    const gate = new RuntimeParityQualityGate();
    const score = gate.evaluate({
      targetStrategy: 'nextjs-typescript',
      expectedFramework: 'nextjs',
      files: [
        {
          path: 'package.json',
          content: JSON.stringify({ scripts: { dev: 'next dev', build: 'next build', typecheck: 'tsc --noEmit' }, dependencies: { next: '14.2.30' } }),
        },
        { path: 'next.config.mjs', content: 'export default {};' },
        { path: 'tsconfig.json', content: '{}' },
        { path: 'src/app/layout.tsx', content: 'export default function RootLayout() { return null; }' },
        { path: 'src/app/page.tsx', content: 'export default function Page() { return <main />; }' },
        { path: 'src/app/providers.tsx', content: "'use client'; export const RootProviders = ({ children }) => <>{children}</>;" },
        { path: '.npmrc.example', content: '# registry placeholders\n' },
        { path: '.env.example', content: 'API_BASE_URL=\n' },
        { path: 'src/review/registry-migration-report.json', content: '{"schemaVersion":1}' },
        { path: 'src/review/script-migration-report.json', content: '{"schemaVersion":1}' },
        { path: 'src/review/environment-contract-report.json', content: '{"schemaVersion":1}' },
        { path: 'src/review/package-manager-parity-report.json', content: '{"schemaVersion":1}' },
      ],
    });

    expect(score.requiredFilesPresent).toBe(true);
    expect(score.packageInstallReady).toBe(true);
    expect(score.enterpriseParityArtifactsPresent).toBe(true);
    expect(score.enterpriseScriptReady).toBe(true);
    expect(score.enterpriseEnvironmentReady).toBe(true);
    expect(score.score).toBeGreaterThanOrEqual(85);
  });

  it('plans generated target validation commands with safe boundaries', () => {
    const planner = new GeneratedTargetCommandPlanner();
    const plan = planner.plan({
      runId: 'run-001',
      targetRoot: '/workspace/generated-next',
      packageJson: {
        scripts: {
          dev: 'next dev',
          build: 'next build',
          lint: 'next lint',
          postinstall: 'node unsafe.js',
          typecheck: 'tsc --noEmit',
        },
      },
    });

    expect(plan.commands.map((command) => command.kind)).toEqual(['install', 'typecheck', 'build', 'lint']);
    expect(plan.commands.every((command) => command.allowlisted)).toBe(true);
    expect(plan.commands.every((command) => command.workingDirectory === '/workspace/generated-next')).toBe(true);
    expect(plan.rejectedScripts).toEqual(['postinstall']);
  });

  it('plans generated target validation commands with detected Yarn package manager parity', () => {
    const planner = new GeneratedTargetCommandPlanner();
    const plan = planner.plan({
      runId: 'run-yarn',
      targetRoot: '/workspace/generated-next',
      packageJson: {
        packageManager: 'yarn@1.22.22',
        scripts: {
          dev: 'next dev',
          build: 'next build',
          typecheck: 'tsc --noEmit',
        },
      },
    });

    expect(plan.packageManager).toBe('yarn');
    expect(plan.commands[0]).toMatchObject({
      kind: 'install',
      command: 'yarn',
      args: ['install', '--ignore-scripts', '--non-interactive'],
    });
    expect(plan.commands.find((command) => command.kind === 'build')).toMatchObject({
      command: 'yarn',
      args: ['build'],
    });
  });

  it('classifies generated target validation failures with sanitized diagnostics', () => {
    const classifier = new ValidationResultClassifier();
    const result = classifier.classify({
      commandId: 'run-001-build',
      kind: 'build',
      exitCode: 1,
      safeOutputSummary: 'Module not found: /Users/jhan/private/customer/src/app.tsx',
      durationMs: 10,
    });

    expect(result.status).toBe('failed');
    expect(result.safeOutputSummary).toContain('[safe-path]');
    expect(result.diagnostics[0]?.category).toBe('typescript-import-resolution');
    expect(result.diagnostics[0]?.fixerCandidateIds).toContain('fix-import-paths');
  });

  it('keeps deterministic fixer planning idempotent for repeated diagnostics', () => {
    const classifier = new ValidationResultClassifier();
    const diagnostic = classifier.classify({
      commandId: 'run-001-build',
      kind: 'build',
      exitCode: 1,
      safeOutputSummary: 'useState requires a client component boundary',
    }).diagnostics[0];
    if (!diagnostic) {
      throw new Error('Expected diagnostic');
    }
    const registry = new DeterministicFixerRegistry();

    const first = registry.planFixes([diagnostic, diagnostic]);
    const second = registry.planFixes([diagnostic]);

    expect(first).toStrictEqual(second);
    expect(first).toHaveLength(1);
    expect(first[0]?.category).toBe('next-client-boundary');
  });

  it('summarizes generated target self-correction for runtime parity scoring', () => {
    const classifier = new ValidationResultClassifier();
    const validationResult = classifier.classify({
      commandId: 'run-001-build',
      kind: 'build',
      exitCode: 1,
      safeOutputSummary: 'Cannot find module ./helpers',
    });
    const service = new GeneratedTargetSelfCorrectionService();
    const result = service.evaluate({
      runId: 'run-001',
      targetRoot: '/workspace/generated-next',
      packageJson: { scripts: { build: 'next build' } },
      validationResults: [validationResult],
    });

    expect(result.status).toBe('degraded');
    expect(result.summary.appliedFixes).toBe(1);
    expect(result.artifactRefs).toContain('.spa-bridge/quality-gate-results.json');
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
