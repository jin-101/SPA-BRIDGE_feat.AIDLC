import type { GeneratedArtifactRef, SourceRef, TraceLink } from '@spa-bridge/core-model';

import { createStableHash } from '../shared-errors.js';
import type { QualityGateRun, QualityRequest, QualityRunSummary } from '../types.js';

const createSourceRef = (workspaceRoot: string): SourceRef => ({
  kind: 'source',
  path: workspaceRoot,
  symbol: 'quality-run',
});

const createGeneratedRef = (runId: string, suffix: string): GeneratedArtifactRef => ({
  kind: 'generated',
  path: `quality/${runId}/${suffix}`,
  segment: suffix,
});

export const createQualitySummaryTraceId = (runId: string): string =>
  `trace-${createStableHash({ runId, kind: 'summary' }).slice(0, 16)}`;

export const createQualityGateTraceId = (runId: string, gateId: string): string =>
  `trace-${createStableHash({ runId, gateId, kind: 'gate' }).slice(0, 16)}`;

export const createQualityArtifactTraceId = (runId: string, artifactPath: string, index: number): string =>
  `trace-${createStableHash({ runId, artifactPath, index, kind: 'artifact' }).slice(0, 16)}`;

export class QualityTraceBuilder {
  build(request: QualityRequest, gateRuns: QualityGateRun[], summary: QualityRunSummary): TraceLink[] {
    const source = createSourceRef(request.workspaceRoot);
    const summaryTarget = createGeneratedRef(request.runId, 'summary.json');

    const summaryLink: TraceLink = {
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
      } satisfies TraceLink;
    });

    const artifactLinks = (request.artifactRefs ?? []).map((artifactRef, index) => ({
      id: createQualityArtifactTraceId(request.runId, artifactRef.path, index),
      source,
      target: artifactRef,
      relation: 'references',
      confidence: 1,
      notes: `artifact:${index}`,
    }) satisfies TraceLink);

    return [summaryLink, ...gateLinks, ...artifactLinks];
  }
}
