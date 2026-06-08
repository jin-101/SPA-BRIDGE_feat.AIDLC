import fs from 'node:fs/promises';
import path from 'node:path';

import { ok, type Result } from '@spa-bridge/core-model';
import { SourceAngularAnalysisService } from '@spa-bridge/source-angular';
import { createTransformationService } from '@spa-bridge/transform-angular-react';
import { generateReactTarget, type GeneratedFileSpec } from '@spa-bridge/target-react';

import type { CliApplicationBridge, CliApplicationRequest, CliApplicationResponse, CliReportPayload, CliValidationRequest, CliValidationResponse } from '../types.js';
import type { CliError } from '../shared-errors.js';
import { createCliError } from '../shared-errors.js';

const buildPayload = (
  request: CliApplicationRequest,
  title: string,
  summary: string,
  warnings: string[] = [],
  reviewItems: string[] = [],
  sections: CliReportPayload['sections'] = [],
): CliReportPayload => ({
  title,
  summary,
  warnings,
  reviewItems,
  sections: [
    { title: 'Run', lines: [`Run ID: ${request.resolvedOptions.runId}`, `Workspace: ${request.validatedPaths.workspaceRoot}`] },
    { title: 'Summary', lines: [summary] },
    ...sections,
  ],
});

const toCliError = (message: string, cause: unknown): CliError =>
  createCliError('RUNTIME_FAILED', message, cause instanceof Error ? cause.message : JSON.stringify(cause));

const writeGeneratedFiles = async (files: GeneratedFileSpec[]): Promise<void> => {
  for (const file of [...files].sort((left, right) => left.path.localeCompare(right.path))) {
    if (!file.overwrite) {
      continue;
    }

    await fs.mkdir(path.dirname(file.path), { recursive: true });
    await fs.writeFile(file.path, file.content, 'utf8');
  }
};

const writeJsonArtifact = async (targetRoot: string, name: string, value: unknown): Promise<string> => {
  const artifactPath = path.join(targetRoot, '.spa-bridge', name);
  await fs.mkdir(path.dirname(artifactPath), { recursive: true });
  await fs.writeFile(artifactPath, JSON.stringify(value, null, 2) + '\n', 'utf8');
  return artifactPath;
};

export const createDefaultApplicationBridge = (): CliApplicationBridge => ({
  async startConversion(request: CliApplicationRequest): Promise<Result<CliApplicationResponse, CliError>> {
    const analysisService = new SourceAngularAnalysisService();
    const transformationService = createTransformationService();
    const runId = request.resolvedOptions.runId;
    const correlationId = `${runId}:cli`;

    const analysisResult = await analysisService.analyze({
      projectRoot: request.validatedPaths.inputPath,
      outputDir: path.join(request.validatedPaths.outputPath, '.spa-bridge', 'analysis'),
    });
    if (!analysisResult.ok) {
      return { ok: false, error: toCliError('Angular source analysis failed.', analysisResult.error) };
    }

    const transformationResult = transformationService.transform({
      runId,
      correlationId,
      analysis: analysisResult.value,
      targetFramework: 'react',
      targetProjectStrategy: 'vite-react-typescript',
      stateStrategy: 'service',
      enabledRulePacks: ['built-in'],
      outputNamespace: path.join(request.validatedPaths.outputPath, '.spa-bridge', 'transformation'),
    });
    if (!transformationResult.ok) {
      return { ok: false, error: toCliError('Angular-to-React transformation failed.', transformationResult.error) };
    }

    const targetResult = generateReactTarget({
      runId,
      correlationId,
      targetRoot: request.validatedPaths.outputPath,
      draftSet: transformationResult.value.draftSet,
      strategyId: 'vite-react-typescript',
      overwritePolicy: request.resolvedOptions.dryRun ? 'preserve' : 'overwrite',
      projectName: analysisResult.value.workspaceProfile.projectName,
      selectedStateStrategy: 'service',
      sourceModelRef: {
        kind: 'source',
        path: analysisResult.value.sourceModelBoundary.sourceModelRef.projectPath,
      },
    });
    if (!targetResult.ok) {
      return { ok: false, error: toCliError('React target generation failed.', targetResult.error) };
    }

    try {
      await fs.mkdir(request.validatedPaths.outputPath, { recursive: true });
      if (!request.resolvedOptions.dryRun) {
        await writeGeneratedFiles(targetResult.value.writePlan.files);
      }

      await writeJsonArtifact(request.validatedPaths.outputPath, 'analysis-summary.json', analysisResult.value.summary);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'transformation-summary.json', transformationResult.value.summary);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'target-summary.json', targetResult.value.summary);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'manual-review-items.json', targetResult.value.manualReviewItems);
    } catch (error) {
      return { ok: false, error: toCliError('Unable to write generated React target files.', error) };
    }

    const warnings = [
      ...analysisResult.value.diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').map((diagnostic) => diagnostic.message),
      ...(request.resolvedOptions.dryRun ? ['Dry run mode enabled; React target files were not written.'] : []),
    ];
    const reviewItems = targetResult.value.manualReviewItems.map((item) => item.title);
    const summary = request.resolvedOptions.dryRun
      ? `Dry run generated a React write plan with ${targetResult.value.summary.totalFiles} files for ${request.validatedPaths.inputPath}.`
      : `Converted ${request.validatedPaths.inputPath} into ${request.validatedPaths.outputPath} with ${targetResult.value.summary.totalFiles} generated files.`;

    return ok({
      runId,
      summary,
      warnings,
      reviewItems,
      reportPayload: buildPayload(request, 'Conversion Summary', summary, warnings, reviewItems, [
        {
          title: 'Analysis',
          lines: [
            `Status: ${analysisResult.value.status}`,
            `Files scanned: ${analysisResult.value.summary.totalFiles}`,
            `Symbols discovered: ${analysisResult.value.summary.totalSymbols}`,
            `Routes discovered: ${analysisResult.value.summary.totalRoutes}`,
          ],
        },
        {
          title: 'Transformation',
          lines: [
            `Status: ${transformationResult.value.status}`,
            `Components: ${transformationResult.value.summary.totalComponents}`,
            `Services: ${transformationResult.value.summary.totalServices}`,
            `Routes: ${transformationResult.value.summary.totalRoutes}`,
            `Review items: ${transformationResult.value.summary.totalReviewItems}`,
          ],
        },
        {
          title: 'React Target',
          lines: [
            `Status: ${targetResult.value.status}`,
            `Output: ${request.validatedPaths.outputPath}`,
            `Generated files: ${targetResult.value.summary.totalFiles}`,
            `Strategy: ${targetResult.value.summary.strategyId}`,
          ],
        },
      ]),
    });
  },

  async validateWorkspace(request: CliValidationRequest): Promise<Result<CliValidationResponse, CliError>> {
    return ok({
      runId: request.resolvedOptions.runId,
      summary: `Workspace validated: ${request.validatedPaths.workspaceRoot}`,
      warnings: [],
      reviewItems: [],
    });
  },

  async prepareReport(request: CliApplicationRequest): Promise<Result<CliReportPayload, CliError>> {
    return ok(buildPayload(request, 'CLI Report', `Report prepared for ${request.validatedPaths.workspaceRoot}.`));
  },
});

export type { CliApplicationBridge };
