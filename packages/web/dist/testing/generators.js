import fc from 'fast-check';
import { canonicalConversionReportArbitrary, manualReviewItemArbitrary, reportDiagnosticArbitrary, } from '@spa-bridge/core-reporting';
const safeTextArbitrary = fc
    .string({ minLength: 1, maxLength: 32 })
    .filter((value) => !/[<>{}]/.test(value) && !/javascript:/i.test(value) && !/on\w+=/i.test(value));
export const webReviewRoleArbitrary = fc.constantFrom('guest', 'viewer', 'reviewer', 'approver', 'admin');
export const webReviewTabArbitrary = fc.constantFrom('dashboard', 'reports', 'triage', 'quality', 'security');
export const webReviewInputArbitrary = fc.record({
    report: canonicalConversionReportArbitrary,
    role: webReviewRoleArbitrary,
    viewportWidth: fc.integer({ min: 320, max: 1920 }),
    policyKnown: fc.boolean(),
    explicitGrant: fc.boolean(),
    renderSafe: fc.boolean(),
    requestedScope: fc.option(safeTextArbitrary, { nil: undefined }),
    grantedScopes: fc.option(fc.uniqueArray(safeTextArbitrary, { maxLength: 5 }), { nil: undefined }),
    activeTab: fc.option(webReviewTabArbitrary, { nil: undefined }),
    query: fc.option(fc.dictionary(safeTextArbitrary, safeTextArbitrary, { maxKeys: 4 }), { nil: undefined }),
});
export const remediationRequestArbitrary = fc.record({
    actionId: safeTextArbitrary,
    actionLabel: safeTextArbitrary,
    reasonCode: safeTextArbitrary,
    summary: safeTextArbitrary,
    confirmed: fc.boolean(),
    targetRoute: fc.constantFrom('/review', '/review/reports', '/review/triage', '/review/quality', '/review/security'),
});
export const reportDiagnosticListArbitrary = fc.array(reportDiagnosticArbitrary, { maxLength: 6 });
export const manualReviewItemListArbitrary = fc.array(manualReviewItemArbitrary, { maxLength: 6 });
//# sourceMappingURL=generators.js.map