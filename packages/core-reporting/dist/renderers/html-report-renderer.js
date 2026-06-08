import { buildReportViewModel } from '../view-model/report-view-model-builder.js';
const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const renderList = (rows) => {
    if (rows.length === 0) {
        return '<p>None</p>';
    }
    return `<ul>${rows
        .map((row) => `<li><strong>${escapeHtml(row.label ?? 'Item')}:</strong> ${escapeHtml(row.value ?? '')}</li>`)
        .join('')}</ul>`;
};
const renderSection = (title, rows) => `<section><h2>${escapeHtml(title)}</h2>${renderList(rows)}</section>`;
export const renderHtmlReport = (report) => {
    const viewModel = buildReportViewModel(report);
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(report.reportId)}</title>
</head>
<body>
  <article>
    <h1>Conversion Report ${escapeHtml(report.reportId)}</h1>
    ${renderSection('Metadata', [
        { label: 'Run ID', value: viewModel.metadata.runId },
        { label: 'Correlation ID', value: viewModel.metadata.correlationId },
        { label: 'Project Label', value: viewModel.metadata.projectLabel },
        { label: 'Source Framework', value: viewModel.metadata.sourceFramework },
        { label: 'Target Framework', value: viewModel.metadata.targetFramework },
        { label: 'Generated At', value: viewModel.metadata.generatedAt },
        { label: 'Partial', value: viewModel.metadata.partial ? 'true' : 'false' },
    ])}
    ${renderSection('Source Inventory', viewModel.sections.sourceInventory)}
    ${renderSection('Conversion Output', viewModel.sections.conversionOutput)}
    ${renderSection('Diagnostics', viewModel.sections.diagnostics)}
    ${renderSection('AI Decisions', viewModel.sections.aiDecisions)}
    ${renderSection('Manual Review', viewModel.sections.manualReview)}
    ${renderSection('Quality', viewModel.sections.quality)}
    ${renderSection('Traceability', viewModel.sections.traceability)}
  </article>
</body>
</html>`;
};
//# sourceMappingURL=html-report-renderer.js.map