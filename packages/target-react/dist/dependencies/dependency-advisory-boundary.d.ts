import type { DependencyCompatibilityAction } from '../types.js';
export type DependencyAdvisoryCandidate = {
    packageName: string;
    recommendedAction: DependencyCompatibilityAction;
    targetPackageName?: string;
    rationale?: string;
    confidence: number;
};
export type DependencyAdvisoryResponse = {
    schemaVersion: 1;
    candidates: DependencyAdvisoryCandidate[];
};
export declare class DependencyAdvisoryBoundary {
    parseAdvisoryJson(raw: string): DependencyAdvisoryResponse;
    normalize(value: unknown): DependencyAdvisoryResponse;
    private normalizeCandidate;
}
//# sourceMappingURL=dependency-advisory-boundary.d.ts.map