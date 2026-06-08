import { type Result } from '@spa-bridge/core-model';
import { type CliError } from '../shared-errors.js';
import type { CliCommandRequest, CliResolvedOptions } from '../types.js';
export declare const resolveCliOptions: (request: CliCommandRequest, env: NodeJS.ProcessEnv, readText: (path: string) => Promise<Result<string, CliError>>, cwd: string) => Promise<Result<CliResolvedOptions, CliError>>;
//# sourceMappingURL=cli-option-resolver.d.ts.map