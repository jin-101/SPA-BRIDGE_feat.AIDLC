import { err, ok } from '@spa-bridge/core-model';
import { SecurityEvaluationPipeline, } from '@spa-bridge/core-security';
export class SecurityPolicyCoordinator {
    pipeline = new SecurityEvaluationPipeline();
    evaluate(input) {
        const result = this.pipeline.evaluate({
            schemaVersion: 1,
            payload: input.payload,
            rawConfig: input.rawConfig,
            overrides: input.overrides,
            providerMode: input.providerMode,
            externalProviderRequested: input.externalProviderRequested,
            rulePacks: input.rulePacks ?? [],
            sourceRefs: input.sourceRefs ?? [],
            generatedRefs: input.generatedRefs ?? [],
        });
        if (!result.ok) {
            return err({
                code: 'POLICY_BLOCKED',
                message: result.error.message,
                cause: result.error,
            });
        }
        return ok(result.value);
    }
}
//# sourceMappingURL=security-policy-coordinator.js.map