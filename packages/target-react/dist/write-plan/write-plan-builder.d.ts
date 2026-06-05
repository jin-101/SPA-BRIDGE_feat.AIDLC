import type { GeneratedFileSpec, TargetGenerationError, TargetOverwritePolicy, TargetWritePlan } from '../types.js';
export declare class WritePlanBuilder {
    private readonly pathGuard;
    private readonly conflictDetector;
    private readonly hashService;
    private readonly refFactory;
    build(input: {
        runId: string;
        correlationId: string;
        targetRoot: string;
        projectName: string;
        strategyId: TargetWritePlan['strategyId'];
        overwritePolicy: TargetOverwritePolicy;
        files: GeneratedFileSpec[];
        dependencyManifest: TargetWritePlan['dependencyManifest'];
        existingPaths?: string[];
    }): {
        ok: true;
        value: TargetWritePlan;
    } | {
        ok: false;
        error: TargetGenerationError;
    };
}
//# sourceMappingURL=write-plan-builder.d.ts.map