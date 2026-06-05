import { type Result, type SourceRef } from '@spa-bridge/core-model';
import { createSecurityError, type PayloadRef, type SensitiveFinding, type SecurityRulePack } from '../types.js';
export type SensitiveDataInput = {
    payload: unknown;
    sourceRefs?: SourceRef[];
    payloadId?: string;
    rulePacks?: SecurityRulePack[];
};
export type SensitiveDataDetectionResult = {
    payloadRef: PayloadRef;
    normalizedPayload: string;
    findings: SensitiveFinding[];
    hasSensitiveData: boolean;
};
export declare class SensitiveDataDetector {
    detect(input: SensitiveDataInput): Result<SensitiveDataDetectionResult, ReturnType<typeof createSecurityError>>;
}
export declare class FindingMerger {
    merge(findings: SensitiveFinding[]): SensitiveFinding[];
}
//# sourceMappingURL=sensitive-data-detector.d.ts.map