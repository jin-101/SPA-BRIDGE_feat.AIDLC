import fc from 'fast-check';
import { createViteReactTypeScriptStrategy } from '../strategies/vite-react-typescript.js';
const identifierArbitrary = fc
    .array(fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5'), { minLength: 4, maxLength: 12 })
    .map((characters) => characters.join(''));
const absolutePathArbitrary = fc
    .array(fc.constantFrom('workspace', 'spa-bridge', 'target-react', 'demo', 'generated'), { minLength: 3, maxLength: 6 })
    .map((segments) => `/tmp/${segments.join('/')}`);
const sourceRefArbitrary = fc.record({
    kind: fc.constant('source'),
    path: absolutePathArbitrary,
});
const generatedRefArbitrary = fc.record({
    kind: fc.constant('generated'),
    path: fc
        .array(fc.constantFrom('src', 'components', 'services', 'routes', 'state'), { minLength: 2, maxLength: 4 })
        .map((segments) => segments.join('/')),
});
const manualReviewItemArbitrary = fc.record({
    id: identifierArbitrary,
    title: identifierArbitrary,
    description: fc.option(identifierArbitrary, { nil: undefined }),
    status: fc.constant('open'),
});
const createDraftSetArbitrary = () => fc
    .record({
    schemaVersion: fc.constant(1),
    targetFramework: fc.constant('react'),
    projectStrategy: fc.constantFrom('vite-react-typescript', 'react-default'),
    components: fc.array(fc.record({
        id: identifierArbitrary,
        name: identifierArbitrary,
        sourceRef: fc.option(sourceRefArbitrary, { nil: undefined }),
        props: fc.array(identifierArbitrary, { maxLength: 3 }),
        state: fc.array(identifierArbitrary, { maxLength: 3 }),
        hooks: fc.constant([]),
        imports: fc.array(identifierArbitrary, { maxLength: 3 }),
        templateDraftId: fc.option(identifierArbitrary, { nil: undefined }),
        templateRawText: fc.option(fc.constant('<button (click)="select()"> {{ title }} </button>'), { nil: undefined }),
        templateExternalReferences: fc.array(fc.constantFrom('assets/logo.png', './local.png'), { maxLength: 2 }),
        serviceRefs: fc.array(identifierArbitrary, { maxLength: 3 }),
        styleUrls: fc.array(fc.constantFrom('./component.less', './component.css'), { maxLength: 1 }),
        propertyInitializers: fc.array(fc.record({
            name: identifierArbitrary,
            initializer: fc.option(fc.constantFrom("'value'", '0', 'false'), { nil: undefined }),
            readonly: fc.boolean(),
            decorators: fc.array(fc.constantFrom('Input', 'Output'), { maxLength: 1 }),
            typeText: fc.option(fc.constantFrom('string', 'boolean', 'EventEmitter<unknown>'), { nil: undefined }),
            isEventEmitter: fc.boolean(),
        }), { maxLength: 2 }),
        methods: fc.array(fc.record({
            name: identifierArbitrary,
            parameters: fc.array(identifierArbitrary, { maxLength: 2 }),
            bodyText: fc.constant('this.value = 1;'),
            isAsync: fc.boolean(),
        }), { maxLength: 2 }),
        reviewItemIds: fc.array(identifierArbitrary, { maxLength: 2 }),
        generatedRefs: fc.array(generatedRefArbitrary, { minLength: 1, maxLength: 2 }),
    }), { minLength: 1, maxLength: 3 }),
    templates: fc.array(fc.record({
        id: identifierArbitrary,
        ownerComponentId: identifierArbitrary,
        sourceRef: fc.option(sourceRefArbitrary, { nil: undefined }),
        jsxNodes: fc.array(identifierArbitrary, { maxLength: 3 }),
        bindings: fc.array(identifierArbitrary, { maxLength: 3 }),
        events: fc.array(identifierArbitrary, { maxLength: 3 }),
        forms: fc.array(identifierArbitrary, { maxLength: 2 }),
        rawText: fc.option(fc.constant('<input [(ngModel)]="title" />'), { nil: undefined }),
        externalReferences: fc.array(fc.constantFrom('assets/logo.png', './local.png'), { maxLength: 2 }),
        reviewItemIds: fc.array(identifierArbitrary, { maxLength: 2 }),
        generatedRefs: fc.array(generatedRefArbitrary, { minLength: 1, maxLength: 2 }),
    }), { minLength: 1, maxLength: 3 }),
    services: fc.array(fc.record({
        id: identifierArbitrary,
        name: identifierArbitrary,
        sourceRef: fc.option(sourceRefArbitrary, { nil: undefined }),
        kind: fc.constantFrom('module', 'hook', 'context', 'unknown'),
        providerScope: fc.option(identifierArbitrary, { nil: undefined }),
        dependencies: fc.array(identifierArbitrary, { maxLength: 3 }),
        reviewItemIds: fc.array(identifierArbitrary, { maxLength: 2 }),
        generatedRefs: fc.array(generatedRefArbitrary, { minLength: 1, maxLength: 2 }),
    }), { minLength: 0, maxLength: 2 }),
    routes: fc.array(fc.record({
        id: identifierArbitrary,
        path: fc.constantFrom('/', '/home', '/products', '/contact'),
        sourceRef: fc.option(sourceRefArbitrary, { nil: undefined }),
        elementRef: fc.option(identifierArbitrary, { nil: undefined }),
        children: fc.array(identifierArbitrary, { maxLength: 2 }),
        guardRefs: fc.array(identifierArbitrary, { maxLength: 2 }),
        lazyTarget: fc.option(identifierArbitrary, { nil: undefined }),
        reviewItemIds: fc.array(identifierArbitrary, { maxLength: 2 }),
        generatedRefs: fc.array(generatedRefArbitrary, { minLength: 1, maxLength: 2 }),
    }), { minLength: 1, maxLength: 2 }),
    state: fc.array(fc.record({
        id: identifierArbitrary,
        name: identifierArbitrary,
        sourceRef: fc.option(sourceRefArbitrary, { nil: undefined }),
        strategy: fc.constantFrom('service', 'signals', 'store', 'local', 'unknown'),
        storeRefs: fc.array(identifierArbitrary, { maxLength: 2 }),
        actions: fc.array(identifierArbitrary, { maxLength: 3 }),
        selectors: fc.array(identifierArbitrary, { maxLength: 3 }),
        effects: fc.array(identifierArbitrary, { maxLength: 2 }),
        reviewItemIds: fc.array(identifierArbitrary, { maxLength: 2 }),
        generatedRefs: fc.array(generatedRefArbitrary, { minLength: 1, maxLength: 2 }),
    }), { minLength: 0, maxLength: 2 }),
    manualReviewItems: fc.array(manualReviewItemArbitrary, { maxLength: 3 }),
    diagnostics: fc.array(fc.record({
        code: identifierArbitrary,
        severity: fc.constantFrom('info', 'warning', 'error', 'manual-review', 'security-blocker'),
        message: identifierArbitrary,
        sourceRefs: fc.array(sourceRefArbitrary, { maxLength: 2 }),
        generatedRefs: fc.array(generatedRefArbitrary, { maxLength: 2 }),
        tags: fc.array(identifierArbitrary, { maxLength: 3 }),
        remediationHint: fc.option(identifierArbitrary, { nil: undefined }),
    }), { maxLength: 4 }),
    traces: fc.array(fc.record({
        id: identifierArbitrary,
        source: sourceRefArbitrary,
        target: generatedRefArbitrary,
        relation: fc.constantFrom('maps-to', 'derived-from', 'emits', 'references'),
        confidence: fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
    }), { maxLength: 6 }),
})
    .map((draftSet) => ({
    ...draftSet,
    projectStrategy: draftSet.projectStrategy,
    components: [...draftSet.components].sort((left, right) => left.id.localeCompare(right.id)),
    templates: [...draftSet.templates].sort((left, right) => left.id.localeCompare(right.id)),
    services: [...draftSet.services].sort((left, right) => left.id.localeCompare(right.id)),
    routes: [...draftSet.routes].sort((left, right) => left.id.localeCompare(right.id)),
    state: [...draftSet.state].sort((left, right) => left.id.localeCompare(right.id)),
    manualReviewItems: [...draftSet.manualReviewItems].sort((left, right) => left.id.localeCompare(right.id)),
    diagnostics: [...draftSet.diagnostics].sort((left, right) => left.code.localeCompare(right.code)),
    traces: [...draftSet.traces].sort((left, right) => left.id.localeCompare(right.id)),
}));
export const targetGenerationRequestArbitrary = fc
    .record({
    runId: identifierArbitrary,
    correlationId: identifierArbitrary,
    targetRoot: absolutePathArbitrary,
    strategyId: fc.option(fc.constantFrom('vite-react-typescript', 'react-default'), { nil: undefined }),
    overwritePolicy: fc.constantFrom('preserve', 'overwrite'),
    projectName: fc.option(identifierArbitrary, { nil: undefined }),
    selectedStateStrategy: fc.option(fc.constantFrom('service', 'signals', 'store', 'local', 'unknown'), {
        nil: undefined,
    }),
    sourceModelRef: fc.option(sourceRefArbitrary, { nil: undefined }),
    existingPaths: fc.constant(undefined),
})
    .chain((fields) => createDraftSetArbitrary().map((draftSet) => ({
    runId: fields.runId,
    correlationId: fields.correlationId,
    targetRoot: fields.targetRoot,
    draftSet,
    strategyId: fields.strategyId ?? createViteReactTypeScriptStrategy().id,
    overwritePolicy: fields.overwritePolicy,
    projectName: fields.projectName,
    selectedStateStrategy: fields.selectedStateStrategy,
    sourceModelRef: fields.sourceModelRef,
    existingPaths: fields.existingPaths ?? undefined,
})));
export const targetDraftSetArbitrary = createDraftSetArbitrary();
export const targetManualReviewItemArbitrary = manualReviewItemArbitrary;
//# sourceMappingURL=generators.js.map