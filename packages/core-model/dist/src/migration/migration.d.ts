import { type Result } from '../result/result.js';
import type { ValidationError } from '../validation/validation.js';
export type SchemaVersioned = {
    schemaVersion: number;
};
export type MigrationError = {
    name: 'MigrationError';
    message: string;
    fromVersion?: number;
    toVersion?: number;
};
export declare const createMigrationError: (message: string, fromVersion?: number, toVersion?: number) => MigrationError;
export type MigrationStep<TArtifact extends SchemaVersioned> = {
    fromVersion: number;
    toVersion: number;
    migrate: (artifact: TArtifact) => Result<TArtifact, MigrationError>;
};
export type MigrationRegistry<TArtifact extends SchemaVersioned> = {
    latestVersion: number;
    register: (step: MigrationStep<TArtifact>) => MigrationRegistry<TArtifact>;
    migrate: (artifact: TArtifact) => Result<TArtifact, MigrationError | ValidationError>;
};
export declare const createMigrationRegistry: <TArtifact extends SchemaVersioned>(latestVersion: number, validator?: (artifact: unknown) => Result<TArtifact, ValidationError>) => MigrationRegistry<TArtifact>;
export declare const migrateOnce: <TArtifact extends SchemaVersioned>(artifact: TArtifact, step: MigrationStep<TArtifact>) => Result<TArtifact, MigrationError>;
//# sourceMappingURL=migration.d.ts.map