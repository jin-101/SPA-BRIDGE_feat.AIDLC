import { ok, err } from '@spa-bridge/core-model';
import { createSafeDisplayString } from '@spa-bridge/core-model';
import { createWebUiError } from '../shared-errors.js';
import { buildConfirmationDialog, resolveConfirmation } from './confirmation-dialog.js';
export const createRemediationBridge = () => ({
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
export const requestRemediation = (request) => {
    if (!request.actionId.trim()) {
        return err(createWebUiError('INVALID_INPUT', 'Action id is required.', 'A remediation action cannot be scheduled without an action identifier.'));
    }
    return createRemediationBridge().confirm(request);
};
//# sourceMappingURL=remediation-bridge.js.map