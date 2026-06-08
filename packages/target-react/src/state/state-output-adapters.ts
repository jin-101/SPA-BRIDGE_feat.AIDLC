import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactStateDraft } from '@spa-bridge/transform-angular-react';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec, TargetStateStrategy } from '../types.js';

const toStateSegment = (name: string): string => name.replace(/[^A-Za-z0-9]/g, '').toLowerCase() || 'state';
const toStateType = (name: string): string => `${name.replace(/[^A-Za-z0-9]/g, '') || 'Feature'}State`;

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
            ...(strategy === 'store'
              ? [
                  "import { createSlice, type PayloadAction } from '@reduxjs/toolkit';",
                  '',
                  `export type ${toStateType(entry.name)} = Record<string, unknown>;`,
                  '',
                  `const initialState: ${toStateType(entry.name)} = {};`,
                  '',
                  `export const ${toStateSegment(entry.name)}Slice = createSlice({`,
                  `  name: '${toStateSegment(entry.name)}',`,
                  '  initialState,',
                  '  reducers: {',
                  ...((entry.actions.length > 0 ? entry.actions : ['patch']).map((action) => `    ${toStateSegment(action)}: (state, action: PayloadAction<Record<string, unknown>>) => ({ ...state, ...action.payload }),`)),
                  '  },',
                  '});',
                  '',
                  `export const ${toStateSegment(entry.name)}Actions = ${toStateSegment(entry.name)}Slice.actions;`,
                  `export const ${toStateSegment(entry.name)}Reducer = ${toStateSegment(entry.name)}Slice.reducer;`,
                ]
              : [
                  "import { useMemo, useState } from 'react';",
                  '',
                  `export type ${toStateType(entry.name)} = Record<string, unknown>;`,
                  '',
                  `export const use${toStateType(entry.name)} = (initialState: ${toStateType(entry.name)} = {}) => {`,
                  `  const [state, setState] = useState<${toStateType(entry.name)}>(initialState);`,
                  '  const actions = useMemo(() => ({',
                  '    patch: (value: Record<string, unknown>) => setState((previous) => ({ ...previous, ...value })),',
                  '    reset: () => setState(initialState),',
                  '  }), [initialState]);',
                  '',
                  '  return { state, actions };',
                  '};',
                ]),
            '',
          ].join('\n'),
          sourceRefs,
          overwrite: true,
        }),
      ),
    ];
  }
}
