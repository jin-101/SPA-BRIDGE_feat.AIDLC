import type {
  GeneratedTargetSelfCorrectionResult,
  GeneratedTargetValidationResult,
} from '../types.js';
import { AiRepairBoundary } from './ai-repair-boundary.js';
import { DeterministicFixerRegistry } from './deterministic-fixer-registry.js';
import { GeneratedTargetCommandPlanner, type GeneratedTargetCommandPlannerInput } from './generated-target-command-planner.js';

export class GeneratedTargetSelfCorrectionService {
  constructor(
    private readonly planner = new GeneratedTargetCommandPlanner(),
    private readonly fixerRegistry = new DeterministicFixerRegistry(),
    private readonly aiBoundary = new AiRepairBoundary(),
  ) {}

  evaluate(input: GeneratedTargetCommandPlannerInput & {
    validationResults?: GeneratedTargetValidationResult[];
    maxAttempts?: number;
    allowLocalAiRepair?: boolean;
    allowExternalAiRepair?: boolean;
  }): GeneratedTargetSelfCorrectionResult {
    const commandPlan = this.planner.plan(input);
    const validationResults = input.validationResults ?? commandPlan.commands.map((command) => ({
      commandId: command.id,
      kind: command.kind,
      status: command.allowlisted ? 'planned' as const : 'blocked' as const,
      durationMs: 0,
      safeOutputSummary: command.allowlisted ? `${command.kind} validation planned.` : `${command.kind} command blocked by allowlist.`,
      diagnostics: [],
    }));
    const diagnostics = validationResults.flatMap((result) => result.diagnostics);
    const fixes = this.fixerRegistry.planFixes(diagnostics);
    const remainingBlockerIds = diagnostics
      .filter((diagnostic) => diagnostic.severity === 'blocking' || diagnostic.severity === 'manual-review')
      .map((diagnostic) => diagnostic.id)
      .sort();
    const aiRepairRequests =
      remainingBlockerIds.length > fixes.length
        ? this.aiBoundary.prepare({
            runId: input.runId,
            diagnostics,
            allowExternalProvider: input.allowExternalAiRepair,
            allowLocalProvider: input.allowLocalAiRepair,
          })
        : [];
    const passedCommands = validationResults.filter((result) => result.status === 'passed').length;
    const failedCommands = validationResults.filter((result) => result.status === 'failed' || result.status === 'timed-out' || result.status === 'blocked').length;
    const skippedCommands = validationResults.filter((result) => result.status === 'skipped' || result.status === 'planned').length;
    const status =
      failedCommands === 0 && remainingBlockerIds.length === 0
        ? passedCommands > 0
          ? 'passed'
          : 'skipped'
        : fixes.length > 0 || aiRepairRequests.length > 0
          ? 'degraded'
          : 'blocked';

    return {
      schemaVersion: 1,
      status,
      targetRoot: commandPlan.targetRoot,
      commandPlan,
      attempts: [
        {
          attemptNumber: 1,
          validationResults,
          appliedFixes: fixes,
          aiRepairRequests,
          remainingBlockerIds,
        },
      ].slice(0, Math.max(1, input.maxAttempts ?? 1)),
      artifactRefs: ['.spa-bridge/quality-gate-results.json', 'src/review/runtime-parity-quality.json'],
      summary: {
        totalCommands: validationResults.length,
        passedCommands,
        failedCommands,
        skippedCommands,
        appliedFixes: fixes.length,
        aiRepairRequests: aiRepairRequests.length,
        remainingBlockers: remainingBlockerIds.length,
      },
    };
  }
}
