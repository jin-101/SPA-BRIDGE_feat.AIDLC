import { StableIdFactory } from '../model/stable-id-factory.js';
export class TraceBuilder {
    ids = new StableIdFactory();
    traces = [];
    addTrace(source, target, ruleId, relation = 'maps-to', confidence = 1) {
        const trace = {
            id: this.ids.traceId(source.path, target.kind === 'ir' ? target.id : target.path, ruleId, this.traces.length + 1),
            source,
            target,
            relation,
            confidence,
        };
        this.traces.push(trace);
        return trace;
    }
    list() {
        return [...this.traces].sort((left, right) => left.id.localeCompare(right.id));
    }
}
//# sourceMappingURL=trace-builder.js.map