import { dependencyRemovalRules, dependencyReplacementRules, frameworkNeutralCarryPackages, highRiskWrapperRules, } from './dependency-replacement-registry.js';
const byPackageName = (left, right) => left.packageName.localeCompare(right.packageName);
const findPatternRule = (packageName, rules) => rules.find((rule) => rule.pattern.test(packageName));
const summarize = (decisions) => ({
    carried: decisions.filter((decision) => decision.decision === 'carry').length,
    replaced: decisions.filter((decision) => decision.decision === 'replace').length,
    removed: decisions.filter((decision) => decision.decision === 'remove').length,
    review: decisions.filter((decision) => decision.decision === 'review').length,
    total: decisions.length,
});
const makeReplacementDecision = (packageName, sourceVersion, rule) => {
    const targetVersion = rule.versionPolicy === 'fixed' ? rule.fixedVersion ?? sourceVersion : sourceVersion;
    const usageSiteReviewRequired = rule.usageSiteReviewPolicy !== 'none';
    return {
        packageName,
        sourceVersion,
        decision: 'replace',
        targetPackageName: rule.targetPackage,
        targetVersion,
        riskLevel: 'medium',
        sourceCategory: 'custom',
        rationale: rule.rationale,
        usageSiteReviewRequired,
        diagnostics: usageSiteReviewRequired
            ? [`Review usage sites for ${packageName} before assuming API parity with ${rule.targetPackage}.`]
            : [],
    };
};
const makePatternDecision = (packageName, sourceVersion, rule, decision) => ({
    packageName,
    sourceVersion,
    decision,
    riskLevel: 'high',
    sourceCategory: rule.category,
    rationale: rule.rationale,
    usageSiteReviewRequired: decision === 'review',
    diagnostics: decision === 'review'
        ? [`${packageName} is not installed automatically because it is likely Angular-specific and requires an explicit React replacement.`]
        : [],
});
const categoryForUnknown = (packageName) => {
    if (packageName.includes('angular')) {
        return 'angular-wrapper';
    }
    if (packageName.includes('ngrx')) {
        return 'ngrx';
    }
    if (packageName.startsWith('@')) {
        return 'custom';
    }
    return 'unknown';
};
export class DependencyCompatibilityClassifier {
    replacementRules;
    constructor(replacementRules = dependencyReplacementRules) {
        this.replacementRules = replacementRules;
    }
    classify(dependencies) {
        const decisions = Object.entries(dependencies)
            .map(([packageName, sourceVersion]) => this.classifyOne(packageName, sourceVersion))
            .sort(byPackageName);
        return {
            decisions,
            report: {
                schemaVersion: 1,
                decisions,
                usageFindings: [],
                summary: summarize(decisions),
            },
        };
    }
    classifyOne(packageName, sourceVersion) {
        const replacement = this.replacementRules.find((rule) => rule.sourcePackage === packageName);
        if (replacement) {
            return makeReplacementDecision(packageName, sourceVersion, replacement);
        }
        const removal = findPatternRule(packageName, dependencyRemovalRules);
        if (removal) {
            return makePatternDecision(packageName, sourceVersion, removal, 'remove');
        }
        if (frameworkNeutralCarryPackages.has(packageName)) {
            return {
                packageName,
                sourceVersion,
                decision: 'carry',
                targetPackageName: packageName,
                targetVersion: sourceVersion,
                riskLevel: 'low',
                sourceCategory: 'framework-neutral',
                rationale: 'Framework-neutral package carried into the React target because generated code may continue to reference it.',
                usageSiteReviewRequired: false,
                diagnostics: [],
            };
        }
        const highRisk = findPatternRule(packageName, highRiskWrapperRules);
        if (highRisk) {
            return makePatternDecision(packageName, sourceVersion, highRisk, 'review');
        }
        return {
            packageName,
            sourceVersion,
            decision: 'carry',
            targetPackageName: packageName,
            targetVersion: sourceVersion,
            riskLevel: 'unknown',
            sourceCategory: categoryForUnknown(packageName),
            rationale: 'Unknown package carried by default because no deterministic Angular-only pattern matched; verify install and runtime usage during self-correction.',
            usageSiteReviewRequired: true,
            diagnostics: [`${packageName} was carried with unknown compatibility and should be checked during generated project validation.`],
        };
    }
    toDependencyRecord(decisions) {
        return Object.fromEntries(decisions
            .filter((decision) => decision.decision === 'carry' || decision.decision === 'replace')
            .map((decision) => [decision.targetPackageName ?? decision.packageName, decision.targetVersion ?? decision.sourceVersion])
            .sort(([left], [right]) => left.localeCompare(right)));
    }
    combineReports(...reports) {
        const decisions = reports.flatMap((report) => report.decisions).sort(byPackageName);
        const usageFindings = reports
            .flatMap((report) => report.usageFindings)
            .sort((left, right) => `${left.sourcePackage}:${left.usageKind}`.localeCompare(`${right.sourcePackage}:${right.usageKind}`));
        return {
            schemaVersion: 1,
            decisions,
            usageFindings,
            summary: summarize(decisions),
        };
    }
}
//# sourceMappingURL=dependency-compatibility-classifier.js.map