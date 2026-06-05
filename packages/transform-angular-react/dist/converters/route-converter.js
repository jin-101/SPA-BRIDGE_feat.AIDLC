import { StableIdFactory } from '../model/stable-id-factory.js';
import { SafeReviewDiagnosticBuilder } from '../diagnostics/safe-review-diagnostic-builder.js';
import { ProviderNeutralMappingRequestBuilder } from '../ai-handoff/provider-neutral-mapping-request-builder.js';
export class RouteConverter {
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
        const routeDrafts = context.routes.map((route) => {
            const reviewItems = [];
            if (route.isDynamic || route.guardRefs.length > 0) {
                const review = this.reviewBuilder.build({
                    category: 'route',
                    ruleId: 'route-dynamic',
                    message: `Route '${route.path}' requires manual review.`,
                    sourcePaths: route.sourceRef ? [route.sourceRef.path] : undefined,
                    generatedPaths: undefined,
                    remediationHint: 'Preserve guards, redirects, and lazy targets explicitly.',
                });
                reviewItems.push(review.reviewItem.id);
                mappingRequests.push(this.mappingBuilder.build('route', route.sourceRef ? [route.sourceRef] : [], [this.ids.artifactRef(`${route.path || 'dynamic'}/route.json`, 'route')], ['route-dynamic'], [review.diagnostic.code], {
                    routePath: route.path,
                    dynamic: route.isDynamic,
                }));
            }
            return {
                id: route.id,
                path: route.path,
                sourceRef: route.sourceRef,
                elementRef: route.component,
                children: [...route.childPaths],
                guardRefs: [...route.guardRefs],
                lazyTarget: route.lazyTarget,
                reviewItemIds: reviewItems,
                generatedRefs: [this.ids.artifactRef(`${route.path || 'dynamic'}/route.json`, 'route')],
            };
        });
        return { routeDrafts, mappingRequests };
    }
}
//# sourceMappingURL=route-converter.js.map