export const createFileSpec = (input) => ({
    path: input.path,
    kind: input.kind,
    content: input.content,
    sourceRefs: input.sourceRefs ?? [],
    generatedRefs: [{ kind: 'generated', path: input.path }],
    traceRefs: input.traceRefs ?? [],
    overwrite: input.overwrite ?? true,
    status: input.status ?? 'generated',
});
//# sourceMappingURL=generated-file-spec-factory.js.map