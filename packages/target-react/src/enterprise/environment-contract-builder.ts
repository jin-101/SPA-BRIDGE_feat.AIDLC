import type {
  EnvironmentContractReport,
  EnvironmentVariableClassification,
  EnvironmentVariableInventoryItem,
  SourceEnvironmentVariableInput,
} from '../types.js';

const SECRET_NAME_PATTERN = /(secret|token|password|passwd|pwd|private|credential|auth|api[_-]?key)/i;
const CLIENT_NAME_PATTERN = /^(NEXT_PUBLIC_|PUBLIC_|REACT_APP_)/;

const classify = (name: string, valuePresent: boolean | undefined): EnvironmentVariableClassification => {
  if (SECRET_NAME_PATTERN.test(name)) return 'secret';
  if (CLIENT_NAME_PATTERN.test(name)) return 'client-exposed';
  if (valuePresent === false) return 'placeholder';
  return 'server-only';
};

const targetNameFor = (name: string, classification: EnvironmentVariableClassification): string => {
  if (classification !== 'client-exposed') {
    return name.replace(/^REACT_APP_/, '').replace(/^PUBLIC_/, '');
  }
  if (name.startsWith('NEXT_PUBLIC_')) {
    return name;
  }
  return `NEXT_PUBLIC_${name.replace(/^REACT_APP_/, '').replace(/^PUBLIC_/, '')}`;
};

const itemFor = (name: string, variables: SourceEnvironmentVariableInput[]): EnvironmentVariableInventoryItem => {
  const classification = classify(name, variables.some((variable) => variable.valuePresent));
  const targetName = targetNameFor(name, classification);
  const sourceKinds = [...new Set(variables.map((variable) => variable.sourceKind))].sort();
  return {
    name,
    targetName,
    sourceKinds,
    classification,
    copyPolicy:
      classification === 'secret'
        ? 'placeholder-only'
        : classification === 'client-exposed'
          ? 'client-placeholder'
          : classification === 'unknown'
            ? 'review'
            : 'copy-name-only',
    manualReviewRequired: classification === 'secret' || classification === 'unknown',
  };
};

export class EnvironmentContractBuilder {
  build(sourceVariables: SourceEnvironmentVariableInput[] = []): EnvironmentContractReport {
    const grouped = new Map<string, SourceEnvironmentVariableInput[]>();
    for (const variable of sourceVariables) {
      if (!variable.name || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(variable.name)) {
        continue;
      }
      grouped.set(variable.name, [...(grouped.get(variable.name) ?? []), variable]);
    }

    const variables = [...grouped.entries()]
      .map(([name, entries]) => itemFor(name, entries))
      .sort((left, right) => left.targetName.localeCompare(right.targetName));
    const exampleEnvLines = variables.map((variable) => `${variable.targetName}=${variable.classification === 'secret' ? '<set-securely>' : ''}`);

    return {
      schemaVersion: 1,
      variables,
      exampleEnvLines,
      secretCount: variables.filter((variable) => variable.classification === 'secret').length,
      clientExposedCount: variables.filter((variable) => variable.classification === 'client-exposed').length,
      manualReviewCount: variables.filter((variable) => variable.manualReviewRequired).length,
    };
  }
}
