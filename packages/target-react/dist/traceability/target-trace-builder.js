let traceSequence = 0;
export class TargetTraceBuilder {
    build(source, targetPath, relation = 'derived-from') {
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
//# sourceMappingURL=target-trace-builder.js.map