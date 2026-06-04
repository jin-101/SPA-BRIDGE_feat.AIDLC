import path from 'node:path';

import { err, ok, type Result } from '@spa-bridge/core-model';
import type { PortError } from '@spa-bridge/core-model';

import type { ApplicationError } from '../types.js';

export type PathSafetyError = ApplicationError;

export type RunWorkspacePaths = {
  projectRoot: string;
  runId: string;
  runRoot: string;
  manifestPath: string;
  resolvedConfigPath: string;
  diagnosticsPath: string;
  artifactsDir: string;
  reportsDir: string;
  checkpointsDir: string;
  locksDir: string;
};

export class PathGuard {
  normalize(input: string): string {
    return path.resolve(input);
  }

  ensureContained(basePath: string, candidatePath: string): Result<string, PathSafetyError> {
    const normalizedBase = this.normalize(basePath);
    const normalizedCandidate = this.normalize(candidatePath);
    const relative = path.relative(normalizedBase, normalizedCandidate);

    if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
      return ok(normalizedCandidate);
    }

    return err({
      code: 'PATH_INVALID',
      message: `Path '${candidatePath}' escapes base '${basePath}'.`,
    });
  }

  deriveRunWorkspace(projectRoot: string, runId: string): Result<RunWorkspacePaths, PathSafetyError> {
    if (!/^[A-Za-z0-9._-]+$/.test(runId)) {
      return err({
        code: 'PATH_INVALID',
        message: `Run id '${runId}' contains unsafe characters.`,
      });
    }

    const normalizedProjectRoot = this.normalize(projectRoot);
    const runRoot = path.join(normalizedProjectRoot, '.spa-bridge', 'runs', runId);
    const guard = this.ensureContained(normalizedProjectRoot, runRoot);
    if (!guard.ok) {
      return guard;
    }

    return ok({
      projectRoot: normalizedProjectRoot,
      runId,
      runRoot: guard.value,
      manifestPath: path.join(guard.value, 'manifest.json'),
      resolvedConfigPath: path.join(guard.value, 'config.resolved.json'),
      diagnosticsPath: path.join(guard.value, 'diagnostics.json'),
      artifactsDir: path.join(guard.value, 'artifacts'),
      reportsDir: path.join(guard.value, 'reports'),
      checkpointsDir: path.join(guard.value, 'checkpoints'),
      locksDir: path.join(guard.value, 'locks'),
    });
  }
}

export type RunWorkspace = RunWorkspacePaths & {
  initializedAt: string;
};

export class RunWorkspaceManager {
  constructor(private readonly pathGuard = new PathGuard()) {}

  derive(projectRoot: string, runId: string, initializedAt: string): Result<RunWorkspace, PathSafetyError> {
    const derived = this.pathGuard.deriveRunWorkspace(projectRoot, runId);
    if (!derived.ok) {
      return derived;
    }

    return ok({
      ...derived.value,
      initializedAt,
    });
  }

  ensureWorkspaceFitsRoot(workspace: RunWorkspace): Result<RunWorkspace, PathSafetyError> {
    return this.pathGuard.ensureContained(workspace.projectRoot, workspace.runRoot).ok
      ? ok(workspace)
      : err({
          code: 'PATH_INVALID',
          message: `Workspace '${workspace.runRoot}' is not contained by '${workspace.projectRoot}'.`,
        });
  }
}

export const isPortError = (error: unknown): error is PortError =>
  typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
