import { createSafeDisplayString } from '@spa-bridge/core-model';
export const createReportError = (code, message, issues = []) => ({
    name: 'ReportError',
    code,
    message: createSafeDisplayString(message),
    issues,
});
export const validationIssueFromPath = (path, message, code = 'custom') => ({
    path,
    code,
    message,
});
//# sourceMappingURL=shared-errors.js.map