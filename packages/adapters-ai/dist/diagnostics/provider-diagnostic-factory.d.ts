import { type Diagnostic } from '@spa-bridge/core-model';
import { type ProviderInvocationRequest, type ProviderError, type ProviderSelectionResult, type ManualReviewItem } from '../types.js';
export declare const createProviderDiagnostic: (code: string, severity: Diagnostic["severity"], message: string, request: {
    sourceRefs?: Diagnostic["sourceRefs"];
    generatedRefs?: Diagnostic["generatedRefs"];
}, remediationHint?: string) => Diagnostic;
export declare const createManualReviewItem: (request: ProviderInvocationRequest, reasonCode: string, safeMessage: string) => ManualReviewItem;
export declare const createSelectionDiagnostic: (result: ProviderSelectionResult, request: ProviderInvocationRequest) => Diagnostic;
export declare const createProviderFailureDiagnostic: (error: ProviderError, request: ProviderInvocationRequest) => Diagnostic;
//# sourceMappingURL=provider-diagnostic-factory.d.ts.map