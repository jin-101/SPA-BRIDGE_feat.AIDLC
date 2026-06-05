import { createDiagnostic } from '@spa-bridge/core-model';
import { createStableIdFactory } from '../model/stable-id-factory.js';
const sanitizeText = (value) => value
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
export class SafeDiagnosticBuilder {
    ids = createStableIdFactory();
    build(input) {
        return createDiagnostic({
            code: input.code,
            severity: input.severity,
            message: sanitizeText(input.message),
            sourceRefs: (input.sourcePaths ?? []).map((sourcePath, index) => ({
                kind: 'source',
                path: sourcePath,
                location: `analysis:${index}`,
            })),
            generatedRefs: input.generatedRefs ?? [],
            tags: input.tags ?? [],
            remediationHint: input.remediationHint ? sanitizeText(input.remediationHint) : undefined,
        });
    }
    normalize(diagnostics) {
        return [...diagnostics].sort((left, right) => {
            const severityOrder = {
                info: 0,
                warning: 1,
                error: 2,
                'manual-review': 3,
                'security-blocker': 4,
            };
            const leftSource = left.sourceRefs[0]?.path ?? '';
            const rightSource = right.sourceRefs[0]?.path ?? '';
            const severityDelta = severityOrder[left.severity] - severityOrder[right.severity];
            if (severityDelta !== 0) {
                return severityDelta;
            }
            if (leftSource !== rightSource) {
                return leftSource.localeCompare(rightSource);
            }
            if (left.code !== right.code) {
                return left.code.localeCompare(right.code);
            }
            return left.message.localeCompare(right.message);
        });
    }
}
//# sourceMappingURL=safe-diagnostic-builder.js.map