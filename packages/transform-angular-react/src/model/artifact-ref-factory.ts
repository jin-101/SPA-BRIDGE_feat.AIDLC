import type { GeneratedArtifactRef } from '@spa-bridge/core-model';

import type { TransformationContext } from '../types.js';
import { StableIdFactory } from './stable-id-factory.js';

export class ArtifactRefFactory {
  constructor(private readonly ids: StableIdFactory = new StableIdFactory()) {}

  build(outputNamespace: string, context: TransformationContext): {
    draftSetRef: GeneratedArtifactRef;
    tracesRef: GeneratedArtifactRef;
    diagnosticsRef: GeneratedArtifactRef;
    summaryRef: GeneratedArtifactRef;
    reviewItemsRef: GeneratedArtifactRef;
    mappingRequestsRef: GeneratedArtifactRef;
  } {
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
