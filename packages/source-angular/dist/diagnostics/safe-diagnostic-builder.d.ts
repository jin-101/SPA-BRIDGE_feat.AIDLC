import { type Diagnostic } from '@spa-bridge/core-model';
export type SafeDiagnosticInput = {
    code: string;
    severity: Diagnostic['severity'];
    message: string;
    sourcePaths?: string[];
    tags?: string[];
    remediationHint?: string;
    generatedRefs?: Diagnostic['generatedRefs'];
};
export declare class SafeDiagnosticBuilder {
    private readonly ids;
    build(input: SafeDiagnosticInput): Diagnostic;
    normalize(diagnostics: Diagnostic[]): Diagnostic[];
}
//# sourceMappingURL=safe-diagnostic-builder.d.ts.map