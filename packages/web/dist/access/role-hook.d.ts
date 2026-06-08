import { type Result } from '@spa-bridge/core-model';
import type { WebAccessState, WebReviewRole } from '../types.js';
import { type WebUiError } from '../shared-errors.js';
export declare const buildAccessGateState: (input: {
    role: WebReviewRole;
    policyKnown: boolean;
    explicitGrant: boolean;
    renderSafe: boolean;
    requestedScope?: string;
    grantedScopes?: string[];
}) => Result<WebAccessState, WebUiError>;
//# sourceMappingURL=role-hook.d.ts.map