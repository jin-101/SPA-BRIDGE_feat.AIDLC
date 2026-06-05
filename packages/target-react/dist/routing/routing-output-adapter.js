import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
const toRouteSegment = (pathValue) => {
    const normalized = pathValue.replace(/^\//, '').replace(/[^\w/-]/g, '-');
    return normalized.length > 0 ? normalized : 'root';
};
export class RoutingOutputAdapter {
    materialize(routes, sourceRefs = []) {
        const routeContent = [
            "import type { RouteObject } from 'react-router-dom';",
            "import { App } from '../App.js';",
            '',
            'export const routes: RouteObject[] = [',
            ...routes.map((route) => `  { path: '${route.path}', element: <App /> },`),
            '];',
            '',
        ].join('\n');
        return [
            createFileSpec({
                path: 'src/routes.tsx',
                kind: 'route',
                content: routeContent,
                sourceRefs,
                overwrite: true,
            }),
            ...routes.map((route) => createFileSpec({
                path: `src/routes/${toRouteSegment(route.path)}.tsx`,
                kind: 'route',
                content: [
                    `export const routePath = '${route.path}';`,
                    `export const routeId = '${route.id}';`,
                    '',
                ].join('\n'),
                sourceRefs,
                overwrite: true,
            })),
        ];
    }
}
//# sourceMappingURL=routing-output-adapter.js.map