import { NpmrcParser } from './npmrc-parser.js';
const uniqueSorted = (values) => [...new Set(values.filter((value) => value.trim().length > 0))].sort((left, right) => left.localeCompare(right));
export class RegistryMigrationPlanner {
    parser;
    constructor(parser = new NpmrcParser()) {
        this.parser = parser;
    }
    plan(files = []) {
        const entries = this.parser.parse(files);
        const safeEntries = entries.filter((entry) => entry.safeLine && (entry.kind === 'registry' || entry.kind === 'scope-registry' || entry.kind === 'safe-config'));
        const secretEntries = entries.filter((entry) => entry.kind === 'secret');
        const safeTargetNpmrcLines = uniqueSorted(safeEntries.map((entry) => entry.safeLine ?? ''));
        const exampleNpmrcLines = uniqueSorted([
            ...safeEntries.map((entry) => entry.placeholderLine ?? entry.safeLine ?? ''),
            ...secretEntries.map((entry) => entry.placeholderLine ?? ''),
        ]);
        return {
            schemaVersion: 1,
            safeTargetNpmrcLines,
            exampleNpmrcLines,
            entries,
            secretEntryCount: secretEntries.length,
            safeEntryCount: safeEntries.length,
            manualReviewItems: secretEntries.map((entry, index) => ({
                id: `registry-secret-${index + 1}`,
                reasonCode: 'NPMRC_SECRET_PLACEHOLDER_REQUIRED',
                safeSummary: `A private registry credential at ${entry.sourcePath}:${entry.lineNumber} was replaced with an environment placeholder.`,
            })),
        };
    }
}
//# sourceMappingURL=registry-migration-planner.js.map