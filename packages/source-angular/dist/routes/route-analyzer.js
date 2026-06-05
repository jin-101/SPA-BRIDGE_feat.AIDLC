import { createDiagnostic } from '@spa-bridge/core-model';
import { createStableIdFactory } from '../model/stable-id-factory.js';
const isObjectLiteral = (text) => text.trim().startsWith('{') && text.trim().endsWith('}');
const pickString = (text, key) => {
    const pattern = new RegExp(`${key}\\s*:\\s*(['"\`])([^'"\`]+)\\1`);
    const match = text.match(pattern);
    return match?.[2];
};
export class RouteAnalyzer {
    ids = createStableIdFactory();
    analyze(sourcePath, sourceText) {
        const routes = [];
        const diagnostics = [];
        const matches = sourceText.match(/\{[\s\S]*?\}/g) ?? [];
        for (const [index, candidate] of matches.entries()) {
            if (!isObjectLiteral(candidate)) {
                continue;
            }
            const pathValue = pickString(candidate, 'path') ?? '';
            const component = pickString(candidate, 'component');
            const lazyLoadTarget = pickString(candidate, 'loadChildren');
            const guardRefs = [...candidate.matchAll(/canActivate\s*:\s*\[([^\]]*)\]/g)]
                .flatMap((match) => (match[1] ?? '').split(','))
                .map((value) => value.trim())
                .filter(Boolean);
            const resolverRefs = [...candidate.matchAll(/resolve\s*:\s*\{([^}]*)\}/g)]
                .flatMap((match) => (match[1] ?? '').split(','))
                .map((value) => value.trim().split(':')[0] ?? '')
                .filter(Boolean);
            const childPaths = [...candidate.matchAll(/children\s*:\s*\[([\s\S]*?)\]/g)]
                .map((match) => match[1] ?? '')
                .filter(Boolean)
                .map((childrenText) => pickString(childrenText, 'path') ?? '')
                .filter(Boolean);
            const parameterNames = [...candidate.matchAll(/:([A-Za-z0-9_]+)/g)].map((match) => match[1] ?? '').filter(Boolean);
            const isDynamic = !pathValue || /[+`$]/.test(candidate) || candidate.includes('loadChildren');
            if (isDynamic) {
                diagnostics.push(createDiagnostic({
                    code: 'ROUTE-DYNAMIC-001',
                    severity: 'manual-review',
                    message: `Dynamic or partially unresolved route in '${sourcePath}'.`,
                    sourceRefs: [
                        {
                            kind: 'source',
                            path: sourcePath,
                            location: `${index}:0`,
                        },
                    ],
                    generatedRefs: [],
                    tags: ['route', 'manual-review'],
                }));
            }
            routes.push({
                id: this.ids.routeId(sourcePath, pathValue || 'dynamic', index),
                sourcePath,
                path: pathValue || '',
                component,
                lazyLoadTarget,
                guardRefs,
                resolverRefs,
                childPaths,
                parameterNames,
                isDynamic,
            });
        }
        return { routes, diagnostics };
    }
}
//# sourceMappingURL=route-analyzer.js.map