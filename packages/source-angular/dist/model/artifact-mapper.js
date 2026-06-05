import path from 'node:path';
import { createStableIdFactory } from './stable-id-factory.js';
export class AnalysisArtifactMapper {
    ids = createStableIdFactory();
    buildArtifactRefs(outputDir, workspaceProfile) {
        const baseDir = outputDir || path.join(workspaceProfile.projectRoot, '.spa-bridge', 'analysis');
        const asRef = (filename) => ({
            kind: 'generated',
            path: path.join(baseDir, filename),
        });
        return {
            sourceModelRef: asRef('source-model.json'),
            inventoryRef: asRef('inventory.json'),
            graphRef: asRef('graph.json'),
            diagnosticsRef: asRef('diagnostics.json'),
        };
    }
    buildSourceModelBoundary(workspaceProfile, entryFile) {
        return {
            schemaVersion: 1,
            sourceModelRef: {
                projectPath: workspaceProfile.projectRoot,
                entryFile,
                projectKind: workspaceProfile.projectKind,
            },
            entryPoints: workspaceProfile.entryFiles,
            notes: [`analysis:${workspaceProfile.projectName}`, `sourceRoot:${workspaceProfile.sourceRoot}`],
        };
    }
}
//# sourceMappingURL=artifact-mapper.js.map