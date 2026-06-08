import { err, ok, type Result } from '@spa-bridge/core-model';

import type { CliApplicationBridge, CliApplicationRequest, CliApplicationResponse, CliReportPayload, CliValidationRequest, CliValidationResponse } from '../types.js';
import type { CliError } from '../shared-errors.js';

const buildPayload = (request: CliApplicationRequest, title: string, summary: string): CliReportPayload => ({
  title,
  summary,
  warnings: [],
  reviewItems: [],
  sections: [
    { title: 'Run', lines: [`Run ID: ${request.resolvedOptions.runId}`, `Workspace: ${request.validatedPaths.workspaceRoot}`] },
    { title: 'Summary', lines: [summary] },
  ],
});

export const createDefaultApplicationBridge = (): CliApplicationBridge => ({
  async startConversion(request: CliApplicationRequest): Promise<Result<CliApplicationResponse, CliError>> {
    const summary = request.resolvedOptions.dryRun
      ? `Dry run prepared for ${request.validatedPaths.workspaceRoot}.`
      : `Conversion workflow started for ${request.validatedPaths.workspaceRoot}.`;

    return ok({
      runId: request.resolvedOptions.runId,
      summary,
      warnings: request.resolvedOptions.dryRun ? ['Dry run mode enabled.'] : [],
      reviewItems: request.resolvedOptions.dryRun ? ['Review the dry-run output before execution.'] : [],
      reportPayload: buildPayload(request, 'Conversion Summary', summary),
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
