import fs from 'node:fs/promises';
import path from 'node:path';

import { err, ok, type Result } from '@spa-bridge/core-model';

import { PathGuard } from '../path/path-guard.js';
import type { AnalysisError, AngularWorkspaceProfile } from '../types.js';

type AngularJson = {
  defaultProject?: string;
  projects?: Record<string, { sourceRoot?: string; root?: string; projectType?: string; architect?: Record<string, unknown> }>;
};

export class WorkspaceProfiler {
  constructor(private readonly pathGuard = new PathGuard()) {}

  async profile(projectRoot: string, explicitSourceRoot?: string): Promise<Result<AngularWorkspaceProfile, AnalysisError>> {
    const normalizedRoot = this.pathGuard.canonicalize(projectRoot);
    const angularJsonPath = path.join(normalizedRoot, 'angular.json');
    const packageJsonPath = path.join(normalizedRoot, 'package.json');

    let angularJson: AngularJson | undefined;
    try {
      const angularJsonText = await fs.readFile(angularJsonPath, 'utf8');
      angularJson = JSON.parse(angularJsonText) as AngularJson;
    } catch {
      angularJson = undefined;
    }

    const packageJsonName = await this.readProjectName(packageJsonPath);
    const defaultProjectName = angularJson?.defaultProject ?? packageJsonName ?? path.basename(normalizedRoot);
    const projectEntry = angularJson?.projects?.[defaultProjectName] ?? Object.values(angularJson?.projects ?? {})[0];
    const inferredSourceRoot = explicitSourceRoot
      ? path.join(normalizedRoot, explicitSourceRoot)
      : projectEntry?.sourceRoot
        ? path.join(normalizedRoot, projectEntry.sourceRoot)
        : path.join(normalizedRoot, 'src');

    const sourceRootCheck = this.pathGuard.contains(normalizedRoot, inferredSourceRoot);
    if (!sourceRootCheck.ok) {
      return sourceRootCheck;
    }

    const entryCandidates = [
      path.join(sourceRootCheck.value.absolutePath, 'main.ts'),
      path.join(sourceRootCheck.value.absolutePath, 'app', 'app.component.ts'),
      path.join(sourceRootCheck.value.absolutePath, 'app', 'app.module.ts'),
    ];

    const entryFiles: string[] = [];
    for (const candidate of entryCandidates) {
      try {
        await fs.access(candidate);
        entryFiles.push(candidate);
      } catch {
        // ignore missing candidates; the scanner can still work from the source tree
      }
    }

    if (entryFiles.length === 0) {
      return err({
        code: 'NOT_FOUND',
        message: `No Angular entry file found under '${sourceRootCheck.value.absolutePath}'.`,
      });
    }

    return ok({
      schemaVersion: 1,
      projectKind: 'application',
      projectName: defaultProjectName,
      projectRoot: normalizedRoot,
      sourceRoot: sourceRootCheck.value.absolutePath,
      entryFiles,
      configFiles: [angularJsonPath, packageJsonPath],
      packageRefs: [packageJsonPath],
    });
  }

  private async readProjectName(packageJsonPath: string): Promise<string | undefined> {
    try {
      const text = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(text) as { name?: string };
      return packageJson.name?.split('/').pop();
    } catch {
      return undefined;
    }
  }
}
