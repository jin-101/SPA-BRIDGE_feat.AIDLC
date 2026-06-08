import path from 'node:path';

import { err, ok, type Result } from '@spa-bridge/core-model';

import { createCliError, type CliError } from '../shared-errors.js';
import type { CliResolvedOptions, ValidatedWorkspacePaths } from '../types.js';

const isWithin = (root: string, target: string): boolean => {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

const normalizeAbsolute = (cwd: string, input: string): string =>
  path.isAbsolute(input) ? path.normalize(input) : path.normalize(path.resolve(cwd, input));

export const validateWorkspacePaths = (
  resolved: CliResolvedOptions,
  cwd: string,
): Result<ValidatedWorkspacePaths, CliError> => {
  const workspaceRoot = normalizeAbsolute(cwd, resolved.workspacePath);
  const inputPath = normalizeAbsolute(workspaceRoot, resolved.inputPath);
  const outputPath = normalizeAbsolute(workspaceRoot, resolved.outputPath);
  const configPath = resolved.configPath ? normalizeAbsolute(workspaceRoot, resolved.configPath) : undefined;

  const inputs = [
    ['workspace', workspaceRoot],
    ['input', inputPath],
    ['output', outputPath],
    ...(configPath ? [['config', configPath]] as const : []),
  ];

  for (const [, value] of inputs) {
    if (!isWithin(workspaceRoot, value)) {
      return err(createCliError('PATH_INVALID', `Path is outside the workspace root: ${value}`, undefined, 'Use workspace-relative paths only.'));
    }
  }

  const reportPath = path.extname(outputPath) ? outputPath : path.join(outputPath, `report.${resolved.reportFormat}`);

  return ok({
    workspaceRoot,
    inputPath,
    outputPath,
    configPath,
    reportPath,
    isContained: true,
  });
};
