import type { SourceRef } from '@spa-bridge/core-model';

import { createTargetGenerationError } from '../shared-errors.js';
import type { GeneratedFileSpec, TargetGenerationError, TargetOverwritePolicy, TargetWritePlan } from '../types.js';
import { TargetPathGuard } from '../path/target-path-guard.js';
import { TargetConflictDetector } from '../path/target-conflict-detector.js';
import { ContentHashService } from './content-hash-service.js';
import { StableFileRefFactory } from './stable-file-ref-factory.js';
import { resolveOverwriteConflict } from '../path/overwrite-conflict-policy.js';

export class WritePlanBuilder {
  private readonly pathGuard = new TargetPathGuard();
  private readonly conflictDetector = new TargetConflictDetector();
  private readonly hashService = new ContentHashService();
  private readonly refFactory = new StableFileRefFactory();

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
  }): { ok: true; value: TargetWritePlan } | { ok: false; error: TargetGenerationError } {
    const conflicts = this.conflictDetector.detect(input.files);
    if (conflicts.length > 0 && input.overwritePolicy === 'fail') {
      return {
        ok: false,
        error: createTargetGenerationError('CONFLICT_DETECTED', 'Conflicting generated file paths were detected.', conflicts.map((conflict) => conflict.path)),
      };
    }

    const normalizedFiles: GeneratedFileSpec[] = [];
    for (const file of [...input.files].sort((left, right) => left.path.localeCompare(right.path))) {
      const containment = this.pathGuard.ensureContained(input.targetRoot, file.path);
      if (!containment.ok) {
        return { ok: false, error: containment.error };
      }

      const hash = this.hashService.hash(file.path, file.content);
      const ref = this.refFactory.create(file.path, hash);
      const existingContent = input.existingPaths?.includes(file.path) ? '' : undefined;
      const conflict = resolveOverwriteConflict(input.overwritePolicy, existingContent, file.content);

      if (conflict.action === 'fail') {
        return {
          ok: false,
          error: createTargetGenerationError('CONFLICT_DETECTED', `Unable to resolve conflict for '${file.path}'.`, [conflict.reason]),
        };
      }

      normalizedFiles.push({
        ...file,
        path: containment.value,
        hash,
        fileRef: ref.path,
        overwrite: conflict.action === 'write',
      });
    }

    return {
      ok: true,
      value: {
        runId: input.runId,
        correlationId: input.correlationId,
        targetRoot: input.targetRoot,
        projectName: input.projectName,
        strategyId: input.strategyId,
        files: normalizedFiles,
        conflicts,
        dependencyManifest: input.dependencyManifest,
      },
    };
  }
}
