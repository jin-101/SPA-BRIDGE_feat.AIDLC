import type { RegistryMigrationPlan, SourceNpmrcFileInput } from '../types.js';
import { NpmrcParser } from './npmrc-parser.js';
export declare class RegistryMigrationPlanner {
    private readonly parser;
    constructor(parser?: NpmrcParser);
    plan(files?: SourceNpmrcFileInput[]): RegistryMigrationPlan;
}
//# sourceMappingURL=registry-migration-planner.d.ts.map