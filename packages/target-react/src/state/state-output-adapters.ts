import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactStateDraft } from '@spa-bridge/transform-angular-react';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec, TargetStateStrategy } from '../types.js';

const toStateSegment = (name: string): string => name.replace(/[^A-Za-z0-9]/g, '').toLowerCase() || 'state';

export class StateOutputAdapters {
  materialize(state: ReactStateDraft[], strategy: TargetStateStrategy, sourceRefs: SourceRef[] = []): GeneratedFileSpec[] {
    const basePath = `src/state/${strategy}`;
    const indexContent = [
      `export const stateStrategy = '${strategy}';`,
      `export const stateCount = ${state.length};`,
      '',
    ].join('\n');

    return [
      createFileSpec({
        path: `${basePath}/index.ts`,
        kind: 'state',
        content: indexContent,
        sourceRefs,
        overwrite: true,
      }),
      ...state.map((entry) =>
        createFileSpec({
          path: `${basePath}/${toStateSegment(entry.name)}.ts`,
          kind: 'state',
          content: [
            `export const ${toStateSegment(entry.name)}StateId = '${entry.id}';`,
            `export const ${toStateSegment(entry.name)}Strategy = '${entry.strategy}';`,
            '',
          ].join('\n'),
          sourceRefs,
          overwrite: true,
        }),
      ),
    ];
  }
}
