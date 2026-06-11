import type { Diagnostic, ManualReviewItem, SourceRef, TraceLink } from '@spa-bridge/core-model';

import { err, ok, type Result } from '@spa-bridge/core-model';
import type {
  GeneratedFileSpec,
  NormalizedTargetDraftBundle,
  TargetDependencyManifest,
  DependencyCompatibilityDecision,
  DependencyCompatibilityReport,
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
import { FormRuntimeMaterializer } from '../materializers/form-runtime-materializer.js';
import { RxjsRuntimeMaterializer } from '../materializers/rxjs-runtime-materializer.js';
import { ReduxToolkitMaterializer } from '../materializers/redux-toolkit-materializer.js';
import { ServiceMaterializer } from '../materializers/service-materializer.js';
import { RoutingOutputAdapter } from '../routing/routing-output-adapter.js';
import { StateOutputAdapters } from '../state/state-output-adapters.js';
import { WritePlanBuilder } from '../write-plan/write-plan-builder.js';
import { TargetTraceBuilder } from '../traceability/target-trace-builder.js';
import { TraceCoverageValidator } from '../traceability/trace-coverage-validator.js';
import { DependencyManifestBuilder } from '../dependencies/dependency-manifest-builder.js';
import { DependencyCompatibilityClassifier } from '../dependencies/dependency-compatibility-classifier.js';
import { DependencyCompatibilityReportMaterializer } from '../dependencies/dependency-compatibility-report-materializer.js';
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
    private readonly formRuntimeMaterializer = new FormRuntimeMaterializer(),
    private readonly rxjsRuntimeMaterializer = new RxjsRuntimeMaterializer(),
    private readonly reduxToolkitMaterializer = new ReduxToolkitMaterializer(),
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
    private readonly dependencyClassifier = new DependencyCompatibilityClassifier(),
    private readonly dependencyReportMaterializer = new DependencyCompatibilityReportMaterializer(),
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
    const dependencyCompatibilityReport = dependencyManifest.compatibilityReport ?? {
      schemaVersion: 1,
      decisions: [],
      usageFindings: [],
      summary: { carried: 0, replaced: 0, removed: 0, review: 0, total: 0 },
    };

    const scaffoldFiles = strategy.createScaffoldFiles({
      request: requestValidation.value,
      normalizedDrafts,
      dependencyManifest,
    });

    const generatedFiles: GeneratedFileSpec[] = [
      ...scaffoldFiles,
      ...this.formRuntimeMaterializer.materialize(normalizedDrafts.components.some((component) => component.forms.length > 0)),
      ...this.rxjsRuntimeMaterializer.materialize(normalizedDrafts.components.some((component) => component.rxHooks.length > 0)),
      ...this.reduxToolkitMaterializer.materialize(normalizedDrafts.reduxToolkit, [sourceRef]),
      ...this.componentMaterializer.materializeMany(normalizedDrafts.components, sourceRef),
      ...this.serviceMaterializer.materializeMany(normalizedDrafts.services, sourceRef),
      ...this.routeAdapter.materialize(normalizedDrafts.routes, [sourceRef], normalizedDrafts.components),
      ...this.stateAdapters.materialize(normalizedDrafts.state, normalizedDrafts.stateStrategy, [sourceRef]),
    ];

    const manualReviewItems: ManualReviewItem[] = [
      ...normalizedDrafts.manualReviewItems,
      ...this.createManualReviewItems(normalizedDrafts, dependencyCompatibilityReport),
    ];

    const reviewStubs = this.reviewStubGenerator.build(manualReviewItems);
    const dependencyCompatibilityFile = this.dependencyReportMaterializer.materialize(dependencyCompatibilityReport);
    const ecosystemMetadata = this.privacyGuard.sanitize(targetEcosystemMetadataCatalog);
    const metadataFile = createFileSpec({
      path: 'src/metadata/ecosystem-metadata.json',
      kind: 'metadata',
      content: JSON.stringify(ecosystemMetadata, null, 2) + '\n',
      overwrite: true,
      status: 'metadata',
    });

    const allFiles = [...generatedFiles, ...reviewStubs, dependencyCompatibilityFile, metadataFile];
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
      dependencyCompatibilityReport,
      scaffoldFiles,
    });
  }

  private buildDependencyManifest(strategy: TargetStrategyDescriptor, drafts: NormalizedTargetDraftBundle, request: TargetGenerationRequest): TargetDependencyManifest {
    const manifest = this.dependencyBuilder.build(drafts.stateStrategy, true, drafts.reduxToolkit.length > 0);
    const dependencyClassification = this.dependencyClassifier.classify(request.sourceDependencies ?? {});
    const devDependencyClassification = this.dependencyClassifier.classify(request.sourceDevDependencies ?? {});
    const sourceDependencies = this.dependencyClassifier.toDependencyRecord(dependencyClassification.decisions);
    const sourceDevDependencies = this.dependencyClassifier.toDependencyRecord(devDependencyClassification.decisions);
    const compatibilityReport = this.withUsageFindings(
      this.dependencyClassifier.combineReports(dependencyClassification.report, devDependencyClassification.report),
      makeSourceRef(request),
    );

    return {
      dependencies: { ...sourceDependencies, ...strategy.exactDependencies, ...manifest.dependencies },
      devDependencies: { ...sourceDevDependencies, ...manifest.devDependencies },
      rationale: {
        ...Object.fromEntries(
          compatibilityReport.decisions
            .filter((decision) => decision.decision === 'carry' || decision.decision === 'replace')
            .map((decision) => [decision.targetPackageName ?? decision.packageName, decision.rationale]),
        ),
        ...manifest.rationale,
      },
      compatibilityReport,
    };
  }

  private withUsageFindings(report: DependencyCompatibilityReport, sourceRef: SourceRef): DependencyCompatibilityReport {
    const usageFindings = report.decisions
      .filter((decision) => decision.usageSiteReviewRequired || decision.decision === 'replace' || decision.decision === 'review')
      .map((decision) => ({
        sourcePackage: decision.packageName,
        targetPackage: decision.targetPackageName,
        sourceRef,
        usageKind: 'dependency' as const,
        message:
          decision.decision === 'replace'
            ? `${decision.packageName} was replaced with ${decision.targetPackageName}; imports, props, events, and custom element usage require review.`
            : `${decision.packageName} was excluded from the target manifest and requires an explicit React-compatible replacement if used by generated code.`,
        suggestedCodeChange:
          decision.packageName === '@wds/wc-angular-lib'
            ? "Replace package imports with '@wds/wc-react-lib' only after confirming component props/events API compatibility."
            : undefined,
        manualReviewRequired: true,
      }))
      .sort((left, right) => left.sourcePackage.localeCompare(right.sourcePackage));

    return {
      ...report,
      usageFindings,
    };
  }

  private createManualReviewItems(drafts: NormalizedTargetDraftBundle, dependencyReport: DependencyCompatibilityReport): ManualReviewItem[] {
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

    for (const decision of dependencyReport.decisions.filter((candidate) => candidate.usageSiteReviewRequired || candidate.decision === 'review')) {
      items.push(
        this.manualReviewFactory.create(
          `dependency-${decision.packageName.replace(/[^A-Za-z0-9_-]/g, '-')}`,
          `Review dependency compatibility for ${decision.packageName}`,
          decision.targetPackageName
            ? `${decision.packageName} is replaced with ${decision.targetPackageName}; verify usage-site imports, props, events, and runtime behavior.`
            : `${decision.packageName} is not installed automatically; choose a React-compatible replacement if generated code requires it.`,
        ),
      );
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
