const isAction = (value) => value === 'carry' || value === 'replace' || value === 'remove' || value === 'review';
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
export class DependencyAdvisoryBoundary {
    parseAdvisoryJson(raw) {
        try {
            const parsed = JSON.parse(raw);
            return this.normalize(parsed);
        }
        catch {
            return { schemaVersion: 1, candidates: [] };
        }
    }
    normalize(value) {
        if (!value || typeof value !== 'object') {
            return { schemaVersion: 1, candidates: [] };
        }
        const candidates = Array.isArray(value.candidates)
            ? value.candidates
            : [];
        return {
            schemaVersion: 1,
            candidates: candidates
                .map((candidate) => this.normalizeCandidate(candidate))
                .filter((candidate) => Boolean(candidate))
                .sort((left, right) => left.packageName.localeCompare(right.packageName)),
        };
    }
    normalizeCandidate(candidate) {
        if (!candidate || typeof candidate !== 'object') {
            return undefined;
        }
        const record = candidate;
        const packageName = record.packageName;
        const recommendedAction = record.recommendedAction;
        const confidence = record.confidence;
        if (!isNonEmptyString(packageName) || !isAction(recommendedAction) || typeof confidence !== 'number' || confidence < 0.8) {
            return undefined;
        }
        const normalized = {
            packageName,
            recommendedAction,
            confidence,
        };
        if (isNonEmptyString(record.targetPackageName)) {
            normalized.targetPackageName = record.targetPackageName;
        }
        if (isNonEmptyString(record.rationale)) {
            normalized.rationale = record.rationale;
        }
        return normalized;
    }
}
//# sourceMappingURL=dependency-advisory-boundary.js.map