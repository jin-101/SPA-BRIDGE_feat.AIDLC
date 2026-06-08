import { ok, err } from '@spa-bridge/core-model';
import { createSafeDisplayString } from '@spa-bridge/core-model';
import { createWebUiError } from '../shared-errors.js';
import { renderSafeText } from '../rendering/safe-content-renderer.js';
export const buildConfirmationDialog = (request) => ({
    actionId: createSafeDisplayString(request.actionId),
    title: createSafeDisplayString(`${request.actionLabel} confirmation`),
    body: renderSafeText(request.summary),
    confirmationRequired: true,
    acknowledged: request.confirmed,
});
export const resolveConfirmation = (request) => {
    if (!request.confirmed) {
        return err(createWebUiError('CONFIRMATION_REQUIRED', 'Remediation confirmation is required.', 'The user has not confirmed the requested action.'));
    }
    return ok({
        actionId: createSafeDisplayString(request.actionId),
        accepted: true,
        nextRoute: request.targetRoute,
        message: createSafeDisplayString(`Confirmed ${request.actionLabel}.`),
        confirmationRequired: true,
    });
};
//# sourceMappingURL=confirmation-dialog.js.map