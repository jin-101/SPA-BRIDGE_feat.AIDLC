import { createSafeDisplayString } from '@spa-bridge/core-model';
import type { ManualReviewItem } from '@spa-bridge/core-model';

import { createStableHash } from '../shared-errors.js';
import { createDefaultGateRegistry, GateRegistry } from '../gates/gate-registry.js';
import { GateSelectionPolicy } from '../gates/gate-selection-policy.js';
import { ValidationGuard } from '../validation/validation-guard.js';
import { RunnerAdapter, createDeterministicRunnerAdapter } from '../runners/runner-adapter.js';
import { RunnerPlanBuilder } from '../runners/runner-plan-builder.js';
import { SelfCorrectionPlanner } from '../correction/self-correction-planner.js';
import { PbtCoordinator } from '../pbt/pbt-coordinator.js';
import { EvidenceAggregator } from '../evidence/evidence-aggregator.js';
import { QualityDiagnosticFactory } from '../diagnostics/quality-diagnostic-factory.js';
import { ManualReviewFactory } from '../review/manual-review-factory.js';
import { RunSummaryBuilder } from '../summary/run-summary-builder.js';
import {
  QualityTraceBuilder,
  createQualityGateTraceId,
  createQualitySummaryTraceId,
} from '../traceability/quality-trace-builder.js';
import { TraceCoverageValidator } from '../traceability/trace-coverage-validator.js';
import type {
  QualityDiagnostic,
  QualityGateDefinition,
  QualityGateRun,
  QualityOrchestrationResult,
  QualityRequest,
  PropertyTestPlan,
  SelfCorrectionPlan,
} from '../types.js';
import { err, ok, type Result } from '@spa-bridge/core-model';
import type { QualityError } from '../shared-errors.js';

export type QualityOrchestrationOptions = {
  registry?: GateRegistry;
  runnerAdapter?: RunnerAdapter;
  retryBudget?: number;
};

const nowIso = (): string => new Date().toISOString();
const deterministicIso = (seed: unknown): string => {
  const hash = createStableHash(seed);
  const offsetMs = Number.parseInt(hash.slice(0, 8), 16) % (24 * 60 * 60 * 1000);
  return new Date(Date.UTC(2026, 0, 1, 0, 0, 0, offsetMs)).toISOString();
};

const toTraceRefs = (traceIds: string[]): string[] => [...new Set(traceIds)];

export class QualityOrchestrationService {
  constructor(
    private readonly validationGuard = new ValidationGuard(),
    private readonly registry = createDefaultGateRegistry(),
    private readonly selectionPolicy = new GateSelectionPolicy(),
    private readonly runnerPlanBuilder = new RunnerPlanBuilder(),
    private readonly runnerAdapter = createDeterministicRunnerAdapter(),
    private readonly selfCorrectionPlanner = new SelfCorrectionPlanner(),
    private readonly pbtCoordinator = new PbtCoordinator(),
    private readonly evidenceAggregator = new EvidenceAggregator(),
    private readonly diagnosticFactory = new QualityDiagnosticFactory(),
    private readonly manualReviewFactory = new ManualReviewFactory(),
    private readonly summaryBuilder = new RunSummaryBuilder(),
    private readonly traceBuilder = new QualityTraceBuilder(),
    private readonly traceCoverageValidator = new TraceCoverageValidator(),
  ) {}

  async run(input: unknown, options: QualityOrchestrationOptions = {}): Promise<Result<QualityOrchestrationResult, QualityError>> {
    const validation = this.validationGuard.validate(input);
    if (!validation.ok) {
      return err(validation.error);
    }

    const request = validation.value;
    const registry = options.registry ?? this.registry;
    const runnerAdapter = options.runnerAdapter ?? this.runnerAdapter;
    const retryBudget = options.retryBudget ?? 1;

    const gateDefinitions = this.selectionPolicy.select(request, registry);
    const runnerPlan = this.runnerPlanBuilder.build(request, gateDefinitions);

    const gateRuns: QualityGateRun[] = [];
    const diagnostics: QualityDiagnostic[] = [];
    const manualReviewItems: ManualReviewItem[] = [];
    const correctionPlans: SelfCorrectionPlan[] = [];
    let retryCount = 0;
    const startedAt = deterministicIso({ runId: request.runId, phase: 'quality-start' });

    for (const planEntry of runnerPlan) {
      const gateDefinition = gateDefinitions.find((candidate) => candidate.gateId === planEntry.gateId);
      if (!gateDefinition) {
        continue;
      }

      const attempts: Array<{
        status: 'passed' | 'failed' | 'skipped' | 'blocked';
        safeSummary: string;
        diagnosticRefs: string[];
        traceRefs: string[];
      }> = [];

      const runOnce = async () => {
        const result = await runnerAdapter.run(planEntry);
        attempts.push(result);
        return result;
      };

      let result = await runOnce();
      let appliedRetries = 0;

      while (result.status === 'failed' && gateDefinition.blocking && appliedRetries < retryBudget) {
        const plannedCorrection = this.selfCorrectionPlanner.plan(gateDefinition, {
          gateId: gateDefinition.gateId,
          status: 'failed',
          startedAt,
          finishedAt: deterministicIso({ runId: request.runId, gateId: gateDefinition.gateId, attempt: appliedRetries }),
          durationMs: 0,
          safeSummary: result.safeSummary,
          diagnosticRefs: [...result.diagnosticRefs],
          traceRefs: [...result.traceRefs],
          attempts: appliedRetries + 1,
        }, { retryBudget });

        if (!plannedCorrection) {
          break;
        }

        correctionPlans.push(plannedCorrection);
        appliedRetries += 1;
        retryCount += 1;
        result = await runOnce();
      }

      const finalStatus = result.status === 'passed'
        ? 'passed'
        : gateDefinition.blocking
          ? 'blocked'
          : 'failed';

      const gateRun: QualityGateRun = {
        gateId: gateDefinition.gateId,
        status: finalStatus,
        startedAt,
        finishedAt: deterministicIso({ runId: request.runId, gateId: gateDefinition.gateId, attempt: attempts.length }),
        durationMs: attempts.length - 1,
        safeSummary: createSafeDisplayString(result.safeSummary),
        diagnosticRefs: [...result.diagnosticRefs],
        traceRefs: [createQualityGateTraceId(request.runId, gateDefinition.gateId), ...result.traceRefs],
        attempts: attempts.length,
      };

      gateRuns.push(gateRun);

      if (finalStatus !== 'passed') {
        const severity = finalStatus === 'blocked' ? 'blocking' : 'warning';
        diagnostics.push(this.diagnosticFactory.createFromGateRun(gateRun, severity));
      }

      if (finalStatus === 'blocked') {
        manualReviewItems.push(this.manualReviewFactory.createFromGateRun(gateRun));
      }
    }

    const propertyPlans: PropertyTestPlan[] = gateDefinitions
      .filter((gate) => gate.kind === 'property')
      .map((gate) => ({
        planId: `pbt-${gate.gateId}`,
        subject: gate.toolRef,
        generatorFamily: gate.gateId,
        propertyName: gate.summaryTemplate,
        seed: request.seed,
        shrinkStrategy: 'default',
        exampleRegressions: [],
      }));

    const propertyTestRuns = await this.pbtCoordinator.runPlans(propertyPlans);
    const propertyTraceRefs = propertyTestRuns.flatMap((entry) => entry.traceRefs);
    const propertyDiagnostics = propertyTestRuns
      .filter((entry) => entry.status !== 'passed')
      .map((entry) => this.diagnosticFactory.createFromGateRun({
        gateId: entry.planId,
        status: entry.status,
        startedAt,
        finishedAt: deterministicIso({ runId: request.runId, gateId: entry.planId, phase: 'property' }),
        durationMs: 0,
        safeSummary: entry.counterexample ?? 'property failure',
        diagnosticRefs: [...entry.diagnosticRefs],
        traceRefs: [...entry.traceRefs],
        attempts: 1,
      }, entry.status === 'blocked' ? 'blocking' : 'manual-review'));

    diagnostics.push(...propertyDiagnostics);

    const traces = this.traceBuilder.build(request, gateRuns, this.summaryBuilder.build({
      runId: request.runId,
      gateRuns,
      seed: request.seed,
      durationMs: 0,
      manualReviewCount: manualReviewItems.length,
      retryCount,
    }));

    const traceRefs = toTraceRefs([...traces.map((trace) => trace.id), ...propertyTraceRefs, createQualitySummaryTraceId(request.runId)]);

    if (!this.traceCoverageValidator.validate(request, gateRuns, traceRefs)) {
      diagnostics.push(this.diagnosticFactory.createFromGateRun({
        gateId: 'trace-coverage',
        status: 'blocked',
        startedAt,
        finishedAt: nowIso(),
        durationMs: 0,
        safeSummary: 'Trace coverage validation failed.',
        diagnosticRefs: [],
        traceRefs: [],
        attempts: 1,
      }, 'blocking'));
      manualReviewItems.push({
        id: 'trace-coverage-review',
        title: createSafeDisplayString('Review trace coverage'),
        description: createSafeDisplayString('Trace coverage validation failed for the quality run.'),
        status: 'open',
      });
    }

    const summary = this.summaryBuilder.build({
      runId: request.runId,
      gateRuns,
      seed: request.seed,
      durationMs: 0,
      manualReviewCount: manualReviewItems.length,
      retryCount,
    });

    const evidenceBundle = this.evidenceAggregator.build(
      request.runId,
      gateRuns,
      summary,
      diagnostics.map((diagnostic) => diagnostic.code),
      traceRefs,
    );

    const anyBlocked = gateRuns.some((entry) => entry.status === 'blocked') || diagnostics.some((diagnostic) => diagnostic.severity === 'security-blocker');
    const anyPartial = gateRuns.some((entry) => entry.status === 'failed' || entry.status === 'skipped');
    const overallStatus = anyBlocked
      ? 'blocked'
      : manualReviewItems.length > 0
        ? 'manual-review'
        : anyPartial
          ? 'partial'
          : 'passed';

    return ok({
      request,
      gateDefinitions,
      gateRuns,
      propertyTestRuns,
      summary: {
        ...summary,
        overallStatus,
      },
      evidenceBundle,
      diagnostics,
      manualReviewItems,
      traces,
      runnerPlan,
      correctionPlans,
    });
  }
}

export const generateQualityOrchestration = async (
  input: unknown,
  options: QualityOrchestrationOptions = {},
): Promise<Result<QualityOrchestrationResult, QualityError>> =>
  new QualityOrchestrationService().run(input, options);
