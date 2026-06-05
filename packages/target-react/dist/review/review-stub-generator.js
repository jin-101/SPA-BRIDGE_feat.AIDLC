import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
export class ReviewStubGenerator {
    build(reviewItems) {
        return reviewItems.map((item) => createFileSpec({
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
        }));
    }
}
//# sourceMappingURL=review-stub-generator.js.map