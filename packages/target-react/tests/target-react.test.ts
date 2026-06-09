import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { createDiagnostic } from '@spa-bridge/core-model';

import {
  DependencyManifestBuilder,
  ReviewStubGenerator,
  TargetGenerationRequestValidator,
  TargetPathGuard,
  TargetStrategyRegistry,
  TargetGenerationService,
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
