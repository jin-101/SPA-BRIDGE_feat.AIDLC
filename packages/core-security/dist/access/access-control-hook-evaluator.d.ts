import { type Result } from '@spa-bridge/core-model';
import { createSecurityError, type AccessControlDecision } from '../types.js';
export declare class AccessControlHookEvaluator {
    evaluate(input: {
        policyKnown: boolean;
        explicitGrant: boolean;
        renderSafe: boolean;
        requestedScope?: string;
        grantedScopes?: string[];
    }): Result<AccessControlDecision, ReturnType<typeof createSecurityError>>;
}
//# sourceMappingURL=access-control-hook-evaluator.d.ts.map