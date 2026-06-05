import path from 'node:path';

import type { GeneratedArtifactRef, AngularSourceModelBoundary } from '@spa-bridge/core-model';

import type { AnalysisArtifactRefs, AngularWorkspaceProfile, SourceInventory, AngularDependencyGraph } from '../types.js';
import { createStableIdFactory } from './stable-id-factory.js';

export class AnalysisArtifactMapper {
  private readonly ids = createStableIdFactory();

  buildArtifactRefs(outputDir: string, workspaceProfile: AngularWorkspaceProfile): AnalysisArtifactRefs {
    const baseDir = outputDir || path.join(workspaceProfile.projectRoot, '.spa-bridge', 'analysis');
    const asRef = (filename: string): GeneratedArtifactRef => ({
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

  buildSourceModelBoundary(workspaceProfile: AngularWorkspaceProfile, entryFile: string): AngularSourceModelBoundary {
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
