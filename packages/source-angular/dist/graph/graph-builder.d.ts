import { type Diagnostic, type SourceRef } from '@spa-bridge/core-model';
import type { AngularDependencyGraph, GraphEdge, GraphEdgeKind, GraphNode, GraphNodeKind } from '../types.js';
export declare class GraphBuilder {
    private readonly ids;
    private readonly nodes;
    private readonly edges;
    addNode(kind: GraphNodeKind, label: string, sourceRef?: SourceRef, metadata?: GraphNode['metadata']): GraphNode;
    addEdge(kind: GraphEdgeKind, from: string, to: string, evidenceRefs?: SourceRef[], confidence?: number): GraphEdge;
    finalize(): {
        graph: AngularDependencyGraph;
        diagnostics: Diagnostic[];
    };
}
//# sourceMappingURL=graph-builder.d.ts.map