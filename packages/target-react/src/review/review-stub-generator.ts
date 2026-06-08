import type { ManualReviewItem } from '@spa-bridge/core-model';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import { ContentHashService } from '../write-plan/content-hash-service.js';
import type { GeneratedFileSpec } from '../types.js';

const sanitizeSegment = (value: string): string => {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized.length > 0 ? normalized.slice(0, 48) : 'item';
};

export class ReviewStubGenerator {
  private readonly hashService = new ContentHashService();

  private createReviewPath(item: ManualReviewItem, index: number): string {
    const label = sanitizeSegment(item.title || item.id);
    const hash = this.hashService.hash(item.id, item.title).slice(0, 12);
    const ordinal = String(index + 1).padStart(4, '0');
    return `src/review/${ordinal}-${label}-${hash}.md`;
  }

  build(reviewItems: ManualReviewItem[]): GeneratedFileSpec[] {
    return reviewItems.map((item, index) =>
      createFileSpec({
        path: this.createReviewPath(item, index),
        kind: 'review',
        content: [
          `# ${item.title}`,
          '',
          `Review ID: ${item.id}`,
          '',
          item.description ?? 'Manual review required.',
          '',
        ].join('\n'),
        overwrite: true,
        status: 'review',
      }),
    );
  }
}
