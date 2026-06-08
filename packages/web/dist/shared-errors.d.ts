export type WebUiErrorCode = 'INVALID_INPUT' | 'ACCESS_DENIED' | 'CONFIRMATION_REQUIRED' | 'ROUTE_INVALID' | 'RENDER_UNSAFE' | 'POLICY_UNKNOWN';
export type WebUiError = {
    code: WebUiErrorCode;
    message: string;
    detail?: string;
    context?: Record<string, string>;
};
export declare const createWebUiError: (code: WebUiErrorCode, message: string, detail?: string, context?: Record<string, string>) => WebUiError;
//# sourceMappingURL=shared-errors.d.ts.map