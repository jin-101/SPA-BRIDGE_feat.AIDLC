import type { PackageManagerName, PackageManagerParityReport, SourcePackageManagerInput } from '../types.js';

const DEFAULT_PACKAGE_MANAGER: SourcePackageManagerInput = {
  name: 'npm',
  version: undefined,
  packageManagerField: undefined,
  detectedFrom: ['default'],
  confidence: 'low',
  manualReviewRequired: false,
};

const normalizeField = (input: SourcePackageManagerInput): string => {
  if (input.packageManagerField) {
    return input.packageManagerField;
  }
  return input.version ? `${input.name}@${input.version}` : input.name;
};

const runCommand = (name: PackageManagerName, script: string): string => {
  if (name === 'npm') {
    return `npm run ${script}`;
  }
  return `${name} ${script}`;
};

export class PackageManagerParityPlanner {
  plan(sourcePackageManager?: SourcePackageManagerInput): PackageManagerParityReport {
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
