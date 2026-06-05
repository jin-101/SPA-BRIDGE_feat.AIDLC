import { ProviderNeutralMappingRequestBuilder } from '../ai-handoff/provider-neutral-mapping-request-builder.js';
import { SafeReviewDiagnosticBuilder } from '../diagnostics/safe-review-diagnostic-builder.js';
import { StableIdFactory } from '../model/stable-id-factory.js';
const supportedPackages = [
    { name: '@angular/forms', category: 'template', hint: 'Preserve form bindings and validation intent explicitly.' },
    { name: '@angular/router', category: 'route', hint: 'Preserve route guards, lazy targets, and redirects explicitly.' },
    { name: '@ngrx/store', category: 'state', hint: 'Map store slices to state strategy artifacts.' },
    { name: '@ngrx/effects', category: 'state', hint: 'Preserve side-effect flows as reviewable state actions.' },
    { name: '@ngrx/entity', category: 'state', hint: 'Keep entity normalization evidence for downstream drafting.' },
    { name: '@ngrx/router-store', category: 'route', hint: 'Preserve router synchronization semantics explicitly.' },
    { name: '@ngx-translate/core', category: 'template', hint: 'Keep translation keys and fallback behavior reviewable.' },
    { name: 'mapbox-gl', category: 'unknown', hint: 'Manual review is required for map rendering and plugin behavior.' },
    { name: 'ngx-mapbox-gl', category: 'unknown', hint: 'Manual review is required for Angular Mapbox bindings.' },
    { name: 'ngx-lottie', category: 'template', hint: 'Preserve animation timing and asset references explicitly.' },
    { name: 'lottie-web', category: 'template', hint: 'Preserve animation timing and asset references explicitly.' },
    { name: 'html2canvas', category: 'unknown', hint: 'Rendering capture logic should be preserved manually.' },
    { name: 'html-to-image', category: 'unknown', hint: 'Rendering capture logic should be preserved manually.' },
    { name: 'bwip-js', category: 'unknown', hint: 'Barcode rendering should be preserved manually.' },
    { name: 'angularx-qrcode', category: 'unknown', hint: 'QR rendering should be preserved manually.' },
    { name: 'ngx-swiper-wrapper', category: 'unknown', hint: 'Slider/carousel behavior should be preserved manually.' },
    { name: 'focus-trap', category: 'unknown', hint: 'Accessibility/focus behavior should be preserved manually.' },
    { name: '@turf/along', category: 'unknown', hint: 'Geospatial helpers should be reviewed manually.' },
    { name: '@turf/bearing', category: 'unknown', hint: 'Geospatial helpers should be reviewed manually.' },
    { name: '@turf/helpers', category: 'unknown', hint: 'Geospatial helpers should be reviewed manually.' },
    { name: '@turf/line-distance', category: 'unknown', hint: 'Geospatial helpers should be reviewed manually.' },
];
export const createAngularEcosystemRules = () => {
    const ids = new StableIdFactory();
    const reviewBuilder = new SafeReviewDiagnosticBuilder();
    const mappingBuilder = new ProviderNeutralMappingRequestBuilder();
    const rules = [
        {
            ruleId: 'angular-ecosystem-review',
            displayName: 'Angular Ecosystem Review',
            phase: 'finalize',
            priority: 90,
            appliesTo: ['component', 'template', 'service', 'route', 'state'],
            transform: (context) => {
                const diagnostics = [];
                const reviewItems = [];
                const mappingRequests = [];
                for (const packageRef of context.packageRefs) {
                    const match = supportedPackages.find((candidate) => packageRef === candidate.name);
                    if (!match) {
                        continue;
                    }
                    const review = reviewBuilder.build({
                        category: match.category,
                        ruleId: 'angular-ecosystem-review',
                        message: `Package '${packageRef}' is present in the source workspace and should be preserved with a target-specific adapter or manual review.`,
                        sourcePaths: [context.sourceModelRef.projectPath],
                        generatedPaths: undefined,
                        remediationHint: match.hint,
                    });
                    diagnostics.push(review.diagnostic);
                    reviewItems.push(review.reviewItem);
                    mappingRequests.push(mappingBuilder.build(match.category, [{ kind: 'source', path: context.sourceModelRef.projectPath }], [ids.artifactRef(`${context.projectName}/${packageRef.replace(/[@/]/g, '-')}.json`, packageRef)], ['angular-ecosystem-review'], [review.diagnostic.code], {
                        packageRef,
                        category: match.category,
                    }));
                }
                return { diagnostics, reviewItems, mappingRequests };
            },
        },
    ];
    return rules;
};
//# sourceMappingURL=angular-ecosystem-rules.js.map