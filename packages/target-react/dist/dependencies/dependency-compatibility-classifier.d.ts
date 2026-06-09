import type { DependencyCompatibilityDecision, DependencyCompatibilityReport, DependencyReplacementRule } from '../types.js';
export type DependencyCompatibilityClassification = {
    decisions: DependencyCompatibilityDecision[];
    report: DependencyCompatibilityReport;
};
export declare class DependencyCompatibilityClassifier {
    private readonly replacementRules;
    constructor(replacementRules?: DependencyReplacementRule[]);
    classify(dependencies: Record<string, string>): DependencyCompatibilityClassification;
    classifyOne(packageName: string, sourceVersion: string): DependencyCompatibilityDecision;
    toDependencyRecord(decisions: DependencyCompatibilityDecision[]): Record<string, string>;
    combineReports(...reports: DependencyCompatibilityReport[]): DependencyCompatibilityReport;
}
//# sourceMappingURL=dependency-compatibility-classifier.d.ts.map