import { type Diagnostic } from '@spa-bridge/core-model';
import type { QualityGateRun } from '../types.js';
export declare class QualityDiagnosticFactory {
    createFromGateRun(gateRun: QualityGateRun, severity: 'info' | 'warning' | 'manual-review' | 'blocking'): Diagnostic;
}
//# sourceMappingURL=quality-diagnostic-factory.d.ts.map