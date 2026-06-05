import type { ManualReviewItem, Diagnostic, GeneratedArtifactRef, TraceLink } from '@spa-bridge/core-model';

import type {
  ReactComponentDraft,
  ReactHookDraft,
  ReactRouteDraft,
  ReactServiceDraft,
  ReactStateDraft,
  ReactTargetDraftSet,
  ReactTemplateDraft,
  TransformationTargetFramework,
  TargetProjectStrategy,
} from '../types.js';

const sortById = <T extends { id: string }>(items: T[]): T[] => [...items].sort((left, right) => left.id.localeCompare(right.id));

export class DraftBuilder {
  private readonly components: ReactComponentDraft[] = [];
  private readonly templates: ReactTemplateDraft[] = [];
  private readonly services: ReactServiceDraft[] = [];
  private readonly routes: ReactRouteDraft[] = [];
  private readonly state: ReactStateDraft[] = [];
  private readonly diagnostics: Diagnostic[] = [];
  private readonly reviewItems: ManualReviewItem[] = [];
  private readonly traces: TraceLink[] = [];

  addComponent(draft: ReactComponentDraft): void {
    this.components.push(draft);
  }

  addTemplate(draft: ReactTemplateDraft): void {
    this.templates.push(draft);
  }

  addService(draft: ReactServiceDraft): void {
    this.services.push(draft);
  }

  addRoute(draft: ReactRouteDraft): void {
    this.routes.push(draft);
  }

  addState(draft: ReactStateDraft): void {
    this.state.push(draft);
  }

  addDiagnostic(diagnostic: Diagnostic): void {
    this.diagnostics.push(diagnostic);
  }

  addReviewItem(item: ManualReviewItem): void {
    this.reviewItems.push(item);
  }

  addTrace(trace: TraceLink): void {
    this.traces.push(trace);
  }

  finalize(targetFramework: TransformationTargetFramework, projectStrategy: TargetProjectStrategy): ReactTargetDraftSet {
    return {
      schemaVersion: 1,
      targetFramework,
      projectStrategy,
      components: sortById(this.components),
      templates: sortById(this.templates),
      services: sortById(this.services),
      routes: sortById(this.routes),
      state: sortById(this.state),
      manualReviewItems: sortById(this.reviewItems),
      diagnostics: [...this.diagnostics].sort((left, right) => {
        if (left.severity !== right.severity) {
          return left.severity.localeCompare(right.severity);
        }
        if (left.code !== right.code) {
          return left.code.localeCompare(right.code);
        }
        return left.message.localeCompare(right.message);
      }),
      traces: [...this.traces].sort((left, right) => left.id.localeCompare(right.id)),
    };
  }
}
