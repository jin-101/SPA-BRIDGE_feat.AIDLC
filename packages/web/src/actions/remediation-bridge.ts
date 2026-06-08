import { ok, err, type Result } from '@spa-bridge/core-model';
import { createSafeDisplayString } from '@spa-bridge/core-model';

import type { WebRemediationOutcome, WebRemediationRequest } from '../types.js';
import { createWebUiError, type WebUiError } from '../shared-errors.js';
import { buildConfirmationDialog, resolveConfirmation } from './confirmation-dialog.js';

export type RemediationBridge = {
  createDialog: (request: WebRemediationRequest) => ReturnType<typeof buildConfirmationDialog>;
  confirm: (request: WebRemediationRequest) => Result<WebRemediationOutcome, WebUiError>;
  rerun: (request: WebRemediationRequest) => Result<WebRemediationOutcome, WebUiError>;
};

export const createRemediationBridge = (): RemediationBridge => ({
  createDialog: (request) => buildConfirmationDialog(request),
  confirm: (request) => resolveConfirmation(request),
  rerun: (request) => {
    const confirmation = resolveConfirmation(request);
    if (!confirmation.ok) {
      return confirmation;
    }

    return ok({
      ...confirmation.value,
      message: createSafeDisplayString(`Queued rerun for ${request.actionLabel}.`),
    });
  },
});

export const requestRemediation = (
  request: WebRemediationRequest,
): Result<WebRemediationOutcome, WebUiError> => {
  if (!request.actionId.trim()) {
    return err(createWebUiError('INVALID_INPUT', 'Action id is required.', 'A remediation action cannot be scheduled without an action identifier.'));
  }

  return createRemediationBridge().confirm(request);
};
