import { type Diagnostic } from '@spa-bridge/core-model';
import type { RouteSummary } from '../types.js';
export declare class RouteAnalyzer {
    private readonly ids;
    analyze(sourcePath: string, sourceText: string): {
        routes: RouteSummary[];
        diagnostics: Diagnostic[];
    };
}
//# sourceMappingURL=route-analyzer.d.ts.map