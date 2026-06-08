import { createHash } from 'node:crypto';

import type { CanonicalConversionReport, ReportExportMetadata } from '../types.js';

export type ReportExportArtifact = {
  json: string;
  markdown?: string;
  html?: string;
};

const hashContent = (content: string): string => createHash('sha256').update(content).digest('hex');

export const buildReportExportMetadata = (
  report: CanonicalConversionReport,
  exports: ReportExportArtifact,
  rendererVersion: string,
  exportedAt: string,
): ReportExportMetadata => {
  const formats: ReportExportMetadata['formats'] = ['json'];
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
      ...(typeof exports.markdown === 'string' ? [{ format: 'markdown' as const, hash: hashContent(exports.markdown) }] : []),
      ...(typeof exports.html === 'string' ? [{ format: 'html' as const, hash: hashContent(exports.html) }] : []),
    ],
    rendererVersion,
    exportedAt,
    canonicalReportRef: report.reportId,
    partial: report.metadata.partial,
  };
};

