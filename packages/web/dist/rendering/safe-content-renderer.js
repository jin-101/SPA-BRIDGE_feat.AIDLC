import { createSafeDisplayString, isRedactedString } from '@spa-bridge/core-model';
const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};
export const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => HTML_ESCAPE_MAP[character] ?? character);
export const renderSafeText = (value) => {
    const normalized = createSafeDisplayString(value);
    return {
        text: normalized,
        html: escapeHtml(normalized),
        redacted: isRedactedString(normalized),
    };
};
export const renderSafeLabel = (value) => createSafeDisplayString(value);
export const createKeyValueRow = (label, value) => ({
    label: renderSafeLabel(label),
    value: renderSafeText(value),
});
export const createSectionModel = (id, title, rows, detail) => ({
    id: createSafeDisplayString(id),
    title: renderSafeLabel(title),
    rows: rows.map((row) => (Array.isArray(row) ? createKeyValueRow(row[0], row[1]) : row)),
    detail: detail ? createSafeDisplayString(detail) : undefined,
});
export const renderSectionRowsToHtml = (section) => {
    const rows = section.rows
        .map((row) => `<tr><th>${escapeHtml(row.label)}</th><td>${row.value.html}</td></tr>`)
        .join('');
    return `<section data-section="${escapeHtml(section.id)}"><h2>${escapeHtml(section.title)}</h2><table>${rows}</table></section>`;
};
export const renderSectionsToHtml = (sections) => sections.map((section) => renderSectionRowsToHtml(section)).join('');
export const renderSectionsToText = (sections) => sections
    .map((section) => {
    const rows = section.rows.map((row) => `${row.label}: ${row.value.text}`).join(' | ');
    return `${section.title}: ${rows}`;
})
    .join('\n');
//# sourceMappingURL=safe-content-renderer.js.map