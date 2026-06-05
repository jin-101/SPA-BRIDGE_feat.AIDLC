import { GateRegistry } from '../gates/gate-registry.js';
import { GateSelectionPolicy } from '../gates/gate-selection-policy.js';
import { ValidationGuard } from '../validation/validation-guard.js';
import { RunnerAdapter } from '../runners/runner-adapter.js';
import { RunnerPlanBuilder } from '../runners/runner-plan-builder.js';
import { SelfCorrectionPlanner } from '../correction/self-correction-planner.js';
import { PbtCoordinator } from '../pbt/pbt-coordinator.js';
import { EvidenceAggregator } from '../evidence/evidence-aggregator.js';
import { QualityDiagnosticFactory } from '../diagnostics/quality-diagnostic-factory.js';
import { ManualReviewFactory } from '../review/manual-review-factory.js';
import { RunSummaryBuilder } from '../summary/run-summary-builder.js';
import { QualityTraceBuilder } from '../traceability/quality-trace-builder.js';
import { TraceCoverageValidator } from '../traceability/trace-coverage-validator.js';
import type { QualityOrchestrationResult } from '../types.js';
import { type Result } from '@spa-bridge/core-model';
import type { QualityError } from '../shared-errors.js';
export type QualityOrchestrationOptions = {
    registry?: GateRegistry;
    runnerAdapter?: RunnerAdapter;
    retryBudget?: number;
};
export declare class QualityOrchestrationService {
    private readonly validationGuard;
    private readonly registry;
    private readonly selectionPolicy;
    private readonly runnerPlanBuilder;
    private readonly runnerAdapter;
    private readonly selfCorrectionPlanner;
    private readonly pbtCoordinator;
    private readonly evidenceAggregator;
    private readonly diagnosticFactory;
    private readonly manualReviewFactory;
    private readonly summaryBuilder;
    private readonly traceBuilder;
    private readonly traceCoverageValidator;
    constructor(validationGuard?: ValidationGuard, registry?: GateRegistry, selectionPolicy?: GateSelectionPolicy, runnerPlanBuilder?: RunnerPlanBuilder, runnerAdapter?: RunnerAdapter, selfCorrectionPlanner?: SelfCorrectionPlanner, pbtCoordinator?: PbtCoordinator, evidenceAggregator?: EvidenceAggregator, diagnosticFactory?: QualityDiagnosticFactory, manualReviewFactory?: ManualReviewFactory, summaryBuilder?: RunSummaryBuilder, traceBuilder?: QualityTraceBuilder, traceCoverageValidator?: TraceCoverageValidator);
    run(input: unknown, options?: QualityOrchestrationOptions): Promise<Result<QualityOrchestrationResult, QualityError>>;
}
export declare const generateQualityOrchestration: (input: unknown, options?: QualityOrchestrationOptions) => Promise<Result<QualityOrchestrationResult, QualityError>>;
//# sourceMappingURL=quality-orchestration-service.d.ts.map