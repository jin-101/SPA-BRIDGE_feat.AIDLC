import { StableIdFactory } from '../model/stable-id-factory.js';
import { SafeReviewDiagnosticBuilder } from '../diagnostics/safe-review-diagnostic-builder.js';
import { ProviderNeutralMappingRequestBuilder } from '../ai-handoff/provider-neutral-mapping-request-builder.js';
export class ComponentConverter {
    ids;
    reviewBuilder;
    mappingBuilder;
    constructor(ids = new StableIdFactory(), reviewBuilder = new SafeReviewDiagnosticBuilder(), mappingBuilder = new ProviderNeutralMappingRequestBuilder()) {
        this.ids = ids;
        this.reviewBuilder = reviewBuilder;
        this.mappingBuilder = mappingBuilder;
    }
    convert(context) {
        const componentDrafts = context.components.map((component) => this.convertComponent(component, context));
        const diagnostics = [];
        const reviewItems = [];
        const traces = [];
        const mappingRequests = [];
        for (const draft of componentDrafts) {
            const sourcePath = draft.sourceRef?.path;
            if (sourcePath && !context.templates.some((template) => template.ownerComponentPath === sourcePath)) {
                const review = this.reviewBuilder.build({
                    category: 'template',
                    ruleId: 'component-template-missing',
                    message: `Component '${draft.name}' has no associated template draft.`,
                    sourcePaths: [sourcePath],
                    generatedPaths: draft.generatedRefs.map((ref) => ref.path),
                    remediationHint: 'Attach an explicit template draft or verify template analysis.',
                });
                diagnostics.push(review.diagnostic);
                reviewItems.push(review.reviewItem);
                draft.reviewItemIds.push(review.reviewItem.id);
                mappingRequests.push(this.mappingBuilder.build('template', draft.sourceRef ? [draft.sourceRef] : [], draft.generatedRefs, ['component-template-missing'], [review.diagnostic.code], {
                    component: draft.name,
                    reason: 'missing-template',
                }));
            }
            for (const hook of draft.hooks) {
                traces.push({
                    id: this.ids.traceId(draft.sourceRef?.path ?? draft.name, hook.generatedRefs[0]?.path ?? hook.id, 'component-hooks', 1),
                    source: draft.sourceRef ?? { kind: 'source', path: draft.name },
                    target: hook.generatedRefs[0] ?? { kind: 'generated', path: `${draft.id}/hooks/${hook.id}.json` },
                    relation: 'maps-to',
                    confidence: 1,
                });
            }
        }
        return { componentDrafts, diagnostics, reviewItems, traces, mappingRequests };
    }
    convertComponent(component, context) {
        const matchingTemplates = context.templates.filter((template) => template.ownerComponentPath === component.sourceRef?.path);
        const matchingForms = context.forms.filter((form) => form.ownerComponentPath === component.sourceRef?.path);
        const matchingStreams = context.rxStreams.filter((stream) => stream.ownerId === component.id || stream.sourceRef?.path === component.sourceRef?.path);
        const matchingSubscriptions = context.rxSubscriptions.filter((subscription) => subscription.ownerId === component.id);
        const matchingReduxUsage = context.ngrxComponentUsages.find((usage) => usage.ownerComponentPath === component.sourceRef?.path || usage.ownerComponentName === component.name);
        const templateDraftId = matchingTemplates[0]?.id;
        const primaryTemplate = matchingTemplates[0];
        const hooks = component.lifecycleHooks.map((hookName, index) => ({
            id: this.ids.hookId(component.name, hookName, index + 1),
            kind: hookName === 'ngOnInit' || hookName === 'ngOnDestroy' ? 'effect' : 'custom',
            sourceRef: component.sourceRef,
            dependencies: [...component.serviceRefs],
            intent: `map lifecycle hook '${hookName}' to React hook intent`,
            reviewItemIds: [],
            generatedRefs: [
                this.ids.artifactRef(`${component.name}/hooks/${hookName}.json`, hookName),
            ],
        }));
        const rxHooks = [
            ...matchingStreams.map((stream, index) => ({
                id: this.ids.hookId(component.name, `rxjs-${stream.memberName}`, index + 1),
                ownerComponentId: component.id,
                hookKind: 'useObservable',
                sourceStreamId: stream.id,
                valueName: stream.valueName,
                initialValueText: stream.initializerText?.includes('BehaviorSubject') ? "''" : 'undefined',
                dependencyExpressions: [stream.memberName],
                cleanupRequired: true,
                reviewComments: stream.operatorChainIds
                    .map((chainId) => context.rxOperatorChains.find((chain) => chain.id === chainId))
                    .filter((chain) => chain?.conversionSafety !== 'safe')
                    .map((chain) => `AIDLC_MANUAL_REVIEW_RXJS: operator chain '${chain?.sourceExpression ?? 'unknown'}' requires review.`),
            })),
            ...matchingSubscriptions.map((subscription, index) => ({
                id: this.ids.hookId(component.name, `subscription-${subscription.id}`, matchingStreams.length + index + 1),
                ownerComponentId: component.id,
                hookKind: 'useSubscriptionEffect',
                sourceStreamId: subscription.id,
                valueName: subscription.assignmentTarget ? `${subscription.assignmentTarget}Value` : `subscription${index + 1}Value`,
                initialValueText: 'undefined',
                dependencyExpressions: [subscription.sourceExpression.replace(/\.pipe\s*\(.+\)$/s, '').replace(/^this\./, '')],
                cleanupRequired: true,
                reviewComments: subscription.sideEffectLevel === 'state-assignment' && subscription.cleanupEvidence !== 'none'
                    ? []
                    : [`AIDLC_MANUAL_REVIEW_RXJS: subscription '${subscription.sourceExpression}' has ${subscription.sideEffectLevel} behavior or missing cleanup evidence.`],
            })),
        ].sort((left, right) => left.id.localeCompare(right.id));
        const propertyInputs = component.propertyInitializers
            .filter((property) => property.decorators.includes('Input'))
            .map((property) => property.name);
        const propertyOutputs = component.propertyInitializers
            .filter((property) => property.decorators.includes('Output') || property.isEventEmitter)
            .map((property) => property.name);
        return {
            id: component.id,
            name: component.name,
            sourceRef: component.sourceRef,
            selector: component.selector,
            props: [...new Set([...component.inputs, ...component.outputs, ...propertyInputs, ...propertyOutputs])],
            state: [...new Set([...component.stateRefs])],
            hooks,
            imports: [...new Set([...component.serviceRefs])],
            templateDraftId,
            templateRawText: primaryTemplate?.rawText,
            templateIr: primaryTemplate?.templateIr,
            templateExternalReferences: [...new Set(matchingTemplates.flatMap((template) => template.externalReferences))],
            forms: matchingForms,
            rxHooks,
            reduxUsage: matchingReduxUsage
                ? {
                    id: matchingReduxUsage.id,
                    ownerComponentId: component.id,
                    selectorRefs: [...matchingReduxUsage.selectedSelectors],
                    actionRefs: [...matchingReduxUsage.dispatchedActions],
                    reviewComments: matchingReduxUsage.reviewRequired ? [`AIDLC_MANUAL_REVIEW_NGRX: Store usage in '${component.name}' needs manual review.`] : [],
                }
                : undefined,
            serviceRefs: [...component.serviceRefs],
            styleUrls: [...component.styleUrls],
            sourceRelativePath: component.sourceRef?.path,
            propertyInitializers: [...component.propertyInitializers],
            methods: [...component.methods],
            reviewItemIds: [],
            generatedRefs: [this.ids.artifactRef(`${component.name}/component.json`, 'component')],
        };
    }
}
//# sourceMappingURL=component-converter.js.map