import type { ManualReviewItem } from '@spa-bridge/core-model';

export class TargetManualReviewFactory {
  create(id: string, title: string, description?: string): ManualReviewItem {
    return {
      id,
      title,
      description,
      status: 'open',
    };
  }
}
