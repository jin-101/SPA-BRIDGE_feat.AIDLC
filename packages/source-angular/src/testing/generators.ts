import fc from 'fast-check';

export const fileRecordArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  path: fc.webUrl().map((url) => url.replace(/^https?:\/\//, '/tmp/')),
  relativePath: fc.string({ minLength: 1, maxLength: 60 }),
  role: fc.constantFrom('component', 'module', 'directive', 'pipe', 'service', 'route', 'state', 'template', 'style', 'config', 'unknown'),
  kind: fc.constantFrom('typescript', 'template', 'style', 'json', 'text'),
  evidence: fc.array(fc.string({ minLength: 1, maxLength: 40 }), { minLength: 1, maxLength: 4 }),
  relatedPaths: fc.array(fc.string({ minLength: 1, maxLength: 40 }), { maxLength: 4 }),
  parseStatus: fc.constantFrom('pending', 'parsed', 'partial', 'failed'),
});

export const diagnosticArbitrary = fc.record({
  code: fc.string({ minLength: 3, maxLength: 20 }),
  severity: fc.constantFrom('info', 'warning', 'error', 'manual-review', 'security-blocker'),
  message: fc.string({ minLength: 1, maxLength: 80 }),
  sourceRefs: fc.array(
    fc.record({
      kind: fc.constant('source'),
      path: fc.string({ minLength: 1, maxLength: 50 }),
      symbol: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
      location: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
    }),
    { maxLength: 3 },
  ),
  generatedRefs: fc.constant([]),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 4 }),
  remediationHint: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
});

export const graphNodeArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 30 }),
  kind: fc.constantFrom('project', 'file', 'symbol', 'template', 'style', 'route', 'state', 'external'),
  label: fc.string({ minLength: 1, maxLength: 40 }),
  sourceRef: fc.option(
    fc.record({
      kind: fc.constant('source'),
      path: fc.string({ minLength: 1, maxLength: 50 }),
      symbol: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
      location: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
    }),
    { nil: undefined },
  ),
});

export const graphEdgeArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 30 }),
  kind: fc.constantFrom('imports', 'declares', 'provides', 'uses-template', 'uses-style', 'routes-to', 'guards', 'references', 'contains'),
  from: fc.string({ minLength: 1, maxLength: 30 }),
  to: fc.string({ minLength: 1, maxLength: 30 }),
  evidenceRefs: fc.array(
    fc.record({
      kind: fc.constant('source'),
      path: fc.string({ minLength: 1, maxLength: 50 }),
      symbol: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
      location: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
    }),
    { maxLength: 2 },
  ),
  confidence: fc.float({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
});

export const parserSummaryArbitrary = fc.record({
  sourcePath: fc.string({ minLength: 1, maxLength: 50 }),
  symbols: fc.array(
    fc.record({
      id: fc.string({ minLength: 1, maxLength: 30 }),
      path: fc.string({ minLength: 1, maxLength: 50 }),
      name: fc.string({ minLength: 1, maxLength: 30 }),
      symbolKind: fc.constantFrom('class', 'function', 'interface', 'type', 'const', 'import', 'export', 'unknown'),
      decorators: fc.constant([]),
      members: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 4 }),
      imports: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 4 }),
      exports: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 4 }),
      constructorDependencies: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 4 }),
      lifecycleHooks: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 4 }),
      references: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 4 }),
    }),
    { maxLength: 5 },
  ),
  diagnostics: fc.constant([]),
  hasParseErrors: fc.boolean(),
});
