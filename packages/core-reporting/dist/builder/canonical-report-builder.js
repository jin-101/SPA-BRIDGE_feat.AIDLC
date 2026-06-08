import { ReportSchemaVersion } from '../types.js';
export const buildCanonicalConversionReport = (input) => {
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
//# sourceMappingURL=canonical-report-builder.js.map