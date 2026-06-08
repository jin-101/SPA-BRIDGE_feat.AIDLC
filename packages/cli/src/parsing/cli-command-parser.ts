import { err, ok, type Result } from '@spa-bridge/core-model';

import { createCliError, type CliError } from '../shared-errors.js';
import type { CliCommandRequest, CliCommandName, CliCommandOptions } from '../types.js';
import { buildHelpContent } from './help-content-builder.js';

const COMMAND_NAMES = new Set<CliCommandName>(['convert', 'validate', 'report', 'help']);
const VERBOSITY_VALUES = new Set(['quiet', 'normal', 'verbose'] as const);
const REPORT_FORMATS = new Set(['json', 'markdown', 'html'] as const);
const VALUE_FLAGS = new Set([
  '--workspace',
  '--workspace-path',
  '--input',
  '--input-path',
  '--output',
  '--output-path',
  '--config',
  '--config-path',
  '--report-format',
  '--format',
  '--verbosity',
  '--run-id',
]);

const isFlag = (token: string) => token.startsWith('-');

const parseBooleanFlag = (value: string | undefined, fallback = true): boolean => {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'no';
};

const isBooleanLike = (value: string | undefined): value is string =>
  typeof value === 'string' && ['true', 'false', '1', '0', 'yes', 'no', 'y', 'n'].includes(value.toLowerCase());

const parseFlagValue = (token: string, argv: string[], index: number): [string | undefined, number] => {
  const flagName = token.split('=')[0] ?? token;
  if (!VALUE_FLAGS.has(flagName)) {
    return [undefined, index];
  }

  const inlineValueIndex = token.indexOf('=');
  if (inlineValueIndex >= 0) {
    return [token.slice(inlineValueIndex + 1), index];
  }

  const next = argv[index + 1];
  if (next && !isFlag(next)) {
    return [next, index + 1];
  }

  return [undefined, index];
};

const pushPositional = (options: CliCommandOptions, args: string[], value: string): void => {
  if (!options.workspacePath) {
    options.workspacePath = value;
    return;
  }

  if (!options.inputPath) {
    options.inputPath = value;
    return;
  }

  if (!options.outputPath) {
    options.outputPath = value;
    return;
  }

  args.push(value);
};

export const parseCliCommand = (rawArgv: string[]): Result<CliCommandRequest, CliError> => {
  if (rawArgv.length === 0) {
    return ok({
      commandName: 'help',
      rawArgv,
      args: [],
      options: {},
    });
  }

  const [first, ...rest] = rawArgv;
  if (first === '--help' || first === '-h') {
    return ok({
      commandName: 'help',
      rawArgv,
      args: rest,
      options: {},
    });
  }

  if (!COMMAND_NAMES.has(first as CliCommandName)) {
    return err(createCliError('PARSE_ERROR', `Unknown command: ${first}`, undefined, buildHelpContent().usage));
  }

  const commandName = first as CliCommandName;
  const options: CliCommandOptions = {};
  const args: string[] = [];

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === undefined) {
      continue;
    }

    if (token === '--help' || token === '-h') {
      return ok({
        commandName: 'help',
        subcommand: commandName,
        rawArgv,
        args,
        options,
      });
    }

    if (!isFlag(token)) {
      pushPositional(options, args, token);
      continue;
    }

    const [value, newIndex] = parseFlagValue(token, rest, index);
    index = newIndex;

    const flagName = token.split('=')[0] ?? token;

    switch (flagName) {
      case '--workspace':
      case '--workspace-path':
        options.workspacePath = value ?? options.workspacePath;
        break;
      case '--input':
      case '--input-path':
        options.inputPath = value ?? options.inputPath;
        break;
      case '--output':
      case '--output-path':
        options.outputPath = value ?? options.outputPath;
        break;
      case '--config':
      case '--config-path':
        options.configPath = value ?? options.configPath;
        break;
      case '--report-format':
      case '--format':
        if (value && REPORT_FORMATS.has(value as typeof value & ('json' | 'markdown' | 'html'))) {
          options.reportFormat = value as CliCommandOptions['reportFormat'];
        }
        break;
      case '--verbosity':
        if (value && VERBOSITY_VALUES.has(value as typeof value & ('quiet' | 'normal' | 'verbose'))) {
          options.verbosity = value as CliCommandOptions['verbosity'];
        }
        break;
      case '--interactive': {
        const nextValue = rest[index + 1];
        if (value !== undefined) {
          options.interactive = parseBooleanFlag(value, true);
        } else if (isBooleanLike(nextValue)) {
          options.interactive = parseBooleanFlag(nextValue, true);
          index += 1;
        } else {
          options.interactive = true;
        }
        break;
      }
      case '--non-interactive': {
        const nextValue = rest[index + 1];
        if (value !== undefined) {
          options.interactive = !parseBooleanFlag(value, true);
        } else if (isBooleanLike(nextValue)) {
          options.interactive = !parseBooleanFlag(nextValue, true);
          index += 1;
        } else {
          options.interactive = false;
        }
        break;
      }
      case '--dry-run': {
        const nextValue = rest[index + 1];
        if (value !== undefined) {
          options.dryRun = parseBooleanFlag(value, true);
        } else if (isBooleanLike(nextValue)) {
          options.dryRun = parseBooleanFlag(nextValue, true);
          index += 1;
        } else {
          options.dryRun = true;
        }
        break;
      }
      case '--run-id':
        options.runId = value ?? options.runId;
        break;
      case '--confirm': {
        const nextValue = rest[index + 1];
        if (value !== undefined) {
          options.confirm = parseBooleanFlag(value, true);
        } else if (isBooleanLike(nextValue)) {
          options.confirm = parseBooleanFlag(nextValue, true);
          index += 1;
        } else {
          options.confirm = true;
        }
        break;
      }
      default:
        return err(createCliError('PARSE_ERROR', `Unknown option: ${token}`, undefined, buildHelpContent().usage));
    }
  }

  return ok({
    commandName,
    rawArgv,
    args,
    options,
  });
};
