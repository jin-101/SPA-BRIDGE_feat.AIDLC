import path from 'node:path';

import { err, ok, type Result } from '@spa-bridge/core-model';

import { buildHelpContent } from '../parsing/help-content-builder.js';
import { parseCliCommand } from '../parsing/cli-command-parser.js';
import { resolveCliOptions } from '../config/cli-option-resolver.js';
import { validateWorkspacePaths } from '../path/workspace-path-guard.js';
import { createDefaultApplicationBridge } from '../bridges/application-bridge.js';
import { createDefaultReportBridge } from '../bridges/report-bridge.js';
import { ConfirmationCoordinator } from '../interaction/confirmation-coordinator.js';
import { buildRenderModel } from '../output/cli-output-formatter.js';
import { ProgressEmitter } from '../output/progress-emitter.js';
import { mapExitCode } from '../exit-codes/exit-code-mapper.js';
import { createCliError, type CliError } from '../shared-errors.js';
import type {
  CliApplicationRequest,
  CliExecutionResult,
  CliFileSystem,
  CliRuntimeDependencies,
  CliRunResult,
  CliReportPayload,
  CliReportRequest,
} from '../types.js';

const createNodeFileSystem = (): CliFileSystem => ({
  async readText(filePath: string) {
    try {
      const { readFile } = await import('node:fs/promises');
      return ok(await readFile(filePath, 'utf8'));
    } catch (error) {
      return err(createCliError('CONFIG_ERROR', `Unable to read file: ${filePath}`, String(error)));
    }
  },
  async writeText(filePath: string, content: string) {
    try {
      const { mkdir, writeFile } = await import('node:fs/promises');
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, content, 'utf8');
      return ok(undefined);
    } catch (error) {
      return err(createCliError('RUNTIME_FAILED', `Unable to write file: ${filePath}`, String(error)));
    }
  },
  async exists(filePath: string) {
    try {
      const { access } = await import('node:fs/promises');
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  },
  async ensureDir(dirPath: string) {
    try {
      const { mkdir } = await import('node:fs/promises');
      await mkdir(dirPath, { recursive: true });
      return ok(undefined);
    } catch (error) {
      return err(createCliError('RUNTIME_FAILED', `Unable to create directory: ${dirPath}`, String(error)));
    }
  },
});

export const createDefaultCliRuntime = (overrides: Partial<CliRuntimeDependencies> = {}): CliRuntimeDependencies => ({
  fileSystem: overrides.fileSystem ?? createNodeFileSystem(),
  applicationBridge: overrides.applicationBridge ?? createDefaultApplicationBridge(),
  reportBridge: overrides.reportBridge ?? createDefaultReportBridge(),
  cwd: overrides.cwd ?? process.cwd(),
  env: overrides.env ?? process.env,
  now: overrides.now ?? (() => new Date().toISOString()),
  confirm: overrides.confirm,
});

export const runCli = async (
  argv: string[],
  env: NodeJS.ProcessEnv = process.env,
  runtimeOverrides: Partial<CliRuntimeDependencies> = {},
): Promise<CliRunResult> => {
  const runtime = createDefaultCliRuntime({ ...runtimeOverrides, env });
  const progress = new ProgressEmitter();
  progress.emit({ phase: 'parse', message: 'Parsing CLI arguments.' });

  const parsedResult = parseCliCommand(argv);
  if (!parsedResult.ok) {
    return parsedResult;
  }

  if (parsedResult.value.commandName === 'help') {
    const helpContent = buildHelpContent();
    const helpExecutionBase: CliExecutionResult = {
      commandName: 'help',
      status: 'success',
      exitCode: mapExitCode('success'),
      summary: helpContent.usage,
      progress: progress.snapshot(),
      warnings: [],
      reviewItems: [],
      renderModel: {
        headline: 'help (success)',
        sections: [
          { title: 'Usage', lines: [helpContent.usage] },
          { title: 'Examples', lines: helpContent.examples },
        ],
        progress: progress.snapshot(),
        warnings: [],
        reviewItems: [],
      },
    };

    return ok({
      ...helpExecutionBase,
      renderModel: buildRenderModel(helpExecutionBase, 'normal', helpContent),
    });
  }

  progress.emit({ phase: 'resolve', message: 'Resolving CLI options.' });
  const resolvedResult = await resolveCliOptions(parsedResult.value, env, runtime.fileSystem.readText, runtime.cwd);
  if (!resolvedResult.ok) {
    return resolvedResult;
  }

  progress.emit({ phase: 'validate', message: 'Validating workspace paths.' });
  const validatedResult = validateWorkspacePaths(resolvedResult.value, runtime.cwd);
  if (!validatedResult.ok) {
    return validatedResult;
  }

  const confirmationCoordinator = new ConfirmationCoordinator(runtime.confirm);
  const shouldProceed = await confirmationCoordinator.requestConfirmation(
    resolvedResult.value.executionMode,
    `Proceed with ${parsedResult.value.commandName}?`,
    false,
    parsedResult.value.commandName === 'report',
  );

  if (!shouldProceed) {
    return err(createCliError('CONFIRMATION_DECLINED', 'Command was not confirmed by the user.', undefined, 'Re-run without interactive confirmation.'));
  }

  progress.emit({ phase: 'dispatch', message: `Dispatching ${parsedResult.value.commandName} command.` });

  const applicationRequest: CliApplicationRequest = {
    commandName: parsedResult.value.commandName,
    resolvedOptions: resolvedResult.value,
    validatedPaths: validatedResult.value,
    generatedAt: runtime.now(),
  };

  let summary = '';
  let warnings: string[] = [];
  let reviewItems: string[] = [];
  let reportPath: string | undefined;
  let reportPayload: CliReportPayload | undefined;

  switch (parsedResult.value.commandName) {
    case 'convert': {
      const conversionResult = await runtime.applicationBridge.startConversion(applicationRequest);
      if (!conversionResult.ok) {
        return conversionResult;
      }

      summary = conversionResult.value.summary;
      warnings = [...conversionResult.value.warnings];
      reviewItems = [...conversionResult.value.reviewItems];
      reportPayload = conversionResult.value.reportPayload;
      break;
    }
    case 'validate': {
      const validationResult = await runtime.applicationBridge.validateWorkspace({
        commandName: 'validate',
        resolvedOptions: resolvedResult.value,
        validatedPaths: validatedResult.value,
        generatedAt: applicationRequest.generatedAt,
      });
      if (!validationResult.ok) {
        return validationResult;
      }

      summary = validationResult.value.summary;
      warnings = [...validationResult.value.warnings];
      reviewItems = [...validationResult.value.reviewItems];
      break;
    }
    case 'report': {
      const preparedReportResult = await runtime.applicationBridge.prepareReport(applicationRequest);
      if (!preparedReportResult.ok) {
        return preparedReportResult;
      }

      reportPayload = preparedReportResult.value;
      summary = reportPayload.summary;
      warnings = [...reportPayload.warnings];
      reviewItems = [...reportPayload.reviewItems];
      break;
    }
    default:
      return err(createCliError('COMMAND_NOT_SUPPORTED', `Unsupported command: ${parsedResult.value.commandName}`));
  }

  if (reportPayload) {
    progress.emit({ phase: 'report', message: 'Rendering report output.' });
    const reportResult = await runtime.reportBridge.exportReport({
      commandName: parsedResult.value.commandName,
      reportFormat: resolvedResult.value.reportFormat,
      outputPath: validatedResult.value.reportPath,
      generatedAt: applicationRequest.generatedAt,
      payload: reportPayload,
    });
    if (!reportResult.ok) {
      return reportResult;
    }

    const writeResult = await runtime.fileSystem.writeText(reportResult.value.outputPath, reportResult.value.content);
    if (!writeResult.ok) {
      return writeResult;
    }

    reportPath = reportResult.value.outputPath;
  }

  const status = reviewItems.length > 0 ? 'review' : 'success';
  const exitCode = mapExitCode(status);
  const execution: CliExecutionResult = {
    commandName: parsedResult.value.commandName,
    status,
    exitCode,
    summary,
    progress: [...progress.snapshot(), { phase: 'complete', message: 'Command finished.' }],
    warnings,
    reviewItems,
    reportPath,
    renderModel: {
      headline: `${parsedResult.value.commandName} (${status})`,
      sections: [],
      progress: progress.snapshot(),
      warnings,
      reviewItems,
      reportPath,
    },
  };

  return ok({
    ...execution,
    renderModel: buildRenderModel(execution, resolvedResult.value.verbosity),
  });
};
