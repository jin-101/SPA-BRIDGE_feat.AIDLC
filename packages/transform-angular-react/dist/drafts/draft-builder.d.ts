import type { ManualReviewItem, Diagnostic, TraceLink } from '@spa-bridge/core-model';
import type { ReactComponentDraft, ReactRouteDraft, ReactServiceDraft, ReactStateDraft, ReactTargetDraftSet, ReactTemplateDraft, TransformationTargetFramework, TargetProjectStrategy, TransformationContext } from '../types.js';
export declare class DraftBuilder {
    private readonly components;
    private readonly templates;
    private readonly services;
    private readonly routes;
    private readonly state;
    private readonly diagnostics;
    private readonly reviewItems;
    private readonly traces;
    addComponent(draft: ReactComponentDraft): void;
    addTemplate(draft: ReactTemplateDraft): void;
    addService(draft: ReactServiceDraft): void;
    addRoute(draft: ReactRouteDraft): void;
    addState(draft: ReactStateDraft): void;
    addDiagnostic(diagnostic: Diagnostic): void;
    addReviewItem(item: ManualReviewItem): void;
    addTrace(trace: TraceLink): void;
    finalize(targetFramework: TransformationTargetFramework, projectStrategy: TargetProjectStrategy, aliasModel: TransformationContext['aliasModel']): ReactTargetDraftSet;
}
//# sourceMappingURL=draft-builder.d.ts.map