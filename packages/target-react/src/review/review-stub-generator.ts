import type { ManualReviewItem } from '@spa-bridge/core-model';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec } from '../types.js';

export class ReviewStubGenerator {
  build(reviewItems: ManualReviewItem[]): GeneratedFileSpec[] {
    return reviewItems.map((item) =>
      createFileSpec({
        path: `src/review/${item.id}.md`,
        kind: 'review',
        content: [
          `# ${item.title}`,
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
