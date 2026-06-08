import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactServiceDraft } from '@spa-bridge/transform-angular-react';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec } from '../types.js';

const toServiceName = (name: string): string => name.replace(/[^A-Za-z0-9]/g, '');

export class ServiceMaterializer {
  materialize(service: ReactServiceDraft, sourceRefs: SourceRef[] = []): GeneratedFileSpec[] {
    const safeName = toServiceName(service.name) || 'Service';
    const content = [
      "import { createContext, useContext, useMemo } from 'react';",
      '',
      `export type ${safeName}Service = {`,
      `  name: '${safeName}';`,
      `  kind: '${service.kind}';`,
      `  providerScope?: string;`,
      `  dependencies: string[];`,
      `};`,
      '',
      `export const create${safeName}Service = (): ${safeName}Service => ({`,
      `  name: '${safeName}' as const,`,
      `  kind: '${service.kind}',`,
      `  providerScope: ${service.providerScope ? `'${service.providerScope}'` : 'undefined'},`,
      `  dependencies: ${JSON.stringify(service.dependencies)},`,
      '});',
      '',
      `const ${safeName}Context = createContext<${safeName}Service | undefined>(undefined);`,
      '',
      `export const ${safeName}Provider = ${safeName}Context.Provider;`,
      '',
      `export const use${safeName}Service = () => {`,
      `  const existing = useContext(${safeName}Context);`,
      `  const fallback = useMemo(() => create${safeName}Service(), []);`,
      `  return existing ?? fallback;`,
      `};`,
      '',
    ].join('\n');

    return [
      createFileSpec({
        path: `src/services/${safeName}.ts`,
        kind: 'service',
        content,
        sourceRefs,
        overwrite: true,
      }),
    ];
  }

  materializeMany(services: ReactServiceDraft[], sourceRef: SourceRef): GeneratedFileSpec[] {
    return services.flatMap((service) => this.materialize(service, [sourceRef]));
  }
}
