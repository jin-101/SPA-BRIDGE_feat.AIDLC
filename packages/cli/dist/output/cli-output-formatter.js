const levelOrder = {
    quiet: 0,
    normal: 1,
    verbose: 2,
};
export const buildRenderModel = (result, verbosity, helpContent) => {
    const sections = [
        { title: 'Status', lines: [result.summary] },
    ];
    if (helpContent) {
        sections.push({
            title: 'Help',
            lines: [helpContent.usage, '', ...helpContent.examples.map((example) => `Example: ${example}`)],
        });
    }
    if (levelOrder[verbosity] >= 1 && result.warnings.length > 0) {
        sections.push({ title: 'Warnings', lines: result.warnings });
    }
    if (levelOrder[verbosity] >= 1 && result.reviewItems.length > 0) {
        sections.push({ title: 'Review', lines: result.reviewItems });
    }
    if (levelOrder[verbosity] >= 2 && result.reportPath) {
        sections.push({ title: 'Report', lines: [`Report path: ${result.reportPath}`] });
    }
    return {
        headline: `${result.commandName} (${result.status})`,
        sections,
        progress: result.progress,
        warnings: result.warnings,
        reviewItems: result.reviewItems,
        reportPath: result.reportPath,
    };
};
export const renderTerminalOutput = (model, verbosity) => {
    const lines = [model.headline];
    if (verbosity !== 'quiet') {
        for (const section of model.sections) {
            lines.push('', section.title);
            lines.push(...section.lines);
        }
    }
    if (verbosity === 'verbose' && model.progress.length > 0) {
        lines.push('', 'Progress');
        for (const event of model.progress) {
            lines.push(`[${event.phase}] ${event.message}`);
        }
    }
    if (model.reportPath && verbosity !== 'quiet') {
        lines.push('', `Report: ${model.reportPath}`);
    }
    return lines.join('\n');
};
//# sourceMappingURL=cli-output-formatter.js.map