import { createSafeDisplayString, ok, type Result } from '@spa-bridge/core-model';

import { createSecurityError, type AccessControlDecision } from '../types.js';

export class AccessControlHookEvaluator {
  evaluate(input: {
    policyKnown: boolean;
    explicitGrant: boolean;
    renderSafe: boolean;
    requestedScope?: string;
    grantedScopes?: string[];
  }): Result<AccessControlDecision, ReturnType<typeof createSecurityError>> {
    if (!input.policyKnown) {
      return ok({
        decision: 'manual-review',
        reasonCode: 'POLICY_UNKNOWN',
        reason: createSafeDisplayString('Access policy is unknown and requires manual review.'),
        renderSafe: false,
      });
    }

    if (!input.explicitGrant) {
      return ok({
        decision: 'deny',
        reasonCode: 'NO_EXPLICIT_GRANT',
        reason: createSafeDisplayString('Access is denied by default without an explicit grant.'),
        renderSafe: input.renderSafe,
      });
    }

    if (input.requestedScope && !(input.grantedScopes ?? []).includes(input.requestedScope)) {
      return ok({
        decision: 'deny',
        reasonCode: 'SCOPE_NOT_GRANTED',
        reason: createSafeDisplayString('Requested scope is not included in the granted scope list.'),
        renderSafe: input.renderSafe,
      });
    }

    if (!input.renderSafe) {
      return ok({
        decision: 'deny',
        reasonCode: 'NOT_RENDER_SAFE',
        reason: createSafeDisplayString('Render-safe output is required before access can be granted.'),
        renderSafe: false,
      });
    }

    return ok({
      decision: 'allow',
      reasonCode: 'EXPLICIT_GRANT',
      reason: createSafeDisplayString('Access is granted under the explicit policy rules.'),
      renderSafe: true,
    });
  }
}
