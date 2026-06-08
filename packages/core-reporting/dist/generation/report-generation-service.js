import { err, ok } from '@spa-bridge/core-model';
import { buildCanonicalConversionReport } from '../builder/canonical-report-builder.js';
import { buildReportExportMetadata } from '../export/report-export-metadata-builder.js';
import { buildManualReviewGroups, sortDiagnostics } from '../grouping/report-grouping-service.js';
import { normalizeReportInputBundle } from '../normalization/report-section-normalizer.js';
import { buildQualityReportSummary } from '../quality/quality-report-summary-builder.js';
import { renderHtmlReport } from '../renderers/html-report-renderer.js';
import { serializeCanonicalJson } from '../renderers/json-report-serializer.js';
import { renderMarkdownReport } from '../renderers/markdown-report-renderer.js';
import { buildTraceCoverageSummary, validateTraceCoverage } from '../traceability/trace-coverage-validator.js';
import { validateCanonicalConversionReport } from '../validation/report-schema-validator.js';
import { validateReportGenerationRequest } from '../validation/report-input-validator.js';
const createReportId = (runId) => `report-${runId}`;
const createDefaultExportMetadata = (reportId, rendererVersion, exportedAt, partial) => ({
    formats: [],
    contentHashes: [],
    rendererVersion,
    exportedAt,
    canonicalReportRef: reportId,
    partial,
});
const buildReport = (request, bundle, options) => {
    const reportId = createReportId(bundle.metadata.runId);
    const rendererVersion = request.rendererVersion || options.defaultRendererVersion || '1.0.0';
    const quality = buildQualityReportSummary(bundle.quality, request.qualityTargetPercent);
    const partial = request.partial || !quality.targetMet || bundle.manualReview.length > 0;
    const traceCoverage = validateTraceCoverage(bundle.traceability, bundle.conversionOutput.generatedRefs);
    if (!traceCoverage.ok) {
        return err(traceCoverage.error);
    }
    const normalizedBundle = {
        ...bundle,
        quality,
        traceability: {
            ...bundle.traceability,
            coverageSummary: buildTraceCoverageSummary(bundle.traceability, bundle.conversionOutput.generatedRefs),
        },
    };
    const reportMetadata = {
        ...bundle.metadata,
        partial,
    };
    const diagnostics = sortDiagnostics(normalizedBundle.diagnostics);
    const manualReviewGroups = buildManualReviewGroups(normalizedBundle.manualReview);
    const baseReport = buildCanonicalConversionReport({
        reportId,
        inputBundle: normalizedBundle,
        metadata: reportMetadata,
        diagnostics,
        aiDecisions: normalizedBundle.aiDecisions,
        manualReviewItems: normalizedBundle.manualReview,
        manualReviewGroups,
        quality: normalizedBundle.quality,
        traceability: normalizedBundle.traceability,
        exportMetadata: createDefaultExportMetadata(reportId, rendererVersion, request.generatedAt, partial),
    });
    const markdown = request.requestedFormats.includes('markdown') ? renderMarkdownReport(baseReport) : undefined;
    const html = request.requestedFormats.includes('html') ? renderHtmlReport(baseReport) : undefined;
    const jsonForHashBasis = serializeCanonicalJson({
        ...baseReport,
        exportMetadata: {
            ...baseReport.exportMetadata,
            contentHashes: [],
        },
    });
    const exportMetadata = buildReportExportMetadata({
        ...baseReport,
        exportMetadata: {
            ...baseReport.exportMetadata,
            contentHashes: [],
        },
    }, {
        json: jsonForHashBasis,
        markdown,
        html,
    }, rendererVersion, request.generatedAt);
    const finalReport = {
        ...baseReport,
        exportMetadata,
    };
    const schemaValidation = validateCanonicalConversionReport(finalReport);
    if (!schemaValidation.ok) {
        return err(schemaValidation.error);
    }
    const exports = {
        json: serializeCanonicalJson(finalReport),
        markdown,
        html,
        metadata: exportMetadata,
    };
    return ok({
        report: finalReport,
        exports,
        diagnostics,
    });
};
export class ReportGenerationService {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    generate(request) {
        const requestValidation = validateReportGenerationRequest(request);
        if (!requestValidation.ok) {
            return err(requestValidation.error);
        }
        const normalizedBundle = normalizeReportInputBundle(requestValidation.value.inputBundle, requestValidation.value.qualityTargetPercent);
        const normalizedRequest = {
            ...requestValidation.value,
            inputBundle: normalizedBundle,
        };
        return buildReport(normalizedRequest, normalizedBundle, this.options);
    }
}
export const generateConversionReport = (request, options = {}) => new ReportGenerationService(options).generate(request);
//# sourceMappingURL=report-generation-service.js.map