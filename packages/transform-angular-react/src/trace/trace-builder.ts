import type { SourceRef, TraceLink } from '@spa-bridge/core-model';

import { StableIdFactory } from '../model/stable-id-factory.js';

export class TraceBuilder {
  private readonly ids = new StableIdFactory();
  private readonly traces: TraceLink[] = [];

  addTrace(source: SourceRef, target: TraceLink['target'], ruleId: string, relation: TraceLink['relation'] = 'maps-to', confidence = 1): TraceLink {
    const trace: TraceLink = {
      id: this.ids.traceId(source.path, target.kind === 'ir' ? target.id : target.path, ruleId, this.traces.length + 1),
      source,
      target,
      relation,
      confidence,
    };
    this.traces.push(trace);
    return trace;
  }

  list(): TraceLink[] {
    return [...this.traces].sort((left, right) => left.id.localeCompare(right.id));
  }
}
