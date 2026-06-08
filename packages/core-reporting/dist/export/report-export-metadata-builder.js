import { createHash } from 'node:crypto';
const hashContent = (content) => createHash('sha256').update(content).digest('hex');
export const buildReportExportMetadata = (report, exports, rendererVersion, exportedAt) => {
    const formats = ['json'];
    if (typeof exports.markdown === 'string') {
        formats.push('markdown');
    }
    if (typeof exports.html === 'string') {
        formats.push('html');
    }
    return {
        formats,
        contentHashes: [
            { format: 'json', hash: hashContent(exports.json) },
            ...(typeof exports.markdown === 'string' ? [{ format: 'markdown', hash: hashContent(exports.markdown) }] : []),
            ...(typeof exports.html === 'string' ? [{ format: 'html', hash: hashContent(exports.html) }] : []),
        ],
        rendererVersion,
        exportedAt,
        canonicalReportRef: report.reportId,
        partial: report.metadata.partial,
    };
};
//# sourceMappingURL=report-export-metadata-builder.js.map