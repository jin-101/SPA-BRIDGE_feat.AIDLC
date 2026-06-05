import fc from 'fast-check';
import type { TargetGenerationRequest } from '../types.js';
import type { ReactTargetDraftSet } from '@spa-bridge/transform-angular-react';
export declare const targetGenerationRequestArbitrary: fc.Arbitrary<TargetGenerationRequest>;
export declare const targetDraftSetArbitrary: fc.Arbitrary<ReactTargetDraftSet>;
export declare const targetManualReviewItemArbitrary: fc.Arbitrary<{
    status: "open" | "resolved" | "deferred";
    id: string;
    title: string;
    description?: string | undefined | undefined;
}>;
//# sourceMappingURL=generators.d.ts.map