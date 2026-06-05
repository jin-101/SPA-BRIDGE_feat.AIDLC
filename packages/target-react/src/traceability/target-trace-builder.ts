import type { SourceRef, TraceLink } from '@spa-bridge/core-model';

let traceSequence = 0;

export class TargetTraceBuilder {
  build(source: SourceRef, targetPath: string, relation: TraceLink['relation'] = 'derived-from'): TraceLink {
    traceSequence += 1;
    return {
      id: `target-trace-${traceSequence}`,
      source,
      target: { kind: 'generated', path: targetPath },
      relation,
      confidence: 1,
    };
  }
}
