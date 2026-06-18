import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { createDiagnostic } from '@spa-bridge/core-model';

import {
  DependencyManifestBuilder,
  DependencyAdvisoryBoundary,
  DependencyCompatibilityClassifier,
  EnterpriseArtifactMaterializer,
  ReviewStubGenerator,
  TargetGenerationRequestValidator,
  TargetPathGuard,
  TargetStrategyRegistry,
  TargetGenerationService,
  TemplateJsxRenderer,
  createNextJsTypeScriptStrategy,
  createViteReactTypeScriptStrategy,
  generateReactTarget,
  targetGenerationRequestArbitrary,
} from '../src/index.js';
import type { TargetGenerationRequest } from '../src/index.js';

const expectOk = <T, E>(result: { ok: true; value: T } | { ok: false; error: E }): T => {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('Expected result to be ok');
  }

  return result.value;
};

const createFixtureRequest = (): TargetGenerationRequest => ({
  runId: 'run-001',
  correlationId: 'corr-001',
  targetRoot: '/workspace/spa-bridge/generated',
  strategyId: 'nextjs-typescript',
  overwritePolicy: 'preserve',
  projectName: 'demo-target',
  selectedStateStrategy: 'local',
  draftSet: {
    schemaVersion: 1,
    targetFramework: 'react',
    projectStrategy: 'nextjs-typescript',
    aliasModel: {
      schemaVersion: 1,
      baseUrl: '/workspace/spa-bridge/src',
      configFiles: ['/workspace/spa-bridge/tsconfig.json'],
      paths: [
        {
          id: 'alias-app',
          aliasPattern: '@app/*',
          targetPatterns: ['app/*'],
          resolvedTargets: ['/workspace/spa-bridge/src/app'],
          sourceConfigPath: '/workspace/spa-bridge/tsconfig.json',
          status: 'supported',
        },
      ],
      workspaceProjects: [
        {
          id: 'project-demo',
          projectName: 'demo',
          projectRoot: '/workspace/spa-bridge',
          sourceRoot: '/workspace/spa-bridge/src',
          projectType: 'application',
          status: 'supported',
        },
      ],
      assetRoots: ['/workspace/spa-bridge/src/assets'],
      diagnostics: [],
      summary: {
        totalAliases: 2,
        supportedAliases: 2,
        unresolvedAliases: 0,
        unsafeAliases: 0,
        externalAliases: 0,
      },
    },
    components: [
      {
        id: 'component-1',
        name: 'MainPanel',
        sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/main-panel.ts' },
        props: ['title'],
        state: ['isOpen'],
        hooks: [],
        imports: ['react'],
        templateDraftId: 'template-1',
        templateRawText: '<article class="panel"><button (click)="selectPassenger(title)">{{ title }}</button><img src="assets/logo.png"></article>',
        templateExternalReferences: ['assets/logo.png'],
        forms: [],
        rxHooks: [],
        animations: [],
        serviceRefs: ['service-1'],
        styleUrls: ['./main-panel.less'],
        propertyInitializers: [
          {
            name: 'title',
            initializer: "'Hello'",
            readonly: false,
            decorators: [],
            isEventEmitter: false,
          },
          {
            name: 'selected',
            initializer: 'new EventEmitter<string>()',
            readonly: false,
            decorators: ['Output'],
            typeText: 'EventEmitter<string>',
            isEventEmitter: true,
          },
        ],
        methods: [
          {
            name: 'selectPassenger',
            parameters: ['id: string'],
            bodyText: 'this.title = id;',
            isAsync: false,
          },
        ],
        reviewItemIds: [],
        generatedRefs: [{ kind: 'generated', path: 'src/components/MainPanel.tsx' }],
      },
    ],
    templates: [
      {
        id: 'template-1',
        ownerComponentId: 'component-1',
        sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/main-panel.html' },
        jsxNodes: ['section'],
        bindings: ['title'],
        events: [],
        forms: [],
        rawText: '<article class="panel"><button (click)="selectPassenger(title)">{{ title }}</button><img src="assets/logo.png"></article>',
        externalReferences: ['assets/logo.png'],
        reviewItemIds: [],
        generatedRefs: [{ kind: 'generated', path: 'src/components/MainPanel.tsx' }],
      },
    ],
    services: [
      {
        id: 'service-1',
        name: 'DataService',
        sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/data.service.ts' },
        kind: 'module',
        providerScope: 'root',
        dependencies: [],
        reviewItemIds: [],
        generatedRefs: [{ kind: 'generated', path: 'src/services/DataService.ts' }],
      },
    ],
    routes: [
      {
        id: 'route-1',
        path: '/',
        sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/app.routes.ts' },
        elementRef: 'MainPanel',
        children: [],
        guardRefs: [],
        lazyTarget: undefined,
        reviewItemIds: [],
        generatedRefs: [{ kind: 'generated', path: 'src/routes.tsx' }],
      },
    ],
    state: [
      {
        id: 'state-1',
        name: 'AppState',
        sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/state.ts' },
        strategy: 'local',
        storeRefs: [],
        actions: ['toggleOpen'],
        selectors: ['selectIsOpen'],
        effects: [],
        reviewItemIds: [],
        generatedRefs: [{ kind: 'generated', path: 'src/state/local/appstate.ts' }],
      },
    ],
    reduxToolkit: [],
    animations: [],
    manualReviewItems: [
      {
        id: 'review-1',
        title: 'Check local state mapping',
        description: 'The generated local state wrapper should be reviewed manually.',
        status: 'open',
      },
    ],
    diagnostics: [
      createDiagnostic({
        code: 'UOW07-FIXTURE-001',
        severity: 'warning',
        message: 'Fixture diagnostic.',
        sourceRefs: [],
        generatedRefs: [],
        tags: ['fixture'],
      }),
    ],
    traces: [],
  },
});

describe('TargetGenerationService', () => {
  it('generates a deterministic Next.js + React + TypeScript target scaffold by default', () => {
    const result = expectOk(generateReactTarget(createFixtureRequest()));

    expect(result.status).toBe('partial');
    expect(result.writePlan.files.length).toBeGreaterThan(0);
    expect(result.writePlan.files.map((file) => file.path)).toEqual([...result.writePlan.files.map((file) => file.path)].sort());
    expect(result.writePlan.files.some((file) => file.path.endsWith('package.json'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('next.config.mjs'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/app/layout.tsx'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/app/page.tsx'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/review/runtime-parity-quality.json'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('.spa-bridge/quality-gate-results.json'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/app/main-panel/MainPanel.tsx'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/routes.tsx'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/state/local/index.ts'))).toBe(true);
    expect(result.dependencyManifest.dependencies.next).toBe('14.2.30');
    expect(result.dependencyManifest.devDependencies.vite).toBeUndefined();
    const qualityFile = result.writePlan.files.find((file) => file.path.endsWith('src/review/runtime-parity-quality.json'));
    expect(qualityFile?.content).toContain('"requiredFilesPresent": true');
    expect(qualityFile?.content).toContain('"selfCorrectionStatus": "skipped"');
    const selfCorrectionFile = result.writePlan.files.find((file) => file.path.endsWith('.spa-bridge/quality-gate-results.json'));
    expect(selfCorrectionFile?.content).toContain('"schemaVersion": 1');
    expect(selfCorrectionFile?.content).toContain('.spa-bridge/quality-gate-results.json');
    const tsconfigFile = result.writePlan.files.find((file) => file.path.endsWith('tsconfig.json'));
    const nextConfigFile = result.writePlan.files.find((file) => file.path.endsWith('next.config.mjs'));
    expect(tsconfigFile?.content).toContain('"@app/*"');
    expect(tsconfigFile?.content).toContain('"src/app/*"');
    expect(nextConfigFile?.content).toContain("config.resolve.alias['@app'] = path.resolve(process.cwd(), 'src/app')");
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/metadata/alias-mapping.json'))).toBe(true);
    const componentFile = result.writePlan.files.find((file) => file.path.endsWith('src/app/main-panel/MainPanel.tsx'));
    expect(componentFile?.content).toContain("useState('Hello')");
    expect(componentFile?.content).toContain('selectPassenger');
    expect(componentFile?.content).toContain('setTitle(id)');
    expect(componentFile?.content).toContain('className="panel"');
    expect(componentFile?.content).toContain('onClick={(event) => selectPassenger(title)}');
    expect(componentFile?.content).toContain('src="/assets/logo.png"');
    expect(componentFile?.content).toContain("import '../../styles/components/MainPanel.css';");
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/styles/components/MainPanel.css'))).toBe(true);
    const routesFile = result.writePlan.files.find((file) => file.path.endsWith('src/routes.tsx'));
    expect(routesFile?.content).toContain("import { MainPanel } from './app/main-panel/MainPanel';");
    expect(routesFile?.content).not.toContain("MainPanel.js");
    const layoutFile = result.writePlan.files.find((file) => file.path.endsWith('src/app/layout.tsx'));
    expect(layoutFile?.content).toContain("import { RootProviders } from './providers';");
    expect(layoutFile?.content).toContain("import '../source-styles.css';");
    expect(result.manualReviewItems.length).toBeGreaterThan(0);
    expect(result.traces.length).toBeGreaterThanOrEqual(result.writePlan.files.length);
  });

  it('still supports the legacy Vite strategy when explicitly selected', () => {
    const request = createFixtureRequest();
    request.strategyId = 'vite-react-typescript';
    request.draftSet.projectStrategy = 'vite-react-typescript';
    const result = expectOk(generateReactTarget(request));

    expect(result.summary.strategyId).toBe('vite-react-typescript');
    expect(result.writePlan.files.some((file) => file.path.endsWith('vite.config.ts'))).toBe(true);
    expect(result.dependencyManifest.devDependencies.vite).toBe('5.4.11');
  });

  it('keeps output stable across repeated runs', () => {
    const first = expectOk(generateReactTarget(createFixtureRequest()));
    const second = expectOk(generateReactTarget(createFixtureRequest()));

    expect(first.writePlan).toStrictEqual(second.writePlan);
    expect(first.summary).toStrictEqual(second.summary);
    expect(first.dependencyManifest).toStrictEqual(second.dependencyManifest);
  });

  it('generates Redux Toolkit store artifacts when NgRx drafts are present', () => {
    const request = createFixtureRequest();
    request.selectedStateStrategy = 'store';
    request.draftSet.reduxToolkit = [
      {
        id: 'redux-flights',
        featureName: 'flights',
        actions: [
          {
            id: 'action-load-flights',
            name: 'loadFlights',
            actionType: '[Flights] Load',
            sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/flights.actions.ts' },
            payloadProperties: ['routeId'],
          },
        ],
        reducer: {
          id: 'reducer-flights',
          name: 'flightsReducer',
          featureName: 'flights',
          sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/flights.reducer.ts' },
          handlers: [
            {
              id: 'handler-load-flights',
              actionNames: ['loadFlights'],
              reducerExpression: '(state) => state',
              reviewRequired: false,
            },
          ],
        },
        selectors: [
          {
            id: 'selector-flights',
            name: 'selectFlights',
            featureName: 'flights',
            dependencies: ['selectFlightsFeature'],
            sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/flights.selectors.ts' },
            reviewRequired: false,
          },
        ],
        effects: [
          {
            id: 'effect-flights',
            name: 'loadFlights$',
            sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/flights.effects.ts' },
            ofTypeActions: ['loadFlights'],
            dispatch: true,
            operatorIntents: ['switchMap'],
            serviceCallRefs: ['api.load'],
            safety: 'safe',
          },
        ],
        entityAdapters: [],
        componentUsages: [],
        hasRouterStore: false,
        reviewComments: [],
      },
    ];
    request.draftSet.components[0] = {
      ...request.draftSet.components[0]!,
      reduxUsage: {
        id: 'usage-flights',
        ownerComponentId: 'component-1',
        selectorRefs: ['selectFlights'],
        actionRefs: ['loadFlights'],
        reviewComments: [],
      },
    };

    const result = expectOk(generateReactTarget(request));
    expect(result.dependencyManifest.dependencies['@reduxjs/toolkit']).toBe('2.2.7');
    expect(result.dependencyManifest.dependencies['react-redux']).toBe('9.1.2');
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/store/index.ts'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/store/hooks.ts'))).toBe(true);
    expect(result.writePlan.files.find((file) => file.path.endsWith('src/store/slices/flights.ts'))?.content).toContain('createSlice');
    expect(result.writePlan.files.find((file) => file.path.endsWith('src/store/selectors/flights.ts'))?.content).toContain('selectFlights');
    expect(result.writePlan.files.find((file) => file.path.endsWith('src/store/effects/flights.ts'))?.content).toContain('loadFlights$');
    expect(result.writePlan.files.find((file) => file.path.endsWith('src/app/main-panel/MainPanel.tsx'))?.content).toContain('useAppSelector');
    expect(result.writePlan.files.find((file) => file.path.endsWith('src/app/providers.tsx'))?.content).toContain('<Provider store={store}>');
  });
});

describe('Support utilities', () => {
  it('renders advanced Angular template constructs into JSX intent', () => {
    const renderer = new TemplateJsxRenderer();
    const logicContext = {
      stateNames: new Set<string>(),
      propertyNames: new Set<string>(),
      methodNames: new Set(['select']),
      propNames: new Set<string>(),
      transformExpression: (expression: string) => expression.replace(/\bthis\./g, ''),
      transformTemplateExpression: (expression: string) => expression.replace(/\bthis\./g, ''),
      toStateSetter: (name: string) => `set${name.charAt(0).toUpperCase()}${name.slice(1)}`,
      toIdentifier: (name: string, fallback: string) => name.replace(/[^A-Za-z0-9_$]/g, '') || fallback,
      formControlNames: new Set<string>(),
    };
    const result = renderer.render(
      [
        '<ng-container>',
        '<article *ngIf="ready">',
        '<ke-konbini-pres [passenger]="passenger" (selected)="select($event)"></ke-konbini-pres>',
        '</article>',
        '<li *ngFor="let item of items; index as i">{{ item.name | uppercase }}</li>',
        '</ng-container>',
      ].join(''),
      undefined,
      logicContext,
      new Map([['ke-konbini-pres', { name: 'KeKonbiniPres', path: 'src/app/ke-konbini-pres/KeKonbiniPres.tsx' }]]),
    );

    const content = result.lines.join('\n');
    expect(content).toContain('{ready &&');
    expect(content).toContain('(items ?? []).map((item, i)');
    expect(content).toContain('<KeKonbiniPres');
    expect(content).toContain('passenger={passenger}');
    expect(content).toContain('onSelected={(event) => select(event)}');
    expect(content).toContain('formatUppercasePipe(item.name)');
    expect(result.helpers).toContain('formatUppercasePipe');
    expect(result.usedSelectors).toEqual(['ke-konbini-pres']);
  });

  it('generates local form helpers and controlled form bindings', () => {
    const request = createFixtureRequest();
    request.draftSet.components[0] = {
      ...request.draftSet.components[0]!,
      templateRawText: '<form [formGroup]="profileForm" (ngSubmit)="submit()"><input formControlName="email" /></form>',
      forms: [
        {
          id: 'form-1',
          ownerComponentId: 'component-1',
          ownerComponentPath: '/workspace/spa-bridge/src/app/main-panel.ts',
          declarationKind: 'form-builder',
          rootControl: {
            id: 'form-group-1',
            name: 'profileForm',
            path: 'profileForm',
            controls: [
              {
                id: 'control-email',
                name: 'email',
                path: 'profileForm.email',
                initialValue: "''",
                valueType: 'string',
                validators: [{ id: 'validator-required', kind: 'required', arguments: [], reviewRequired: false }],
                asyncValidators: [],
              },
            ],
            groups: [],
            arrays: [],
            validators: [],
          },
          templateBindings: [],
          submitIntents: [{ id: 'submit-1', expression: 'submit()', sourcePath: '/workspace/spa-bridge/src/app/main-panel.html' }],
        },
      ],
      methods: [
        {
          name: 'submit',
          parameters: [],
          bodyText: 'this.title = "submitted";',
          isAsync: false,
        },
      ],
    };

    const result = expectOk(generateReactTarget(request));
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/utils/forms/useFormControl.ts'))).toBe(true);
    const componentFile = result.writePlan.files.find((file) => file.path.endsWith('src/app/main-panel/MainPanel.tsx'));
    expect(componentFile?.content).toContain('useFormControl');
    expect(componentFile?.content).toContain('formValidators.required()');
    expect(componentFile?.content).toContain('{...emailControl.inputProps}');
    expect(componentFile?.content).toContain('event.preventDefault(); submit();');
  });

  it('generates RxJS runtime helpers and binds async pipe expressions to observable hook values', () => {
    const request = createFixtureRequest();
    request.sourceDependencies = {
      rxjs: '6.6.7',
    };
    request.draftSet.components[0] = {
      ...request.draftSet.components[0]!,
      templateRawText: '<span>{{ flights$ | async }}</span>',
      propertyInitializers: [
        ...request.draftSet.components[0]!.propertyInitializers,
        {
          name: 'flights$',
          initializer: 'this.flightService.flights()',
          readonly: true,
          decorators: [],
          typeText: 'Observable<string[]>',
          isEventEmitter: false,
        },
      ],
      rxHooks: [
        {
          id: 'rx-hook-1',
          ownerComponentId: 'component-1',
          hookKind: 'useObservable',
          sourceStreamId: 'stream-1',
          valueName: 'flightsValue',
          initialValueText: '[]',
          dependencyExpressions: ['flights$'],
          cleanupRequired: true,
          reviewComments: [],
        },
      ],
    };

    const result = expectOk(generateReactTarget(request));
    const componentFile = result.writePlan.files.find((file) => file.path.endsWith('src/app/main-panel/MainPanel.tsx'));

    expect(result.writePlan.files.some((file) => file.path.endsWith('src/utils/rxjs/useObservable.ts'))).toBe(true);
    expect(componentFile?.content).toContain('useObservable');
    expect(componentFile?.content).toContain('const { value: flightsValue } = useObservable(flights$, []);');
    expect(componentFile?.content).toContain('{flightsValue}');
    expect(result.dependencyManifest.dependencies.rxjs).toBe('6.6.7');
  });

  it('generates animation helpers, CSS, client boundaries, and quality signals', () => {
    const request = createFixtureRequest();
    request.sourceDependencies = {
      'lottie-web': '5.13.0',
      'ngx-lottie': '7.0.0',
    };
    request.draftSet.components[0] = {
      ...request.draftSet.components[0]!,
      animations: [
        {
          id: 'animation-main-open-close',
          ownerComponentId: 'component-1',
          sourceRef: { kind: 'source', path: '/workspace/spa-bridge/src/app/main-panel.ts' },
          triggerName: 'openClose',
          conversionKind: 'manual-review',
          cssClassPrefix: 'aidlc-main-panel-open-close',
          stateClassNames: {
            open: 'aidlc-main-panel-open-close-open',
            closed: 'aidlc-main-panel-open-close-closed',
          },
          bindings: [
            {
              id: 'binding-open-close',
              triggerName: 'openClose',
              bindingExpression: 'state',
              targetElementRef: '/workspace/spa-bridge/src/app/main-panel.html',
              conversionPlan: 'class-binding',
            },
          ],
          requiresClientComponent: true,
          assetRefs: [],
          reviewComments: ['AIDLC_MANUAL_REVIEW_ANIMATION: transition uses query/stagger behavior.'],
          reviewItemIds: [],
          generatedRefs: [{ kind: 'generated', path: 'src/animations/main-panel-openClose.ts', segment: 'openClose' }],
        },
      ],
    };
    request.draftSet.animations = [...request.draftSet.components[0]!.animations];

    const result = expectOk(generateReactTarget(request));
    const componentFile = result.writePlan.files.find((file) => file.path.endsWith('src/app/main-panel/MainPanel.tsx'));
    const qualityFile = result.writePlan.files.find((file) => file.path.endsWith('src/review/runtime-parity-quality.json'));

    expect(result.writePlan.files.some((file) => file.path.endsWith('src/animations/animations.css'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/animations/main-panel-openClose.ts'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/review/animation-conversion-summary.json'))).toBe(true);
    expect(componentFile?.content.startsWith('"use client";')).toBe(true);
    expect(componentFile?.content).toContain('openCloseAnimationClass');
    expect(componentFile?.content).toContain('className={openCloseAnimationClass}');
    expect(result.dependencyManifest.dependencies['lottie-web']).toBe('5.13.0');
    expect(result.dependencyManifest.dependencies['ngx-lottie']).toBeUndefined();
    expect(qualityFile?.content).toContain('"animationTriggerCount": 1');
    expect(qualityFile?.content).toContain('"unresolvedAnimationTriggerCount": 1');
  });

  it('selects the default strategy deterministically', () => {
    const registry = new TargetStrategyRegistry();
    registry.register(createNextJsTypeScriptStrategy());
    registry.register(createViteReactTypeScriptStrategy());

    const selected = registry.list()[0];
    expect(selected.id).toBe('nextjs-typescript');
    expect(selected.defaultStrategy).toBe(true);
  });

  it('builds a dependency manifest with exact versions', () => {
    const manifest = new DependencyManifestBuilder().build('store');
    expect(manifest.dependencies.react).toBe('18.2.0');
    expect(manifest.dependencies.next).toBe('14.2.30');
    expect(manifest.dependencies['@reduxjs/toolkit']).toBeDefined();
    expect(manifest.devDependencies.vite).toBeUndefined();
  });

  it('filters Angular-only dependencies and replaces the WDS Angular package', () => {
    const request = createFixtureRequest();
    request.sourceDependencies = {
      '@angular/core': '15.2.10',
      '@wds/wc-angular-lib': '0.1.43',
      'angularx-qrcode': '15.0.1',
      dayjs: '1.11.20',
      rxjs: '6.6.7',
    };
    request.sourceDevDependencies = {
      '@angular-devkit/build-angular': '15.2.10',
      webpack: '5.76.1',
    };

    const result = expectOk(generateReactTarget(request));

    expect(result.dependencyManifest.dependencies['@angular/core']).toBeUndefined();
    expect(result.dependencyManifest.dependencies['@wds/wc-angular-lib']).toBeUndefined();
    expect(result.dependencyManifest.dependencies['@wds/wc-react-lib']).toBe('0.1.43');
    expect(result.dependencyManifest.dependencies['angularx-qrcode']).toBeUndefined();
    expect(result.dependencyManifest.dependencies.dayjs).toBe('1.11.20');
    expect(result.dependencyManifest.dependencies.rxjs).toBe('6.6.7');
    expect(result.dependencyManifest.devDependencies.webpack).toBeUndefined();
    expect(result.dependencyCompatibilityReport.summary.replaced).toBe(1);
    expect(result.manualReviewItems.some((item) => item.id === 'dependency--wds-wc-angular-lib')).toBe(true);

    const reportFile = result.writePlan.files.find((file) => file.path.endsWith('src/review/dependency-compatibility.md'));
    expect(reportFile?.content).toContain('@wds/wc-angular-lib');
    expect(reportFile?.content).toContain('@wds/wc-react-lib');
    expect(reportFile?.content).toContain('angularx-qrcode');
    expect(reportFile?.content).toContain('WDS Custom Package Compatibility');
  });

  it('generates enterprise parity artifacts for private registries, scripts, and environment contracts', () => {
    const request = createFixtureRequest();
    request.sourceDependencies = {
      '@wds/wc-angular-lib': '0.1.43',
      dayjs: '1.11.20',
    };
    request.sourceNpmrcFiles = [
      {
        sourcePath: '.npmrc',
        lines: [
          'registry=https://nexus.example/repository/npm-group/',
          '@wds:registry=https://nexus.example/repository/wds-npm/',
          '//nexus.example/repository/wds-npm/:_authToken=super-secret-token',
        ],
      },
    ];
    request.sourceScripts = {
      start: 'ng serve --configuration local',
      build: 'ng build --configuration production',
      analyze: 'webpack-bundle-analyzer dist/stats.json',
      deploy: 'npm run build && upload-to-prod',
      clean: 'rm -rf dist',
    };
    request.sourceEnvironmentVariables = [
      { name: 'API_BASE_URL', sourceKind: 'env-file', sourcePath: '.env', valuePresent: true },
      { name: 'PUBLIC_CDN_URL', sourceKind: 'env-file', sourcePath: '.env', valuePresent: true },
      { name: 'WDS_API_TOKEN', sourceKind: 'env-file', sourcePath: '.env.local', valuePresent: true },
    ];
    request.sourcePackageManager = {
      name: 'yarn',
      version: '1.22.22',
      packageManagerField: 'yarn@1.22.22',
      detectedFrom: ['package.json#packageManager', 'yarn.lock'],
      lockfile: 'yarn.lock',
      configFiles: ['.yarnrc'],
      confidence: 'high',
    };

    const result = expectOk(generateReactTarget(request));
    const packageFile = result.writePlan.files.find((file) => file.path.endsWith('package.json'));
    const npmrcFile = result.writePlan.files.find((file) => file.path.endsWith('.npmrc'));
    const npmrcExampleFile = result.writePlan.files.find((file) => file.path.endsWith('.npmrc.example'));
    const envExampleFile = result.writePlan.files.find((file) => file.path.endsWith('.env.example'));
    const registryReport = result.writePlan.files.find((file) => file.path.endsWith('src/review/registry-migration-report.json'));
    const scriptReport = result.writePlan.files.find((file) => file.path.endsWith('src/review/script-migration-report.json'));
    const environmentReport = result.writePlan.files.find((file) => file.path.endsWith('src/review/environment-contract-report.json'));
    const packageManagerReport = result.writePlan.files.find((file) => file.path.endsWith('src/review/package-manager-parity-report.json'));
    const qualityFile = result.writePlan.files.find((file) => file.path.endsWith('src/review/runtime-parity-quality.json'));

    expect(packageFile?.content).toContain('"dev": "next dev"');
    expect(packageFile?.content).toContain('"start": "next dev"');
    expect(packageFile?.content).toContain('"serve": "next start"');
    expect(packageFile?.content).toContain('"packageManager": "yarn@1.22.22"');
    expect(packageFile?.content).toContain('"typecheck": "tsc --noEmit"');
    expect(packageFile?.content).toContain('"analyze": "ANALYZE=true next build"');
    expect(npmrcFile?.content).toContain('@wds:registry=https://nexus.example/repository/wds-npm/');
    expect(npmrcFile?.content).not.toContain('super-secret-token');
    expect(npmrcExampleFile?.content).toContain('_authToken=${');
    expect(npmrcExampleFile?.content).not.toContain('super-secret-token');
    expect(envExampleFile?.content).toContain('API_BASE_URL=');
    expect(envExampleFile?.content).toContain('NEXT_PUBLIC_CDN_URL=');
    expect(envExampleFile?.content).toContain('WDS_API_TOKEN=<set-securely>');
    expect(registryReport?.content).not.toContain('super-secret-token');
    expect(scriptReport?.content).toContain('UNSAFE_SCRIPT_NOT_COPIED');
    expect(scriptReport?.content).toContain('SOURCE_DEPLOY_SCRIPT_REVIEW_REQUIRED');
    expect(environmentReport?.content).toContain('"secretCount": 1');
    expect(packageManagerReport?.content).toContain('"targetPackageManagerField": "yarn@1.22.22"');
    expect(packageManagerReport?.content).toContain('"installCommand": "yarn install"');
    expect(result.enterpriseParity?.summary.registrySecretPlaceholders).toBe(1);
    expect(result.enterpriseParity?.summary.reviewedScripts).toBeGreaterThanOrEqual(2);
    expect(result.enterpriseParity?.summary.secretEnvironmentVariables).toBe(1);
    expect(result.enterpriseParity?.summary.packageManager).toBe('yarn');
    expect(result.manualReviewItems.some((item) => item.id === 'registry-secret-1')).toBe(true);
    expect(result.manualReviewItems.some((item) => item.id === 'env-WDS_API_TOKEN')).toBe(true);
    expect(qualityFile?.content).toContain('"enterpriseParityArtifactsPresent": true');
    expect(result.selfCorrectionResult?.commandPlan.packageManager).toBe('yarn');
    expect(result.dependencyManifest.dependencies['@wds/wc-react-lib']).toBe('0.1.43');
  });

  it('keeps enterprise parity artifact generation deterministic and secret-free', async () => {
    await fc.assert(
      fc.property(
        fc.array(
          fc.tuple(
            fc.constantFrom('registry', '@scope:registry', '//registry.example/:_authToken', 'always-auth'),
            fc.string({ minLength: 1, maxLength: 12 }),
          ),
          { minLength: 1, maxLength: 8 },
        ),
        (entries) => {
          const lines = entries.map(([key, value]) => `${key}=${key.includes('_authToken') ? `secret-${value}` : value}`);
          const materializer = new EnterpriseArtifactMaterializer();
          const first = materializer.buildArtifacts({
            ...createFixtureRequest(),
            sourceNpmrcFiles: [{ sourcePath: '.npmrc', lines }],
            sourceScripts: { start: 'ng serve', clean: 'rm -rf dist' },
            sourceEnvironmentVariables: [{ name: 'PRIVATE_TOKEN', sourceKind: 'env-file', sourcePath: '.env', valuePresent: true }],
          });
          const second = materializer.buildArtifacts({
            ...createFixtureRequest(),
            sourceNpmrcFiles: [{ sourcePath: '.npmrc', lines }],
            sourceScripts: { start: 'ng serve', clean: 'rm -rf dist' },
            sourceEnvironmentVariables: [{ name: 'PRIVATE_TOKEN', sourceKind: 'env-file', sourcePath: '.env', valuePresent: true }],
          });
          const files = materializer.materialize(first);

          expect(first).toStrictEqual(second);
          for (const [, value] of entries.filter(([key]) => key.includes('_authToken'))) {
            expect(files.map((file) => file.content).join('\n')).not.toContain(`secret-${value}`);
          }
        },
      ),
      { numRuns: 20, seed: 20260617 },
    );
  });

  it('parses dependency advisory responses defensively without overriding registry behavior', () => {
    const advisory = new DependencyAdvisoryBoundary();

    expect(advisory.parseAdvisoryJson('not-json')).toStrictEqual({ schemaVersion: 1, candidates: [] });
    expect(
      advisory.parseAdvisoryJson(
        JSON.stringify({
          candidates: [
            { packageName: 'dayjs', recommendedAction: 'carry', confidence: 0.95 },
            { packageName: '@angular/core', recommendedAction: 'carry', confidence: 0.4 },
          ],
        }),
      ),
    ).toStrictEqual({
      schemaVersion: 1,
      candidates: [{ packageName: 'dayjs', recommendedAction: 'carry', confidence: 0.95 }],
    });
  });

  it('rejects target paths outside the target root', () => {
    const guard = new TargetPathGuard();
    const result = guard.ensureContained('/workspace/spa-bridge/generated', '../escape.ts');

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error('Expected path guard to reject traversal');
    }
    expect(result.error.code).toBe('PATH_VIOLATION');
  });

  it('validates request shape before generation', () => {
    const validator = new TargetGenerationRequestValidator();
    const result = validator.validate(createFixtureRequest());

    expect(result.ok).toBe(true);
  });

  it('bounds manual review stub filenames even for long source-derived IDs', () => {
    const longId = `review-lifecycle-${'very-long-source-path-segment-'.repeat(20)}component-ts-1`;
    const files = new ReviewStubGenerator().build([
      {
        id: longId,
        title: 'Review lifecycle behavior for converted component',
        description: 'Generated from a long source path.',
        status: 'open',
      },
    ]);

    expect(files).toHaveLength(1);
    expect(files[0]?.path.length).toBeLessThan(120);
    expect(files[0]?.path).toMatch(/^src\/review\/0001-review-lifecycle-behavior-for-converted-componen-[a-f0-9]{12}\.md$/);
    expect(files[0]?.content).toContain(longId);
  });
});

describe('Property-based target generation', () => {
  it('keeps dependency classification deterministic and target package names unique', () => {
    const classifier = new DependencyCompatibilityClassifier();
    const packageNameArbitrary = fc.constantFrom(
      '@angular/core',
      '@ngrx/store',
      '@wds/wc-angular-lib',
      'angularx-qrcode',
      'ngx-lottie',
      'dayjs',
      'mapbox-gl',
      'custom-runtime-lib',
    );

    fc.assert(
      fc.property(fc.dictionary(packageNameArbitrary, fc.constantFrom('0.1.43', '1.0.0', '15.2.10')), (dependencies) => {
        const first = classifier.classify(dependencies);
        const second = classifier.classify(dependencies);
        const targetNames = first.decisions
          .filter((decision) => decision.decision === 'carry' || decision.decision === 'replace')
          .map((decision) => decision.targetPackageName ?? decision.packageName);

        expect(first).toStrictEqual(second);
        expect(first.decisions).toHaveLength(Object.keys(dependencies).length);
        expect(new Set(targetNames).size).toBe(targetNames.length);
        expect(classifier.toDependencyRecord(first.decisions)['@angular/core']).toBeUndefined();
        expect(classifier.toDependencyRecord(first.decisions)['@ngrx/store']).toBeUndefined();
      }),
      {
        numRuns: 30,
        seed: 20260609,
      },
    );
  });

  it('keeps generated write plans deterministic across repeated runs', () => {
    fc.assert(
      fc.property(targetGenerationRequestArbitrary, (request) => {
        const first = expectOk(generateReactTarget(request));
        const second = expectOk(generateReactTarget(request));

        expect(first.writePlan).toStrictEqual(second.writePlan);
        expect(first.summary).toStrictEqual(second.summary);
        expect(first.dependencyManifest).toStrictEqual(second.dependencyManifest);
      }),
      {
        numRuns: 20,
        seed: 20260605,
      },
    );
  });

  it('keeps all generated file paths contained within the requested root', () => {
    fc.assert(
      fc.property(targetGenerationRequestArbitrary, (request) => {
        const result = expectOk(generateReactTarget(request));
        expect(result.writePlan.files.every((file) => file.path.startsWith(request.targetRoot))).toBe(true);
      }),
      {
        numRuns: 20,
        seed: 20260605,
      },
    );
  });

  it('preserves trace coverage for every generated file', () => {
    fc.assert(
      fc.property(targetGenerationRequestArbitrary, (request) => {
        const result = expectOk(generateReactTarget(request));
        const tracedPaths = new Set(result.traces.map((trace) => (trace.target.kind === 'generated' ? trace.target.path : trace.target.id)));

        expect(result.writePlan.files.every((file) => tracedPaths.has(file.path))).toBe(true);
      }),
      {
        numRuns: 20,
        seed: 20260605,
      },
    );
  });
});
