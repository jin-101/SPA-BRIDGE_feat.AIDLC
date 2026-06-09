import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { createDiagnostic } from '@spa-bridge/core-model';

import {
  DependencyManifestBuilder,
  DependencyAdvisoryBoundary,
  DependencyCompatibilityClassifier,
  ReviewStubGenerator,
  TargetGenerationRequestValidator,
  TargetPathGuard,
  TargetStrategyRegistry,
  TargetGenerationService,
  TemplateJsxRenderer,
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
  strategyId: 'vite-react-typescript',
  overwritePolicy: 'preserve',
  projectName: 'demo-target',
  selectedStateStrategy: 'local',
  draftSet: {
    schemaVersion: 1,
    targetFramework: 'react',
    projectStrategy: 'vite-react-typescript',
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
  it('generates a deterministic Vite + React + TypeScript target scaffold', () => {
    const result = expectOk(generateReactTarget(createFixtureRequest()));

    expect(result.status).toBe('partial');
    expect(result.writePlan.files.length).toBeGreaterThan(0);
    expect(result.writePlan.files.map((file) => file.path)).toEqual([...result.writePlan.files.map((file) => file.path)].sort());
    expect(result.writePlan.files.some((file) => file.path.endsWith('package.json'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/app/main-panel/MainPanel.tsx'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/routes.tsx'))).toBe(true);
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/state/local/index.ts'))).toBe(true);
    const tsconfigFile = result.writePlan.files.find((file) => file.path.endsWith('tsconfig.json'));
    const viteConfigFile = result.writePlan.files.find((file) => file.path.endsWith('vite.config.ts'));
    expect(tsconfigFile?.content).toContain('"@app/*"');
    expect(tsconfigFile?.content).toContain('"src/app/*"');
    expect(viteConfigFile?.content).toContain("'@app': path.resolve(__dirname, 'src/app')");
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/metadata/alias-mapping.json'))).toBe(true);
    const componentFile = result.writePlan.files.find((file) => file.path.endsWith('src/app/main-panel/MainPanel.tsx'));
    expect(componentFile?.content).toContain("useState('Hello')");
    expect(componentFile?.content).toContain('selectPassenger');
    expect(componentFile?.content).toContain('setTitle(id)');
    expect(componentFile?.content).toContain('className="panel"');
    expect(componentFile?.content).toContain('onClick={(event) => selectPassenger(title)}');
    expect(componentFile?.content).toContain('src="/assets/logo.png"');
    expect(componentFile?.content).toContain("import '../../styles/components/MainPanel.less';");
    expect(result.writePlan.files.some((file) => file.path.endsWith('src/styles/components/MainPanel.less'))).toBe(true);
    const routesFile = result.writePlan.files.find((file) => file.path.endsWith('src/routes.tsx'));
    expect(routesFile?.content).toContain("import { MainPanel } from './app/main-panel/MainPanel.js';");
    expect(result.manualReviewItems.length).toBeGreaterThan(0);
    expect(result.traces.length).toBeGreaterThanOrEqual(result.writePlan.files.length);
  });

  it('keeps output stable across repeated runs', () => {
    const first = expectOk(generateReactTarget(createFixtureRequest()));
    const second = expectOk(generateReactTarget(createFixtureRequest()));

    expect(first.writePlan).toStrictEqual(second.writePlan);
    expect(first.summary).toStrictEqual(second.summary);
    expect(first.dependencyManifest).toStrictEqual(second.dependencyManifest);
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

  it('selects the default strategy deterministically', () => {
    const registry = new TargetStrategyRegistry();
    registry.register(createViteReactTypeScriptStrategy());

    const selected = registry.list()[0];
    expect(selected.id).toBe('vite-react-typescript');
    expect(selected.defaultStrategy).toBe(true);
  });

  it('builds a dependency manifest with exact versions', () => {
    const manifest = new DependencyManifestBuilder().build('store');
    expect(manifest.dependencies.react).toBe('18.2.0');
    expect(manifest.dependencies['@reduxjs/toolkit']).toBeDefined();
    expect(manifest.devDependencies.vite).toBe('5.4.11');
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
