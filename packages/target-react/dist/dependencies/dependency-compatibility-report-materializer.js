import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
const sectionTitle = (title) => `## ${title}\n`;
const renderDecisionRows = (decisions) => {
    if (decisions.length === 0) {
        return 'None.\n';
    }
    return [
        '| Source package | Source version | Target package | Target version | Risk | Review | Rationale |',
        '| --- | --- | --- | --- | --- | --- | --- |',
        ...decisions.map((decision) => [
            decision.packageName,
            decision.sourceVersion,
            decision.targetPackageName ?? '',
            decision.targetVersion ?? '',
            decision.riskLevel,
            decision.usageSiteReviewRequired ? 'yes' : 'no',
            decision.rationale.replace(/\|/g, '\\|'),
        ].join(' | ')),
        '',
    ].join('\n');
};
export class DependencyCompatibilityReportMaterializer {
    materialize(report) {
        const replaced = report.decisions.filter((decision) => decision.decision === 'replace');
        const removed = report.decisions.filter((decision) => decision.decision === 'remove');
        const review = report.decisions.filter((decision) => decision.decision === 'review' || decision.usageSiteReviewRequired);
        const carried = report.decisions.filter((decision) => decision.decision === 'carry');
        const wds = report.decisions.filter((decision) => decision.packageName === '@wds/wc-angular-lib' || decision.targetPackageName === '@wds/wc-react-lib');
        const content = [
            '# Dependency Compatibility Report',
            '',
            'This file records deterministic package compatibility decisions used while generating the React target project.',
            '',
            sectionTitle('Summary'),
            `- Carried: ${report.summary.carried}`,
            `- Replaced: ${report.summary.replaced}`,
            `- Removed: ${report.summary.removed}`,
            `- Review required: ${report.summary.review}`,
            `- Total source packages classified: ${report.summary.total}`,
            '',
            sectionTitle('Carried'),
            renderDecisionRows(carried),
            sectionTitle('Replaced'),
            renderDecisionRows(replaced),
            sectionTitle('Removed'),
            renderDecisionRows(removed),
            sectionTitle('Review Required'),
            renderDecisionRows(review),
            sectionTitle('WDS Custom Package Compatibility'),
            wds.length > 0
                ? renderDecisionRows(wds)
                : 'No WDS package mapping was found in the source dependency manifest.\n',
            sectionTitle('Suggested Code Changes'),
            report.usageFindings.length === 0
                ? 'No safe usage-site rewrite was applied automatically. Review replaced package imports, props, events, and custom elements manually.\n'
                : report.usageFindings
                    .map((finding) => `- ${finding.sourcePackage}: ${finding.message}${finding.suggestedCodeChange ? ` Suggested change: ${finding.suggestedCodeChange}` : ''}`)
                    .join('\n') + '\n',
        ].join('\n');
        return createFileSpec({
            path: 'src/review/dependency-compatibility.md',
            kind: 'review',
            content,
            overwrite: true,
            status: 'review',
        });
    }
}
//# sourceMappingURL=dependency-compatibility-report-materializer.js.map