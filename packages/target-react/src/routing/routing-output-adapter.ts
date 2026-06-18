import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactComponentDraft, ReactRouteDraft } from '@spa-bridge/transform-angular-react';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec } from '../types.js';

const toRouteSegment = (pathValue: string): string => {
  const normalized = pathValue.replace(/^\//, '').replace(/[^\w/-]/g, '-');
  return normalized.length > 0 ? normalized : 'root';
};

const toComponentName = (name: string | undefined): string => (name ?? 'App').replace(/[^A-Za-z0-9]/g, '') || 'App';
const toSourceRelativeComponentPath = (component: ReactComponentDraft): string => {
  const sourcePath = component.sourceRef?.path ?? component.sourceRelativePath ?? component.name;
  const normalized = sourcePath.replace(/\\/g, '/');
  const srcIndex = normalized.lastIndexOf('/src/');
  const relative = srcIndex >= 0 ? normalized.slice(srcIndex + '/src/'.length) : normalized.split('/').slice(-2).join('/');
  const withoutExtension = relative
    .replace(/\.ts$/i, '')
    .replace(/\.component$/i, '')
    .replace(/\.page$/i, '')
    .replace(/\.container$/i, '');
  const safeRelative = withoutExtension
    .split('/')
    .map((segment) => segment.replace(/[^A-Za-z0-9._-]/g, '-'))
    .filter(Boolean)
    .join('/');
  return `src/${safeRelative}/${toComponentName(component.name)}.tsx`;
};

const toRelativeImport = (fromPath: string, toPath: string): string => {
  const fromDir = fromPath.split('/').slice(0, -1).join('/');
  const fromParts = fromDir.split('/').filter(Boolean);
  const toParts = toPath.replace(/\.(tsx|ts)$/i, '').split('/').filter(Boolean);
  while (fromParts.length > 0 && toParts.length > 0 && fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }
  const prefix = fromParts.length > 0 ? '../'.repeat(fromParts.length) : './';
  return `${prefix}${toParts.join('/')}`;
};

export class RoutingOutputAdapter {
  materialize(routes: ReactRouteDraft[], sourceRefs: SourceRef[] = [], components: ReactComponentDraft[] = []): GeneratedFileSpec[] {
    const componentPathByName = new Map(components.map((component) => [toComponentName(component.name), toSourceRelativeComponentPath(component)]));
    const componentImports = [...new Set(routes.map((route) => toComponentName(route.elementRef)).filter((name) => name !== 'App'))]
      .map((name) => `import { ${name} } from '${toRelativeImport('src/routes.tsx', componentPathByName.get(name) ?? `src/components/${name}.tsx`)}';`);
    const routeContent = [
      "import type { RouteObject } from 'react-router-dom';",
      "import { App } from './App';",
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
