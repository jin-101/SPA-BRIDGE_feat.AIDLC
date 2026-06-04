import { createSafeDisplayString, ok } from '@spa-bridge/core-model';
export class PolicyGate {
    evaluate(input) {
        if (!input.policyKnown || (input.sensitiveDataPresent && !input.maskingReady)) {
            return ok({
                decision: 'block',
                reason: 'Policy or masking state is unclear, so provider use is blocked.',
            });
        }
        if (input.providerMode === 'external-only' && !input.externalProviderRequested) {
            return ok({
                decision: 'deny',
                reason: 'External provider is required by configuration, but no external provider was requested.',
            });
        }
        return ok({
            decision: 'allow',
            reason: createSafeDisplayString('Provider usage is permitted by policy.'),
        });
    }
}
//# sourceMappingURL=policy.js.map