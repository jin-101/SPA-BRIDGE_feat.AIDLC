import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactComponentDraft, ReactRouteDraft } from '@spa-bridge/transform-angular-react';
import type { GeneratedFileSpec } from '../types.js';
export declare class RoutingOutputAdapter {
    materialize(routes: ReactRouteDraft[], sourceRefs?: SourceRef[], components?: ReactComponentDraft[]): GeneratedFileSpec[];
}
//# sourceMappingURL=routing-output-adapter.d.ts.map