import { StableIdFactory } from '../model/stable-id-factory.js';
import { SafeReviewDiagnosticBuilder } from '../diagnostics/safe-review-diagnostic-builder.js';
import { ProviderNeutralMappingRequestBuilder } from '../ai-handoff/provider-neutral-mapping-request-builder.js';
const featureFrom = (name) => name
    .replace(/Reducer$/i, '')
    .replace(/^select/i, '')
    .replace(/[^A-Za-z0-9]+/g, '')
    .replace(/^./, (char) => char.toLowerCase()) || 'feature';
export class StateStrategyConverter {
    ids;
    reviewBuilder;
    mappingBuilder;
    constructor(ids = new StableIdFactory(), reviewBuilder = new SafeReviewDiagnosticBuilder(), mappingBuilder = new ProviderNeutralMappingRequestBuilder()) {
        this.ids = ids;
        this.reviewBuilder = reviewBuilder;
        this.mappingBuilder = mappingBuilder;
    }
    convert(context) {
        const mappingRequests = [];
        const featureNames = new Set([
            ...context.ngrxReducers.map((reducer) => reducer.featureName),
            ...context.ngrxSelectors.map((selector) => selector.featureName ?? featureFrom(selector.name)),
            ...context.ngrxActions.map((action) => featureFrom(action.name)),
            ...context.ngrxEffects.map((effect) => featureFrom(effect.name)),
            ...context.ngrxEntityAdapters.map((adapter) => featureFrom(adapter.name)),
        ]);
        const reduxToolkitDrafts = [...featureNames].sort((left, right) => left.localeCompare(right)).map((featureName, index) => {
            const reducers = context.ngrxReducers.filter((reducer) => reducer.featureName === featureName);
            const selectors = context.ngrxSelectors.filter((selector) => (selector.featureName ?? featureFrom(selector.name)) === featureName || selector.dependencies.some((dependency) => dependency.toLowerCase().includes(featureName.toLowerCase())));
            const actions = context.ngrxActions.filter((action) => reducers.some((reducer) => reducer.handlers.some((handler) => handler.actionNames.some((name) => name.includes(action.name)))) || action.name.toLowerCase().includes(featureName.toLowerCase()));
            const effects = context.ngrxEffects.filter((effect) => effect.name.toLowerCase().includes(featureName.toLowerCase()) || effect.ofTypeActions.some((action) => actions.some((knownAction) => action.includes(knownAction.name))));
            const entityAdapters = context.ngrxEntityAdapters.filter((adapter) => adapter.name.toLowerCase().includes(featureName.toLowerCase()) || adapter.helperRefs.some((helper) => selectors.some((selector) => selector.name.includes(helper))));
            const reviewComments = [
                ...reducers.flatMap((reducer) => reducer.handlers.filter((handler) => handler.reviewRequired).map((handler) => `AIDLC_MANUAL_REVIEW_NGRX: reducer handler '${handler.id}' needs parity review.`)),
                ...selectors.filter((selector) => selector.reviewRequired).map((selector) => `AIDLC_MANUAL_REVIEW_NGRX: selector '${selector.name}' needs projector review.`),
                ...effects.filter((effect) => effect.safety !== 'safe').map((effect) => `AIDLC_MANUAL_REVIEW_NGRX: effect '${effect.name}' uses ${effect.operatorIntents.join(', ') || 'unknown'} operators and needs review.`),
                ...entityAdapters.filter((adapter) => adapter.reviewRequired).map((adapter) => `AIDLC_MANUAL_REVIEW_NGRX: entity adapter '${adapter.name}' has custom selectId/sortComparer.`),
                ...(context.hasNgrxRouterStore ? ['AIDLC_MANUAL_REVIEW_NGRX: router-store coupling must be checked against React Router state.'] : []),
            ];
            return {
                id: this.ids.next('redux', [featureName, index + 1]),
                featureName,
                actions,
                reducer: reducers[0],
                selectors,
                effects,
                entityAdapters,
                componentUsages: context.ngrxComponentUsages,
                hasRouterStore: context.hasNgrxRouterStore,
                reviewComments,
            };
        });
        const stateDrafts = context.states.map((state) => {
            const reviewItems = [];
            if (state.strategy === 'unknown') {
                const review = this.reviewBuilder.build({
                    category: 'state',
                    ruleId: 'state-unknown',
                    message: `State artifact '${state.name}' requires a target strategy decision.`,
                    sourcePaths: state.sourceRef ? [state.sourceRef.path] : undefined,
                    generatedPaths: undefined,
                    remediationHint: 'Preserve state evidence and defer the implementation choice to the target strategy.',
                });
                reviewItems.push(review.reviewItem.id);
                mappingRequests.push(this.mappingBuilder.build('state', state.sourceRef ? [state.sourceRef] : [], [this.ids.artifactRef(`${state.name}/state.json`, 'state')], ['state-unknown'], [review.diagnostic.code], {
                    state: state.name,
                    strategy: 'unknown',
                }));
            }
            return {
                id: state.id,
                name: state.name,
                sourceRef: state.sourceRef,
                strategy: context.ngrxReducers.length > 0 || context.ngrxComponentUsages.length > 0 ? 'store' : state.strategy,
                storeRefs: [...state.dependencies],
                actions: context.ngrxActions.map((action) => action.name),
                selectors: context.ngrxSelectors.map((selector) => selector.name),
                effects: context.ngrxEffects.map((effect) => effect.name),
                reduxToolkit: reduxToolkitDrafts.find((draft) => draft.featureName === featureFrom(state.name)),
                reviewItemIds: reviewItems,
                generatedRefs: [this.ids.artifactRef(`${state.name}/state.json`, 'state')],
            };
        });
        return { stateDrafts, reduxToolkitDrafts, mappingRequests };
    }
}
//# sourceMappingURL=state-strategy-converter.js.map