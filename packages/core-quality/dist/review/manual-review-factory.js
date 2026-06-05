import { createSafeDisplayString } from '@spa-bridge/core-model';
export class ManualReviewFactory {
    createFromGateRun(gateRun) {
        return {
            id: `review-${gateRun.gateId}`,
            title: createSafeDisplayString(`Review ${gateRun.gateId} gate result`),
            description: createSafeDisplayString(gateRun.safeSummary),
            status: 'open',
        };
    }
}
//# sourceMappingURL=manual-review-factory.js.map