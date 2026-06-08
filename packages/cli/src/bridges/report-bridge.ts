import crypto from 'node:crypto';

import { ok, type Result } from '@spa-bridge/core-model';

import type { CliReportArtifact, CliReportBridge, CliReportRequest } from '../types.js';
import type { CliError } from '../shared-errors.js';

const escapeHtml = (input: string): string =>
  input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const escapeMarkdown = (input: string): string =>
  input.replaceAll('|', '\\|').replaceAll('\n', ' ');

const renderJson = (request: CliReportRequest): string =>
  JSON.stringify(
    {
      title: request.payload.title,
      summary: request.payload.summary,
      warnings: request.payload.warnings,
      reviewItems: request.payload.reviewItems,
      sections: request.payload.sections,
      generatedAt: request.generatedAt,
      format: request.reportFormat,
    },
    null,
    2,
  );

const renderMarkdown = (request: CliReportRequest): string => {
  const lines = [`# ${escapeMarkdown(request.payload.title)}`, '', escapeMarkdown(request.payload.summary)];

  for (const section of request.payload.sections) {
    lines.push('', `## ${escapeMarkdown(section.title)}`);
    for (const line of section.lines) {
      lines.push(`- ${escapeMarkdown(line)}`);
    }
  }

  if (request.payload.warnings.length > 0) {
    lines.push('', '## Warnings');
    for (const warning of request.payload.warnings) {
      lines.push(`- ${escapeMarkdown(warning)}`);
    }
  }

  if (request.payload.reviewItems.length > 0) {
    lines.push('', '## Review');
    for (const item of request.payload.reviewItems) {
      lines.push(`- ${escapeMarkdown(item)}`);
    }
  }

  return lines.join('\n');
};

const renderHtml = (request: CliReportRequest): string => {
  const sections = request.payload.sections
    .map(
      (section) =>
        `<section><h2>${escapeHtml(section.title)}</h2>${section.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</section>`,
    )
    .join('');
  const warnings = request.payload.warnings.length > 0
    ? `<section><h2>Warnings</h2>${request.payload.warnings.map((warning) => `<p>${escapeHtml(warning)}</p>`).join('')}</section>`
    : '';
  const review = request.payload.reviewItems.length > 0
    ? `<section><h2>Review</h2>${request.payload.reviewItems.map((item) => `<p>${escapeHtml(item)}</p>`).join('')}</section>`
    : '';

  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(request.payload.title)}</title></head><body><h1>${escapeHtml(request.payload.title)}</h1><p>${escapeHtml(request.payload.summary)}</p>${sections}${warnings}${review}</body></html>`;
};

export const createDefaultReportBridge = (): CliReportBridge => ({
  async exportReport(request: CliReportRequest): Promise<Result<CliReportArtifact, CliError>> {
    const content =
      request.reportFormat === 'markdown'
        ? renderMarkdown(request)
        : request.reportFormat === 'html'
          ? renderHtml(request)
          : renderJson(request);

    return ok({
      format: request.reportFormat,
      content,
      outputPath: request.outputPath,
      generatedAt: request.generatedAt,
      contentHash: crypto.createHash('sha256').update(content).digest('hex'),
    });
  },
});

export type { CliReportBridge };
