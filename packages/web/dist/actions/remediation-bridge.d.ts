import { type Result } from '@spa-bridge/core-model';
import type { WebRemediationOutcome, WebRemediationRequest } from '../types.js';
import { type WebUiError } from '../shared-errors.js';
import { buildConfirmationDialog } from './confirmation-dialog.js';
export type RemediationBridge = {
    createDialog: (request: WebRemediationRequest) => ReturnType<typeof buildConfirmationDialog>;
    confirm: (request: WebRemediationRequest) => Result<WebRemediationOutcome, WebUiError>;
    rerun: (request: WebRemediationRequest) => Result<WebRemediationOutcome, WebUiError>;
};
export declare const createRemediationBridge: () => RemediationBridge;
export declare const requestRemediation: (request: WebRemediationRequest) => Result<WebRemediationOutcome, WebUiError>;
//# sourceMappingURL=remediation-bridge.d.ts.map