import path from 'node:path';

import type {
  GeneratedTargetCommandPlan,
  GeneratedTargetValidationCommand,
  GeneratedTargetValidationCommandKind,
} from '../types.js';

const defaultTimeouts: Record<GeneratedTargetValidationCommandKind, number> = {
  install: 120_000,
  typecheck: 60_000,
  build: 120_000,
  lint: 60_000,
  test: 60_000,
  'smoke-start': 30_000,
};

const normalizePath = (value: string): string => path.resolve(value);

const isInside = (root: string, candidate: string): boolean => {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

const scriptCommand = (packageManager: 'npm' | 'pnpm' | 'yarn', script: string): { command: string; args: string[] } => {
  if (packageManager === 'yarn') return { command: 'yarn', args: [script] };
  if (packageManager === 'pnpm') return { command: 'pnpm', args: ['run', script] };
  return { command: 'npm', args: ['run', script, '--', '--no-color'] };
};

const installCommand = (packageManager: 'npm' | 'pnpm' | 'yarn'): { command: string; args: string[] } => {
  if (packageManager === 'yarn') return { command: 'yarn', args: ['install', '--ignore-scripts', '--non-interactive'] };
  if (packageManager === 'pnpm') return { command: 'pnpm', args: ['install', '--ignore-scripts'] };
  return { command: 'npm', args: ['install', '--ignore-scripts', '--no-audit', '--no-fund'] };
};

export type GeneratedTargetCommandPlannerInput = {
  runId: string;
  targetRoot: string;
  packageJson?: {
    scripts?: Record<string, string>;
    packageManager?: string;
  };
  packageManager?: 'npm' | 'pnpm' | 'yarn';
  includeSmokeStart?: boolean;
};

export class GeneratedTargetCommandPlanner {
  plan(input: GeneratedTargetCommandPlannerInput): GeneratedTargetCommandPlan {
    const targetRoot = normalizePath(input.targetRoot);
    const packageManager = input.packageManager ?? this.detectPackageManager(input.packageJson?.packageManager);
    const scripts = input.packageJson?.scripts ?? {};
    const install = installCommand(packageManager);
    const commands: GeneratedTargetValidationCommand[] = [
      this.command(input.runId, 'install', packageManager, targetRoot, install.command, install.args, true),
    ];
    const rejectedScripts = Object.keys(scripts)
      .filter((script) => !['dev', 'build', 'lint', 'start', 'test', 'typecheck'].includes(script))
      .sort();

    if (scripts.typecheck) commands.push(this.script(input.runId, 'typecheck', packageManager, targetRoot, 'typecheck', true));
    if (scripts.build) commands.push(this.script(input.runId, 'build', packageManager, targetRoot, 'build', true));
    if (scripts.lint) commands.push(this.script(input.runId, 'lint', packageManager, targetRoot, 'lint', false));
    if (scripts.test) commands.push(this.script(input.runId, 'test', packageManager, targetRoot, 'test', false));
    if (input.includeSmokeStart && scripts.dev) commands.push(this.script(input.runId, 'smoke-start', packageManager, targetRoot, 'dev', false));

    return {
      planId: `generated-target-command-plan-${input.runId}`,
      targetRoot,
      packageManager,
      commands: commands.map((command) => ({
        ...command,
        allowlisted: command.allowlisted && isInside(targetRoot, command.workingDirectory),
      })),
      rejectedScripts,
    };
  }

  private detectPackageManager(value: string | undefined): 'npm' | 'pnpm' | 'yarn' {
    if (value?.startsWith('pnpm@')) return 'pnpm';
    if (value?.startsWith('yarn@')) return 'yarn';
    return 'npm';
  }

  private script(
    runId: string,
    kind: GeneratedTargetValidationCommandKind,
    packageManager: 'npm' | 'pnpm' | 'yarn',
    targetRoot: string,
    script: string,
    blocking: boolean,
  ): GeneratedTargetValidationCommand {
    const command = scriptCommand(packageManager, script);
    return this.command(runId, kind, packageManager, targetRoot, command.command, command.args, blocking);
  }

  private command(
    runId: string,
    kind: GeneratedTargetValidationCommandKind,
    packageManager: 'npm' | 'pnpm' | 'yarn',
    targetRoot: string,
    command: string,
    args: string[],
    blocking: boolean,
  ): GeneratedTargetValidationCommand {
    return {
      id: `${runId}-${kind}`,
      kind,
      command,
      args,
      workingDirectory: targetRoot,
      timeoutMs: defaultTimeouts[kind],
      allowlisted: command === packageManager || ['npm', 'pnpm', 'yarn'].includes(command),
      nonInteractive: true,
      safeEnvironmentKeys: ['CI', 'NODE_ENV', 'NEXT_TELEMETRY_DISABLED'],
      blocking,
    };
  }
}
