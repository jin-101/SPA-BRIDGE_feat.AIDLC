import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactRouteDraft } from '@spa-bridge/transform-angular-react';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec } from '../types.js';

const toRouteSegment = (pathValue: string): string => {
  const normalized = pathValue.replace(/^\//, '').replace(/[^\w/-]/g, '-');
  return normalized.length > 0 ? normalized : 'root';
};

const toComponentName = (name: string | undefined): string => (name ?? 'App').replace(/[^A-Za-z0-9]/g, '') || 'App';

export class RoutingOutputAdapter {
  materialize(routes: ReactRouteDraft[], sourceRefs: SourceRef[] = []): GeneratedFileSpec[] {
    const componentImports = [...new Set(routes.map((route) => toComponentName(route.elementRef)).filter((name) => name !== 'App'))]
      .map((name) => `import { ${name} } from './components/${name}.js';`);
    const routeContent = [
      "import type { RouteObject } from 'react-router-dom';",
      "import { App } from './App.js';",
      ...componentImports,
      '',
      'export const routes: RouteObject[] = [',
      ...routes.map((route) => {
        const componentName = toComponentName(route.elementRef);
        return `  { path: '${route.path}', element: <${componentName} /> },`;
      }),
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
      ...routes.map((route) =>
        createFileSpec({
          path: `src/routes/${toRouteSegment(route.path)}.tsx`,
          kind: 'route',
          content: [
            `export const routePath = '${route.path}';`,
            `export const routeId = '${route.id}';`,
            '',
          ].join('\n'),
          sourceRefs,
          overwrite: true,
        }),
      ),
    ];
  }
}
