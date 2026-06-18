import path from 'node:path';
const baseDependencies = {
    react: '18.2.0',
    'react-dom': '18.2.0',
    'react-router-dom': '6.30.1',
};
const baseDevDependencies = {
    '@types/react': '18.3.12',
    '@types/react-dom': '18.3.1',
    '@types/node': '22.15.0',
    '@vitejs/plugin-react': '4.3.4',
    typescript: '5.8.3',
    vite: '5.4.11',
    less: '4.2.0',
};
const makeFile = (path, kind, content, sourceRefs = [], overwrite = true) => ({
    path,
    kind,
    content,
    sourceRefs,
    generatedRefs: [{ kind: 'generated', path }],
    traceRefs: [],
    overwrite,
    status: 'generated',
});
const buildPackageJson = (request, manifest) => JSON.stringify({
    name: request.projectName ?? 'spa-bridge-react-target',
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview',
    },
    dependencies: manifest.dependencies,
    devDependencies: manifest.devDependencies,
}, null, 2) + '\n';
const stripWildcard = (value) => value.replace(/\/?\*+$/g, '');
const isSafeTargetPath = (value) => value.length > 0 && !path.isAbsolute(value) && !value.split(/[\\/]+/).includes('..');
const normalizeTargetPath = (sourcePath, normalizedDrafts) => {
    const absoluteSourcePath = path.resolve(sourcePath);
    const projects = normalizedDrafts.aliasModel.workspaceProjects.filter((project) => project.status === 'supported');
    for (const project of projects) {
        if (project.sourceRoot) {
            const relative = path.relative(project.sourceRoot, absoluteSourcePath);
            if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
                return path.posix.join('src', relative.split(path.sep).join('/'));
            }
        }
        const projectRelative = path.relative(project.projectRoot, absoluteSourcePath);
        if (projectRelative === '' || (!projectRelative.startsWith('..') && !path.isAbsolute(projectRelative))) {
            return projectRelative.split(path.sep).join('/');
        }
    }
    return undefined;
};
const buildAliasMappings = (normalizedDrafts) => {
    const mappings = [];
    for (const mapping of normalizedDrafts.aliasModel.paths) {
        if (mapping.status !== 'supported') {
            continue;
        }
        const aliasBase = stripWildcard(mapping.aliasPattern);
        const tsconfigTargets = mapping.resolvedTargets
            .map((target) => normalizeTargetPath(target, normalizedDrafts))
            .filter((target) => !!target && isSafeTargetPath(target))
            .map((target) => `${target}${mapping.aliasPattern.endsWith('/*') ? '/*' : ''}`)
            .sort((left, right) => left.localeCompare(right));
        const viteTarget = tsconfigTargets[0] ? stripWildcard(tsconfigTargets[0]) : undefined;
        if (!viteTarget || !isSafeTargetPath(viteTarget)) {
            continue;
        }
        mappings.push({
            alias: aliasBase,
            tsconfigKey: mapping.aliasPattern,
            tsconfigTargets,
            viteTarget,
        });
    }
    return mappings.sort((left, right) => left.alias.localeCompare(right.alias));
};
const buildTsconfig = (aliasMappings) => JSON.stringify({
    compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        jsx: 'react-jsx',
        lib: ['DOM', 'DOM.Iterable', 'ES2022'],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        types: ['vite/client'],
        ...(aliasMappings.length > 0
            ? {
                baseUrl: '.',
                paths: Object.fromEntries(aliasMappings.map((mapping) => [mapping.tsconfigKey, mapping.tsconfigTargets])),
            }
            : {}),
    },
    include: ['src'],
}, null, 2) + '\n';
const buildTsconfigNode = () => JSON.stringify({
    extends: './tsconfig.json',
    compilerOptions: {
        noEmit: false,
        composite: false,
        types: ['node'],
    },
    include: ['vite.config.ts'],
}, null, 2) + '\n';
const buildViteConfig = (aliasMappings) => {
    const aliasBlock = aliasMappings.length > 0
        ? `,
  resolve: {
    alias: {
${aliasMappings.map((mapping) => `      '${mapping.alias}': path.resolve(__dirname, '${mapping.viteTarget}')`).join(',\n')}
    },
  }`
        : '';
    return `import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()]${aliasBlock},
});
`;
};
const buildAliasMetadata = (normalizedDrafts, aliasMappings) => JSON.stringify({
    schemaVersion: 1,
    generatedAliases: aliasMappings,
    sourceSummary: normalizedDrafts.aliasModel.summary,
    unsupportedAliases: normalizedDrafts.aliasModel.paths
        .filter((mapping) => mapping.status !== 'supported')
        .map((mapping) => ({
        aliasPattern: mapping.aliasPattern,
        status: mapping.status,
        sourceConfigPath: mapping.sourceConfigPath,
    }))
        .sort((left, right) => left.aliasPattern.localeCompare(right.aliasPattern)),
}, null, 2) + '\n';
const buildIndexHtml = (projectName) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
const buildMainTsx = (includeReduxStore) => `${includeReduxStore ? "import { Provider } from 'react-redux';\nimport { store } from './store/index';\n" : ''}import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles.css';
import './source-styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    ${includeReduxStore ? '<Provider store={store}>\n      <App />\n    </Provider>' : '<App />'}
  </React.StrictMode>,
);
`;
const buildAppTsx = (projectName) => `export const App = () => {
  return (
    <main className="app-shell">
      <h1>${projectName}</h1>
      <p>Target React scaffold generated by SPA-Bridge.</p>
    </main>
  );
};
`;
const buildStyles = () => `.app-shell {
  font-family: Inter, system-ui, sans-serif;
  padding: 2rem;
}
`;
const buildStrategy = (id, defaultStrategy) => ({
    id,
    displayName: 'Vite + React + TypeScript',
    description: 'Default deterministic Vite scaffold with React 18 and TypeScript.',
    defaultStrategy,
    supportedStateStrategies: ['service', 'signals', 'store', 'local', 'unknown'],
    capabilities: [
        'base-scaffold',
        'routing',
        'state-adapters',
        'component-materialization',
        'review-stubs',
    ],
    exactDependencies: {
        ...baseDependencies,
    },
    createScaffoldFiles: ({ request, normalizedDrafts, dependencyManifest }) => {
        const projectName = normalizedDrafts.projectName || request.projectName || 'spa-bridge-react-target';
        const aliasMappings = buildAliasMappings(normalizedDrafts);
        return [
            makeFile('package.json', 'scaffold', buildPackageJson({ ...request, projectName }, dependencyManifest)),
            makeFile('tsconfig.json', 'scaffold', buildTsconfig(aliasMappings)),
            makeFile('tsconfig.node.json', 'scaffold', buildTsconfigNode()),
            makeFile('vite.config.ts', 'scaffold', buildViteConfig(aliasMappings)),
            makeFile('index.html', 'scaffold', buildIndexHtml(projectName)),
            makeFile('src/main.tsx', 'scaffold', buildMainTsx(normalizedDrafts.reduxToolkit.length > 0)),
            makeFile('src/App.tsx', 'scaffold', buildAppTsx(projectName)),
            makeFile('src/styles.css', 'scaffold', buildStyles()),
            makeFile('src/source-styles.css', 'scaffold', '/* Angular source style imports are added by the CLI resource copier. */\n'),
            makeFile('src/metadata/alias-mapping.json', 'metadata', buildAliasMetadata(normalizedDrafts, aliasMappings)),
        ];
    },
});
export const createViteReactTypeScriptStrategy = () => buildStrategy('vite-react-typescript', false);
export const createReactDefaultStrategy = () => buildStrategy('react-default', false);
export const viteReactTypeScriptStrategyId = 'vite-react-typescript';
export const createViteReactDependencyManifest = () => ({
    dependencies: { ...baseDependencies },
    devDependencies: { ...baseDevDependencies },
    rationale: {
        react: 'Core UI runtime for the generated target project.',
        'react-dom': 'Browser rendering for React root mounting.',
        'react-router-dom': 'Default route support for converted navigation.',
        '@types/react': 'TypeScript declarations for React components.',
        '@types/react-dom': 'TypeScript declarations for DOM rendering APIs.',
        '@vitejs/plugin-react': 'Vite fast refresh and JSX transform support.',
        typescript: 'TypeScript compiler for the generated target project.',
        vite: 'Deterministic dev-server and build pipeline.',
        less: 'LESS preprocessing support for Angular styles carried into the React target.',
    },
});
//# sourceMappingURL=vite-react-typescript.js.map