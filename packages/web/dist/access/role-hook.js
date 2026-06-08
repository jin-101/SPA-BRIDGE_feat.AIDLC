import { AccessControlHookEvaluator } from '@spa-bridge/core-security';
import { ok, err } from '@spa-bridge/core-model';
import { createWebUiError } from '../shared-errors.js';
const tabsByRole = {
    guest: ['dashboard'],
    viewer: ['dashboard', 'reports'],
    reviewer: ['dashboard', 'reports', 'triage', 'quality'],
    approver: ['dashboard', 'reports', 'triage', 'quality', 'security'],
    admin: ['dashboard', 'reports', 'triage', 'quality', 'security'],
};
const actionsByRole = {
    guest: [],
    viewer: ['open-report', 'copy-safe-reference'],
    reviewer: ['open-report', 'copy-safe-reference', 'flag-review-item', 'request-remediation'],
    approver: ['open-report', 'copy-safe-reference', 'flag-review-item', 'request-remediation', 'approve-remediation', 'trigger-rerun'],
    admin: ['open-report', 'copy-safe-reference', 'flag-review-item', 'request-remediation', 'approve-remediation', 'trigger-rerun'],
};
export const buildAccessGateState = (input) => {
    const evaluator = new AccessControlHookEvaluator();
    const decisionResult = evaluator.evaluate({
        policyKnown: input.policyKnown,
        explicitGrant: input.explicitGrant,
        renderSafe: input.renderSafe,
        requestedScope: input.requestedScope,
        grantedScopes: input.grantedScopes,
    });
    if (!decisionResult.ok) {
        return err(createWebUiError('POLICY_UNKNOWN', 'Access policy evaluation failed.', 'The access control hook did not return a decision.'));
    }
    const decision = decisionResult.value;
    const allowedTabs = decision.decision === 'allow' ? tabsByRole[input.role] : ['dashboard', 'reports'];
    const allowedActions = decision.decision === 'allow' ? actionsByRole[input.role] : ['open-report'];
    return ok({
        role: input.role,
        decision,
        allowedTabs,
        allowedActions,
    });
};
//# sourceMappingURL=role-hook.js.map