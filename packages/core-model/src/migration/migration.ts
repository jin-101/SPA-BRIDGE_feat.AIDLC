import { err, ok, type Result } from '../result/result.js';
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

export const createMigrationError = (
  message: string,
  fromVersion?: number,
  toVersion?: number,
): MigrationError => ({
  name: 'MigrationError',
  message,
  fromVersion,
  toVersion,
});

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

export const createMigrationRegistry = <TArtifact extends SchemaVersioned>(
  latestVersion: number,
  validator?: (artifact: unknown) => Result<TArtifact, ValidationError>,
): MigrationRegistry<TArtifact> => {
  const steps = new Map<number, MigrationStep<TArtifact>>();
  const registry: MigrationRegistry<TArtifact> = {
    latestVersion,
    register(step) {
      steps.set(step.fromVersion, step);
      return registry;
    },
    migrate(artifact) {
      let current: TArtifact = artifact;

      if (current.schemaVersion > latestVersion) {
        return err(
          createMigrationError(
            `Unsupported schema version ${current.schemaVersion}`,
            current.schemaVersion,
            latestVersion,
          ),
        );
      }

      while (current.schemaVersion < latestVersion) {
        const step = steps.get(current.schemaVersion);
        if (!step) {
          return err(
            createMigrationError(
              `Missing migration step from ${current.schemaVersion} to ${current.schemaVersion + 1}`,
              current.schemaVersion,
              current.schemaVersion + 1,
            ),
          );
        }

        const migrated = step.migrate(current);
        if (!migrated.ok) {
          return migrated;
        }
        current = migrated.value;
      }

      if (!validator) {
        return ok(current);
      }

      return validator(current);
    },
  };

  return registry;
};

export const migrateOnce = <TArtifact extends SchemaVersioned>(
  artifact: TArtifact,
  step: MigrationStep<TArtifact>,
): Result<TArtifact, MigrationError> => {
  if (artifact.schemaVersion !== step.fromVersion) {
    return err(
      createMigrationError(
        `Step expected version ${step.fromVersion} but got ${artifact.schemaVersion}`,
        artifact.schemaVersion,
        step.toVersion,
      ),
    );
  }

  const migrated = step.migrate(artifact);
  if (!migrated.ok) {
    return migrated;
  }

  if (migrated.value.schemaVersion !== step.toVersion) {
    return err(
      createMigrationError(
        `Migration step did not update schemaVersion to ${step.toVersion}`,
        artifact.schemaVersion,
        step.toVersion,
      ),
    );
  }

  return migrated;
};
