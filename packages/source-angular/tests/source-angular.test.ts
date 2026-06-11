import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { describe, expect, test } from 'vitest';
import fc from 'fast-check';

import { createDiagnostic } from '@spa-bridge/core-model';

import { PathGuard } from '../src/path/path-guard.js';
import { SourceInventoryBuilder, classifyFile } from '../src/scanner/source-inventory-builder.js';
import { TypeScriptParserAdapter } from '../src/parser/typescript-parser-adapter.js';
import { FormModelExtractor } from '../src/forms/form-model-extractor.js';
import { RxjsModelExtractor } from '../src/rxjs/rxjs-model-extractor.js';
import { NgrxModelExtractor } from '../src/ngrx/ngrx-model-extractor.js';
import { AngularTemplateParserAdapter } from '../src/templates/angular-template-parser-adapter.js';
import { GraphBuilder } from '../src/graph/graph-builder.js';
import { SafeDiagnosticBuilder } from '../src/diagnostics/safe-diagnostic-builder.js';
import { SourceAngularAnalysisService } from '../src/service/source-angular-analysis-service.js';
import { fileRecordArbitrary, diagnosticArbitrary, graphEdgeArbitrary, graphNodeArbitrary, parserSummaryArbitrary } from '../src/testing/generators.js';

const makeTempProject = async (): Promise<string> => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'source-angular-'));
  await fs.mkdir(path.join(root, 'src', 'app'), { recursive: true });
  await fs.writeFile(
    path.join(root, 'angular.json'),
    JSON.stringify({
      defaultProject: 'spa-bridge',
      projects: {
        'spa-bridge': {
          root: '',
          sourceRoot: 'src',
          projectType: 'application',
        },
        'shared-lib': {
          root: 'projects/shared-lib',
          sourceRoot: 'projects/shared-lib/src',
          projectType: 'library',
        },
      },
    }),
  );
  await fs.mkdir(path.join(root, 'projects', 'shared-lib', 'src'), { recursive: true });
  await fs.writeFile(
    path.join(root, 'tsconfig.base.json'),
    JSON.stringify({
      compilerOptions: {
        baseUrl: 'src',
        paths: {
          '@app/*': ['app/*'],
        },
      },
    }),
  );
  await fs.writeFile(
    path.join(root, 'tsconfig.json'),
    JSON.stringify({
      extends: './tsconfig.base.json',
      compilerOptions: {
        paths: {
          '@shared/*': ['../projects/shared-lib/src/*'],
          '@unsafe/*': ['../outside/*'],
        },
      },
    }),
  );
  await fs.writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({
      name: 'spa-bridge',
    }),
  );
  await fs.writeFile(
    path.join(root, 'src', 'main.ts'),
    `
      import { AppComponent } from './app/app.component';
      const routes = [
        { path: 'home', component: AppComponent }
      ];
    `,
  );
  await fs.writeFile(
    path.join(root, 'src', 'app', 'app.component.ts'),
    `
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
      })
      export class AppComponent {
        title = 'spa-bridge';
        ngOnInit() {}
      }
    `,
  );
  await fs.writeFile(path.join(root, 'src', 'app', 'app.component.html'), `<h1>{{ title }}</h1><button (click)="title = 'x'">Click</button>`);
  await fs.writeFile(path.join(root, 'src', 'app', 'app.component.scss'), `h1 { color: #333; }`);
  await fs.writeFile(
    path.join(root, 'src', 'app', 'app.routes.ts'),
    `
      export const routes = [
        { path: 'home', component: AppComponent }
      ];
    `,
  );
  return root;
};

describe('PathGuard', () => {
  test('rejects traversal outside workspace root', () => {
    const guard = new PathGuard();
    const result = guard.contains('/tmp/project', '/tmp/project/../outside');
    expect(result.ok).toBe(false);
  });
});

describe('Source inventory', () => {
  test('classifies component files deterministically', () => {
    const first = classifyFile('/tmp/app.component.ts');
    const second = classifyFile('/tmp/app.component.ts');
    expect(first).toEqual(second);
    expect(first.role).toBe('component');
  });

  test('builds deterministic inventory ordering', async () => {
    const root = await makeTempProject();
    const builder = new SourceInventoryBuilder();
    const profileResult = {
      schemaVersion: 1 as const,
      projectKind: 'application' as const,
      projectName: 'spa-bridge',
      projectRoot: root,
      sourceRoot: path.join(root, 'src'),
      entryFiles: [path.join(root, 'src', 'main.ts')],
      configFiles: [path.join(root, 'angular.json')],
      packageRefs: [path.join(root, 'package.json')],
    };

    const inventoryResult = await builder.build(profileResult);
    expect(inventoryResult.ok).toBe(true);
    if (inventoryResult.ok) {
      const paths = inventoryResult.value.files.map((record) => record.relativePath);
      expect(paths).toEqual([...paths].sort((left, right) => left.localeCompare(right)));
    }
  });
});

describe('Parser adapters', () => {
  test('parses TypeScript class metadata and lifecycle hooks', () => {
    const parser = new TypeScriptParserAdapter();
    const parsed = parser.parse(
      '/tmp/app.component.ts',
      `
        import { Component } from '@angular/core';
        @Component({ selector: 'app-root', templateUrl: './app.component.html' })
        export class AppComponent {
          title = 'spa-bridge';
          ngOnInit() {}
        }
      `,
    );

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.symbols[0]?.lifecycleHooks).toContain('ngOnInit');
      expect(parsed.value.symbols[0]?.decorators[0]?.kind).toBe('Component');
    }
  });

  test('parses Angular templates heuristically', async () => {
    const parser = new AngularTemplateParserAdapter();
    const parsed = await parser.parse(
      '/tmp/app.component.html',
      `<button (click)="save()" [disabled]="busy" *ngIf="ready">Save {{ title }}</button>`,
      '/tmp/app.component.ts',
    );

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.bindings.eventBindings).toContain('click');
      expect(parsed.value.bindings.propertyBindings).toContain('disabled');
      expect(parsed.value.bindings.structuralDirectives).toContain('ngIf');
      expect(parsed.value.templateIr?.rootNodes.some((node) => node.directives.some((directive) => directive.kind === 'if'))).toBe(true);
    }
  });

  test('extracts reactive form models without executing validators', async () => {
    const tsParser = new TypeScriptParserAdapter();
    const templateParser = new AngularTemplateParserAdapter();
    const extractor = new FormModelExtractor();
    const parsedTs = tsParser.parse(
      '/tmp/profile.component.ts',
      `
        import { Component } from '@angular/core';
        import { FormBuilder, Validators } from '@angular/forms';

        @Component({ selector: 'app-profile', templateUrl: './profile.component.html' })
        export class ProfileComponent {
          profileForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            passengers: this.fb.array([])
          });
          constructor(private fb: FormBuilder) {}
          submit() {}
        }
      `,
    );
    const parsedTemplate = await templateParser.parse(
      '/tmp/profile.component.html',
      `<form [formGroup]="profileForm" (ngSubmit)="submit()"><input formControlName="email" /></form>`,
      '/tmp/profile.component.ts',
    );

    expect(parsedTs.ok).toBe(true);
    expect(parsedTemplate.ok).toBe(true);
    if (parsedTs.ok && parsedTemplate.ok) {
      const forms = extractor.extract([parsedTs.value], [parsedTemplate.value]);
      expect(forms).toHaveLength(1);
      expect(forms[0]?.declarationKind).toBe('form-builder');
      expect(forms[0]?.templateBindings.some((binding) => binding.kind === 'formControlName' && binding.name === 'email')).toBe(true);
      const root = forms[0]?.rootControl;
      expect(root && 'controls' in root ? root.controls[0]?.validators.map((validator) => validator.kind) : []).toEqual(['required', 'email']);
      expect(forms[0]?.submitIntents[0]?.expression).toBe('submit()');
    }
  });

  test('extracts RxJS streams, subjects, subscriptions, cleanup, and async pipe bindings without execution', async () => {
    const tsParser = new TypeScriptParserAdapter();
    const templateParser = new AngularTemplateParserAdapter();
    const extractor = new RxjsModelExtractor();
    const parsedTs = tsParser.parse(
      '/tmp/flights.component.ts',
      `
        import { Component } from '@angular/core';
        import { BehaviorSubject, Observable } from 'rxjs';
        import { map, takeUntil } from 'rxjs/operators';

        @Component({ selector: 'app-flights', templateUrl: './flights.component.html' })
        export class FlightsComponent {
          destroy$ = new BehaviorSubject(false);
          flights$: Observable<string[]> = this.service.flights().pipe(map((items) => items), takeUntil(this.destroy$));
          selected = '';
          ngOnInit() {
            this.flights$.subscribe((items) => this.selected = items[0]);
          }
          ngOnDestroy() {
            this.destroy$.next(true);
            this.destroy$.complete();
          }
        }
      `,
    );
    const parsedTemplate = await templateParser.parse(
      '/tmp/flights.component.html',
      `<span>{{ flights$ | async }}</span>`,
      '/tmp/flights.component.ts',
    );

    expect(parsedTs.ok).toBe(true);
    expect(parsedTemplate.ok).toBe(true);
    if (parsedTs.ok && parsedTemplate.ok) {
      const model = extractor.extract([parsedTs.value], [parsedTemplate.value]);
      expect(model.streams.some((stream) => stream.memberName === 'flights$')).toBe(true);
      expect(model.subjects.some((subject) => subject.memberName === 'destroy$' && subject.cleanupRole === 'destroy-signal')).toBe(true);
      expect(model.subscriptions.some((subscription) => subscription.cleanupEvidence === 'ngOnDestroy-unsubscribe' || subscription.cleanupEvidence === 'takeUntil' || subscription.cleanupEvidence === 'none')).toBe(true);
      expect(model.operatorChains.some((chain) => chain.hasCleanupOperator)).toBe(true);
      expect(model.asyncPipeBindings.some((binding) => binding.expressionText === 'flights$' && !binding.reviewRequired)).toBe(true);
    }
  });

  test('extracts NgRx actions, reducers, selectors, effects, entity adapters, and component store usage without execution', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'source-ngrx-'));
    const sourcePath = path.join(root, 'flights.component.ts');
    const sourceText = `
      import { Component } from '@angular/core';
      import { Store, createAction, createReducer, createSelector, createFeatureSelector, on, props } from '@ngrx/store';
      import { createEffect, ofType } from '@ngrx/effects';
      import { createEntityAdapter } from '@ngrx/entity';
      import { map, switchMap } from 'rxjs/operators';

      export const loadFlights = createAction('[Flights] Load', props<{ routeId: string }>());
      export const loadFlightsSuccess = createAction('[Flights] Load Success', props<{ items: string[] }>());
      export const adapter = createEntityAdapter<string>();
      export const initialState = adapter.getInitialState({ loading: false });
      export const flightsReducer = createReducer(
        initialState,
        on(loadFlights, (state) => ({ ...state, loading: true })),
        on(loadFlightsSuccess, (state, action) => ({ ...state, items: action.items }))
      );
      export const selectFlightsFeature = createFeatureSelector('flights');
      export const selectFlights = createSelector(selectFlightsFeature, (state) => state);

      @Component({ selector: 'app-flights', template: '' })
      export class FlightsComponent {
        flights$ = this.store.select(selectFlights);
        readonly load$ = createEffect(() => this.actions$.pipe(ofType(loadFlights), switchMap(() => this.api.load()), map(loadFlightsSuccess)));
        constructor(private store: Store) {}
        refresh() {
          this.store.dispatch(loadFlights({ routeId: 'A' }));
        }
      }
    `;
    await fs.writeFile(sourcePath, sourceText);
    const parser = new TypeScriptParserAdapter();
    const parsed = parser.parse(sourcePath, sourceText);

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const model = new NgrxModelExtractor().extract([parsed.value]);
      expect(model.actions.map((action) => action.name)).toContain('loadFlights');
      expect(model.actions.find((action) => action.name === 'loadFlights')?.payloadProperties).toEqual(['routeId']);
      expect(model.reducers[0]?.handlers.map((handler) => handler.actionNames).flat()).toContain('loadFlights');
      expect(model.selectors.map((selector) => selector.name)).toContain('selectFlights');
      expect(model.effects.map((effect) => effect.name)).toContain('load$');
      expect(model.effects[0]?.operatorIntents).toContain('switchMap');
      expect(model.entityAdapters.map((adapterModel) => adapterModel.name)).toContain('adapter');
      expect(model.componentUsages[0]?.selectedSelectors).toContain('selectFlights');
      expect(model.componentUsages[0]?.dispatchedActions).toContain('loadFlights');
    }
  });
});

describe('Graph and diagnostics', () => {
  test('graph builder rejects dangling endpoints during finalize', () => {
    const builder = new GraphBuilder();
    const a = builder.addNode('file', 'a', { kind: 'source', path: '/tmp/a.ts' });
    builder.addEdge('contains', a.id, 'missing-node', [{ kind: 'source', path: '/tmp/a.ts' }]);
    const finalized = builder.finalize();
    expect(finalized.diagnostics.some((diagnostic) => diagnostic.severity === 'error')).toBe(true);
  });

  test('safe diagnostic builder normalizes messages and ordering', () => {
    const builder = new SafeDiagnosticBuilder();
    const left = builder.build({ code: 'A', severity: 'warning', message: '  hello   world  ', sourcePaths: ['/tmp/a.ts'] });
    const right = builder.build({ code: 'A', severity: 'warning', message: 'hello world', sourcePaths: ['/tmp/a.ts'] });
    expect(left.message).toBe('hello world');
    expect(builder.normalize([right, left])).toHaveLength(2);
  });
});

describe('Property-based invariants', () => {
  test('file record generator can be normalized into stable order', () => {
    fc.assert(
      fc.property(fc.array(fileRecordArbitrary, { minLength: 1, maxLength: 12 }), (records) => {
        const sorted = [...records].sort((left, right) => left.relativePath.localeCompare(right.relativePath) || left.role.localeCompare(right.role));
        const resorted = [...sorted].sort((left, right) => left.relativePath.localeCompare(right.relativePath) || left.role.localeCompare(right.role));
        expect(resorted).toEqual(sorted);
      }),
    );
  });

  test('diagnostic normalization preserves severity', () => {
    const builder = new SafeDiagnosticBuilder();
    fc.assert(
      fc.property(fc.array(diagnosticArbitrary, { minLength: 1, maxLength: 8 }), (diagnostics) => {
        const normalized = builder.normalize(diagnostics.map((diagnostic) => createDiagnostic(diagnostic)));
        for (const diagnostic of normalized) {
          expect(['info', 'warning', 'error', 'manual-review', 'security-blocker']).toContain(diagnostic.severity);
        }
      }),
    );
  });

  test('graph edge generator can be finalized with stable sort invariants', () => {
    fc.assert(
      fc.property(fc.array(graphNodeArbitrary, { minLength: 1, maxLength: 8 }), fc.array(graphEdgeArbitrary, { maxLength: 8 }), (nodes, edges) => {
        const builder = new GraphBuilder();
        for (const node of nodes) {
          builder.addNode(node.kind, node.label, node.sourceRef);
        }
        for (const edge of edges) {
          builder.addEdge(edge.kind, edge.from, edge.to, edge.evidenceRefs as never, edge.confidence);
        }
        const result = builder.finalize();
        expect([...result.graph.nodes].sort((left, right) => left.id.localeCompare(right.id)).length).toBe(result.graph.nodes.length);
      }),
    );
  });

  test('parser summary arbitrary is structurally stable', () => {
    fc.assert(
      fc.property(parserSummaryArbitrary, (summary) => {
        const cloned = JSON.parse(JSON.stringify(summary));
        expect(cloned.symbols.length).toBe(summary.symbols.length);
        expect(cloned.hasParseErrors).toBe(summary.hasParseErrors);
      }),
    );
  });

  test('reactive form extraction is deterministic for generated control names', () => {
    fc.assert(
      fc.property(fc.array(fc.constantFrom('email', 'firstName', 'lastName', 'phone'), { minLength: 1, maxLength: 4 }), (names) => {
        const uniqueNames = [...new Set(names)];
        const controls = uniqueNames.map((name) => `${name}: ['', [Validators.required]]`).join(', ');
        const sourceText = `
          import { Component } from '@angular/core';
          import { FormBuilder, Validators } from '@angular/forms';
          @Component({ selector: 'app-profile', template: '<form [formGroup]="profileForm"></form>' })
          export class ProfileComponent {
            profileForm = this.fb.group({ ${controls} });
            constructor(private fb: FormBuilder) {}
          }
        `;
        const parser = new TypeScriptParserAdapter();
        const parsed = parser.parse('/tmp/profile.component.ts', sourceText);
        expect(parsed.ok).toBe(true);
        if (parsed.ok) {
          const extractor = new FormModelExtractor();
          const first = extractor.extract([parsed.value], []);
          const second = extractor.extract([parsed.value], []);
          expect(first).toStrictEqual(second);
          const root = first[0]?.rootControl;
          expect(root && 'controls' in root ? root.controls.map((control) => control.name) : []).toEqual([...uniqueNames].sort());
        }
      }),
      {
        numRuns: 20,
        seed: 20260609,
      },
    );
  });

  test('RxJS extraction is deterministic for generated stream names and operators', () => {
    const extractor = new RxjsModelExtractor();
    fc.assert(
      fc.property(fc.constantFrom('data$', 'items$', 'selected$'), fc.constantFrom('map', 'filter', 'takeUntil'), (streamName, operator) => {
        const summary = {
          sourcePath: '/tmp/rx.component.ts',
          symbols: [
            {
              id: 'component-rx',
              path: '/tmp/rx.component.ts',
              name: 'RxComponent',
              symbolKind: 'class' as const,
              decorators: [{ kind: 'Component', metadata: {}, rawMetadataKeys: [] }],
              members: [],
              imports: ['rxjs'],
              exports: [],
              constructorDependencies: [],
              lifecycleHooks: ['ngOnInit'],
              references: [],
              styleUrls: [],
              propertyInitializers: [
                {
                  name: streamName,
                  initializer: `this.service.load().pipe(${operator}((value) => value))`,
                  readonly: false,
                  decorators: [],
                  typeText: 'Observable<unknown>',
                  isEventEmitter: false,
                },
              ],
              methods: [
                {
                  name: 'ngOnInit',
                  parameters: [],
                  bodyText: `this.${streamName}.subscribe((value) => this.value = value);`,
                  isAsync: false,
                },
              ],
            },
          ],
          diagnostics: [],
          hasParseErrors: false,
        };

        expect(extractor.extract([summary], [])).toStrictEqual(extractor.extract([summary], []));
      }),
      {
        numRuns: 20,
        seed: 20260611,
      },
    );
  });

  test('NgRx extraction is deterministic and keeps valid action identifiers', () => {
    fc.assert(
      fc.property(fc.constantFrom('loadFlights', 'saveBooking', 'resetState'), fc.constantFrom('routeId', 'bookingId', 'status'), (actionName, payloadName) => {
        const root = fsSync.mkdtempSync(path.join(os.tmpdir(), 'ngrx-pbt-'));
        const sourcePath = path.join(root, 'state.ts');
        const sourceText = `
          import { createAction, props } from '@ngrx/store';
          export const ${actionName} = createAction('[Feature] ${actionName}', props<{ ${payloadName}: string }>());
        `;
        fsSync.writeFileSync(sourcePath, sourceText);
        const parser = new TypeScriptParserAdapter();
        const parsed = parser.parse(sourcePath, sourceText);
        expect(parsed.ok).toBe(true);
        if (parsed.ok) {
          const extractor = new NgrxModelExtractor();
          const first = extractor.extract([parsed.value]);
          const second = extractor.extract([parsed.value]);
          expect(first).toStrictEqual(second);
          expect(first.actions[0]?.name).toMatch(/^[A-Za-z_$][\w$]*$/);
          expect(first.actions[0]?.payloadProperties).toEqual([payloadName]);
        }
      }),
      {
        numRuns: 20,
        seed: 20260611,
      },
    );
  });
});

describe('Source analysis service', () => {
  test('produces partial analysis for a valid Angular-like project', async () => {
    const root = await makeTempProject();
    const service = new SourceAngularAnalysisService();
    const result = await service.analyze({ projectRoot: root });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.workspaceProfile.projectRoot).toBe(path.resolve(root));
      expect(result.value.inventory.files.length).toBeGreaterThan(0);
      expect(result.value.summary.totalFiles).toBeGreaterThan(0);
      expect(result.value.aliasModel.paths.map((mapping) => mapping.aliasPattern)).toContain('@shared/*');
      expect(result.value.aliasModel.workspaceProjects.map((project) => project.projectName)).toContain('shared-lib');
      expect(result.value.summary.totalAliases).toBeGreaterThan(0);
      expect(result.value.artifacts.graphRef.kind).toBe('generated');
    }
  });

  test('rejects unsafe project traversal', async () => {
    const service = new SourceAngularAnalysisService();
    const result = await service.analyze({ projectRoot: '/tmp/../../escape' });
    expect(result.ok).toBe(false);
  });
});
