import type { CliRuntimeDependencies, CliRunResult } from '../types.js';
export declare const createDefaultCliRuntime: (overrides?: Partial<CliRuntimeDependencies>) => CliRuntimeDependencies;
export declare const runCli: (argv: string[], env?: NodeJS.ProcessEnv, runtimeOverrides?: Partial<CliRuntimeDependencies>) => Promise<CliRunResult>;
//# sourceMappingURL=cli-service.d.ts.map