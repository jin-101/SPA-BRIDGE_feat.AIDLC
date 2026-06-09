import type { DependencyReplacementRule, DependencySourceCategory } from '../types.js';
export type DependencyPatternRule = {
    pattern: RegExp;
    category: DependencySourceCategory;
    rationale: string;
};
export declare const dependencyReplacementRules: DependencyReplacementRule[];
export declare const dependencyRemovalRules: DependencyPatternRule[];
export declare const highRiskWrapperRules: DependencyPatternRule[];
export declare const frameworkNeutralCarryPackages: Set<string>;
//# sourceMappingURL=dependency-replacement-registry.d.ts.map