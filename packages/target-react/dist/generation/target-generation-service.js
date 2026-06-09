import { err, ok } from '@spa-bridge/core-model';
import { TargetGenerationRequestValidator } from '../validation/target-generation-request-validator.js';
import { TargetStrategyRegistry } from '../strategy/target-strategy-registry.js';
import { selectTargetStrategy } from '../strategy/target-strategy-selection-policy.js';
import { createReactDefaultStrategy, createViteReactTypeScriptStrategy } from '../strategies/vite-react-typescript.js';
import { ReactDraftNormalizer } from '../drafts/react-draft-normalizer.js';
import { ComponentMaterializer } from '../materializers/component-materializer.js';
import { ServiceMaterializer } from '../materializers/service-materializer.js';
import { RoutingOutputAdapter } from '../routing/routing-output-adapter.js';
import { StateOutputAdapters } from '../state/state-output-adapters.js';
import { WritePlanBuilder } from '../write-plan/write-plan-builder.js';
import { TargetTraceBuilder } from '../traceability/target-trace-builder.js';
import { TraceCoverageValidator } from '../traceability/trace-coverage-validator.js';
import { DependencyManifestBuilder } from '../dependencies/dependency-manifest-builder.js';
import { TargetDiagnosticFactory } from '../diagnostics/target-diagnostic-factory.js';
import { TargetManualReviewFactory } from '../review/target-manual-review-factory.js';
import { ReviewStubGenerator } from '../review/review-stub-generator.js';
import { targetEcosystemMetadataCatalog } from '../metadata/target-ecosystem-metadata-catalog.js';
import { EcosystemMetadataPrivacyGuard } from '../metadata/ecosystem-metadata-privacy-guard.js';
import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
const defaultRegistry = () => {
    const registry = new TargetStrategyRegistry();
    registry.register(createViteReactTypeScriptStrategy());
    registry.register(createReactDefaultStrategy());
    return registry;
};
const makeSourceRef = (request) => request.sourceModelRef ?? { kind: 'source', path: request.targetRoot };
const collectAllDiagnostics = (normalized, generatedDiagnostics) => [
    ...normalized.diagnostics,
    ...generatedDiagnostics,
];
export class TargetGenerationService {
    registry;
    validator;
    normalizer;
    dependencyBuilder;
    componentMaterializer;
    serviceMaterializer;
    routeAdapter;
    stateAdapters;
    writePlanBuilder;
    traceBuilder;
    traceCoverageValidator;
    diagnosticFactory;
    manualReviewFactory;
    reviewStubGenerator;
    privacyGuard;
    constructor(registry = defaultRegistry(), validator = new TargetGenerationRequestValidator(), normalizer = new ReactDraftNormalizer(), dependencyBuilder = new DependencyManifestBuilder(), componentMaterializer = new ComponentMaterializer(), serviceMaterializer = new ServiceMaterializer(), routeAdapter = new RoutingOutputAdapter(), stateAdapters = new StateOutputAdapters(), writePlanBuilder = new WritePlanBuilder(), traceBuilder = new TargetTraceBuilder(), traceCoverageValidator = new TraceCoverageValidator(), diagnosticFactory = new TargetDiagnosticFactory(), manualReviewFactory = new TargetManualReviewFactory(), reviewStubGenerator = new ReviewStubGenerator(), privacyGuard = new EcosystemMetadataPrivacyGuard()) {
        this.registry = registry;
        this.validator = validator;
        this.normalizer = normalizer;
        this.dependencyBuilder = dependencyBuilder;
        this.componentMaterializer = componentMaterializer;
        this.serviceMaterializer = serviceMaterializer;
        this.routeAdapter = routeAdapter;
        this.stateAdapters = stateAdapters;
        this.writePlanBuilder = writePlanBuilder;
        this.traceBuilder = traceBuilder;
        this.traceCoverageValidator = traceCoverageValidator;
        this.diagnosticFactory = diagnosticFactory;
        this.manualReviewFactory = manualReviewFactory;
        this.reviewStubGenerator = reviewStubGenerator;
        this.privacyGuard = privacyGuard;
    }
    generate(request) {
        const requestValidation = this.validator.validate(request);
        if (!requestValidation.ok) {
            return err(requestValidation.error);
        }
        const strategy = selectTargetStrategy(requestValidation.value, this.registry);
        const normalizedDrafts = this.normalizer.normalize(requestValidation.value);
        const sourceRef = makeSourceRef(requestValidation.value);
        const dependencyManifest = this.buildDependencyManifest(strategy, normalizedDrafts, requestValidation.value);
        const scaffoldFiles = strategy.createScaffoldFiles({
            request: requestValidation.value,
            normalizedDrafts,
            dependencyManifest,
        });
        const generatedFiles = [
            ...scaffoldFiles,
            ...this.componentMaterializer.materializeMany(normalizedDrafts.components, sourceRef),
            ...this.serviceMaterializer.materializeMany(normalizedDrafts.services, sourceRef),
            ...this.routeAdapter.materialize(normalizedDrafts.routes, [sourceRef], normalizedDrafts.components),
            ...this.stateAdapters.materialize(normalizedDrafts.state, normalizedDrafts.stateStrategy, [sourceRef]),
        ];
        const manualReviewItems = [
            ...normalizedDrafts.manualReviewItems,
            ...this.createManualReviewItems(normalizedDrafts),
        ];
        const reviewStubs = this.reviewStubGenerator.build(manualReviewItems);
        const ecosystemMetadata = this.privacyGuard.sanitize(targetEcosystemMetadataCatalog);
        const metadataFile = createFileSpec({
            path: 'src/metadata/ecosystem-metadata.json',
            kind: 'metadata',
            content: JSON.stringify(ecosystemMetadata, null, 2) + '\n',
            overwrite: true,
            status: 'metadata',
        });
        const allFiles = [...generatedFiles, ...reviewStubs, metadataFile];
        const writePlanResult = this.writePlanBuilder.build({
            runId: requestValidation.value.runId,
            correlationId: requestValidation.value.correlationId,
            targetRoot: requestValidation.value.targetRoot,
            projectName: normalizedDrafts.projectName,
            strategyId: strategy.id,
            overwritePolicy: requestValidation.value.overwritePolicy,
            files: allFiles,
            dependencyManifest,
            existingPaths: requestValidation.value.existingPaths,
        });
        if (!writePlanResult.ok) {
            return err(writePlanResult.error);
        }
        const traceLinks = [
            ...normalizedDrafts.traces,
            ...writePlanResult.value.files.map((file) => this.traceBuilder.build(sourceRef, file.path)),
        ];
        const traceValidation = this.traceCoverageValidator.validate(writePlanResult.value.files, traceLinks);
        if (!traceValidation.ok) {
            return err(traceValidation.error);
        }
        const diagnostics = collectAllDiagnostics(normalizedDrafts, [
            ...this.createGeneratedDiagnostics(strategy.id, writePlanResult.value.files.length),
        ]);
        const summary = {
            projectName: normalizedDrafts.projectName,
            strategyId: strategy.id,
            totalFiles: writePlanResult.value.files.length,
            totalComponents: normalizedDrafts.components.length,
            totalTemplates: normalizedDrafts.templates.length,
            totalServices: normalizedDrafts.services.length,
            totalRoutes: normalizedDrafts.routes.length,
            totalState: normalizedDrafts.state.length,
            totalReviewItems: manualReviewItems.length,
            totalDiagnostics: diagnostics.length,
            totalTraces: traceLinks.length,
            totalAliases: normalizedDrafts.aliasModel.summary.totalAliases,
            totalGeneratedAliases: normalizedDrafts.aliasModel.paths.filter((mapping) => mapping.status === 'supported').length,
            unresolvedAliases: normalizedDrafts.aliasModel.summary.unresolvedAliases,
        };
        return ok({
            status: manualReviewItems.length > 0 ? 'partial' : 'success',
            request: requestValidation.value,
            normalizedDrafts,
            writePlan: writePlanResult.value,
            summary,
            diagnostics,
            manualReviewItems,
            traces: traceLinks,
            dependencyManifest,
            scaffoldFiles,
        });
    }
    buildDependencyManifest(strategy, drafts, request) {
        const manifest = this.dependencyBuilder.build(drafts.stateStrategy, true);
        const sourceDependencies = this.filterSourceDependencies(request.sourceDependencies ?? {});
        const sourceDevDependencies = this.filterSourceDependencies(request.sourceDevDependencies ?? {});
        return {
            dependencies: { ...sourceDependencies, ...strategy.exactDependencies, ...manifest.dependencies },
            devDependencies: { ...sourceDevDependencies, ...manifest.devDependencies },
            rationale: {
                ...Object.fromEntries(Object.keys(sourceDependencies).map((name) => [name, 'Carried over from the Angular source package because generated React code may still reference this runtime library.'])),
                ...Object.fromEntries(Object.keys(sourceDevDependencies).map((name) => [name, 'Carried over from the Angular source package devDependencies when it is not Angular-specific.'])),
                ...manifest.rationale,
            },
        };
    }
    filterSourceDependencies(dependencies) {
        const blocked = [/^@angular\//, /^@ngrx\//, /^@angular-devkit\//, /^@schematics\//, /^zone\.js$/, /^typescript$/, /^webpack$/];
        return Object.fromEntries(Object.entries(dependencies)
            .filter(([name]) => !blocked.some((pattern) => pattern.test(name)))
            .sort(([left], [right]) => left.localeCompare(right)));
    }
    createManualReviewItems(drafts) {
        const items = [];
        for (const route of drafts.routes) {
            if (route.guardRefs.length > 0 || route.lazyTarget || route.children.length > 0) {
                items.push(this.manualReviewFactory.create(`route-${route.id}`, `Review route mapping for ${route.path}`, 'Route guards and dynamic paths should be checked manually.'));
            }
        }
        for (const state of drafts.state) {
            if (state.strategy === 'unknown') {
                items.push(this.manualReviewFactory.create(`state-${state.id}`, `Review state mapping for ${state.name}`, 'State strategy should be selected explicitly for target materialization.'));
            }
        }
        return items;
    }
    createGeneratedDiagnostics(strategyId, totalFiles) {
        return [
            this.diagnosticFactory.create('UOW07-TARGET-001', 'info', `Target strategy '${strategyId}' produced ${totalFiles} write-plan files.`),
        ];
    }
}
export const generateReactTarget = (request) => new TargetGenerationService().generate(request);
//# sourceMappingURL=target-generation-service.js.map