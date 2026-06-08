import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  buildReportExportMetadata,
  buildReportViewModel,
  buildTraceCoverageSummary,
  generateConversionReport,
  normalizeReportInputBundle,
  renderHtmlReport,
  renderMarkdownReport,
  reportGenerationRequestArbitrary,
  reportInputBundleArbitrary,
  serializeCanonicalJson,
  validateReportGenerationRequest,
  validateTraceCoverage,
} from '../src/index.js';
import type { ReportGenerationRequest } from '../src/index.js';

const expectOk = <T>(result: { ok: true; value: T } | { ok: false; error: unknown }): T => {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw result.error;
  }
  return result.value;
};

const createFixtureRequest = (): ReportGenerationRequest => ({
    inputBundle: {
      metadata: {
        runId: 'run-001',
        correlationId: 'corr-001',
        projectLabel: 'SPA Bridge',
        sourceFramework: 'Angular 15',
        targetFramework: 'React 18',
        generatedAt: '2026-06-07T00:00:00.000Z',
      },
    sourceInventory: {
      artifactCounts: { components: 2, services: 1 },
      detectedCategories: ['component', 'service'],
      sourceRefs: [{ kind: 'source', path: 'src/app/app.component.ts', symbol: 'AppComponent' }],
      diagnosticRefs: ['diag-001'],
    },
    conversionOutput: {
      generatedArtifactCounts: { component: 2, route: 1 },
      generatedRefs: [{ kind: 'generated', path: 'src/app/app.component.tsx', segment: 'component' }],
      targetProject: { targetStrategy: 'vite-react', targetFramework: 'React 18' },
      convertedArtifactCount: 1,
      totalCandidateArtifactCount: 1,
      unresolvedCount: 0,
    },
    diagnostics: [
      {
        id: 'diag-001',
        severity: 'warning',
        reasonCode: 'review_binding',
        safeMessage: 'Manual review required for one binding.',
        sourceRef: { kind: 'source', path: 'src/app/app.component.ts', symbol: 'AppComponent' },
        generatedRef: { kind: 'generated', path: 'src/app/app.component.tsx', segment: 'component' },
        storyArea: 'US-013',
        reviewCategory: 'mapping',
      },
    ],
    aiDecisions: [
      {
        id: 'ai-001',
        mappingRequestId: 'map-001',
        providerCategory: 'internal',
        policyStatus: 'allowed',
        confidence: 0.92,
        provenanceRef: 'ref:provider/internal',
        safeRationale: 'Stable mapping selected.',
      },
    ],
    manualReview: [
      {
        id: 'review-001',
        severity: 'warning',
        category: 'mapping',
        reasonCode: 'ambiguous-binding',
        safeSummary: 'Review the ambiguous binding mapping.',
        remediationHint: 'Compare Angular event and React prop behavior.',
        sourceRef: { kind: 'source', path: 'src/app/app.component.ts', symbol: 'AppComponent' },
        generatedRef: { kind: 'generated', path: 'src/app/app.component.tsx', segment: 'component' },
        storyArea: 'US-013',
      },
    ],
    quality: {
      gateStatus: 'passed',
      gateRuns: [
        {
          gateId: 'build',
          status: 'passed',
          durationMs: 1000,
          safeSummary: 'Build passed',
          diagnosticRefs: [],
          traceRefs: ['trace-001'],
        },
      ],
      pbtRuns: [],
      correctionAttempts: 0,
      evidenceCounts: { total: 1, blocked: 0, safe: 1 },
      conversionQualityScore: 0.91,
      targetPercent: 85,
      targetMet: true,
    },
    traceability: {
      links: [
        {
          id: 'trace-001',
          source: { kind: 'source', path: 'src/app/app.component.ts', symbol: 'AppComponent' },
          target: { kind: 'generated', path: 'src/app/app.component.tsx', segment: 'component' },
          relation: 'maps-to',
          confidence: 1,
          notes: 'Trace preserved',
        },
      ],
      syntheticOrigins: [{ kind: 'generated', path: 'src/app/app.component.tsx', segment: 'component' }],
      coverageSummary: { covered: 1, uncovered: 0 },
    },
  },
  requestedFormats: ['json', 'markdown', 'html'],
  rendererVersion: '1.0.0',
  generatedAt: '2026-06-07T00:00:00.000Z',
  qualityTargetPercent: 85,
  partial: false,
});

describe('core-reporting package', () => {
  it('validates report generation requests', () => {
    const validation = validateReportGenerationRequest(createFixtureRequest());
    expect(validation.ok).toBe(true);
  });

  it('generates a canonical report and stable exports', () => {
    const result = expectOk(generateConversionReport(createFixtureRequest()));

    expect(result.report.schemaVersion).toBe(1);
    expect(result.report.manualReview.groups.length).toBeGreaterThan(0);
    expect(result.exports.json).toContain('"reportId": "report-run-001"');
    expect(result.exports.markdown).toContain('# Conversion Report report-run-001');
    expect(result.exports.html).toContain('<h1>Conversion Report report-run-001</h1>');
    expect(result.exports.metadata.contentHashes).toHaveLength(3);
  });

  it('renders markdown and html deterministically from the same report', () => {
    const result = expectOk(generateConversionReport(createFixtureRequest()));

    const viewModel = buildReportViewModel(result.report);
    const firstMarkdown = renderMarkdownReport(result.report);
    const secondMarkdown = renderMarkdownReport(result.report);
    const firstHtml = renderHtmlReport(result.report);
    const secondHtml = renderHtmlReport(result.report);

    expect(viewModel).toStrictEqual(buildReportViewModel(result.report));
    expect(firstMarkdown).toBe(secondMarkdown);
    expect(firstHtml).toBe(secondHtml);
  });

  it('rejects unsafe report content', () => {
    const request = createFixtureRequest();
    request.inputBundle.metadata.projectLabel = '<script>alert(1)</script>';

    const result = generateConversionReport(request);
    expect(result.ok).toBe(false);
  });

  it('rejects absolute source paths', () => {
    const request = createFixtureRequest();
    request.inputBundle.sourceInventory.sourceRefs = [{ kind: 'source', path: '/abs/path.ts' }];

    const result = generateConversionReport(request);
    expect(result.ok).toBe(false);
  });

  it('fails when trace coverage is missing', () => {
    const request = createFixtureRequest();
    request.inputBundle.traceability.links = [];
    request.inputBundle.traceability.syntheticOrigins = [];

    const result = generateConversionReport(request);
    expect(result.ok).toBe(false);
  });

  it('serializes report JSON deterministically', () => {
    const result = expectOk(generateConversionReport(createFixtureRequest()));

    const jsonA = serializeCanonicalJson(result.report);
    const jsonB = serializeCanonicalJson(result.report);

    expect(jsonA).toBe(jsonB);
  });

  it('keeps export metadata deterministic', () => {
    const result = expectOk(generateConversionReport(createFixtureRequest()));

    const metadata = buildReportExportMetadata(
      result.report,
      { json: result.exports.json, markdown: result.exports.markdown, html: result.exports.html },
      result.exports.metadata.rendererVersion,
      result.exports.metadata.exportedAt,
    );

    expect(metadata.canonicalReportRef).toBe(result.report.reportId);
    expect(metadata.contentHashes.map((entry) => entry.format)).toEqual(['json', 'markdown', 'html']);
  });

  it('keeps normalization idempotent', () => {
    const request = createFixtureRequest();
    const normalized = normalizeReportInputBundle(request.inputBundle, request.qualityTargetPercent);
    const twice = normalizeReportInputBundle(normalized, request.qualityTargetPercent);
    expect(normalized).toStrictEqual(twice);
  });

  it('builds trace coverage summaries from generated refs', () => {
    const request = createFixtureRequest();
    const summary = buildTraceCoverageSummary(request.inputBundle.traceability, request.inputBundle.conversionOutput.generatedRefs);
    expect(summary.covered).toBe(1);
    expect(summary.uncovered).toBe(0);
  });

  it('can validate trace coverage separately', () => {
    const request = createFixtureRequest();
    const result = validateTraceCoverage(request.inputBundle.traceability, request.inputBundle.conversionOutput.generatedRefs);
    expect(result.ok).toBe(true);
  });
});

describe('property-based reporting', () => {
  it('keeps report generation deterministic for generated requests', async () => {
    await fc.assert(
      fc.asyncProperty(reportGenerationRequestArbitrary, async (request) => {
        const first = generateConversionReport(request);
        const second = generateConversionReport(request);

        expect(first.ok).toBe(second.ok);
        if (first.ok && second.ok) {
          expect(first.value.report).toStrictEqual(second.value.report);
          expect(first.value.exports.json).toStrictEqual(second.value.exports.json);
        }
      }),
      { numRuns: 15, seed: 20260607 },
    );
  });

  it('keeps normalization idempotent across arbitrary bundles', async () => {
    await fc.assert(
      fc.asyncProperty(reportInputBundleArbitrary, async (bundle) => {
        const normalized = normalizeReportInputBundle(bundle, 85);
        const twice = normalizeReportInputBundle(normalized, 85);
        expect(normalized).toStrictEqual(twice);
      }),
      { numRuns: 15, seed: 20260607 },
    );
  });
});
