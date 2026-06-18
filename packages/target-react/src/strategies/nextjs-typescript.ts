import path from 'node:path';

import type {
  GeneratedFileSpec,
  NormalizedTargetDraftBundle,
  TargetDependencyManifest,
  TargetGenerationRequest,
  TargetStrategyDescriptor,
} from '../types.js';

type TargetAliasMapping = {
  alias: string;
  tsconfigKey: string;
  tsconfigTargets: string[];
  nextAliasTarget: string;
};

const baseDependencies = {
  react: '18.2.0',
  'react-dom': '18.2.0',
  next: '14.2.30',
};

const baseDevDependencies = {
  '@types/react': '18.3.12',
  '@types/react-dom': '18.3.1',
  '@types/node': '22.15.0',
  typescript: '5.8.3',
  less: '4.2.0',
};

const makeFile = (
  path: string,
  kind: GeneratedFileSpec['kind'],
  content: string,
  sourceRefs: GeneratedFileSpec['sourceRefs'] = [],
  overwrite = true,
): GeneratedFileSpec => ({
  path,
  kind,
  content,
  sourceRefs,
  generatedRefs: [{ kind: 'generated', path }],
  traceRefs: [],
  overwrite,
  status: 'generated',
});

const buildPackageJson = (
  request: TargetGenerationRequest,
  manifest: TargetDependencyManifest,
): string =>
  JSON.stringify(
    {
      name: request.projectName ?? 'spa-bridge-next-target',
      private: true,
      version: '0.0.0',
      type: 'module',
      ...(manifest.packageManager ? { packageManager: manifest.packageManager } : {}),
      scripts: {
        ...(manifest.scripts ?? {
          dev: 'next dev',
          build: 'next build',
          start: 'next dev',
          serve: 'next start',
          lint: 'next lint',
          typecheck: 'tsc --noEmit',
        }),
      },
      dependencies: manifest.dependencies,
      devDependencies: manifest.devDependencies,
    },
    null,
    2,
  ) + '\n';

const stripWildcard = (value: string): string => value.replace(/\/?\*+$/g, '');

const isSafeTargetPath = (value: string): boolean => value.length > 0 && !path.isAbsolute(value) && !value.split(/[\\/]+/).includes('..');

const normalizeTargetPath = (sourcePath: string, normalizedDrafts: NormalizedTargetDraftBundle): string | undefined => {
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

const buildAliasMappings = (normalizedDrafts: NormalizedTargetDraftBundle): TargetAliasMapping[] => {
  const mappings: TargetAliasMapping[] = [];
  for (const mapping of normalizedDrafts.aliasModel.paths) {
    if (mapping.status !== 'supported') {
      continue;
    }

    const aliasBase = stripWildcard(mapping.aliasPattern);
    const tsconfigTargets = mapping.resolvedTargets
      .map((target) => normalizeTargetPath(target, normalizedDrafts))
      .filter((target): target is string => !!target && isSafeTargetPath(target))
      .map((target) => `${target}${mapping.aliasPattern.endsWith('/*') ? '/*' : ''}`)
      .sort((left, right) => left.localeCompare(right));

    const nextAliasTarget = tsconfigTargets[0] ? stripWildcard(tsconfigTargets[0]) : undefined;
    if (!nextAliasTarget || !isSafeTargetPath(nextAliasTarget)) {
      continue;
    }

    mappings.push({
      alias: aliasBase,
      tsconfigKey: mapping.aliasPattern,
      tsconfigTargets,
      nextAliasTarget,
    });
  }

  return mappings.sort((left, right) => left.alias.localeCompare(right.alias));
};

const buildTsconfig = (aliasMappings: TargetAliasMapping[]): string =>
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['DOM', 'DOM.Iterable', 'ES2022'],
        allowJs: false,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        ...(aliasMappings.length > 0
          ? {
              baseUrl: '.',
              paths: Object.fromEntries(aliasMappings.map((mapping) => [mapping.tsconfigKey, mapping.tsconfigTargets])),
            }
          : {}),
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    },
    null,
    2,
  ) + '\n';

const buildNextConfig = (aliasMappings: TargetAliasMapping[]): string => {
  const aliasLines = aliasMappings.map(
    (mapping) => `      config.resolve.alias['${mapping.alias}'] = path.resolve(process.cwd(), '${mapping.nextAliasTarget}');`,
  );

  return `import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = config.resolve.alias ?? {};
${aliasLines.length > 0 ? aliasLines.join('\n') : '    // No Angular path aliases were eligible for Next.js alias generation.'}
    return config;
  },
};

export default nextConfig;
`;
};

const buildAliasMetadata = (normalizedDrafts: NormalizedTargetDraftBundle, aliasMappings: TargetAliasMapping[]): string =>
  JSON.stringify(
    {
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
    },
    null,
    2,
  ) + '\n';

const buildNextEnv = (): string => `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file is generated by SPA-Bridge for the Next.js target.
`;

const buildGlobalStyles = (): string => `.app-shell {
  font-family: Inter, system-ui, sans-serif;
  padding: 2rem;
}
`;

const buildRootProvider = (includeReduxStore: boolean): string => `'use client';

${includeReduxStore ? "import { Provider } from 'react-redux';\nimport { store } from '../store/index';\n" : ''}import type { ReactNode } from 'react';

export const RootProviders = ({ children }: { children: ReactNode }) => {
  return ${includeReduxStore ? '<Provider store={store}>{children}</Provider>' : '<>{children}</>'};
};
`;

const buildLayout = (projectName: string): string => `import type { Metadata } from 'next';
import { RootProviders } from './providers';
import './globals.css';
import '../source-styles.css';

export const metadata: Metadata = {
  title: '${projectName.replace(/'/g, "\\'")}',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
`;

const buildPage = (projectName: string): string => `export default function Page() {
  return (
    <main className="app-shell">
      <h1>${projectName}</h1>
      <p>Target Next.js scaffold generated by SPA-Bridge.</p>
    </main>
  );
}
`;

const buildStrategy = (defaultStrategy: boolean): TargetStrategyDescriptor => ({
  id: 'nextjs-typescript',
  displayName: 'Next.js + React + TypeScript',
  description: 'Default deterministic Next.js App Router scaffold with React 18 and TypeScript.',
  defaultStrategy,
  supportedStateStrategies: ['service', 'signals', 'store', 'local', 'unknown'],
  capabilities: [
    'base-scaffold',
    'nextjs-app-router',
    'routing',
    'state-adapters',
    'component-materialization',
    'review-stubs',
  ],
  exactDependencies: {
    ...baseDependencies,
  },
  createScaffoldFiles: ({ request, normalizedDrafts, dependencyManifest }): GeneratedFileSpec[] => {
    const projectName = normalizedDrafts.projectName || request.projectName || 'spa-bridge-next-target';
    const aliasMappings = buildAliasMappings(normalizedDrafts);
    const includeReduxStore = normalizedDrafts.reduxToolkit.length > 0;

    return [
      makeFile('package.json', 'scaffold', buildPackageJson({ ...request, projectName }, dependencyManifest)),
      makeFile('tsconfig.json', 'scaffold', buildTsconfig(aliasMappings)),
      makeFile('next.config.mjs', 'scaffold', buildNextConfig(aliasMappings)),
      makeFile('next-env.d.ts', 'scaffold', buildNextEnv()),
      makeFile('src/app/layout.tsx', 'scaffold', buildLayout(projectName)),
      makeFile('src/app/page.tsx', 'scaffold', buildPage(projectName)),
      makeFile('src/app/providers.tsx', 'scaffold', buildRootProvider(includeReduxStore)),
      makeFile('src/app/globals.css', 'scaffold', buildGlobalStyles()),
      makeFile('src/source-styles.css', 'scaffold', '/* Angular source style imports are added by the CLI resource copier. */\n'),
      makeFile('src/metadata/alias-mapping.json', 'metadata', buildAliasMetadata(normalizedDrafts, aliasMappings)),
    ];
  },
});

export const createNextJsTypeScriptStrategy = (): TargetStrategyDescriptor => buildStrategy(true);

export const nextJsTypeScriptStrategyId = 'nextjs-typescript' as const;

export const createNextJsDependencyManifest = (): TargetDependencyManifest => ({
  dependencies: { ...baseDependencies },
  devDependencies: { ...baseDevDependencies },
  rationale: {
    react: 'Core UI runtime for the generated Next.js target project.',
    'react-dom': 'Browser rendering support used by Next.js.',
    next: 'Next.js application framework for the generated target project.',
    '@types/react': 'TypeScript declarations for React components.',
    '@types/react-dom': 'TypeScript declarations for DOM rendering APIs.',
    '@types/node': 'TypeScript declarations for Next.js config and Node.js tooling.',
    typescript: 'TypeScript compiler for the generated target project.',
    less: 'LESS preprocessing support for Angular styles carried into the Next.js target.',
  },
});
