const sortById = (items) => [...items].sort((left, right) => left.id.localeCompare(right.id));
export class DraftBuilder {
    components = [];
    templates = [];
    services = [];
    routes = [];
    state = [];
    reduxToolkit = [];
    diagnostics = [];
    reviewItems = [];
    traces = [];
    addComponent(draft) {
        this.components.push(draft);
    }
    addTemplate(draft) {
        this.templates.push(draft);
    }
    addService(draft) {
        this.services.push(draft);
    }
    addRoute(draft) {
        this.routes.push(draft);
    }
    addState(draft) {
        this.state.push(draft);
    }
    addReduxToolkitDraft(draft) {
        this.reduxToolkit.push(draft);
    }
    addDiagnostic(diagnostic) {
        this.diagnostics.push(diagnostic);
    }
    addReviewItem(item) {
        this.reviewItems.push(item);
    }
    addTrace(trace) {
        this.traces.push(trace);
    }
    finalize(targetFramework, projectStrategy, aliasModel) {
        return {
            schemaVersion: 1,
            targetFramework,
            projectStrategy,
            aliasModel,
            components: sortById(this.components),
            templates: sortById(this.templates),
            services: sortById(this.services),
            routes: sortById(this.routes),
            state: sortById(this.state),
            reduxToolkit: sortById(this.reduxToolkit),
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
//# sourceMappingURL=draft-builder.js.map