import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
const toStateSegment = (name) => name.replace(/[^A-Za-z0-9]/g, '').toLowerCase() || 'state';
export class StateOutputAdapters {
    materialize(state, strategy, sourceRefs = []) {
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
            ...state.map((entry) => createFileSpec({
                path: `${basePath}/${toStateSegment(entry.name)}.ts`,
                kind: 'state',
                content: [
                    `export const ${toStateSegment(entry.name)}StateId = '${entry.id}';`,
                    `export const ${toStateSegment(entry.name)}Strategy = '${entry.strategy}';`,
                    '',
                ].join('\n'),
                sourceRefs,
                overwrite: true,
            })),
        ];
    }
}
//# sourceMappingURL=state-output-adapters.js.map