import { createDiagnostic, type Diagnostic } from '@spa-bridge/core-model';

export class TargetDiagnosticFactory {
  create(code: string, severity: Diagnostic['severity'], message: string, sourcePath?: string): Diagnostic {
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
