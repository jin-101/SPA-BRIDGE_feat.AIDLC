import { createDiagnostic, type Diagnostic, type SourceRef } from '@spa-bridge/core-model';

import { createStableIdFactory } from '../model/stable-id-factory.js';
import type { AngularDependencyGraph, GraphEdge, GraphEdgeKind, GraphNode, GraphNodeKind } from '../types.js';

const severityOf = (severity: Diagnostic['severity']): number => {
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
  private readonly ids = createStableIdFactory();
  private readonly nodes = new Map<string, GraphNode>();
  private readonly edges = new Map<string, GraphEdge>();

  addNode(kind: GraphNodeKind, label: string, sourceRef?: SourceRef, metadata?: GraphNode['metadata']): GraphNode {
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

  addEdge(kind: GraphEdgeKind, from: string, to: string, evidenceRefs: SourceRef[] = [], confidence = 1): GraphEdge {
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

  finalize(): { graph: AngularDependencyGraph; diagnostics: Diagnostic[] } {
    const diagnostics: Diagnostic[] = [];
    for (const edge of this.edges.values()) {
      if (!this.nodes.has(edge.from) || (!this.nodes.has(edge.to) && !edge.to.startsWith('external:'))) {
        diagnostics.push(
          createDiagnostic({
            code: 'GRAPH-EDGE-001',
            severity: 'error',
            message: `Dangling graph edge '${edge.id}'.`,
            sourceRefs: edge.evidenceRefs,
            generatedRefs: [],
            tags: ['graph', 'invariant'],
          }),
        );
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
