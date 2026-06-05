import { createDiagnostic } from '@spa-bridge/core-model';
export class TargetDiagnosticFactory {
    create(code, severity, message, sourcePath) {
        return createDiagnostic({
            code,
            severity,
            message,
            sourceRefs: sourcePath ? [{ kind: 'source', path: sourcePath }] : [],
            generatedRefs: [],
            tags: ['uow07', 'target-generation'],
        });
    }
}
//# sourceMappingURL=target-diagnostic-factory.js.map