import { createSafeDisplayString, type ManualReviewItem } from '@spa-bridge/core-model';

import type { QualityGateRun } from '../types.js';

export class ManualReviewFactory {
  createFromGateRun(gateRun: QualityGateRun): ManualReviewItem {
    return {
      id: `review-${gateRun.gateId}`,
      title: createSafeDisplayString(`Review ${gateRun.gateId} gate result`),
      description: createSafeDisplayString(gateRun.safeSummary),
      status: 'open',
    };
  }
}

