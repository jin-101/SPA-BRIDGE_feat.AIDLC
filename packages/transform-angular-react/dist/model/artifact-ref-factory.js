import { StableIdFactory } from './stable-id-factory.js';
export class ArtifactRefFactory {
    ids;
    constructor(ids = new StableIdFactory()) {
        this.ids = ids;
    }
    build(outputNamespace, context) {
        const base = `${outputNamespace.replace(/\/+$/u, '')}/transformation/${context.runId}`;
        return {
            draftSetRef: this.ids.artifactRef(`${base}/draft-set.json`, 'draft-set'),
            tracesRef: this.ids.artifactRef(`${base}/traces.json`, 'traces'),
            diagnosticsRef: this.ids.artifactRef(`${base}/diagnostics.json`, 'diagnostics'),
            summaryRef: this.ids.artifactRef(`${base}/summary.json`, 'summary'),
            reviewItemsRef: this.ids.artifactRef(`${base}/review-items.json`, 'review-items'),
            mappingRequestsRef: this.ids.artifactRef(`${base}/mapping-requests.json`, 'mapping-requests'),
        };
    }
}
//# sourceMappingURL=artifact-ref-factory.js.map