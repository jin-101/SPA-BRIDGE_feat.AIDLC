import type { CanonicalConversionReport, ReportViewModel } from '../types.js';

const row = (label: string, value: string): Record<string, string> => ({ label, value });

const refText = (ref?: { kind: string; path?: string; segment?: string; symbol?: string; location?: string; id?: string }): string => {
  if (!ref) {
    return 'N/A';
  }

  if ('path' in ref) {
    return [ref.kind, ref.path, ref.segment ?? ref.symbol ?? ref.location ?? ''].filter(Boolean).join(':');
  }

  return [ref.kind, ref.id ?? ''].filter(Boolean).join(':');
};

export const buildReportViewModel = (report: CanonicalConversionReport): ReportViewModel => ({
  reportId: report.reportId,
  metadata: report.metadata,
  sections: {
    sourceInventory: [
      row('Artifact Count', Object.values(report.sourceInventory.artifactCounts).reduce((sum, value) => sum + value, 0).toString()),
      row('Detected Categories', report.sourceInventory.detectedCategories.join(', ') || 'None'),
      row('Source Refs', report.sourceInventory.sourceRefs.map(refText).join(' | ') || 'None'),
      row('Diagnostic Refs', report.sourceInventory.diagnosticRefs.join(', ') || 'None'),
    ],
    conversionOutput: [
      row('Target Strategy', report.conversionOutput.targetProject.targetStrategy),
      row('Target Framework', report.conversionOutput.targetProject.targetFramework),
      row('Converted Artifact Count', report.conversionOutput.convertedArtifactCount.toString()),
      row('Candidate Artifact Count', report.conversionOutput.totalCandidateArtifactCount.toString()),
      row('Unresolved Count', report.conversionOutput.unresolvedCount.toString()),
      row('Generated Refs', report.conversionOutput.generatedRefs.map(refText).join(' | ') || 'None'),
    ],
    diagnostics: report.diagnostics.map((diagnostic) =>
      row(
        diagnostic.id,
        [diagnostic.severity, diagnostic.reasonCode, diagnostic.safeMessage, refText(diagnostic.sourceRef), refText(diagnostic.generatedRef)]
          .filter((value) => value && value !== 'N/A')
          .join(' | '),
      ),
    ),
    aiDecisions: report.aiDecisions.map((decision) =>
      row(
        decision.id,
        [
          decision.providerCategory,
          decision.policyStatus,
          `confidence=${decision.confidence.toFixed(2)}`,
          decision.provenanceRef,
          decision.safeRationale,
        ].join(' | '),
      ),
    ),
    manualReview: [
      ...report.manualReview.items.map((item) =>
        row(
          item.id,
          [item.severity, item.category, item.reasonCode, item.safeSummary, refText(item.sourceRef), refText(item.generatedRef)]
            .filter((value) => value && value !== 'N/A')
            .join(' | '),
        ),
      ),
      ...report.manualReview.groups.map((group) =>
        row(
          group.id,
          [group.severity, group.reviewCategory ?? 'manual-review', group.itemIds.join(', '), refText(group.sourceRef), refText(group.generatedRef)]
            .filter((value) => value && value !== 'N/A')
            .join(' | '),
        ),
      ),
    ],
    quality: [
      row('Gate Status', report.quality.gateStatus),
      row('Target Percent', report.quality.targetPercent.toString()),
      row('Target Met', report.quality.targetMet ? 'true' : 'false'),
      row('Conversion Quality Score', report.quality.conversionQualityScore.toFixed(2)),
      row('Correction Attempts', report.quality.correctionAttempts.toString()),
      row('Evidence Total', report.quality.evidenceCounts.total.toString()),
      row('Evidence Blocked', report.quality.evidenceCounts.blocked.toString()),
      row('Evidence Safe', report.quality.evidenceCounts.safe.toString()),
      row('Gate Runs', report.quality.gateRuns.map((run) => `${run.gateId}:${run.status}`).join(', ') || 'None'),
      row('PBT Runs', report.quality.pbtRuns.map((run) => `${run.planId}:${run.status}`).join(', ') || 'None'),
    ],
    traceability: [
      row('Trace Links', report.traceability.links.map((link) => link.id).join(', ') || 'None'),
      row('Synthetic Origins', report.traceability.syntheticOrigins.map(refText).join(' | ') || 'None'),
      row('Coverage', `${report.traceability.coverageSummary.covered}/${report.traceability.coverageSummary.covered + report.traceability.coverageSummary.uncovered}`),
    ],
  },
});
