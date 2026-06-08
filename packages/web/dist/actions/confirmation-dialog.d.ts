import { type Result } from '@spa-bridge/core-model';
import type { WebConfirmationDialog, WebRemediationRequest, WebRemediationOutcome } from '../types.js';
import { type WebUiError } from '../shared-errors.js';
export declare const buildConfirmationDialog: (request: WebRemediationRequest) => WebConfirmationDialog;
export declare const resolveConfirmation: (request: WebRemediationRequest) => Result<WebRemediationOutcome, WebUiError>;
//# sourceMappingURL=confirmation-dialog.d.ts.map