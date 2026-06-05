import type { SourceRef, TraceLink } from '@spa-bridge/core-model';
export declare class TraceBuilder {
    private readonly ids;
    private readonly traces;
    addTrace(source: SourceRef, target: TraceLink['target'], ruleId: string, relation?: TraceLink['relation'], confidence?: number): TraceLink;
    list(): TraceLink[];
}
//# sourceMappingURL=trace-builder.d.ts.map