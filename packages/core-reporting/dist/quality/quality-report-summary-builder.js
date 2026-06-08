const clampPercent = (value) => Math.min(100, Math.max(0, value));
const clampScore = (value) => Math.min(1, Math.max(0, value));
export const buildQualityReportSummary = (quality, targetPercent = 85) => {
    const score = clampScore(quality.conversionQualityScore);
    const target = clampPercent(targetPercent);
    return {
        ...quality,
        correctionAttempts: Math.max(0, quality.correctionAttempts),
        evidenceCounts: {
            total: Math.max(0, quality.evidenceCounts.total),
            blocked: Math.max(0, quality.evidenceCounts.blocked),
            safe: Math.max(0, quality.evidenceCounts.safe),
        },
        conversionQualityScore: score,
        targetPercent: target,
        targetMet: score * 100 >= target,
    };
};
//# sourceMappingURL=quality-report-summary-builder.js.map