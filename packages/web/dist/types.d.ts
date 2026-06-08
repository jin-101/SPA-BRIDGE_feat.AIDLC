import type { AccessControlDecision } from '@spa-bridge/core-security';
import type { CanonicalConversionReport, ManualReviewItem, ReportDiagnostic, ReportGroup, ReportViewModel } from '@spa-bridge/core-reporting';
import type { QualityRunSummary } from '@spa-bridge/core-quality';
export type WebReviewRole = 'guest' | 'viewer' | 'reviewer' | 'approver' | 'admin';
export type WebReviewTab = 'dashboard' | 'reports' | 'triage' | 'quality' | 'security';
export type WebLayoutMode = 'compact' | 'standard' | 'wide';
export type WebRoutePath = '/review' | '/review/reports' | '/review/triage' | '/review/quality' | '/review/security';
export type WebTextFragment = {
    text: string;
    html: string;
    redacted: boolean;
};
export type WebKeyValueRow = {
    label: string;
    value: WebTextFragment;
};
export type WebSectionModel = {
    id: string;
    title: string;
    rows: WebKeyValueRow[];
    detail?: string;
};
export type WebNavigationState = {
    route: WebRoutePath;
    activeTab: WebReviewTab;
    breadcrumb: string[];
    query: Record<string, string>;
};
export type WebLayoutState = {
    mode: WebLayoutMode;
    columns: number;
    showSidebar: boolean;
    showDetailPane: boolean;
};
export type WebAccessState = {
    role: WebReviewRole;
    decision: AccessControlDecision;
    allowedTabs: WebReviewTab[];
    allowedActions: string[];
};
export type WebDashboardViewModel = {
    title: string;
    subtitle: string;
    summaryCards: WebSectionModel[];
    sections: WebSectionModel[];
    access: WebAccessState;
    navigation: WebNavigationState;
    layout: WebLayoutState;
};
export type WebReportBrowserViewModel = {
    reportViewModel: ReportViewModel;
    sections: WebSectionModel[];
    access: WebAccessState;
    navigation: WebNavigationState;
    layout: WebLayoutState;
};
export type WebReviewTriageViewModel = {
    blockedCount: number;
    reviewItems: WebSectionModel[];
    reviewGroups: WebSectionModel[];
    access: WebAccessState;
    navigation: WebNavigationState;
    layout: WebLayoutState;
};
export type WebReviewState = {
    report: CanonicalConversionReport;
    qualitySummary: QualityRunSummary;
    access: WebAccessState;
    navigation: WebNavigationState;
    layout: WebLayoutState;
    dashboard: WebDashboardViewModel;
    reportBrowser: WebReportBrowserViewModel;
    triage: WebReviewTriageViewModel;
    safeSummary: WebTextFragment;
    diagnostics: ReportDiagnostic[];
    manualReviewItems: ManualReviewItem[];
    manualReviewGroups: ReportGroup[];
};
export type WebComponentRenderModel = {
    name: string;
    title: string;
    html: string;
    text: string;
    sections: WebSectionModel[];
    access: WebAccessState;
    navigation: WebNavigationState;
    layout: WebLayoutState;
};
export type WebReviewInput = {
    report: CanonicalConversionReport;
    role: WebReviewRole;
    viewportWidth: number;
    policyKnown: boolean;
    explicitGrant: boolean;
    renderSafe: boolean;
    requestedScope?: string;
    grantedScopes?: string[];
    activeTab?: WebReviewTab;
    query?: Record<string, string>;
};
export type WebRenderDocument = {
    title: string;
    description: string;
    html: string;
    text: string;
    sections: WebSectionModel[];
    access: WebAccessState;
    navigation: WebNavigationState;
    layout: WebLayoutState;
};
export type WebRemediationRequest = {
    actionId: string;
    actionLabel: string;
    reasonCode: string;
    summary: string;
    confirmed: boolean;
    targetRoute: WebRoutePath;
};
export type WebRemediationOutcome = {
    actionId: string;
    accepted: boolean;
    nextRoute: WebRoutePath;
    message: string;
    confirmationRequired: boolean;
};
export type WebConfirmationDialog = {
    actionId: string;
    title: string;
    body: WebTextFragment;
    confirmationRequired: boolean;
    acknowledged: boolean;
};
//# sourceMappingURL=types.d.ts.map