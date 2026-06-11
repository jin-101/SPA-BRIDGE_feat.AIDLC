import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
const toIdentifier = (value, fallback) => {
    const cleaned = value
        .replace(/^[^A-Za-z_$]+/, '')
        .replace(/[^A-Za-z0-9_$]+/g, '_');
    return cleaned || fallback;
};
const toPascal = (value) => {
    const id = toIdentifier(value, 'Feature');
    return id.charAt(0).toUpperCase() + id.slice(1);
};
const toFeatureSegment = (value) => toIdentifier(value, 'feature').replace(/_/g, '-').toLowerCase();
const asComment = (value) => value.replace(/\*\//g, '* /');
const collectReducerActionNames = (draft) => {
    const reducerActions = draft.reducer?.handlers.flatMap((handler) => handler.actionNames) ?? [];
    const modelActions = draft.actions.map((action) => action.name);
    return [...new Set([...reducerActions, ...modelActions])]
        .map((name) => name.split('.').pop() ?? name)
        .map((name) => toIdentifier(name, 'patch'))
        .filter(Boolean)
        .sort((left, right) => left.localeCompare(right));
};
const renderSlice = (draft) => {
    const feature = toIdentifier(draft.featureName, 'feature');
    const stateType = `${toPascal(feature)}State`;
    const actionNames = collectReducerActionNames(draft);
    const effectiveActions = actionNames.length > 0 ? actionNames : ['patch'];
    const comments = [
        ...draft.reviewComments,
        ...(draft.entityAdapters.length > 0
            ? draft.entityAdapters.map((adapter) => `AIDLC_MANUAL_REVIEW_NGRX: entity adapter '${adapter.name}' mapped with Redux Toolkit createEntityAdapter; verify selectId/sortComparer parity.`)
            : []),
    ];
    const adapterImports = draft.entityAdapters.length > 0 ? ', createEntityAdapter' : '';
    const adapterLines = draft.entityAdapters.flatMap((adapter) => [
        `const ${toIdentifier(adapter.name, 'entityAdapter')} = createEntityAdapter<Record<string, unknown>>({`,
        ...(adapter.selectIdExpression ? [`  // selectId source: ${asComment(adapter.selectIdExpression)}`] : []),
        ...(adapter.sortComparerExpression ? [`  // sortComparer source: ${asComment(adapter.sortComparerExpression)}`] : []),
        '});',
        '',
    ]);
    return createFileSpec({
        path: `src/store/slices/${toFeatureSegment(feature)}.ts`,
        kind: 'state',
        content: [
            `import { createSlice, type PayloadAction${adapterImports} } from '@reduxjs/toolkit';`,
            '',
            ...adapterLines,
            `export type ${stateType} = Record<string, unknown>;`,
            '',
            `const initialState: ${stateType} = {};`,
            '',
            ...comments.map((comment) => `/* ${asComment(comment)} */`),
            `export const ${feature}Slice = createSlice({`,
            `  name: '${feature}',`,
            '  initialState,',
            '  reducers: {',
            ...effectiveActions.map((actionName) => `    ${actionName}: (state, action: PayloadAction<Record<string, unknown> | undefined>) => ({ ...state, ...(action.payload ?? {}) }),`),
            '  },',
            '});',
            '',
            `export const ${feature}Actions = ${feature}Slice.actions;`,
            `export const ${feature}Reducer = ${feature}Slice.reducer;`,
            '',
        ].join('\n'),
        sourceRefs: draft.reducer?.sourceRef ? [draft.reducer.sourceRef] : [],
        overwrite: true,
    });
};
const renderSelectors = (draft) => {
    const feature = toIdentifier(draft.featureName, 'feature');
    const selectorLines = draft.selectors.length > 0
        ? draft.selectors.flatMap((selector) => [
            ...(selector.reviewRequired ? [`/* AIDLC_MANUAL_REVIEW_NGRX: selector '${selector.name}' projector needs parity review. */`] : []),
            `export const ${toIdentifier(selector.name, 'selectFeature')} = (state: RootState) => state.${feature};`,
            '',
        ])
        : [
            `export const select${toPascal(feature)}State = (state: RootState) => state.${feature};`,
            '',
        ];
    return createFileSpec({
        path: `src/store/selectors/${toFeatureSegment(feature)}.ts`,
        kind: 'state',
        content: [
            "import type { RootState } from '../index';",
            '',
            ...selectorLines,
        ].join('\n'),
        sourceRefs: draft.selectors.flatMap((selector) => (selector.sourceRef ? [selector.sourceRef] : [])),
        overwrite: true,
    });
};
const renderEffects = (draft) => {
    if (draft.effects.length === 0) {
        return undefined;
    }
    const feature = toIdentifier(draft.featureName, 'feature');
    return createFileSpec({
        path: `src/store/effects/${toFeatureSegment(feature)}.ts`,
        kind: 'state',
        content: [
            "import type { AppDispatch, RootState } from '../index';",
            '',
            'export type EffectContext = {',
            '  dispatch: AppDispatch;',
            '  getState: () => RootState;',
            '};',
            '',
            ...draft.effects.flatMap((effect) => [
                `/* AIDLC_MANUAL_REVIEW_NGRX: effect '${effect.name}' operators: ${asComment(effect.operatorIntents.join(', ') || 'unknown')}; services: ${asComment(effect.serviceCallRefs.join(', ') || 'unknown')}. */`,
                `export const ${toIdentifier(effect.name, 'runEffect')} = async (_context: EffectContext) => {`,
                "  // Converted effect placeholder keeps the generated app runnable while preserving the effect handoff point.",
                '};',
                '',
            ]),
        ].join('\n'),
        sourceRefs: draft.effects.flatMap((effect) => (effect.sourceRef ? [effect.sourceRef] : [])),
        overwrite: true,
    });
};
export class ReduxToolkitMaterializer {
    materialize(drafts, sourceRefs = []) {
        if (drafts.length === 0) {
            return [];
        }
        const sortedDrafts = [...drafts].sort((left, right) => left.featureName.localeCompare(right.featureName));
        const reducerImports = sortedDrafts.map((draft) => {
            const feature = toIdentifier(draft.featureName, 'feature');
            return `import { ${feature}Reducer } from './slices/${toFeatureSegment(feature)}';`;
        });
        const reducerEntries = sortedDrafts.map((draft) => {
            const feature = toIdentifier(draft.featureName, 'feature');
            return `    ${feature}: ${feature}Reducer,`;
        });
        const indexFile = createFileSpec({
            path: 'src/store/index.ts',
            kind: 'state',
            content: [
                "import { configureStore } from '@reduxjs/toolkit';",
                ...reducerImports,
                '',
                'export const store = configureStore({',
                '  reducer: {',
                ...reducerEntries,
                '  },',
                '});',
                '',
                'export type RootState = ReturnType<typeof store.getState>;',
                'export type AppDispatch = typeof store.dispatch;',
                '',
            ].join('\n'),
            sourceRefs,
            overwrite: true,
        });
        const hooksFile = createFileSpec({
            path: 'src/store/hooks.ts',
            kind: 'state',
            content: [
                "import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';",
                "import type { AppDispatch, RootState } from './index';",
                '',
                'export const useAppDispatch: () => AppDispatch = useDispatch;',
                'export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;',
                '',
            ].join('\n'),
            sourceRefs,
            overwrite: true,
        });
        return [
            indexFile,
            hooksFile,
            ...sortedDrafts.flatMap((draft) => [renderSlice(draft), renderSelectors(draft), renderEffects(draft)].filter((file) => Boolean(file))),
        ];
    }
}
//# sourceMappingURL=redux-toolkit-materializer.js.map