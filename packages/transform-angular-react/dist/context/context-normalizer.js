import { createDiagnostic, ok } from '@spa-bridge/core-model';
import { StableIdFactory } from '../model/stable-id-factory.js';
const normalizeValidators = (validators) => validators.map((validator) => ({
    id: validator.id,
    kind: validator.kind,
    arguments: [...validator.arguments],
    reviewRequired: validator.reviewRequired,
}));
const normalizeFormControl = (control) => ({
    id: control.id,
    name: control.name,
    path: control.path,
    initialValue: control.initialValue,
    valueType: control.valueType,
    validators: normalizeValidators(control.validators),
    asyncValidators: normalizeValidators(control.asyncValidators),
});
const normalizeFormGroup = (group) => ({
    id: group.id,
    name: group.name,
    path: group.path,
    controls: group.controls.map(normalizeFormControl).sort((left, right) => left.path.localeCompare(right.path)),
    groups: group.groups.map(normalizeFormGroup).sort((left, right) => left.path.localeCompare(right.path)),
    arrays: group.arrays.map(normalizeFormArray).sort((left, right) => left.path.localeCompare(right.path)),
    validators: normalizeValidators(group.validators),
});
const normalizeFormArray = (array) => ({
    id: array.id,
    name: array.name,
    path: array.path,
    itemKind: array.itemKind,
    initialItems: array.initialItems.map((item) => {
        if ('controls' in item)
            return normalizeFormGroup(item);
        if ('initialItems' in item)
            return normalizeFormArray(item);
        return normalizeFormControl(item);
    }),
    complexity: array.complexity,
    validators: normalizeValidators(array.validators),
});
const normalizeRxStream = (stream) => ({
    id: stream.id,
    ownerId: stream.ownerId,
    ownerKind: stream.ownerKind,
    sourceRef: stream.sourceRef,
    memberName: stream.memberName,
    valueName: stream.valueName,
    typeText: stream.typeText,
    initializerText: stream.initializerText,
    operatorChainIds: [...stream.operatorChainIds],
    asyncPipeBindingIds: [...stream.asyncPipeBindingIds],
    diagnostics: [...stream.diagnostics],
});
const normalizeRxOperatorChain = (chain) => ({
    id: chain.id,
    sourceExpression: chain.sourceExpression,
    operators: chain.operators.map((operator) => ({ ...operator })).sort((left, right) => left.id.localeCompare(right.id)),
    hasFlattening: chain.hasFlattening,
    hasErrorHandling: chain.hasErrorHandling,
    hasCleanupOperator: chain.hasCleanupOperator,
    conversionSafety: chain.conversionSafety,
});
const normalizeNgrxAction = (action) => ({
    id: action.id,
    name: action.name,
    actionType: action.actionType,
    sourceRef: action.sourceRef,
    payloadProperties: [...action.payloadProperties].sort((left, right) => left.localeCompare(right)),
});
const normalizeNgrxReducer = (reducer) => ({
    id: reducer.id,
    name: reducer.name,
    featureName: reducer.featureName,
    initialStateRef: reducer.initialStateRef,
    sourceRef: reducer.sourceRef,
    handlers: reducer.handlers.map((handler) => ({
        id: handler.id,
        actionNames: [...handler.actionNames].sort((left, right) => left.localeCompare(right)),
        reducerExpression: handler.reducerExpression,
        reviewRequired: handler.reviewRequired,
    })).sort((left, right) => left.id.localeCompare(right.id)),
});
const normalizeNgrxSelector = (selector) => ({
    id: selector.id,
    name: selector.name,
    featureName: selector.featureName,
    dependencies: [...selector.dependencies].sort((left, right) => left.localeCompare(right)),
    projectorExpression: selector.projectorExpression,
    sourceRef: selector.sourceRef,
    reviewRequired: selector.reviewRequired,
});
const normalizeNgrxEffect = (effect) => ({
    id: effect.id,
    name: effect.name,
    sourceRef: effect.sourceRef,
    ofTypeActions: [...effect.ofTypeActions].sort((left, right) => left.localeCompare(right)),
    dispatch: effect.dispatch,
    operatorIntents: [...effect.operatorIntents].sort((left, right) => left.localeCompare(right)),
    serviceCallRefs: [...effect.serviceCallRefs].sort((left, right) => left.localeCompare(right)),
    safety: effect.safety,
});
const normalizeNgrxEntityAdapter = (adapter) => ({
    id: adapter.id,
    name: adapter.name,
    entityType: adapter.entityType,
    sourceRef: adapter.sourceRef,
    selectIdExpression: adapter.selectIdExpression,
    sortComparerExpression: adapter.sortComparerExpression,
    helperRefs: [...adapter.helperRefs].sort((left, right) => left.localeCompare(right)),
    reviewRequired: adapter.reviewRequired,
});
const normalizeNgrxComponentUsage = (usage) => ({
    id: usage.id,
    ownerComponentPath: usage.ownerComponentPath,
    ownerComponentName: usage.ownerComponentName,
    sourceRef: usage.sourceRef,
    storeDependencyName: usage.storeDependencyName,
    selectedSelectors: [...usage.selectedSelectors].sort((left, right) => left.localeCompare(right)),
    dispatchedActions: [...usage.dispatchedActions].sort((left, right) => left.localeCompare(right)),
    usageKind: usage.usageKind,
    reviewRequired: usage.reviewRequired,
});
const isComponentSymbol = (symbol) => symbol.decorators.some((decorator) => decorator.kind === 'Component');
const isServiceSymbol = (symbol) => symbol.decorators.some((decorator) => decorator.kind === 'Injectable') || /service/i.test(symbol.name);
const isStateSymbol = (symbol) => /store|selector|effect|reducer|state/i.test(symbol.name);
export class ContextNormalizer {
    ids = new StableIdFactory();
    normalize(request) {
        const analysis = request.analysis;
        const diagnostics = [...analysis.diagnostics];
        for (const mapping of analysis.aliasModel.paths.filter((alias) => alias.status !== 'supported')) {
            diagnostics.push(createDiagnostic({
                code: 'V2-GAP-ALIAS-TRANSFORM-001',
                severity: mapping.status === 'unsafe' ? 'security-blocker' : 'manual-review',
                message: `Alias ${mapping.aliasPattern} is preserved for manual review because it is ${mapping.status}.`,
                sourceRefs: [{ kind: 'source', path: mapping.sourceConfigPath }],
                generatedRefs: [],
                tags: ['alias', 'transformation'],
            }));
        }
        const templateByOwner = new Map();
        for (const template of analysis.templateSummaries) {
            const ownerPath = template.ownerPath ?? template.sourcePath;
            const ownerTemplates = templateByOwner.get(ownerPath) ?? [];
            ownerTemplates.push({
                id: this.ids.templateId(ownerPath, ownerTemplates.length + 1),
                ownerComponentPath: ownerPath,
                ownerComponentName: ownerPath.split('/').pop()?.replace(/\.html$/i, '') ?? ownerPath,
                sourceRef: {
                    kind: 'source',
                    path: template.sourcePath,
                },
                parserMode: template.parserMode,
                bindings: [...template.bindings.propertyBindings, ...template.bindings.eventBindings, ...template.bindings.structuralDirectives, ...template.bindings.templateRefs],
                events: [...template.bindings.eventBindings],
                structuralDirectives: [...template.bindings.structuralDirectives],
                templateRefs: [...template.bindings.templateRefs],
                pipes: [...template.bindings.pipes],
                externalReferences: [...template.bindings.externalReferences],
                rawText: template.rawText,
                templateIr: template.templateIr,
                diagnostics: [...template.diagnostics],
            });
            templateByOwner.set(ownerPath, ownerTemplates);
        }
        const components = [];
        const services = [];
        const states = [];
        const routes = [];
        const templates = [];
        const forms = analysis.formModels.map((form) => ({
            id: form.id,
            ownerComponentId: form.ownerComponentId,
            ownerComponentPath: form.ownerComponentPath,
            declarationKind: form.declarationKind,
            rootControl: 'controls' in form.rootControl
                ? normalizeFormGroup(form.rootControl)
                : 'initialItems' in form.rootControl
                    ? normalizeFormArray(form.rootControl)
                    : normalizeFormControl(form.rootControl),
            templateBindings: form.templateBindings.map((binding) => ({ ...binding })).sort((left, right) => left.id.localeCompare(right.id)),
            submitIntents: form.submitIntents.map((intent) => ({ ...intent })).sort((left, right) => left.id.localeCompare(right.id)),
        })).sort((left, right) => left.id.localeCompare(right.id));
        for (const summary of analysis.typeScriptSummaries) {
            const relatedFiles = analysis.inventory.files.filter((file) => file.path === summary.sourcePath || file.relativePath.endsWith(summary.sourcePath.split('/').pop() ?? ''));
            const sourceRef = relatedFiles[0] ? { kind: 'source', path: relatedFiles[0].path } : { kind: 'source', path: summary.sourcePath };
            for (const symbol of summary.symbols) {
                if (isComponentSymbol(symbol)) {
                    const templateCandidates = templateByOwner.get(summary.sourcePath) ?? [];
                    const componentTemplates = templateCandidates.map((template) => template.id);
                    components.push({
                        id: this.ids.componentId(symbol.name, components.length + 1),
                        name: symbol.name,
                        sourceRef,
                        selector: symbol.decorators.find((decorator) => decorator.kind === 'Component')?.metadata.selector,
                        inputs: symbol.decorators.flatMap((decorator) => (Array.isArray(decorator.metadata.inputs) ? decorator.metadata.inputs : [])),
                        outputs: symbol.decorators.flatMap((decorator) => (Array.isArray(decorator.metadata.outputs) ? decorator.metadata.outputs : [])),
                        lifecycleHooks: [...symbol.lifecycleHooks],
                        templateIds: componentTemplates,
                        serviceRefs: [...symbol.constructorDependencies],
                        stateRefs: [],
                        routeRefs: [],
                        styleUrls: [...symbol.styleUrls],
                        propertyInitializers: [...symbol.propertyInitializers],
                        methods: [...symbol.methods],
                        diagnostics: [...summary.diagnostics],
                    });
                    templates.push(...templateCandidates);
                    continue;
                }
                if (isServiceSymbol(symbol)) {
                    services.push({
                        id: this.ids.serviceId(symbol.name, services.length + 1),
                        name: symbol.name,
                        sourceRef,
                        providedIn: typeof symbol.decorators.find((decorator) => decorator.kind === 'Injectable')?.metadata.providedIn === 'string'
                            ? symbol.decorators.find((decorator) => decorator.kind === 'Injectable')?.metadata.providedIn
                            : undefined,
                        dependencies: [...symbol.constructorDependencies],
                        diagnostics: [...summary.diagnostics],
                    });
                    continue;
                }
                if (isStateSymbol(symbol)) {
                    states.push({
                        id: this.ids.stateId(symbol.name, states.length + 1),
                        name: symbol.name,
                        sourceRef,
                        strategy: 'unknown',
                        dependencies: [...symbol.constructorDependencies],
                        diagnostics: [...summary.diagnostics],
                    });
                }
            }
        }
        for (const route of analysis.routeSummaries) {
            routes.push({
                id: this.ids.routeId(route.path, routes.length + 1),
                path: route.path,
                sourceRef: {
                    kind: 'source',
                    path: route.sourcePath,
                },
                component: route.component,
                lazyTarget: route.lazyLoadTarget,
                guardRefs: [...route.guardRefs],
                resolverRefs: [...route.resolverRefs],
                childPaths: [...route.childPaths],
                parameterNames: [...route.parameterNames],
                isDynamic: route.isDynamic,
                diagnostics: [...analysis.diagnostics],
            });
        }
        const normalizedContext = {
            schemaVersion: 1,
            runId: request.runId,
            correlationId: request.correlationId,
            sourceModelRef: analysis.sourceModelBoundary.sourceModelRef,
            packageRefs: [...analysis.workspaceProfile.packageRefs],
            aliasModel: analysis.aliasModel,
            targetFramework: request.targetFramework,
            targetProjectStrategy: request.targetProjectStrategy,
            stateStrategy: request.stateStrategy,
            enabledRulePacks: [...request.enabledRulePacks],
            projectName: analysis.workspaceProfile.projectName,
            diagnostics,
            components,
            templates,
            forms,
            services,
            routes,
            states,
            traceLinks: [...analysis.graph.edges].map((edge, index) => ({
                id: this.ids.next('trace', [edge.from, edge.to, edge.kind, index + 1]),
                source: { kind: 'source', path: edge.evidenceRefs[0]?.path ?? analysis.workspaceProfile.projectRoot },
                target: { kind: 'generated', path: `${request.targetProjectStrategy}/drafts/${edge.kind}/${index + 1}.tsx` },
                relation: 'derived-from',
                confidence: edge.confidence,
            })),
            rxStreams: analysis.rxjsModel.streams.map(normalizeRxStream).sort((left, right) => left.id.localeCompare(right.id)),
            rxSubjects: analysis.rxjsModel.subjects.map((subject) => ({
                id: subject.id,
                subjectKind: subject.subjectKind,
                memberName: subject.memberName,
                initialValueText: subject.initialValueText,
                cleanupRole: subject.cleanupRole,
                reviewRequired: subject.reviewRequired,
            })).sort((left, right) => left.id.localeCompare(right.id)),
            rxSubscriptions: analysis.rxjsModel.subscriptions.map((subscription) => ({
                id: subscription.id,
                ownerId: subscription.ownerId,
                sourceExpression: subscription.sourceExpression,
                nextCallbackText: subscription.nextCallbackText,
                assignmentTarget: subscription.assignmentTarget,
                cleanupEvidence: subscription.cleanupEvidence,
                operatorChainId: subscription.operatorChainId,
                sideEffectLevel: subscription.sideEffectLevel,
            })).sort((left, right) => left.id.localeCompare(right.id)),
            rxOperatorChains: analysis.rxjsModel.operatorChains.map(normalizeRxOperatorChain).sort((left, right) => left.id.localeCompare(right.id)),
            asyncPipeBindings: analysis.rxjsModel.asyncPipeBindings.map((binding) => ({
                id: binding.id,
                ownerComponentId: binding.ownerComponentId,
                templateSourceRef: binding.templateSourceRef,
                expressionText: binding.expressionText,
                streamId: binding.streamId,
                bindingKind: binding.bindingKind,
                fallbackValueText: binding.fallbackValueText,
                reviewRequired: binding.reviewRequired,
            })).sort((left, right) => left.id.localeCompare(right.id)),
            ngrxActions: analysis.ngrxModel.actions.map(normalizeNgrxAction).sort((left, right) => left.id.localeCompare(right.id)),
            ngrxReducers: analysis.ngrxModel.reducers.map(normalizeNgrxReducer).sort((left, right) => left.id.localeCompare(right.id)),
            ngrxSelectors: analysis.ngrxModel.selectors.map(normalizeNgrxSelector).sort((left, right) => left.id.localeCompare(right.id)),
            ngrxEffects: analysis.ngrxModel.effects.map(normalizeNgrxEffect).sort((left, right) => left.id.localeCompare(right.id)),
            ngrxEntityAdapters: analysis.ngrxModel.entityAdapters.map(normalizeNgrxEntityAdapter).sort((left, right) => left.id.localeCompare(right.id)),
            ngrxComponentUsages: analysis.ngrxModel.componentUsages.map(normalizeNgrxComponentUsage).sort((left, right) => left.id.localeCompare(right.id)),
            hasNgrxRouterStore: analysis.ngrxModel.hasRouterStore,
        };
        return ok(normalizedContext);
    }
}
//# sourceMappingURL=context-normalizer.js.map