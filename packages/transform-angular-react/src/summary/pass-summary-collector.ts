import type { Diagnostic, ManualReviewItem } from '@spa-bridge/core-model';

import type { PassSummary, ReactTargetDraftSet } from '../types.js';

export class PassSummaryCollector {
  collect(executedRules: number, skippedRules: number, drafts: ReactTargetDraftSet): PassSummary {
    const diagnosticsBySeverity: Record<string, number> = {};
    for (const diagnostic of drafts.diagnostics) {
      diagnosticsBySeverity[diagnostic.severity] = (diagnosticsBySeverity[diagnostic.severity] ?? 0) + 1;
    }

    const reviewItemsByCategory: Record<string, number> = {};
    for (const reviewItem of drafts.manualReviewItems) {
      const category = reviewItem.title.toLowerCase().split(' ')[1] ?? 'unknown';
      reviewItemsByCategory[category] = (reviewItemsByCategory[category] ?? 0) + 1;
    }

    const tracedDrafts = new Set(drafts.traces.map((trace) => (trace.target.kind === 'generated' ? trace.target.path : trace.target.id))).size;
    const totalDrafts = drafts.components.length + drafts.templates.length + drafts.services.length + drafts.routes.length + drafts.state.length;

    return {
      totalRules: executedRules + skippedRules,
      executedRules,
      skippedRules,
      diagnosticsBySeverity,
      reviewItemsByCategory,
      traceCoverage: {
        tracedDrafts,
        untracedDrafts: Math.max(totalDrafts - tracedDrafts, 0),
      },
      phaseCounts: {
        component: drafts.components.length,
        template: drafts.templates.length,
        service: drafts.services.length,
        route: drafts.routes.length,
        state: drafts.state.length,
      },
    };
  }
}
