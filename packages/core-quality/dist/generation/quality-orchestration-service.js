import { createSafeDisplayString } from '@spa-bridge/core-model';
import { createStableHash } from '../shared-errors.js';
import { createDefaultGateRegistry } from '../gates/gate-registry.js';
import { GateSelectionPolicy } from '../gates/gate-selection-policy.js';
import { ValidationGuard } from '../validation/validation-guard.js';
import { createDeterministicRunnerAdapter } from '../runners/runner-adapter.js';
import { RunnerPlanBuilder } from '../runners/runner-plan-builder.js';
import { SelfCorrectionPlanner } from '../correction/self-correction-planner.js';
import { PbtCoordinator } from '../pbt/pbt-coordinator.js';
import { EvidenceAggregator } from '../evidence/evidence-aggregator.js';
import { QualityDiagnosticFactory } from '../diagnostics/quality-diagnostic-factory.js';
import { ManualReviewFactory } from '../review/manual-review-factory.js';
import { RunSummaryBuilder } from '../summary/run-summary-builder.js';
import { QualityTraceBuilder, createQualityGateTraceId, createQualitySummaryTraceId, } from '../traceability/quality-trace-builder.js';
import { TraceCoverageValidator } from '../traceability/trace-coverage-validator.js';
import { err, ok } from '@spa-bridge/core-model';
const nowIso = () => new Date().toISOString();
const deterministicIso = (seed) => {
    const hash = createStableHash(seed);
    const offsetMs = Number.parseInt(hash.slice(0, 8), 16) % (24 * 60 * 60 * 1000);
    return new Date(Date.UTC(2026, 0, 1, 0, 0, 0, offsetMs)).toISOString();
};
const toTraceRefs = (traceIds) => [...new Set(traceIds)];
export class QualityOrchestrationService {
    validationGuard;
    registry;
    selectionPolicy;
    runnerPlanBuilder;
    runnerAdapter;
    selfCorrectionPlanner;
    pbtCoordinator;
    evidenceAggregator;
    diagnosticFactory;
    manualReviewFactory;
    summaryBuilder;
    traceBuilder;
    traceCoverageValidator;
    constructor(validationGuard = new ValidationGuard(), registry = createDefaultGateRegistry(), selectionPolicy = new GateSelectionPolicy(), runnerPlanBuilder = new RunnerPlanBuilder(), runnerAdapter = createDeterministicRunnerAdapter(), selfCorrectionPlanner = new SelfCorrectionPlanner(), pbtCoordinator = new PbtCoordinator(), evidenceAggregator = new EvidenceAggregator(), diagnosticFactory = new QualityDiagnosticFactory(), manualReviewFactory = new ManualReviewFactory(), summaryBuilder = new RunSummaryBuilder(), traceBuilder = new QualityTraceBuilder(), traceCoverageValidator = new TraceCoverageValidator()) {
        this.validationGuard = validationGuard;
        this.registry = registry;
        this.selectionPolicy = selectionPolicy;
        this.runnerPlanBuilder = runnerPlanBuilder;
        this.runnerAdapter = runnerAdapter;
        this.selfCorrectionPlanner = selfCorrectionPlanner;
        this.pbtCoordinator = pbtCoordinator;
        this.evidenceAggregator = evidenceAggregator;
        this.diagnosticFactory = diagnosticFactory;
        this.manualReviewFactory = manualReviewFactory;
        this.summaryBuilder = summaryBuilder;
        this.traceBuilder = traceBuilder;
        this.traceCoverageValidator = traceCoverageValidator;
    }
    async run(input, options = {}) {
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
        const gateRuns = [];
        const diagnostics = [];
        const manualReviewItems = [];
        const correctionPlans = [];
        let retryCount = 0;
        const startedAt = deterministicIso({ runId: request.runId, phase: 'quality-start' });
        for (const planEntry of runnerPlan) {
            const gateDefinition = gateDefinitions.find((candidate) => candidate.gateId === planEntry.gateId);
            if (!gateDefinition) {
                continue;
            }
            const attempts = [];
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
            const gateRun = {
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
        const propertyPlans = gateDefinitions
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
        const evidenceBundle = this.evidenceAggregator.build(request.runId, gateRuns, summary, diagnostics.map((diagnostic) => diagnostic.code), traceRefs);
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
export const generateQualityOrchestration = async (input, options = {}) => new QualityOrchestrationService().run(input, options);
//# sourceMappingURL=quality-orchestration-service.js.map