import path from 'node:path';

import type {
  AngularAnalysisResult,
  AngularDependencyGraph,
  AngularWorkspaceProfile,
  AnalysisArtifactRefs,
  FileInventoryRecord,
  GraphEdge,
  GraphNode,
  RouteSummary,
  TemplateParseSummary,
  TypeScriptParseSummary,
} from '@spa-bridge/source-angular';
import type { Diagnostic, GeneratedArtifactRef } from '@spa-bridge/core-model';

type BenchmarkFixtureOptions = {
  componentCount?: number;
  includeUnsupportedTemplate?: boolean;
};

const createGeneratedRef = (baseDir: string, filename: string): GeneratedArtifactRef => ({
  kind: 'generated',
  path: path.join(baseDir, filename),
});

const createFileRecord = (
  id: string,
  filePath: string,
  relativePath: string,
  role: FileInventoryRecord['role'],
  kind: FileInventoryRecord['kind'],
): FileInventoryRecord => ({
  id,
  path: filePath,
  relativePath,
  role,
  kind,
  evidence: [relativePath],
  relatedPaths: [],
  parseStatus: 'parsed',
});

const createComponentSummary = (
  componentName: string,
  sourcePath: string,
  serviceName: string,
  templatePath: string,
  stylePath: string,
): TypeScriptParseSummary => ({
  sourcePath,
  symbols: [
    {
      id: `symbol:${componentName}`,
      path: sourcePath,
      name: componentName,
      symbolKind: 'class',
      decorators: [
        {
          kind: 'Component',
          metadata: {
            selector: `app-${componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`,
            templateUrl: path.basename(templatePath),
            styleUrls: [path.basename(stylePath)],
            inputs: ['title'],
            outputs: ['closed'],
          },
          rawMetadataKeys: ['selector', 'templateUrl', 'styleUrls', 'inputs', 'outputs'],
        },
      ],
      members: ['title', 'closed'],
      imports: ['@angular/core'],
      exports: [],
      constructorDependencies: [serviceName],
      lifecycleHooks: ['ngOnInit', 'ngOnDestroy'],
      references: [serviceName, templatePath, stylePath],
      propertyInitializers: [
        {
          name: 'title',
          initializer: "'Demo'",
          readonly: false,
        },
      ],
      methods: [
        {
          name: 'ngOnInit',
          parameters: [],
          bodyText: 'this.title = this.service.loadTitle();',
          isAsync: false,
        },
      ],
    },
  ],
  diagnostics: [],
  hasParseErrors: false,
});

const createServiceSummary = (serviceName: string, sourcePath: string): TypeScriptParseSummary => ({
  sourcePath,
  symbols: [
    {
      id: `symbol:${serviceName}`,
      path: sourcePath,
      name: serviceName,
      symbolKind: 'class',
      decorators: [
        {
          kind: 'Injectable',
          metadata: {
            providedIn: 'root',
          },
          rawMetadataKeys: ['providedIn'],
        },
      ],
      members: ['value'],
      imports: ['@angular/core'],
      exports: [],
      constructorDependencies: [],
      lifecycleHooks: [],
      references: [],
      propertyInitializers: [],
      methods: [],
    },
  ],
  diagnostics: [],
  hasParseErrors: false,
});

const createStateSummary = (stateName: string, sourcePath: string): TypeScriptParseSummary => ({
  sourcePath,
  symbols: [
    {
      id: `symbol:${stateName}`,
      path: sourcePath,
      name: stateName,
      symbolKind: 'class',
      decorators: [],
      members: ['items'],
      imports: [],
      exports: [],
      constructorDependencies: [],
      lifecycleHooks: [],
      references: [],
      propertyInitializers: [],
      methods: [],
    },
  ],
  diagnostics: [],
  hasParseErrors: false,
});

export const createBenchmarkAngularAnalysisFixture = (options: BenchmarkFixtureOptions = {}): AngularAnalysisResult => {
  const componentCount = Math.max(1, options.componentCount ?? 1);
  const projectRoot = '/workspace/spa-bridge';
  const sourceRoot = path.join(projectRoot, 'src');
  const outputDir = path.join(projectRoot, '.spa-bridge', 'analysis');
  const workspaceProfile: AngularWorkspaceProfile = {
    schemaVersion: 1,
    projectKind: 'application',
    projectName: 'spa-bridge-demo',
    projectRoot,
    sourceRoot,
    entryFiles: [path.join(sourceRoot, 'main.ts')],
    configFiles: [path.join(projectRoot, 'angular.json'), path.join(projectRoot, 'package.json')],
    packageRefs: [
      '@angular/animations',
      '@angular/cdk',
      '@angular/common',
      '@angular/compiler',
      '@angular/core',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/router',
      '@angular/service-worker',
      '@ngrx/effects',
      '@ngrx/entity',
      '@ngrx/router-store',
      '@ngrx/store',
      '@ngrx/store-devtools',
      '@ngx-translate/core',
      '@turf/along',
      '@turf/bearing',
      '@turf/helpers',
      '@turf/line-distance',
      '@types/geojson',
      '@types/mapbox-gl',
      '@zumer/snapdom',
      'angularx-qrcode',
      'bwip-js',
      'animejs',
      'browser-image-compression',
      'copyfiles',
      'cross-var',
      'dayjs',
      'decode-uri-component-charset',
      'deepmerge',
      'fflate',
      'focus-trap',
      'gsap',
      'html-to-image',
      'html2canvas',
      'js-cookie',
      'jsbarcode',
      'localstorage-ttl',
      'lottie-web',
      'mapbox-gl',
      'ngrx-store-localstorage',
      'ngx-cookie-service',
      'ngx-lottie',
      'ngx-mapbox-gl',
      'ngx-swiper-wrapper',
      'react',
      'react-dom',
      'rxjs',
      'spltjs',
      'tslib',
      'uuid',
      'webpack',
      'webpack-bundle-analyzer',
      'zone.js',
      'zoom-level',
    ],
  };

  const fileRecords: FileInventoryRecord[] = [
    createFileRecord('file-main', path.join(sourceRoot, 'main.ts'), 'src/main.ts', 'config', 'typescript'),
  ];

  const typeScriptSummaries: TypeScriptParseSummary[] = [];
  const templateSummaries: TemplateParseSummary[] = [];
  const routeSummaries: RouteSummary[] = [
    {
      id: 'route-root',
      sourcePath: path.join(sourceRoot, 'app.routes.ts'),
      path: '/',
      component: 'AppComponent',
      lazyLoadTarget: undefined,
      guardRefs: [],
      resolverRefs: [],
      childPaths: ['/dashboard'],
      parameterNames: [],
      isDynamic: false,
    },
  ];
  const diagnostics: Diagnostic[] = [];
  const nodes: GraphNode[] = [
    {
      id: 'node-project',
      kind: 'project',
      label: workspaceProfile.projectName,
      sourceRef: {
        kind: 'source',
        path: projectRoot,
      },
    },
  ];
  const edges: GraphEdge[] = [];

  for (let index = 0; index < componentCount; index += 1) {
    const suffix = index === 0 ? '' : `${index + 1}`;
    const componentName = index === 0 ? 'AppComponent' : `FeatureComponent${index + 1}`;
    const serviceName = index === 0 ? 'AppService' : `FeatureService${index + 1}`;
    const stateName = index === 0 ? 'AppStateStore' : `FeatureStateStore${index + 1}`;
    const componentSourcePath = path.join(sourceRoot, 'app', `${componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}.ts`);
    const templatePath = path.join(sourceRoot, 'app', `${componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}.html`);
    const stylePath = path.join(sourceRoot, 'app', `${componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}.css`);
    const serviceSourcePath = path.join(sourceRoot, 'app', `${serviceName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}.ts`);
    const stateSourcePath = path.join(sourceRoot, 'app', `${stateName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}.ts`);

    fileRecords.push(
      createFileRecord(`file-component-${index + 1}`, componentSourcePath, `src/app/${path.basename(componentSourcePath)}`, 'component', 'typescript'),
      createFileRecord(`file-template-${index + 1}`, templatePath, `src/app/${path.basename(templatePath)}`, 'template', 'template'),
      createFileRecord(`file-style-${index + 1}`, stylePath, `src/app/${path.basename(stylePath)}`, 'style', 'style'),
      createFileRecord(`file-service-${index + 1}`, serviceSourcePath, `src/app/${path.basename(serviceSourcePath)}`, 'service', 'typescript'),
      createFileRecord(`file-state-${index + 1}`, stateSourcePath, `src/app/${path.basename(stateSourcePath)}`, 'state', 'typescript'),
    );

    typeScriptSummaries.push(createComponentSummary(componentName, componentSourcePath, serviceName, templatePath, stylePath));
    typeScriptSummaries.push(createServiceSummary(serviceName, serviceSourcePath));
    typeScriptSummaries.push(createStateSummary(stateName, stateSourcePath));

    const templateBindings: TemplateParseSummary = {
      sourcePath: templatePath,
      ownerPath: componentSourcePath,
      bindings: {
        propertyBindings: ['[title]', '[class.active]'],
        eventBindings: ['(closed)'],
        structuralDirectives: ['*ngIf'],
        templateRefs: ['#content'],
        pipes: ['async'],
        externalReferences: options.includeUnsupportedTemplate && index === 0 ? ['javascript:alert(1)'] : [],
      },
      diagnostics: [],
      parserMode: 'heuristic',
    };
    templateSummaries.push(templateBindings);

    const componentNodeId = `node-component-${index + 1}`;
    const templateNodeId = `node-template-${index + 1}`;
    const serviceNodeId = `node-service-${index + 1}`;
    const stateNodeId = `node-state-${index + 1}`;

    nodes.push(
      {
        id: componentNodeId,
        kind: 'symbol',
        label: componentName,
        sourceRef: { kind: 'source', path: componentSourcePath, symbol: componentName },
      },
      {
        id: templateNodeId,
        kind: 'template',
        label: path.basename(templatePath),
        sourceRef: { kind: 'source', path: templatePath },
      },
      {
        id: serviceNodeId,
        kind: 'symbol',
        label: serviceName,
        sourceRef: { kind: 'source', path: serviceSourcePath, symbol: serviceName },
      },
      {
        id: stateNodeId,
        kind: 'state',
        label: stateName,
        sourceRef: { kind: 'source', path: stateSourcePath, symbol: stateName },
      },
    );

    edges.push(
      {
        id: `edge-component-template-${index + 1}`,
        kind: 'uses-template',
        from: componentNodeId,
        to: templateNodeId,
        evidenceRefs: [{ kind: 'source', path: templatePath }],
        confidence: 1,
      },
      {
        id: `edge-component-service-${index + 1}`,
        kind: 'references',
        from: componentNodeId,
        to: serviceNodeId,
        evidenceRefs: [{ kind: 'source', path: componentSourcePath }],
        confidence: 1,
      },
      {
        id: `edge-component-state-${index + 1}`,
        kind: 'references',
        from: componentNodeId,
        to: stateNodeId,
        evidenceRefs: [{ kind: 'source', path: stateSourcePath }],
        confidence: 0.8,
      },
    );
  }

  const graph: AngularDependencyGraph = {
    schemaVersion: 1,
    nodes,
    edges,
  };

  const artifacts: AnalysisArtifactRefs = {
    sourceModelRef: createGeneratedRef(outputDir, 'source-model.json'),
    inventoryRef: createGeneratedRef(outputDir, 'inventory.json'),
    graphRef: createGeneratedRef(outputDir, 'graph.json'),
    diagnosticsRef: createGeneratedRef(outputDir, 'diagnostics.json'),
  };

  return {
    status: 'succeeded',
    workspaceProfile,
    inventory: {
      schemaVersion: 1,
      workspaceProfileId: `workspace-${workspaceProfile.projectName}`,
      files: fileRecords,
      excludedPaths: [],
    },
    typeScriptSummaries,
    templateSummaries,
    routeSummaries,
    graph,
    diagnostics,
    sourceModelBoundary: {
      schemaVersion: 1,
      sourceModelRef: {
        projectPath: projectRoot,
        entryFile: path.join(sourceRoot, 'main.ts'),
        projectKind: 'application',
      },
      entryPoints: [path.join(sourceRoot, 'main.ts')],
      notes: ['benchmark-fixture', 'transform-angular-react'],
    },
    artifacts,
    summary: {
      totalFiles: fileRecords.length,
      totalSymbols: typeScriptSummaries.reduce((total, summary) => total + summary.symbols.length, 0),
      totalRoutes: routeSummaries.length,
      totalDiagnostics: diagnostics.length,
    },
  };
};
