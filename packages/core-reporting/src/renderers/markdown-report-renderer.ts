import type { CanonicalConversionReport } from '../types.js';
import { buildReportViewModel } from '../view-model/report-view-model-builder.js';

const escapeMarkdown = (value: string): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/`/g, '\\`');

const renderSection = (title: string, rows: Record<string, string>[]): string => {
  const lines = [`## ${escapeMarkdown(title)}`];
  if (rows.length === 0) {
    lines.push('- None');
    return lines.join('\n');
  }

  for (const row of rows) {
    const label = escapeMarkdown(row.label ?? 'Item');
    const value = escapeMarkdown(row.value ?? '');
    lines.push(`- ${label}: ${value}`);
  }

  return lines.join('\n');
};

export const renderMarkdownReport = (report: CanonicalConversionReport): string => {
  const viewModel = buildReportViewModel(report);
  const lines = [
    `# Conversion Report ${escapeMarkdown(report.reportId)}`,
    renderSection('Metadata', [
      { label: 'Run ID', value: viewModel.metadata.runId },
      { label: 'Correlation ID', value: viewModel.metadata.correlationId },
      { label: 'Project Label', value: viewModel.metadata.projectLabel },
      { label: 'Source Framework', value: viewModel.metadata.sourceFramework },
      { label: 'Target Framework', value: viewModel.metadata.targetFramework },
      { label: 'Generated At', value: viewModel.metadata.generatedAt },
      { label: 'Partial', value: viewModel.metadata.partial ? 'true' : 'false' },
    ]),
    renderSection('Source Inventory', viewModel.sections.sourceInventory),
    renderSection('Conversion Output', viewModel.sections.conversionOutput),
    renderSection('Diagnostics', viewModel.sections.diagnostics),
    renderSection('AI Decisions', viewModel.sections.aiDecisions),
    renderSection('Manual Review', viewModel.sections.manualReview),
    renderSection('Quality', viewModel.sections.quality),
    renderSection('Traceability', viewModel.sections.traceability),
  ];

  return lines.join('\n\n').trim() + '\n';
};
