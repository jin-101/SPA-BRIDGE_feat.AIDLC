import { type Result } from '@spa-bridge/core-model';
import { type CliError } from '../shared-errors.js';
import type { CliResolvedOptions, ValidatedWorkspacePaths } from '../types.js';
export declare const validateWorkspacePaths: (resolved: CliResolvedOptions, cwd: string) => Result<ValidatedWorkspacePaths, CliError>;
//# sourceMappingURL=workspace-path-guard.d.ts.map