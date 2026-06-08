import path from 'node:path';

import { err, ok, type Result } from '@spa-bridge/core-model';

import { createCliError, type CliError } from '../shared-errors.js';
import type { CliCommandRequest, CliResolvedOptions, CliReportFormat, CliVerbosity } from '../types.js';

const DEFAULT_REPORT_FORMAT: CliReportFormat = 'json';
const DEFAULT_VERBOSITY: CliVerbosity = 'normal';

const readString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

const readBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no', 'n'].includes(normalized)) {
      return false;
    }
  }

  return undefined;
};

const readConfigObject = async (configPath: string | undefined, readText: (path: string) => Promise<Result<string, CliError>>): Promise<Record<string, unknown>> => {
  if (!configPath) {
    return {};
  }

  const configResult = await readText(configPath);
  if (!configResult.ok) {
    return {};
  }

  try {
    const parsed = JSON.parse(configResult.value);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
};

export const resolveCliOptions = async (
  request: CliCommandRequest,
  env: NodeJS.ProcessEnv,
  readText: (path: string) => Promise<Result<string, CliError>>,
  cwd: string,
): Promise<Result<CliResolvedOptions, CliError>> => {
  const configPathFromEnv = readString(env.SPA_BRIDGE_CONFIG);
  const configPath = request.options.configPath ?? configPathFromEnv;
  const config = await readConfigObject(configPath, readText);

  const mergedWorkspacePath =
    request.options.workspacePath ??
    readString(env.SPA_BRIDGE_WORKSPACE) ??
    readString(config.workspacePath) ??
    cwd;

  const mergedInputPath =
    request.options.inputPath ??
    readString(env.SPA_BRIDGE_INPUT) ??
    readString(config.inputPath) ??
    'src';

  const mergedOutputPath =
    request.options.outputPath ??
    readString(env.SPA_BRIDGE_OUTPUT) ??
    readString(config.outputPath) ??
    path.join('dist', 'spa-bridge');

  const mergedReportFormat =
    request.options.reportFormat ??
    (readString(env.SPA_BRIDGE_REPORT_FORMAT) as CliReportFormat | undefined) ??
    (readString(config.reportFormat) as CliReportFormat | undefined) ??
    DEFAULT_REPORT_FORMAT;

  const mergedVerbosity =
    request.options.verbosity ??
    (readString(env.SPA_BRIDGE_VERBOSITY) as CliVerbosity | undefined) ??
    (readString(config.verbosity) as CliVerbosity | undefined) ??
    DEFAULT_VERBOSITY;

  const mergedInteractive = request.options.interactive ?? readBoolean(env.SPA_BRIDGE_INTERACTIVE) ?? readBoolean(config.interactive);
  const mergedDryRun = request.options.dryRun ?? readBoolean(env.SPA_BRIDGE_DRY_RUN) ?? readBoolean(config.dryRun) ?? false;
  const mergedRunId = request.options.runId ?? readString(env.SPA_BRIDGE_RUN_ID) ?? readString(config.runId) ?? `run-${Date.now()}`;
  const mergedConfirm = request.options.confirm ?? readBoolean(env.SPA_BRIDGE_CONFIRM) ?? readBoolean(config.confirm) ?? false;

  if (!mergedWorkspacePath || !mergedInputPath || !mergedOutputPath) {
    return err(createCliError('CONFIG_ERROR', 'Unable to resolve CLI options.', undefined, 'Check flags, environment variables, and config.'));
  }

  const executionMode = mergedInteractive ? 'interactive' : 'non-interactive';

  const resolvedConfigPath = configPath ?? path.join(mergedWorkspacePath, 'spa-bridge.config.json');

  return ok({
    commandName: request.commandName,
    workspacePath: mergedWorkspacePath,
    inputPath: mergedInputPath,
    outputPath: mergedOutputPath,
    configPath: resolvedConfigPath,
    reportFormat: mergedReportFormat,
    verbosity: mergedVerbosity,
    executionMode,
    dryRun: mergedDryRun,
    runId: mergedRunId,
    confirm: mergedConfirm,
  });
};
