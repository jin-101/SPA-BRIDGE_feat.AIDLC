import { ok } from '@spa-bridge/core-model';
const buildPayload = (request, title, summary) => ({
    title,
    summary,
    warnings: [],
    reviewItems: [],
    sections: [
        { title: 'Run', lines: [`Run ID: ${request.resolvedOptions.runId}`, `Workspace: ${request.validatedPaths.workspaceRoot}`] },
        { title: 'Summary', lines: [summary] },
    ],
});
export const createDefaultApplicationBridge = () => ({
    async startConversion(request) {
        const summary = request.resolvedOptions.dryRun
            ? `Dry run prepared for ${request.validatedPaths.workspaceRoot}.`
            : `Conversion workflow started for ${request.validatedPaths.workspaceRoot}.`;
        return ok({
            runId: request.resolvedOptions.runId,
            summary,
            warnings: request.resolvedOptions.dryRun ? ['Dry run mode enabled.'] : [],
            reviewItems: request.resolvedOptions.dryRun ? ['Review the dry-run output before execution.'] : [],
            reportPayload: buildPayload(request, 'Conversion Summary', summary),
        });
    },
    async validateWorkspace(request) {
        return ok({
            runId: request.resolvedOptions.runId,
            summary: `Workspace validated: ${request.validatedPaths.workspaceRoot}`,
            warnings: [],
            reviewItems: [],
        });
    },
    async prepareReport(request) {
        return ok(buildPayload(request, 'CLI Report', `Report prepared for ${request.validatedPaths.workspaceRoot}.`));
    },
});
//# sourceMappingURL=application-bridge.js.map