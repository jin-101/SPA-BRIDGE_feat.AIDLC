import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  buildHelpContent,
  buildRenderModel,
  createDefaultApplicationBridge,
  createDefaultReportBridge,
  mapExitCode,
  parseCliCommand,
  renderTerminalOutput,
  resolveCliOptions,
  runCli,
  validateWorkspacePaths,
  argvArbitrary,
  commandRequestArbitrary,
  exitOutcomeArbitrary,
  outputModeArbitrary,
  workspacePathArbitrary,
} from '../src/index.js';
import type { CliCommandRequest, CliResolvedOptions } from '../src/index.js';

const expectOk = <T, E>(result: { ok: true; value: T } | { ok: false; error: E }): T => {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('Expected ok result');
  }
  return result.value;
};

const createFixtureRequest = (): CliCommandRequest => ({
  commandName: 'convert',
  rawArgv: [
    'convert',
    '--workspace',
    '/workspace/spa-bridge',
    '--input',
    'src',
    '--output',
    'dist/out',
    '--report-format',
    'json',
    '--verbosity',
    'normal',
  ],
  args: [],
  options: {
    workspacePath: '/workspace/spa-bridge',
    inputPath: 'src',
    outputPath: 'dist/out',
    reportFormat: 'json',
    verbosity: 'normal',
  },
});

const createResolvedOptions = (): CliResolvedOptions => ({
  commandName: 'convert',
  workspacePath: '/workspace/spa-bridge',
  inputPath: 'src',
  outputPath: 'dist/out',
  configPath: '/workspace/spa-bridge/spa-bridge.config.json',
  reportFormat: 'json',
  verbosity: 'normal',
  executionMode: 'non-interactive',
  dryRun: false,
  runId: 'run-001',
  confirm: false,
});

describe('cli package', () => {
  it('builds stable help content', () => {
    const help = buildHelpContent();
    expect(help.commands.map((entry) => entry.name)).toEqual(['convert', 'validate', 'report', 'help']);
  });

  it('parses convert commands with flags', () => {
    const parsed = expectOk(parseCliCommand(createFixtureRequest().rawArgv));
    expect(parsed.commandName).toBe('convert');
    expect(parsed.options.workspacePath).toBe('/workspace/spa-bridge');
    expect(parsed.options.reportFormat).toBe('json');
  });

  it('resolves precedence and validates paths', async () => {
    const parsed = expectOk(parseCliCommand(createFixtureRequest().rawArgv));
    const resolved = await resolveCliOptions(
      parsed,
      {
        SPA_BRIDGE_OUTPUT: 'dist/env-out',
        SPA_BRIDGE_VERBOSITY: 'verbose',
      },
      async () => ({ ok: false, error: { code: 'CONFIG_ERROR', message: 'missing' } }),
      '/workspace/spa-bridge',
    );

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) {
      throw new Error('Expected ok result');
    }

    const validated = expectOk(validateWorkspacePaths(resolved.value, '/workspace/spa-bridge'));
    expect(validated.isContained).toBe(true);
    expect(validated.workspaceRoot).toBe('/workspace/spa-bridge');
  });

  it('maps stable exit codes', () => {
    expect(mapExitCode('success').code).toBe(0);
    expect(mapExitCode('review').code).toBe(80);
    expect(mapExitCode('usage').code).toBe(64);
    expect(mapExitCode('validation').code).toBe(65);
    expect(mapExitCode('runtime').code).toBe(70);
  });

  it('renders safe output deterministically', () => {
    const help = buildHelpContent();
    const renderModel = buildRenderModel(
      {
        commandName: 'help',
        status: 'success',
        exitCode: mapExitCode('success'),
        summary: help.usage,
        progress: [],
        warnings: ['safe warning'],
        reviewItems: ['safe review'],
        renderModel: {
          headline: 'help (success)',
          sections: [],
          progress: [],
          warnings: ['safe warning'],
          reviewItems: ['safe review'],
        },
      },
      'verbose',
      help,
    );
    const rendered = renderTerminalOutput(renderModel, 'verbose');
    expect(rendered).toContain('help (success)');
    expect(rendered).toContain('safe warning');
  });

  it('runs help commands without requiring a backend bridge', async () => {
    const result = await runCli(['--help']);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected ok result');
    }
    expect(result.value.summary).toContain('spa-bridge <command>');
  });

  it('runs convert commands with injectable bridges', async () => {
    const result = await runCli(
      createFixtureRequest().rawArgv,
      process.env,
      {
        cwd: '/workspace/spa-bridge',
        env: process.env,
        fileSystem: {
          async readText() {
            return { ok: false, error: { code: 'CONFIG_ERROR', message: 'missing config' } };
          },
          async writeText() {
            return { ok: true, value: undefined };
          },
          async exists() {
            return false;
          },
          async ensureDir() {
            return { ok: true, value: undefined };
          },
        },
        applicationBridge: {
          async startConversion(request) {
            return {
              ok: true,
              value: {
                runId: request.resolvedOptions.runId,
                summary: `Converted ${request.validatedPaths.workspaceRoot}`,
                warnings: [],
                reviewItems: [],
                reportPayload: {
                  title: 'Conversion Summary',
                  summary: `Converted ${request.validatedPaths.workspaceRoot}`,
                  warnings: [],
                  reviewItems: [],
                  sections: [{ title: 'Summary', lines: ['ok'] }],
                },
              },
            };
          },
          async validateWorkspace(request) {
            return {
              ok: true,
              value: {
                runId: request.resolvedOptions.runId,
                summary: 'validated',
                warnings: [],
                reviewItems: [],
              },
            };
          },
          async prepareReport(request) {
            return {
              ok: true,
              value: {
                title: 'CLI Report',
                summary: `Report for ${request.validatedPaths.workspaceRoot}`,
                warnings: [],
                reviewItems: [],
                sections: [{ title: 'Summary', lines: ['ok'] }],
              },
            };
          },
        },
        reportBridge: {
          async exportReport(request) {
            return {
              ok: true,
              value: {
                format: request.reportFormat,
                content: JSON.stringify({ title: request.payload.title }),
                outputPath: request.outputPath,
                generatedAt: request.generatedAt,
                contentHash: 'hash',
              },
            };
          },
        },
        now: () => '2026-06-08T00:00:00.000Z',
      },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected ok result');
    }
    expect(result.value.commandName).toBe('convert');
    expect(result.value.reportPath).toContain('report.json');
  });

  it('runs a real end-to-end Angular-to-React conversion into an output directory', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'spa-bridge-cli-'));
    const angularRoot = path.join(workspaceRoot, 'angular-app');
    const outputRoot = path.join(workspaceRoot, 'react-output');
    await fs.mkdir(path.join(angularRoot, 'src', 'app'), { recursive: true });
    await fs.writeFile(
      path.join(angularRoot, 'package.json'),
      JSON.stringify({ name: 'fixture-angular-app', dependencies: { '@angular/core': '15.2.10' } }, null, 2),
      'utf8',
    );
    await fs.writeFile(
      path.join(angularRoot, 'angular.json'),
      JSON.stringify(
        {
          defaultProject: 'fixture-angular-app',
          projects: {
            'fixture-angular-app': {
              sourceRoot: 'src',
              projectType: 'application',
            },
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await fs.writeFile(path.join(angularRoot, 'src', 'main.ts'), "import './app/app.component';\n", 'utf8');
    await fs.writeFile(
      path.join(angularRoot, 'src', 'app', 'app.component.ts'),
      [
        "import { Component, Input } from '@angular/core';",
        '',
        '@Component({',
        "  selector: 'app-root',",
        "  templateUrl: './app.component.html',",
        '})',
        'export class AppComponent {',
        '  @Input() title = "Fixture";',
        '}',
        '',
      ].join('\n'),
      'utf8',
    );
    await fs.writeFile(path.join(angularRoot, 'src', 'app', 'app.component.html'), '<h1>{{ title }}</h1>\n', 'utf8');

    const result = await runCli(
      [
        'convert',
        '--workspace',
        workspaceRoot,
        '--input',
        'angular-app',
        '--output',
        'react-output',
        '--report-format',
        'json',
        '--non-interactive',
        '--confirm',
        '--run-id',
        'run-e2e',
      ],
      process.env,
      {
        cwd: workspaceRoot,
        now: () => '2026-06-08T00:00:00.000Z',
      },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.summary).toContain('Converted');
    await expect(fs.readFile(path.join(outputRoot, 'package.json'), 'utf8')).resolves.toContain('fixture-angular-app');
    await expect(fs.readFile(path.join(outputRoot, 'src', 'App.tsx'), 'utf8')).resolves.toContain('Target React scaffold');
    await expect(fs.readFile(path.join(outputRoot, 'src', 'components', 'AppComponent.tsx'), 'utf8')).resolves.toContain('AppComponent');
    await expect(fs.readFile(path.join(outputRoot, '.spa-bridge', 'target-summary.json'), 'utf8')).resolves.toContain('totalFiles');
    await expect(fs.readFile(path.join(outputRoot, 'report.json'), 'utf8')).resolves.toContain('Conversion Summary');
  });
});

describe('cli property tests', () => {
  it('keeps parser and output behavior deterministic', async () => {
    await fc.assert(
      fc.asyncProperty(argvArbitrary, async (argv) => {
        const first = parseCliCommand(argv);
        const second = parseCliCommand(argv);
        expect(first).toStrictEqual(second);
      }),
      { numRuns: 40, seed: 20260608 },
    );
  });

  it('keeps exit code mapping stable across outcome categories', async () => {
    await fc.assert(
      fc.asyncProperty(exitOutcomeArbitrary, async (outcome) => {
        expect(mapExitCode(outcome).category).toBe(outcome);
      }),
      { numRuns: 40, seed: 20260608 },
    );
  });

  it('keeps command request parsing invariant under repeated resolution', async () => {
    await fc.assert(
      fc.asyncProperty(commandRequestArbitrary, async (request) => {
        const renderModel = buildRenderModel(
          {
            commandName: request.commandName,
            status: 'success',
            exitCode: mapExitCode('success'),
            summary: 'summary',
            progress: [],
            warnings: [],
            reviewItems: [],
            renderModel: {
              headline: 'headline',
              sections: [],
              progress: [],
              warnings: [],
              reviewItems: [],
            },
          },
          request.options.verbosity ?? 'normal',
        );

        const second = buildRenderModel(
          {
            commandName: request.commandName,
            status: 'success',
            exitCode: mapExitCode('success'),
            summary: 'summary',
            progress: [],
            warnings: [],
            reviewItems: [],
            renderModel: {
              headline: 'headline',
              sections: [],
              progress: [],
              warnings: [],
              reviewItems: [],
            },
          },
          request.options.verbosity ?? 'normal',
        );

        expect(renderModel).toStrictEqual(second);
      }),
      { numRuns: 30, seed: 20260608 },
    );
  });

  it('keeps workspace path validation stable', async () => {
    await fc.assert(
      fc.asyncProperty(workspacePathArbitrary, async ({ root, child }) => {
        const resolved: CliResolvedOptions = {
          ...createResolvedOptions(),
          workspacePath: `/workspace/${root}`,
          inputPath: child,
          outputPath: child,
          configPath: `/workspace/${root}/spa-bridge.config.json`,
        };

        const validation = validateWorkspacePaths(resolved, `/workspace/${root}`);
        expect(validation.ok).toBe(true);
      }),
      { numRuns: 20, seed: 20260608 },
    );
  });
});
