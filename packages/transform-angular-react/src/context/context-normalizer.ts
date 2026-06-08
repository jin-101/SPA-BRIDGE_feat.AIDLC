import { createDiagnostic, ok, type Diagnostic, type Result } from '@spa-bridge/core-model';
import type { AngularAnalysisResult, FileInventoryRecord, TypeScriptParseSummary } from '@spa-bridge/source-angular';

import type {
  NormalizedComponent,
  NormalizedRoute,
  NormalizedService,
  NormalizedState,
  NormalizedTemplate,
  TransformationContext,
  TransformationError,
  TransformationRequest,
} from '../types.js';
import { StableIdFactory } from '../model/stable-id-factory.js';

type TypeScriptSymbolSummary = TypeScriptParseSummary['symbols'][number];
type DecoratorSummary = TypeScriptSymbolSummary['decorators'][number];
type InventoryRecord = FileInventoryRecord;

const isComponentSymbol = (symbol: TypeScriptSymbolSummary): boolean =>
  symbol.decorators.some((decorator: DecoratorSummary) => decorator.kind === 'Component');

const isServiceSymbol = (symbol: TypeScriptSymbolSummary): boolean =>
  symbol.decorators.some((decorator: DecoratorSummary) => decorator.kind === 'Injectable') || /service/i.test(symbol.name);

const isStateSymbol = (symbol: TypeScriptSymbolSummary): boolean =>
  /store|selector|effect|reducer|state/i.test(symbol.name);

export class ContextNormalizer {
  private readonly ids = new StableIdFactory();

  normalize(request: TransformationRequest): Result<TransformationContext, TransformationError> {
    const analysis = request.analysis;
    const diagnostics: Diagnostic[] = [...analysis.diagnostics];

    const templateByOwner = new Map<string, NormalizedTemplate[]>();
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
        diagnostics: [...template.diagnostics],
      });
      templateByOwner.set(ownerPath, ownerTemplates);
    }

    const components: NormalizedComponent[] = [];
    const services: NormalizedService[] = [];
    const states: NormalizedState[] = [];
    const routes: NormalizedRoute[] = [];
    const templates: NormalizedTemplate[] = [];

    for (const summary of analysis.typeScriptSummaries) {
      const relatedFiles = analysis.inventory.files.filter((file: InventoryRecord) => file.path === summary.sourcePath || file.relativePath.endsWith(summary.sourcePath.split('/').pop() ?? ''));
      const sourceRef = relatedFiles[0] ? { kind: 'source' as const, path: relatedFiles[0].path } : { kind: 'source' as const, path: summary.sourcePath };

      for (const symbol of summary.symbols) {
        if (isComponentSymbol(symbol)) {
          const templateCandidates = templateByOwner.get(summary.sourcePath) ?? [];
          const componentTemplates = templateCandidates.map((template) => template.id);
          components.push({
            id: this.ids.componentId(symbol.name, components.length + 1),
            name: symbol.name,
            sourceRef,
            selector: symbol.decorators.find((decorator: DecoratorSummary) => decorator.kind === 'Component')?.metadata.selector as string | undefined,
            inputs: symbol.decorators.flatMap((decorator: DecoratorSummary) => (Array.isArray(decorator.metadata.inputs) ? decorator.metadata.inputs : ([] as string[]))),
            outputs: symbol.decorators.flatMap((decorator: DecoratorSummary) => (Array.isArray(decorator.metadata.outputs) ? decorator.metadata.outputs : ([] as string[]))),
            lifecycleHooks: [...symbol.lifecycleHooks],
            templateIds: componentTemplates,
            serviceRefs: [...symbol.constructorDependencies],
            stateRefs: [],
            routeRefs: [],
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
            providedIn: typeof symbol.decorators.find((decorator: DecoratorSummary) => decorator.kind === 'Injectable')?.metadata.providedIn === 'string'
              ? (symbol.decorators.find((decorator: DecoratorSummary) => decorator.kind === 'Injectable')?.metadata.providedIn as string)
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

    const normalizedContext: TransformationContext = {
      schemaVersion: 1,
      runId: request.runId,
      correlationId: request.correlationId,
      sourceModelRef: analysis.sourceModelBoundary.sourceModelRef,
      packageRefs: [...analysis.workspaceProfile.packageRefs],
      targetFramework: request.targetFramework,
      targetProjectStrategy: request.targetProjectStrategy,
      stateStrategy: request.stateStrategy,
      enabledRulePacks: [...request.enabledRulePacks],
      projectName: analysis.workspaceProfile.projectName,
      diagnostics,
      components,
      templates,
      services,
      routes,
      states,
      traceLinks: [...analysis.graph.edges].map((edge, index) =>
        ({
          id: this.ids.next('trace', [edge.from, edge.to, edge.kind, index + 1]),
          source: { kind: 'source', path: edge.evidenceRefs[0]?.path ?? analysis.workspaceProfile.projectRoot },
          target: { kind: 'generated', path: `${request.targetProjectStrategy}/drafts/${edge.kind}/${index + 1}.tsx` },
          relation: 'derived-from' as const,
          confidence: edge.confidence,
        }),
      ),
    };

    return ok(normalizedContext);
  }
}
