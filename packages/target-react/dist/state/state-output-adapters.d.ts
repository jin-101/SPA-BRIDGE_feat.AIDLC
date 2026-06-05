import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactStateDraft } from '@spa-bridge/transform-angular-react';
import type { GeneratedFileSpec, TargetStateStrategy } from '../types.js';
export declare class StateOutputAdapters {
    materialize(state: ReactStateDraft[], strategy: TargetStateStrategy, sourceRefs?: SourceRef[]): GeneratedFileSpec[];
}
//# sourceMappingURL=state-output-adapters.d.ts.map