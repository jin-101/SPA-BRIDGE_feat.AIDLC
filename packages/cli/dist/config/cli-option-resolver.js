import path from 'node:path';
import { err, ok } from '@spa-bridge/core-model';
import { createCliError } from '../shared-errors.js';
const DEFAULT_REPORT_FORMAT = 'json';
const DEFAULT_VERBOSITY = 'normal';
const readString = (value) => typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
const readBoolean = (value) => {
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
const readConfigObject = async (configPath, readText) => {
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
            return parsed;
        }
        return {};
    }
    catch {
        return {};
    }
};
export const resolveCliOptions = async (request, env, readText, cwd) => {
    const configPathFromEnv = readString(env.SPA_BRIDGE_CONFIG);
    const configPath = request.options.configPath ?? configPathFromEnv;
    const config = await readConfigObject(configPath, readText);
    const mergedWorkspacePath = request.options.workspacePath ??
        readString(env.SPA_BRIDGE_WORKSPACE) ??
        readString(config.workspacePath) ??
        cwd;
    const mergedInputPath = request.options.inputPath ??
        readString(env.SPA_BRIDGE_INPUT) ??
        readString(config.inputPath) ??
        'src';
    const mergedOutputPath = request.options.outputPath ??
        readString(env.SPA_BRIDGE_OUTPUT) ??
        readString(config.outputPath) ??
        path.join('dist', 'spa-bridge');
    const mergedReportFormat = request.options.reportFormat ??
        readString(env.SPA_BRIDGE_REPORT_FORMAT) ??
        readString(config.reportFormat) ??
        DEFAULT_REPORT_FORMAT;
    const mergedVerbosity = request.options.verbosity ??
        readString(env.SPA_BRIDGE_VERBOSITY) ??
        readString(config.verbosity) ??
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
//# sourceMappingURL=cli-option-resolver.js.map