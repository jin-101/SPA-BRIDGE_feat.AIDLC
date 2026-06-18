const DEFAULT_PACKAGE_MANAGER = {
    name: 'npm',
    version: undefined,
    packageManagerField: undefined,
    detectedFrom: ['default'],
    confidence: 'low',
    manualReviewRequired: false,
};
const normalizeField = (input) => {
    if (input.packageManagerField) {
        return input.packageManagerField;
    }
    return input.version ? `${input.name}@${input.version}` : input.name;
};
const runCommand = (name, script) => {
    if (name === 'npm') {
        return `npm run ${script}`;
    }
    return `${name} ${script}`;
};
export class PackageManagerParityPlanner {
    plan(sourcePackageManager) {
        const selected = sourcePackageManager ?? DEFAULT_PACKAGE_MANAGER;
        const targetPackageManagerField = normalizeField(selected);
        return {
            schemaVersion: 1,
            selected,
            targetPackageManagerField,
            installCommand: `${selected.name} install`,
            devCommand: runCommand(selected.name, 'dev'),
            buildCommand: runCommand(selected.name, 'build'),
            manualReviewRequired: selected.manualReviewRequired ?? selected.confidence === 'low',
        };
    }
}
//# sourceMappingURL=package-manager-parity-planner.js.map