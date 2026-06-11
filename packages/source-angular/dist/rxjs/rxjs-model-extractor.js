import { createDiagnostic } from '@spa-bridge/core-model';
import { StableIdFactory } from '../model/stable-id-factory.js';
const sourceRef = (path, symbol) => ({ kind: 'source', path, symbol });
const toValueName = (memberName) => {
    const withoutThis = memberName.replace(/^this\./, '');
    const withoutDollar = withoutThis.replace(/\$$/, '');
    const cleaned = withoutDollar.replace(/[^A-Za-z0-9_$]/g, '') || 'observable';
    return `${cleaned}Value`;
};
const splitTopLevel = (value) => {
    const result = [];
    let current = '';
    let depth = 0;
    let quote;
    for (let index = 0; index < value.length; index += 1) {
        const char = value[index] ?? '';
        const previous = value[index - 1];
        if (quote) {
            current += char;
            if (char === quote && previous !== '\\')
                quote = undefined;
            continue;
        }
        if (char === '"' || char === "'" || char === '`') {
            quote = char;
            current += char;
            continue;
        }
        if (char === '(' || char === '[' || char === '{')
            depth += 1;
        if (char === ')' || char === ']' || char === '}')
            depth = Math.max(0, depth - 1);
        if (char === ',' && depth === 0) {
            if (current.trim())
                result.push(current.trim());
            current = '';
            continue;
        }
        current += char;
    }
    if (current.trim())
        result.push(current.trim());
    return result;
};
const extractCallArguments = (text, callName) => {
    const start = text.indexOf(`${callName}(`);
    if (start < 0)
        return undefined;
    const openIndex = start + callName.length;
    let depth = 0;
    let quote;
    for (let index = openIndex; index < text.length; index += 1) {
        const char = text[index] ?? '';
        const previous = text[index - 1];
        if (quote) {
            if (char === quote && previous !== '\\')
                quote = undefined;
            continue;
        }
        if (char === '"' || char === "'" || char === '`') {
            quote = char;
            continue;
        }
        if (char === '(')
            depth += 1;
        if (char === ')') {
            depth -= 1;
            if (depth === 0) {
                return text.slice(openIndex + 1, index).trim();
            }
        }
    }
    return undefined;
};
const operatorKind = (name) => {
    if (name === 'map')
        return 'projection';
    if (name === 'filter' || name === 'distinctUntilChanged')
        return 'filter';
    if (name === 'tap')
        return 'side-effect';
    if (name === 'switchMap' || name === 'mergeMap' || name === 'concatMap' || name === 'exhaustMap')
        return 'flattening';
    if (name === 'catchError' || name === 'retry')
        return 'error-handling';
    if (name === 'debounceTime' || name === 'delay' || name === 'throttleTime')
        return 'timing';
    if (name === 'shareReplay' || name === 'share')
        return 'sharing';
    if (name === 'takeUntil' || name === 'take' || name === 'first')
        return 'cleanup';
    return 'unknown';
};
const isObservableLike = (name, typeText, initializer) => /\$$/.test(name) ||
    /Observable\s*</.test(typeText ?? '') ||
    /(of|from|combineLatest|merge|interval|timer)\s*\(/.test(initializer ?? '') ||
    /\.pipe\s*\(/.test(initializer ?? '');
const subjectKind = (typeText, initializer) => {
    const source = `${typeText ?? ''} ${initializer ?? ''}`;
    if (/BehaviorSubject/.test(source))
        return 'BehaviorSubject';
    if (/ReplaySubject/.test(source))
        return 'ReplaySubject';
    if (/AsyncSubject/.test(source))
        return 'AsyncSubject';
    if (/Subject/.test(source))
        return 'Subject';
    return 'unknown';
};
export class RxjsModelExtractor {
    ids = new StableIdFactory();
    extract(typeScriptSummaries, templateSummaries) {
        const streams = [];
        const subjects = [];
        const subscriptions = [];
        const operatorChains = [];
        const diagnostics = [];
        for (const summary of typeScriptSummaries) {
            for (const symbol of summary.symbols) {
                const ownerKind = symbol.decorators.some((decorator) => decorator.kind === 'Component')
                    ? 'component'
                    : symbol.decorators.some((decorator) => decorator.kind === 'Injectable')
                        ? 'service'
                        : /effect|store/i.test(symbol.name)
                            ? 'store-effect'
                            : 'unknown';
                for (const property of symbol.propertyInitializers) {
                    const kind = subjectKind(property.typeText, property.initializer);
                    if (kind !== 'unknown') {
                        const isDestroy = /destroy/i.test(property.name);
                        subjects.push({
                            id: this.ids.symbolId(summary.sourcePath, 'rxjs-subject', property.name, subjects.length + 1),
                            subjectKind: kind,
                            memberName: property.name,
                            initialValueText: this.extractSubjectInitialValue(property.initializer),
                            nextCallRefs: this.findMethodRefs(summary.sourcePath, symbol.methods, `${property.name}.next`),
                            errorCallRefs: this.findMethodRefs(summary.sourcePath, symbol.methods, `${property.name}.error`),
                            completeCallRefs: this.findMethodRefs(summary.sourcePath, symbol.methods, `${property.name}.complete`),
                            cleanupRole: isDestroy ? 'destroy-signal' : 'state-source',
                            reviewRequired: !isDestroy,
                        });
                    }
                    if (isObservableLike(property.name, property.typeText, property.initializer)) {
                        const chain = property.initializer?.includes('.pipe(')
                            ? this.extractOperatorChain(summary.sourcePath, property.initializer, operatorChains.length + 1)
                            : undefined;
                        if (chain)
                            operatorChains.push(chain);
                        streams.push({
                            id: this.ids.symbolId(summary.sourcePath, 'rxjs-stream', property.name, streams.length + 1),
                            ownerId: symbol.id,
                            ownerKind,
                            sourceRef: sourceRef(summary.sourcePath, property.name),
                            memberName: property.name,
                            valueName: toValueName(property.name),
                            typeText: property.typeText,
                            initializerText: property.initializer,
                            operatorChainIds: chain ? [chain.id] : [],
                            asyncPipeBindingIds: [],
                            diagnostics: [],
                        });
                    }
                }
                for (const method of symbol.methods) {
                    const methodText = method.bodyText;
                    const subscriptionMatches = [...methodText.matchAll(/([\w$.()]+(?:\.pipe\s*\([^;]+?\))?)\.subscribe\s*\(([^;]+?)\)/gs)];
                    for (const match of subscriptionMatches) {
                        const sourceExpression = (match[1] ?? '').trim();
                        const callbackText = (match[2] ?? '').trim();
                        const chain = sourceExpression.includes('.pipe(')
                            ? this.extractOperatorChain(summary.sourcePath, sourceExpression, operatorChains.length + 1)
                            : undefined;
                        if (chain)
                            operatorChains.push(chain);
                        subscriptions.push({
                            id: this.ids.symbolId(summary.sourcePath, 'rxjs-subscription', `${symbol.name}-${method.name}`, subscriptions.length + 1),
                            ownerId: symbol.id,
                            sourceExpression,
                            nextCallbackText: callbackText,
                            assignmentTarget: this.inferAssignmentTarget(callbackText),
                            cleanupEvidence: this.cleanupEvidence(methodText, symbol.methods),
                            operatorChainId: chain?.id,
                            sideEffectLevel: this.sideEffectLevel(callbackText),
                        });
                    }
                }
            }
        }
        const asyncPipeBindings = this.extractAsyncPipeBindings(templateSummaries, streams);
        for (const binding of asyncPipeBindings) {
            const stream = streams.find((candidate) => candidate.id === binding.streamId);
            if (stream) {
                stream.asyncPipeBindingIds.push(binding.id);
            }
            if (binding.reviewRequired) {
                diagnostics.push(createDiagnostic({
                    code: 'RXJS-ASYNC-PIPE-001',
                    severity: 'manual-review',
                    message: `Async pipe expression '${binding.expressionText}' could not be matched to a known observable stream.`,
                    sourceRefs: [binding.templateSourceRef],
                    generatedRefs: [],
                    tags: ['rxjs', 'async-pipe'],
                }));
            }
        }
        return {
            schemaVersion: 1,
            streams: streams.sort((left, right) => left.id.localeCompare(right.id)),
            subjects: subjects.sort((left, right) => left.id.localeCompare(right.id)),
            subscriptions: subscriptions.sort((left, right) => left.id.localeCompare(right.id)),
            operatorChains: operatorChains.sort((left, right) => left.id.localeCompare(right.id)),
            asyncPipeBindings: asyncPipeBindings.sort((left, right) => left.id.localeCompare(right.id)),
            diagnostics: diagnostics.sort((left, right) => left.code.localeCompare(right.code) || left.message.localeCompare(right.message)),
        };
    }
    extractOperatorChain(sourcePath, expression, index) {
        const args = extractCallArguments(expression, 'pipe');
        if (!args)
            return undefined;
        const operators = splitTopLevel(args).map((operator, operatorIndex) => {
            const name = operator.match(/^([A-Za-z_$][\w$]*)/)?.[1] ?? 'unknown';
            const kind = operatorKind(name);
            return {
                id: this.ids.symbolId(sourcePath, 'rxjs-operator', `${name}-${operatorIndex + 1}`, index),
                name,
                argumentText: extractCallArguments(operator, name),
                operatorKind: kind,
                reviewRequired: kind === 'flattening' || kind === 'side-effect' || kind === 'unknown',
            };
        });
        const hasFlattening = operators.some((operator) => operator.operatorKind === 'flattening');
        const hasErrorHandling = operators.some((operator) => operator.operatorKind === 'error-handling');
        const hasCleanupOperator = operators.some((operator) => operator.operatorKind === 'cleanup');
        return {
            id: this.ids.symbolId(sourcePath, 'rxjs-chain', expression.slice(0, 40), index),
            sourceExpression: expression,
            operators,
            hasFlattening,
            hasErrorHandling,
            hasCleanupOperator,
            conversionSafety: operators.some((operator) => operator.operatorKind === 'unknown')
                ? 'unsupported'
                : hasFlattening || operators.some((operator) => operator.reviewRequired)
                    ? 'review-required'
                    : 'safe',
        };
    }
    extractAsyncPipeBindings(templates, streams) {
        const bindings = [];
        for (const template of templates) {
            const text = template.rawText ?? '';
            const matches = [
                ...text.matchAll(/\{\{\s*([^{}|]+?)\s*\|\s*async(?:\s*\|\s*[^{}]+)?\s*\}\}/g),
                ...text.matchAll(/\[[^\]]+\]\s*=\s*["']([^"']+?\|\s*async[^"']*)["']/g),
            ];
            for (const match of matches) {
                const rawExpression = (match[1] ?? '').trim();
                const expressionText = rawExpression.split('|')[0]?.trim() ?? rawExpression;
                const stream = streams.find((candidate) => candidate.memberName === expressionText ||
                    `this.${candidate.memberName}` === expressionText ||
                    candidate.memberName.replace(/\$$/, '') === expressionText.replace(/\$$/, ''));
                bindings.push({
                    id: this.ids.symbolId(template.sourcePath, 'async-pipe', expressionText, bindings.length + 1),
                    ownerComponentId: template.ownerPath ?? template.sourcePath,
                    templateSourceRef: sourceRef(template.sourcePath),
                    expressionText,
                    streamId: stream?.id,
                    bindingKind: match[0].startsWith('{{') ? 'interpolation' : 'property',
                    reviewRequired: !stream,
                });
            }
        }
        return bindings;
    }
    extractSubjectInitialValue(initializer) {
        if (!initializer || !/BehaviorSubject/.test(initializer))
            return undefined;
        return extractCallArguments(initializer, 'BehaviorSubject')?.split(',')[0]?.trim();
    }
    findMethodRefs(sourcePath, methods, callText) {
        return methods
            .filter((method) => method.bodyText.includes(callText) || method.bodyText.includes(`this.${callText}`))
            .map((method) => sourceRef(sourcePath, method.name));
    }
    inferAssignmentTarget(callbackText) {
        return callbackText.match(/this\.([A-Za-z_$][\w$]*)\s*=/)?.[1];
    }
    cleanupEvidence(methodText, methods) {
        if (/takeUntil\s*\(/.test(methodText))
            return 'takeUntil';
        if (/\.add\s*\(/.test(methodText))
            return 'subscription-add';
        if (methods.some((method) => method.name === 'ngOnDestroy' && /\.unsubscribe\s*\(/.test(method.bodyText)))
            return 'ngOnDestroy-unsubscribe';
        return 'none';
    }
    sideEffectLevel(callbackText) {
        if (!callbackText.trim())
            return 'none';
        if (/this\.[A-Za-z_$][\w$]*\s*=/.test(callbackText))
            return 'state-assignment';
        if (/this\.[A-Za-z_$][\w$]*\s*\(/.test(callbackText))
            return 'method-call';
        if (/\.navigate\s*\(|\.dispatch\s*\(|\.post\s*\(|\.put\s*\(|\.delete\s*\(/.test(callbackText))
            return 'external-effect';
        return 'unknown';
    }
}
//# sourceMappingURL=rxjs-model-extractor.js.map