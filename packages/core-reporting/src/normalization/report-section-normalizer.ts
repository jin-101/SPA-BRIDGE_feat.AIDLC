import type {
  AiDecision,
  ManualReviewItem,
  ReportDiagnostic,
  ReportInputBundle,
  ReportQualitySection,
  ReportTraceLink,
} from '../types.js';

const compareStrings = (left: string, right: string): number => left.localeCompare(right);

const sourceRefSortKey = (ref?: { path: string; symbol?: string; location?: string }): string =>
  ref ? `${ref.path}::${ref.symbol ?? ''}::${ref.location ?? ''}` : '';

const generatedRefSortKey = (ref?: { path: string; segment?: string }): string =>
  ref ? `${ref.path}::${ref.segment ?? ''}` : '';

const severityOrder: Record<string, number> = {
  blocking: 0,
  critical: 1,
  warning: 2,
  info: 3,
  'manual-review': 4,
};

const sortByStableKey = <T>(items: T[], keyFn: (item: T) => string): T[] =>
  [...items].sort((left, right) => compareStrings(keyFn(left), keyFn(right)));

const uniqueBy = <T>(items: T[], keyFn: (item: T) => string): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
};

const sortRecordKeys = (record: Record<string, number>): Record<string, number> =>
  Object.fromEntries(Object.entries(record).sort(([left], [right]) => compareStrings(left, right)));

export const normalizeDiagnostics = (diagnostics: ReportDiagnostic[]): ReportDiagnostic[] =>
  sortByStableKey(uniqueBy(diagnostics, (item) => item.id), (item) =>
    [
      severityOrder[item.severity] ?? 99,
      sourceRefSortKey(item.sourceRef),
      generatedRefSortKey(item.generatedRef),
      item.storyArea ?? '',
      item.reviewCategory ?? '',
      item.reasonCode,
      item.safeMessage,
      item.id,
    ].join('|'),
  );

export const normalizeManualReviewItems = (items: ManualReviewItem[]): ManualReviewItem[] =>
  sortByStableKey(uniqueBy(items, (item) => item.id), (item) =>
    [
      severityOrder[item.severity] ?? 99,
      item.category,
      sourceRefSortKey(item.sourceRef),
      generatedRefSortKey(item.generatedRef),
      item.storyArea ?? '',
      item.reasonCode,
      item.id,
    ].join('|'),
  );

export const normalizeAiDecisions = (items: AiDecision[]): AiDecision[] =>
  sortByStableKey(uniqueBy(items, (item) => item.id), (item) => item.id);

export const normalizeTraceLinks = (links: ReportTraceLink[]): ReportTraceLink[] =>
  sortByStableKey(uniqueBy(links, (item) => item.id), (item) =>
    [item.id, item.source.path, generatedRefSortKey(item.target.kind === 'generated' ? item.target : undefined), item.relation].join('|'),
  );

export const normalizeQualitySection = (quality: ReportQualitySection, targetPercent: number): ReportQualitySection => ({
  ...quality,
  gateRuns: sortByStableKey(uniqueBy(quality.gateRuns, (item) => item.gateId), (item) => item.gateId),
  pbtRuns: sortByStableKey(uniqueBy(quality.pbtRuns, (item) => item.planId), (item) => item.planId),
  correctionAttempts: Math.max(0, quality.correctionAttempts),
  evidenceCounts: {
    total: Math.max(0, quality.evidenceCounts.total),
    blocked: Math.max(0, quality.evidenceCounts.blocked),
    safe: Math.max(0, quality.evidenceCounts.safe),
  },
  conversionQualityScore: Math.min(1, Math.max(0, quality.conversionQualityScore)),
  targetPercent: Math.min(100, Math.max(0, targetPercent)),
  targetMet: Math.min(1, Math.max(0, quality.conversionQualityScore)) * 100 >= Math.min(100, Math.max(0, targetPercent)),
});

export const normalizeReportInputBundle = (bundle: ReportInputBundle, targetPercent = 85): ReportInputBundle => ({
  metadata: { ...bundle.metadata },
  sourceInventory: {
    ...bundle.sourceInventory,
    artifactCounts: sortRecordKeys(bundle.sourceInventory.artifactCounts),
    detectedCategories: uniqueBy([...bundle.sourceInventory.detectedCategories].sort(compareStrings), (item) => item),
    sourceRefs: sortByStableKey(uniqueBy(bundle.sourceInventory.sourceRefs, (item) => `${item.kind}:${item.path}:${item.symbol ?? ''}:${item.location ?? ''}`), (item) =>
      [item.path, item.symbol ?? '', item.location ?? ''].join('|'),
    ),
    diagnosticRefs: uniqueBy([...bundle.sourceInventory.diagnosticRefs].sort(compareStrings), (item) => item),
  },
  conversionOutput: {
    ...bundle.conversionOutput,
    generatedArtifactCounts: sortRecordKeys(bundle.conversionOutput.generatedArtifactCounts),
    generatedRefs: sortByStableKey(uniqueBy(bundle.conversionOutput.generatedRefs, (item) => `${item.kind}:${item.path}:${item.segment ?? ''}`), (item) =>
      [item.path, item.segment ?? ''].join('|'),
    ),
  },
  diagnostics: normalizeDiagnostics(bundle.diagnostics),
  aiDecisions: normalizeAiDecisions(bundle.aiDecisions),
  manualReview: normalizeManualReviewItems(bundle.manualReview),
  quality: normalizeQualitySection(bundle.quality, targetPercent),
  traceability: {
    ...bundle.traceability,
    links: normalizeTraceLinks(bundle.traceability.links),
    syntheticOrigins: sortByStableKey(
      uniqueBy(bundle.traceability.syntheticOrigins, (item) => `${item.kind}:${item.path}:${item.segment ?? ''}`),
      (item) => [item.path, item.segment ?? ''].join('|'),
    ),
    coverageSummary: {
      covered: Math.max(0, bundle.traceability.coverageSummary.covered),
      uncovered: Math.max(0, bundle.traceability.coverageSummary.uncovered),
    },
  },
});
