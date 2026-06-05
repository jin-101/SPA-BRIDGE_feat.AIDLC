import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactComponentDraft } from '@spa-bridge/transform-angular-react';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec } from '../types.js';

const toComponentName = (name: string): string => name.replace(/[^A-Za-z0-9]/g, '');

export class ComponentMaterializer {
  materialize(component: ReactComponentDraft, sourceRefs: SourceRef[] = []): GeneratedFileSpec[] {
    const safeName = toComponentName(component.name) || 'Component';
    const propsType = component.props.length > 0
      ? `type Props = {\n${component.props.map((prop) => `  ${prop.replace(/[^A-Za-z0-9_]/g, '')}?: unknown;`).join('\n')}\n};`
      : 'type Props = Record<string, never>;';

    const content = [
      propsType,
      '',
      `export const ${safeName} = (props: Props) => {`,
      '  void props;',
      '  return (',
      `    <section data-component="${safeName}">`,
      `      <h2>${safeName}</h2>`,
      '    </section>',
      '  );',
      '};',
      '',
    ].join('\n');

    return [
      createFileSpec({
        path: `src/components/${safeName}.tsx`,
        kind: 'component',
        content,
        sourceRefs,
        overwrite: true,
      }),
    ];
  }

  materializeMany(components: ReactComponentDraft[], sourceRef: SourceRef): GeneratedFileSpec[] {
    return components.flatMap((component) => this.materialize(component, [sourceRef]));
  }
}
