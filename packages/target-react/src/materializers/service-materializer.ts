import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactServiceDraft } from '@spa-bridge/transform-angular-react';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec } from '../types.js';

const toServiceName = (name: string): string => name.replace(/[^A-Za-z0-9]/g, '');

export class ServiceMaterializer {
  materialize(service: ReactServiceDraft, sourceRefs: SourceRef[] = []): GeneratedFileSpec[] {
    const safeName = toServiceName(service.name) || 'Service';
    const content = [
      `export type ${safeName}State = Record<string, unknown>;`,
      '',
      `export const create${safeName}Service = () => ({`,
      `  name: '${safeName}',`,
      `  kind: '${service.kind}',`,
      `  providerScope: ${service.providerScope ? `'${service.providerScope}'` : 'undefined'},`,
      '});',
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
