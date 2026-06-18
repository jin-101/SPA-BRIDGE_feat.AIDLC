const byId = (left, right) => left.id.localeCompare(right.id);
export class ReactDraftNormalizer {
    normalize(request) {
        const draftSet = request.draftSet;
        return {
            schemaVersion: 1,
            targetFramework: 'react',
            projectStrategy: request.strategyId ?? draftSet.projectStrategy,
            aliasModel: draftSet.aliasModel,
            targetRoot: request.targetRoot,
            projectName: request.projectName ?? draftSet.projectStrategy,
            stateStrategy: request.selectedStateStrategy ?? 'unknown',
            components: [...draftSet.components].sort(byId),
            templates: [...draftSet.templates].sort(byId),
            services: [...draftSet.services].sort(byId),
            routes: [...draftSet.routes].sort(byId),
            state: [...draftSet.state].sort(byId),
            reduxToolkit: [...draftSet.reduxToolkit].sort(byId),
            animations: [...draftSet.animations].sort(byId),
            manualReviewItems: [...draftSet.manualReviewItems].sort(byId),
            diagnostics: [...draftSet.diagnostics].sort((left, right) => {
                const severity = left.severity.localeCompare(right.severity);
                return severity !== 0 ? severity : left.code.localeCompare(right.code);
            }),
            traces: [...draftSet.traces].sort((left, right) => left.id.localeCompare(right.id)),
        };
    }
}
//# sourceMappingURL=react-draft-normalizer.js.map