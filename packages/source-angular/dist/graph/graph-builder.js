import { createDiagnostic } from '@spa-bridge/core-model';
import { createStableIdFactory } from '../model/stable-id-factory.js';
const severityOf = (severity) => {
    switch (severity) {
        case 'info':
            return 0;
        case 'warning':
            return 1;
        case 'error':
            return 2;
        case 'manual-review':
            return 3;
        case 'security-blocker':
            return 4;
    }
};
export class GraphBuilder {
    ids = createStableIdFactory();
    nodes = new Map();
    edges = new Map();
    addNode(kind, label, sourceRef, metadata) {
        const id = this.ids.nodeId(kind, label || sourceRef?.path || kind);
        const node = {
            id,
            kind,
            label,
            sourceRef,
            metadata,
        };
        this.nodes.set(id, node);
        return node;
    }
    addEdge(kind, from, to, evidenceRefs = [], confidence = 1) {
        const id = this.ids.edgeId(kind, from, to, this.edges.size);
        const edge = {
            id,
            kind,
            from,
            to,
            evidenceRefs,
            confidence,
        };
        this.edges.set(id, edge);
        return edge;
    }
    finalize() {
        const diagnostics = [];
        for (const edge of this.edges.values()) {
            if (!this.nodes.has(edge.from) || (!this.nodes.has(edge.to) && !edge.to.startsWith('external:'))) {
                diagnostics.push(createDiagnostic({
                    code: 'GRAPH-EDGE-001',
                    severity: 'error',
                    message: `Dangling graph edge '${edge.id}'.`,
                    sourceRefs: edge.evidenceRefs,
                    generatedRefs: [],
                    tags: ['graph', 'invariant'],
                }));
            }
        }
        const sortedNodes = [...this.nodes.values()].sort((left, right) => {
            if (left.kind !== right.kind) {
                return left.kind.localeCompare(right.kind);
            }
            return left.id.localeCompare(right.id);
        });
        const sortedEdges = [...this.edges.values()].sort((left, right) => {
            if (left.kind !== right.kind) {
                return left.kind.localeCompare(right.kind);
            }
            if (left.from !== right.from) {
                return left.from.localeCompare(right.from);
            }
            if (left.to !== right.to) {
                return left.to.localeCompare(right.to);
            }
            return left.id.localeCompare(right.id);
        });
        return {
            graph: {
                schemaVersion: 1,
                nodes: sortedNodes,
                edges: sortedEdges,
            },
            diagnostics,
        };
    }
}
//# sourceMappingURL=graph-builder.js.map