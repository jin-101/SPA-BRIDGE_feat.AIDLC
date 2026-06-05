import { createStableHash } from '../shared-errors.js';
const createSourceRef = (workspaceRoot) => ({
    kind: 'source',
    path: workspaceRoot,
    symbol: 'quality-run',
});
const createGeneratedRef = (runId, suffix) => ({
    kind: 'generated',
    path: `quality/${runId}/${suffix}`,
    segment: suffix,
});
export const createQualitySummaryTraceId = (runId) => `trace-${createStableHash({ runId, kind: 'summary' }).slice(0, 16)}`;
export const createQualityGateTraceId = (runId, gateId) => `trace-${createStableHash({ runId, gateId, kind: 'gate' }).slice(0, 16)}`;
export const createQualityArtifactTraceId = (runId, artifactPath, index) => `trace-${createStableHash({ runId, artifactPath, index, kind: 'artifact' }).slice(0, 16)}`;
export class QualityTraceBuilder {
    build(request, gateRuns, summary) {
        const source = createSourceRef(request.workspaceRoot);
        const summaryTarget = createGeneratedRef(request.runId, 'summary.json');
        const summaryLink = {
            id: createQualitySummaryTraceId(request.runId),
            source,
            target: summaryTarget,
            relation: 'emits',
            confidence: 1,
            notes: `summary:${summary.overallStatus}`,
        };
        const gateLinks = gateRuns.map((gateRun) => {
            const target = createGeneratedRef(request.runId, `gates/${gateRun.gateId}.json`);
            return {
                id: createQualityGateTraceId(request.runId, gateRun.gateId),
                source,
                target,
                relation: 'emits',
                confidence: 1,
                notes: `gate:${gateRun.status}`,
            };
        });
        const artifactLinks = (request.artifactRefs ?? []).map((artifactRef, index) => ({
            id: createQualityArtifactTraceId(request.runId, artifactRef.path, index),
            source,
            target: artifactRef,
            relation: 'references',
            confidence: 1,
            notes: `artifact:${index}`,
        }));
        return [summaryLink, ...gateLinks, ...artifactLinks];
    }
}
//# sourceMappingURL=quality-trace-builder.js.map