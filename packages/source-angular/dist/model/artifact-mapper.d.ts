import type { AngularSourceModelBoundary } from '@spa-bridge/core-model';
import type { AnalysisArtifactRefs, AngularWorkspaceProfile } from '../types.js';
export declare class AnalysisArtifactMapper {
    private readonly ids;
    buildArtifactRefs(outputDir: string, workspaceProfile: AngularWorkspaceProfile): AnalysisArtifactRefs;
    buildSourceModelBoundary(workspaceProfile: AngularWorkspaceProfile, entryFile: string): AngularSourceModelBoundary;
}
//# sourceMappingURL=artifact-mapper.d.ts.map