import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  createBuiltInRules,
  createBenchmarkAngularAnalysisFixture,
  DraftValidator,
  ExecutionPlanner,
  RegistryValidator,
  RuleRegistry,
  TransformationService,
  transformationRequestArbitrary,
} from '../src/index.js';
import type { TransformationRequest } from '../src/index.js';

const createRequest = (overrides: Partial<TransformationRequest> = {}): TransformationRequest => ({
  runId: 'run-001',
  correlationId: 'corr-001',
  analysis: createBenchmarkAngularAnalysisFixture({
    componentCount: 2,
    includeUnsupportedTemplate: false,
  }),
  targetFramework: 'react',
  targetProjectStrategy: 'vite-react-typescript',
  stateStrategy: 'unknown',
  enabledRulePacks: ['core'],
  outputNamespace: '/workspace/spa-bridge/.spa-bridge/transformation',
  ...overrides,
});

const expectOk = <T, E>(result: { ok: true; value: T } | { ok: false; error: E }): T => {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('Expected result to be ok');
  }
  return result.value;
};

describe('TransformationService', () => {
  it('produces deterministic draft artifacts for a representative benchmark fixture', () => {
    const service = new TransformationService();
    const first = expectOk(service.transform(createRequest()));
    const second = expectOk(service.transform(createRequest()));

    expect(first.status).toBe('partial');
    expect(first.draftSet).toStrictEqual(second.draftSet);
    expect(first.summary).toStrictEqual(second.summary);
    expect(first.passSummary).toStrictEqual(second.passSummary);
  });

  it('preserves unsupported mappings as manual-review items', () => {
    const service = new TransformationService();
    const result = expectOk(
      service.transform(
        createRequest({
          analysis: createBenchmarkAngularAnalysisFixture({
            componentCount: 1,
            includeUnsupportedTemplate: true,
          }),
        }),
      ),
    );

    expect(result.status).toBe('partial');
    expect(result.draftSet.manualReviewItems.length).toBeGreaterThan(0);
    expect(result.draftSet.diagnostics.some((diagnostic) => diagnostic.severity === 'manual-review')).toBe(true);
  });

  it('carries NgRx IR into Redux Toolkit drafts and component store usage', () => {
    const analysis = createBenchmarkAngularAnalysisFixture({
      componentCount: 1,
      includeUnsupportedTemplate: false,
    });
    const componentPath = analysis.typeScriptSummaries[0]?.sourcePath ?? '/workspace/spa-bridge/src/app/component-1.component.ts';
    analysis.ngrxModel = {
      schemaVersion: 1,
      actions: [
        {
          id: 'action-load-flights',
          name: 'loadFlights',
          actionType: '[Flights] Load',
          sourceRef: { kind: 'source', path: componentPath, symbol: 'loadFlights' },
          payloadProperties: ['routeId'],
        },
      ],
      reducers: [
        {
          id: 'reducer-flights',
          name: 'flightsReducer',
          featureName: 'flights',
          sourceRef: { kind: 'source', path: componentPath, symbol: 'flightsReducer' },
          handlers: [
            {
              id: 'handler-load-flights',
              actionNames: ['loadFlights'],
              reducerExpression: '(state) => state',
              reviewRequired: false,
            },
          ],
        },
      ],
      selectors: [
        {
          id: 'selector-flights',
          name: 'selectFlights',
          featureName: 'flights',
          dependencies: ['selectFlightsFeature'],
          sourceRef: { kind: 'source', path: componentPath, symbol: 'selectFlights' },
          reviewRequired: false,
        },
      ],
      effects: [
        {
          id: 'effect-load-flights',
          name: 'loadFlights$',
          sourceRef: { kind: 'source', path: componentPath, symbol: 'loadFlights$' },
          ofTypeActions: ['loadFlights'],
          dispatch: true,
          operatorIntents: ['switchMap'],
          serviceCallRefs: ['api.load'],
          safety: 'safe',
        },
      ],
      entityAdapters: [],
      componentUsages: [
        {
          id: 'usage-flights',
          ownerComponentPath: componentPath,
          ownerComponentName: analysis.typeScriptSummaries[0]?.symbols[0]?.name,
          sourceRef: { kind: 'source', path: componentPath },
          storeDependencyName: 'store',
          selectedSelectors: ['selectFlights'],
          dispatchedActions: ['loadFlights'],
          usageKind: 'mixed',
          reviewRequired: false,
        },
      ],
      hasRouterStore: false,
      diagnostics: [],
    };
    const service = new TransformationService();
    const result = expectOk(service.transform(createRequest({ analysis, stateStrategy: 'store' })));

    expect(result.draftSet.reduxToolkit[0]?.featureName).toBe('flights');
    expect(result.draftSet.reduxToolkit[0]?.actions.map((action) => action.name)).toContain('loadFlights');
    expect(result.draftSet.components[0]?.reduxUsage?.selectorRefs).toContain('selectFlights');
    expect(result.draftSet.components[0]?.reduxUsage?.actionRefs).toContain('loadFlights');
  });
});

describe('Registry and planner', () => {
  it('orders built-in rules deterministically and rejects duplicate rule ids', () => {
    const registryValidator = new RegistryValidator();
    const planner = new ExecutionPlanner();
    const rules = createBuiltInRules();

    const registryResult = expectOk(registryValidator.validate(rules));
    const planResult = expectOk(planner.plan(registryResult));

    expect(planResult.orderedRules.map((rule) => rule.ruleId)).toEqual([
      'component-conversion',
      'template-conversion',
      'behavior-conversion',
      'service-di-conversion',
      'route-conversion',
      'state-conversion',
      'angular-ecosystem-review',
    ]);

    const duplicateResult = registryValidator.validate([...rules, rules[0]]);
    expect(duplicateResult.ok).toBe(false);
  });
});

describe('Property-based conversion properties', () => {
  it('keeps transformation results stable across repeated runs', () => {
    fc.assert(
      fc.property(transformationRequestArbitrary, (request) => {
        const service = new TransformationService();
        const first = expectOk(service.transform(request));
        const second = expectOk(service.transform(request));

        expect(first.draftSet).toStrictEqual(second.draftSet);
        expect(first.summary).toStrictEqual(second.summary);
        expect(first.passSummary).toStrictEqual(second.passSummary);
      }),
      {
        numRuns: 20,
        seed: 20260605,
      },
    );
  });

  it('preserves trace coverage for generated drafts', () => {
    fc.assert(
      fc.property(transformationRequestArbitrary, (request) => {
        const service = new TransformationService();
        const result = expectOk(service.transform(request));
        const traceTargets = new Set(
          result.draftSet.traces.map((trace) => (trace.target.kind === 'generated' ? trace.target.path : trace.target.id)),
        );

        for (const draft of [
          ...result.draftSet.components,
          ...result.draftSet.templates,
          ...result.draftSet.services,
          ...result.draftSet.routes,
          ...result.draftSet.state,
        ]) {
          expect(draft.generatedRefs.every((ref) => traceTargets.has(ref.path))).toBe(true);
        }
      }),
      {
        numRuns: 20,
        seed: 20260605,
      },
    );
  });
});

describe('Draft validation', () => {
  it('accepts the generated draft set from the pipeline', () => {
    const service = new TransformationService();
    const result = expectOk(service.transform(createRequest()));
    const validator = new DraftValidator();

    expect(validator.validate(result.draftSet).ok).toBe(true);
  });
});
