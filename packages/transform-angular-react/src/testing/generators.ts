import fc from 'fast-check';

import type { TransformationRequest } from '../types.js';
import { createBenchmarkAngularAnalysisFixture } from './benchmark-fixture-factory.js';

const identifierArbitrary = fc
  .array(fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5'), { minLength: 4, maxLength: 12 })
  .map((characters) => characters.join(''));

const namespaceArbitrary = fc
  .array(fc.constantFrom('app', 'transform', 'drafts', 'reviews', 'demo'), { minLength: 1, maxLength: 4 })
  .map((segments) => `/workspace/${segments.join('/')}`);

export type BenchmarkAnalysisOptions = {
  componentCount: number;
  includeUnsupportedTemplate: boolean;
};

export const benchmarkAnalysisOptionsArbitrary = fc.record<BenchmarkAnalysisOptions>({
  componentCount: fc.integer({ min: 1, max: 3 }),
  includeUnsupportedTemplate: fc.boolean(),
});

export const benchmarkAnalysisArbitrary = benchmarkAnalysisOptionsArbitrary.map((options) =>
  createBenchmarkAngularAnalysisFixture({
    componentCount: options.componentCount,
    includeUnsupportedTemplate: options.includeUnsupportedTemplate,
  }),
);

export const transformationRequestArbitrary = benchmarkAnalysisOptionsArbitrary.chain((analysisOptions) =>
  fc
    .record({
      runId: identifierArbitrary,
      correlationId: identifierArbitrary,
      targetProjectStrategy: fc.constantFrom('nextjs-typescript', 'vite-react-typescript', 'react-default'),
      stateStrategy: fc.constantFrom('service', 'signals', 'store', 'local', 'unknown'),
      outputNamespace: fc.option(namespaceArbitrary, { nil: undefined }),
    })
    .map((requestFields): TransformationRequest => ({
      runId: requestFields.runId,
      correlationId: requestFields.correlationId,
      analysis: createBenchmarkAngularAnalysisFixture({
        componentCount: analysisOptions.componentCount,
        includeUnsupportedTemplate: analysisOptions.includeUnsupportedTemplate,
      }),
      targetFramework: 'react',
      targetProjectStrategy: requestFields.targetProjectStrategy as TransformationRequest['targetProjectStrategy'],
      stateStrategy: requestFields.stateStrategy as TransformationRequest['stateStrategy'],
      enabledRulePacks: ['core'],
      outputNamespace: requestFields.outputNamespace,
    })),
);

export const transformationRequestListArbitrary = fc.array(transformationRequestArbitrary, { minLength: 1, maxLength: 3 });
