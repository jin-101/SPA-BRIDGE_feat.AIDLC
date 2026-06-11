import fs from 'node:fs';
import { createDiagnostic } from '@spa-bridge/core-model';
import { createStableIdFactory } from '../model/stable-id-factory.js';
const ngrxImports = [
    '@ngrx/store',
    '@ngrx/effects',
    '@ngrx/entity',
    '@ngrx/router-store',
];
const toSourceRef = (path, symbol) => ({
    kind: 'source',
    path,
    symbol,
});
const uniqueSorted = (values) => [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
const toFeatureName = (name) => name
    .replace(/Reducer$/i, '')
    .replace(/Selectors?$/i, '')
    .replace(/^select/i, '')
    .replace(/[^A-Za-z0-9]+/g, '')
    .replace(/^./, (char) => char.toLowerCase()) || 'feature';
const getBalancedCall = (sourceText, callName, startIndex) => {
    const callStart = sourceText.indexOf(`${callName}(`, startIndex);
    if (callStart < 0)
        return '';
    let depth = 0;
    for (let index = callStart + callName.length; index < sourceText.length; index += 1) {
        const char = sourceText[index];
        if (char === '(')
            depth += 1;
        if (char === ')') {
            depth -= 1;
            if (depth === 0) {
                return sourceText.slice(callStart, index + 1);
            }
        }
    }
    return sourceText.slice(callStart, Math.min(sourceText.length, callStart + 1_200));
};
const splitTopLevelArgs = (text) => {
    const argsText = text.replace(/^[^(]*\(/, '').replace(/\)\s*$/, '');
    const args = [];
    let current = '';
    let depth = 0;
    let quote;
    for (const char of argsText) {
        if (quote) {
            current += char;
            if (char === quote)
                quote = undefined;
            continue;
        }
        if (char === "'" || char === '"' || char === '`') {
            quote = char;
            current += char;
            continue;
        }
        if (char === '(' || char === '[' || char === '{')
            depth += 1;
        if (char === ')' || char === ']' || char === '}')
            depth -= 1;
        if (char === ',' && depth === 0) {
            args.push(current.trim());
            current = '';
            continue;
        }
        current += char;
    }
    if (current.trim())
        args.push(current.trim());
    return args;
};
const extractPayloadProperties = (expression) => {
    const propsMatch = expression.match(/props\s*<\s*\{([\s\S]*?)\}\s*>\s*\(/);
    if (!propsMatch?.[1])
        return [];
    return uniqueSorted(propsMatch[1]
        .split(/[;,]/)
        .map((part) => part.split(':')[0]?.trim() ?? '')
        .map((name) => name.replace(/[^A-Za-z0-9_$]/g, '')));
};
const detectOperators = (expression) => {
    const operatorNames = [
        'map',
        'switchMap',
        'mergeMap',
        'concatMap',
        'exhaustMap',
        'tap',
        'catchError',
        'withLatestFrom',
        'debounceTime',
        'delay',
        'filter',
    ];
    return uniqueSorted(operatorNames.filter((name) => new RegExp(`\\b${name}\\s*\\(`).test(expression)));
};
const getSourceText = (sourcePath) => {
    try {
        return fs.readFileSync(sourcePath, 'utf8');
    }
    catch {
        return '';
    }
};
export class NgrxModelExtractor {
    ids = createStableIdFactory();
    extract(typeScriptSummaries) {
        const actions = [];
        const reducers = [];
        const selectors = [];
        const effects = [];
        const entityAdapters = [];
        const componentUsages = [];
        const diagnostics = [];
        let hasRouterStore = false;
        for (const summary of typeScriptSummaries) {
            if (!summary.symbols.some((symbol) => symbol.imports.some((specifier) => ngrxImports.includes(specifier)))) {
                continue;
            }
            const sourceText = getSourceText(summary.sourcePath);
            const sourceRef = toSourceRef(summary.sourcePath);
            hasRouterStore = hasRouterStore || summary.symbols.some((symbol) => symbol.imports.includes('@ngrx/router-store')) || /router-store|RouterReducerState|getSelectors\s*\(/.test(sourceText);
            actions.push(...this.extractActions(summary.sourcePath, sourceText));
            reducers.push(...this.extractReducers(summary.sourcePath, sourceText));
            selectors.push(...this.extractSelectors(summary.sourcePath, sourceText));
            effects.push(...this.extractEffects(summary.sourcePath, sourceText));
            entityAdapters.push(...this.extractEntityAdapters(summary.sourcePath, sourceText));
            componentUsages.push(...this.extractComponentUsages(summary, sourceText));
            if (/Store\s*<|store\s*:\s*Store/.test(sourceText) && !/store\.(select|dispatch)\s*\(/.test(sourceText)) {
                diagnostics.push(createDiagnostic({
                    code: 'V2-GAP-NGRX-001',
                    severity: 'manual-review',
                    message: 'Store dependency was detected without a traceable select or dispatch call.',
                    sourceRefs: [sourceRef],
                    generatedRefs: [],
                    tags: ['ngrx', 'component-usage', 'manual-review'],
                }));
            }
        }
        if (hasRouterStore) {
            diagnostics.push(createDiagnostic({
                code: 'V2-GAP-NGRX-ROUTER-001',
                severity: 'manual-review',
                message: 'NgRx router-store usage requires route-state parity review in the React target.',
                sourceRefs: typeScriptSummaries.length > 0 ? [toSourceRef(typeScriptSummaries[0]?.sourcePath ?? 'workspace')] : [],
                generatedRefs: [],
                tags: ['ngrx', 'router-store', 'manual-review'],
            }));
        }
        return {
            schemaVersion: 1,
            actions: actions.sort((left, right) => left.id.localeCompare(right.id)),
            reducers: reducers.sort((left, right) => left.id.localeCompare(right.id)),
            selectors: selectors.sort((left, right) => left.id.localeCompare(right.id)),
            effects: effects.sort((left, right) => left.id.localeCompare(right.id)),
            entityAdapters: entityAdapters.sort((left, right) => left.id.localeCompare(right.id)),
            componentUsages: componentUsages.sort((left, right) => left.id.localeCompare(right.id)),
            hasRouterStore,
            diagnostics: diagnostics.sort((left, right) => left.code.localeCompare(right.code)),
        };
    }
    extractActions(sourcePath, sourceText) {
        const actions = [];
        const actionRegex = /(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*createAction\s*\(\s*(['"`])([^'"`]+)\2([\s\S]*?)\);/g;
        for (const match of sourceText.matchAll(actionRegex)) {
            const name = match[1] ?? 'action';
            const expression = match[0] ?? '';
            actions.push({
                id: this.ids.symbolId(sourcePath, 'ngrx-action', name, actions.length + 1),
                name,
                actionType: match[3] ?? name,
                sourceRef: toSourceRef(sourcePath, name),
                payloadProperties: extractPayloadProperties(expression),
                sourceExpression: expression.slice(0, 500),
            });
        }
        const groupRegex = /(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*createActionGroup\s*\(([\s\S]*?)\);/g;
        for (const match of sourceText.matchAll(groupRegex)) {
            const groupName = match[1] ?? 'actionGroup';
            const body = match[2] ?? '';
            const source = body.match(/source\s*:\s*(['"`])([^'"`]+)\1/)?.[2] ?? groupName;
            for (const event of body.matchAll(/(['"`])([^'"`]+)\1\s*:/g)) {
                const eventName = event[2] ?? 'event';
                const name = `${groupName}${eventName.replace(/[^A-Za-z0-9]+/g, '')}`;
                actions.push({
                    id: this.ids.symbolId(sourcePath, 'ngrx-action-group', name, actions.length + 1),
                    name,
                    actionType: `[${source}] ${eventName}`,
                    sourceRef: toSourceRef(sourcePath, groupName),
                    payloadProperties: [],
                    sourceExpression: `${groupName}.${eventName}`,
                });
            }
        }
        return actions;
    }
    extractReducers(sourcePath, sourceText) {
        const reducers = [];
        const reducerRegex = /(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*createReducer\s*\(/g;
        for (const match of sourceText.matchAll(reducerRegex)) {
            const name = match[1] ?? 'reducer';
            const expression = getBalancedCall(sourceText, 'createReducer', match.index ?? 0);
            const args = splitTopLevelArgs(expression);
            const handlers = [];
            for (const onCall of expression.matchAll(/\bon\s*\(/g)) {
                const onExpression = getBalancedCall(expression, 'on', onCall.index ?? 0);
                const onArgs = splitTopLevelArgs(onExpression);
                const reducerExpression = onArgs[onArgs.length - 1] ?? '';
                handlers.push({
                    id: this.ids.symbolId(sourcePath, 'ngrx-reducer-handler', `${name}-${handlers.length + 1}`, handlers.length + 1),
                    actionNames: onArgs.slice(0, -1).map((arg) => arg.replace(/[^A-Za-z0-9_.$]/g, '')).filter(Boolean),
                    reducerExpression: reducerExpression.slice(0, 500),
                    reviewRequired: /adapter\.|Object\.assign|new\s+|class\s+|function\s*\*/.test(reducerExpression),
                });
            }
            reducers.push({
                id: this.ids.symbolId(sourcePath, 'ngrx-reducer', name, reducers.length + 1),
                name,
                featureName: toFeatureName(name),
                initialStateRef: args[0],
                sourceRef: toSourceRef(sourcePath, name),
                handlers: handlers.sort((left, right) => left.id.localeCompare(right.id)),
            });
        }
        return reducers;
    }
    extractSelectors(sourcePath, sourceText) {
        const selectors = [];
        const featureRegex = /(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*createFeatureSelector(?:\s*<[^>]+>)?\s*\(\s*(['"`])([^'"`]+)\2\s*\)/g;
        for (const match of sourceText.matchAll(featureRegex)) {
            const name = match[1] ?? 'selectFeature';
            selectors.push({
                id: this.ids.symbolId(sourcePath, 'ngrx-feature-selector', name, selectors.length + 1),
                name,
                featureName: match[3] ?? toFeatureName(name),
                dependencies: [],
                projectorExpression: undefined,
                sourceRef: toSourceRef(sourcePath, name),
                reviewRequired: false,
            });
        }
        const selectorRegex = /(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*createSelector\s*\(/g;
        for (const match of sourceText.matchAll(selectorRegex)) {
            const name = match[1] ?? 'selector';
            const expression = getBalancedCall(sourceText, 'createSelector', match.index ?? 0);
            const args = splitTopLevelArgs(expression);
            selectors.push({
                id: this.ids.symbolId(sourcePath, 'ngrx-selector', name, selectors.length + 1),
                name,
                featureName: args[0] ? toFeatureName(args[0]) : undefined,
                dependencies: args.slice(0, -1).map((arg) => arg.replace(/[^A-Za-z0-9_.$]/g, '')).filter(Boolean),
                projectorExpression: args[args.length - 1]?.slice(0, 500),
                sourceRef: toSourceRef(sourcePath, name),
                reviewRequired: args.length < 2 || /\bprops\b|=>\s*\{/.test(args[args.length - 1] ?? ''),
            });
        }
        return selectors;
    }
    extractEffects(sourcePath, sourceText) {
        const effects = [];
        const effectRegex = /(?:readonly\s+|public\s+|private\s+|protected\s+)?([A-Za-z_$][\w$]*)\s*=\s*createEffect\s*\(/g;
        for (const match of sourceText.matchAll(effectRegex)) {
            const name = match[1] ?? 'effect';
            const expression = getBalancedCall(sourceText, 'createEffect', match.index ?? 0);
            const dispatch = !/dispatch\s*:\s*false/.test(expression);
            const operatorIntents = detectOperators(expression);
            const serviceCallRefs = uniqueSorted([...expression.matchAll(/\bthis\.([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\s*\(/g)].map((candidate) => `${candidate[1]}.${candidate[2]}`));
            const reviewRequired = /withLatestFrom|concatLatestFrom|router|navigate|window|document|interval|timer|webSocket/.test(expression);
            effects.push({
                id: this.ids.symbolId(sourcePath, 'ngrx-effect', name, effects.length + 1),
                name,
                sourceRef: toSourceRef(sourcePath, name),
                ofTypeActions: uniqueSorted([...expression.matchAll(/\bofType\s*\(([\s\S]*?)\)/g)].flatMap((candidate) => splitTopLevelArgs(candidate[0]).map((arg) => arg.replace(/[^A-Za-z0-9_.$]/g, '')))),
                dispatch,
                operatorIntents,
                serviceCallRefs,
                safety: reviewRequired ? 'review-required' : serviceCallRefs.length > 0 ? 'safe' : 'review-required',
            });
        }
        return effects;
    }
    extractEntityAdapters(sourcePath, sourceText) {
        const adapters = [];
        const adapterRegex = /(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*createEntityAdapter(?:\s*<([^>]+)>)?\s*\(([\s\S]*?)\);/g;
        for (const match of sourceText.matchAll(adapterRegex)) {
            const name = match[1] ?? 'adapter';
            const body = match[3] ?? '';
            adapters.push({
                id: this.ids.symbolId(sourcePath, 'ngrx-entity-adapter', name, adapters.length + 1),
                name,
                entityType: match[2]?.trim(),
                sourceRef: toSourceRef(sourcePath, name),
                selectIdExpression: body.match(/selectId\s*:\s*([^,\n}]+)/)?.[1]?.trim(),
                sortComparerExpression: body.match(/sortComparer\s*:\s*([^,\n}]+)/)?.[1]?.trim(),
                helperRefs: uniqueSorted([...sourceText.matchAll(new RegExp(`${name}\\.([A-Za-z_$][\\w$]*)`, 'g'))].map((candidate) => candidate[1] ?? '')),
                reviewRequired: /selectId|sortComparer/.test(body),
            });
        }
        return adapters;
    }
    extractComponentUsages(summary, sourceText) {
        const usages = [];
        const componentSymbols = summary.symbols.filter((symbol) => symbol.decorators.some((decorator) => decorator.kind === 'Component'));
        if (componentSymbols.length === 0 || !/Store\s*<|store\s*:\s*Store|private\s+store|public\s+store/.test(sourceText)) {
            return usages;
        }
        const selectedSelectors = uniqueSorted([...sourceText.matchAll(/\bstore\.select\s*\(([\s\S]*?)\)/g)].map((match) => splitTopLevelArgs(match[0])[0]?.replace(/[^A-Za-z0-9_.$]/g, '') ?? ''));
        const dispatchedActions = uniqueSorted([...sourceText.matchAll(/\bstore\.dispatch\s*\(([\s\S]*?)\)/g)].map((match) => {
            const arg = splitTopLevelArgs(match[0])[0] ?? '';
            return (arg.match(/^([A-Za-z_$][\w$.]*)/)?.[1] ?? '').replace(/[^A-Za-z0-9_.$]/g, '');
        }));
        const usageKind = selectedSelectors.length > 0 && dispatchedActions.length > 0 ? 'mixed' : selectedSelectors.length > 0 ? 'select' : dispatchedActions.length > 0 ? 'dispatch' : 'injected-only';
        for (const symbol of componentSymbols) {
            usages.push({
                id: this.ids.symbolId(summary.sourcePath, 'ngrx-component-usage', symbol.name, usages.length + 1),
                ownerComponentPath: summary.sourcePath,
                ownerComponentName: symbol.name,
                sourceRef: toSourceRef(summary.sourcePath, symbol.name),
                storeDependencyName: 'store',
                selectedSelectors,
                dispatchedActions,
                usageKind,
                reviewRequired: usageKind === 'injected-only',
            });
        }
        return usages;
    }
}
//# sourceMappingURL=ngrx-model-extractor.js.map