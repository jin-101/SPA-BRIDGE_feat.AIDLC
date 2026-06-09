import type { Diagnostic, ManualReviewItem, SourceRef, TraceLink } from '@spa-bridge/core-model';

import { err, ok, type Result } from '@spa-bridge/core-model';
import type {
  GeneratedFileSpec,
  NormalizedTargetDraftBundle,
  TargetDependencyManifest,
  TargetGenerationError,
  TargetGenerationRequest,
  TargetGenerationResult,
  TargetGenerationSummary,
  TargetProjectStrategyId,
  TargetStrategyDescriptor,
} from '../types.js';
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

const defaultRegistry = (): TargetStrategyRegistry => {
  const registry = new TargetStrategyRegistry();
  registry.register(createViteReactTypeScriptStrategy());
  registry.register(createReactDefaultStrategy());
  return registry;
};

const makeSourceRef = (request: TargetGenerationRequest): SourceRef =>
  request.sourceModelRef ?? { kind: 'source', path: request.targetRoot };

const collectAllDiagnostics = (normalized: NormalizedTargetDraftBundle, generatedDiagnostics: Diagnostic[]): Diagnostic[] => [
  ...normalized.diagnostics,
  ...generatedDiagnostics,
];

export class TargetGenerationService {
  constructor(
    private readonly registry = defaultRegistry(),
    private readonly validator = new TargetGenerationRequestValidator(),
    private readonly normalizer = new ReactDraftNormalizer(),
    private readonly dependencyBuilder = new DependencyManifestBuilder(),
    private readonly componentMaterializer = new ComponentMaterializer(),
    private readonly serviceMaterializer = new ServiceMaterializer(),
    private readonly routeAdapter = new RoutingOutputAdapter(),
    private readonly stateAdapters = new StateOutputAdapters(),
    private readonly writePlanBuilder = new WritePlanBuilder(),
    private readonly traceBuilder = new TargetTraceBuilder(),
    private readonly traceCoverageValidator = new TraceCoverageValidator(),
    private readonly diagnosticFactory = new TargetDiagnosticFactory(),
    private readonly manualReviewFactory = new TargetManualReviewFactory(),
    private readonly reviewStubGenerator = new ReviewStubGenerator(),
    private readonly privacyGuard = new EcosystemMetadataPrivacyGuard(),
  ) {}

  generate(request: TargetGenerationRequest): Result<TargetGenerationResult, TargetGenerationError> {
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

    const generatedFiles: GeneratedFileSpec[] = [
      ...scaffoldFiles,
      ...this.componentMaterializer.materializeMany(normalizedDrafts.components, sourceRef),
      ...this.serviceMaterializer.materializeMany(normalizedDrafts.services, sourceRef),
      ...this.routeAdapter.materialize(normalizedDrafts.routes, [sourceRef], normalizedDrafts.components),
      ...this.stateAdapters.materialize(normalizedDrafts.state, normalizedDrafts.stateStrategy, [sourceRef]),
    ];

    const manualReviewItems: ManualReviewItem[] = [
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

    const traceLinks: TraceLink[] = [
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

    const summary: TargetGenerationSummary = {
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

  private buildDependencyManifest(strategy: TargetStrategyDescriptor, drafts: NormalizedTargetDraftBundle, request: TargetGenerationRequest): TargetDependencyManifest {
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

  private filterSourceDependencies(dependencies: Record<string, string>): Record<string, string> {
    const blocked = [/^@angular\//, /^@ngrx\//, /^@angular-devkit\//, /^@schematics\//, /^zone\.js$/, /^typescript$/, /^webpack$/];
    return Object.fromEntries(
      Object.entries(dependencies)
        .filter(([name]) => !blocked.some((pattern) => pattern.test(name)))
        .sort(([left], [right]) => left.localeCompare(right)),
    );
  }

  private createManualReviewItems(drafts: NormalizedTargetDraftBundle): ManualReviewItem[] {
    const items: ManualReviewItem[] = [];

    for (const route of drafts.routes) {
      if (route.guardRefs.length > 0 || route.lazyTarget || route.children.length > 0) {
        items.push(
          this.manualReviewFactory.create(
            `route-${route.id}`,
            `Review route mapping for ${route.path}`,
            'Route guards and dynamic paths should be checked manually.',
          ),
        );
      }
    }

    for (const state of drafts.state) {
      if (state.strategy === 'unknown') {
        items.push(
          this.manualReviewFactory.create(
            `state-${state.id}`,
            `Review state mapping for ${state.name}`,
            'State strategy should be selected explicitly for target materialization.',
          ),
        );
      }
    }

    return items;
  }

  private createGeneratedDiagnostics(strategyId: TargetProjectStrategyId, totalFiles: number): Diagnostic[] {
    return [
      this.diagnosticFactory.create(
        'UOW07-TARGET-001',
        'info',
        `Target strategy '${strategyId}' produced ${totalFiles} write-plan files.`,
      ),
    ];
  }
}

export const generateReactTarget = (request: TargetGenerationRequest): Result<TargetGenerationResult, TargetGenerationError> =>
  new TargetGenerationService().generate(request);
