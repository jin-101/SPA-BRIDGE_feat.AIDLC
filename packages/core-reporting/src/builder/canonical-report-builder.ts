import type {
  AiDecision,
  CanonicalConversionReport,
  ManualReviewItem,
  ReportDiagnostic,
  ReportExportMetadata,
  ReportGroup,
  ReportMetadata,
  ReportInputBundle,
  ReportQualitySection,
  ReportTraceabilitySection,
} from '../types.js';
import { ReportSchemaVersion } from '../types.js';

type ReportInputBundleWithPartial = Omit<ReportInputBundle, 'metadata'> & {
  metadata: ReportInputBundle['metadata'] & { partial?: boolean };
};

export type CanonicalReportBuildInput = {
  reportId?: string;
  inputBundle: ReportInputBundleWithPartial;
  metadata: ReportMetadata;
  diagnostics: ReportDiagnostic[];
  aiDecisions: AiDecision[];
  manualReviewItems: ManualReviewItem[];
  manualReviewGroups: ReportGroup[];
  quality: ReportQualitySection;
  traceability: ReportTraceabilitySection;
  exportMetadata: ReportExportMetadata;
};

export const buildCanonicalConversionReport = (
  input: CanonicalReportBuildInput,
): CanonicalConversionReport => {
  const reportId = input.reportId ?? `report-${input.inputBundle.metadata.runId}`;
  const blockingCount = input.manualReviewItems.filter((item) => item.severity === 'blocking' || item.severity === 'critical').length;

  return {
    reportId,
    schemaVersion: ReportSchemaVersion,
    metadata: { ...input.metadata, partial: input.metadata.partial ?? false },
    sourceInventory: { ...input.inputBundle.sourceInventory },
    conversionOutput: { ...input.inputBundle.conversionOutput },
    diagnostics: [...input.diagnostics],
    aiDecisions: [...input.aiDecisions],
    manualReview: {
      items: [...input.manualReviewItems],
      groups: [...input.manualReviewGroups],
      blockingCount,
    },
    quality: { ...input.quality },
    traceability: { ...input.traceability },
    exportMetadata: { ...input.exportMetadata, canonicalReportRef: reportId },
  };
};
