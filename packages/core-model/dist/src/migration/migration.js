import { err, ok } from '../result/result.js';
export const createMigrationError = (message, fromVersion, toVersion) => ({
    name: 'MigrationError',
    message,
    fromVersion,
    toVersion,
});
export const createMigrationRegistry = (latestVersion, validator) => {
    const steps = new Map();
    const registry = {
        latestVersion,
        register(step) {
            steps.set(step.fromVersion, step);
            return registry;
        },
        migrate(artifact) {
            let current = artifact;
            if (current.schemaVersion > latestVersion) {
                return err(createMigrationError(`Unsupported schema version ${current.schemaVersion}`, current.schemaVersion, latestVersion));
            }
            while (current.schemaVersion < latestVersion) {
                const step = steps.get(current.schemaVersion);
                if (!step) {
                    return err(createMigrationError(`Missing migration step from ${current.schemaVersion} to ${current.schemaVersion + 1}`, current.schemaVersion, current.schemaVersion + 1));
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
export const migrateOnce = (artifact, step) => {
    if (artifact.schemaVersion !== step.fromVersion) {
        return err(createMigrationError(`Step expected version ${step.fromVersion} but got ${artifact.schemaVersion}`, artifact.schemaVersion, step.toVersion));
    }
    const migrated = step.migrate(artifact);
    if (!migrated.ok) {
        return migrated;
    }
    if (migrated.value.schemaVersion !== step.toVersion) {
        return err(createMigrationError(`Migration step did not update schemaVersion to ${step.toVersion}`, artifact.schemaVersion, step.toVersion));
    }
    return migrated;
};
//# sourceMappingURL=migration.js.map