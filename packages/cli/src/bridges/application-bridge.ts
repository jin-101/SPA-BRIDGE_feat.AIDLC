import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { createSafeDisplayString, ok, type Result } from '@spa-bridge/core-model';
import { SourceAngularAnalysisService } from '@spa-bridge/source-angular';
import type { AngularAnalysisResult } from '@spa-bridge/source-angular';
import { createTransformationService, type ProviderNeutralMappingRequest } from '@spa-bridge/transform-angular-react';
import { defaultCapabilityCatalog, refineMapping, type ProviderDescriptor, type ProviderMode, type RefinementResult } from '@spa-bridge/adapters-ai';
import type { ProviderPolicyDecision } from '@spa-bridge/core-security';
import {
  generateReactTarget,
  type GeneratedFileSpec,
  type SourceEnvironmentVariableInput,
  type SourceNpmrcFileInput,
  type SourcePackageManagerInput,
} from '@spa-bridge/target-react';

import type { CliApplicationBridge, CliApplicationRequest, CliApplicationResponse, CliReportPayload, CliValidationRequest, CliValidationResponse } from '../types.js';
import type { CliError } from '../shared-errors.js';
import { createCliError } from '../shared-errors.js';

const requireOptional = createRequire(import.meta.url);

const buildPayload = (
  request: CliApplicationRequest,
  title: string,
  summary: string,
  warnings: string[] = [],
  reviewItems: string[] = [],
  sections: CliReportPayload['sections'] = [],
): CliReportPayload => ({
  title,
  summary,
  warnings,
  reviewItems,
  sections: [
    { title: 'Run', lines: [`Run ID: ${request.resolvedOptions.runId}`, `Workspace: ${request.validatedPaths.workspaceRoot}`] },
    { title: 'Summary', lines: [summary] },
    ...sections,
  ],
});

const toCliError = (message: string, cause: unknown): CliError =>
  createCliError(
    'RUNTIME_FAILED',
    message,
    cause instanceof Error ? cause.message : JSON.stringify(cause),
    'Check that --workspace is a real directory and --input points to an Angular project root containing angular.json/package.json and src entry files.',
  );

const writeGeneratedFiles = async (files: GeneratedFileSpec[]): Promise<void> => {
  for (const file of [...files].sort((left, right) => left.path.localeCompare(right.path))) {
    if (!file.overwrite) {
      continue;
    }

    await fs.mkdir(path.dirname(file.path), { recursive: true });
    await fs.writeFile(file.path, file.content, 'utf8');
  }
};

const writeJsonArtifact = async (targetRoot: string, name: string, value: unknown): Promise<string> => {
  const artifactPath = path.join(targetRoot, '.spa-bridge', name);
  await fs.mkdir(path.dirname(artifactPath), { recursive: true });
  await fs.writeFile(artifactPath, JSON.stringify(value, null, 2) + '\n', 'utf8');
  return artifactPath;
};

const readSourcePackageDependencies = async (
  projectRoot: string,
): Promise<{
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  packageManager?: string;
}> => {
  try {
    const packageJsonText = await fs.readFile(path.join(projectRoot, 'package.json'), 'utf8');
    const packageJson = JSON.parse(packageJsonText) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      scripts?: Record<string, string>;
      packageManager?: string;
    };
    return {
      dependencies: packageJson.dependencies ?? {},
      devDependencies: packageJson.devDependencies ?? {},
      scripts: packageJson.scripts ?? {},
      packageManager: typeof packageJson.packageManager === 'string' ? packageJson.packageManager : undefined,
    };
  } catch {
    return { dependencies: {}, devDependencies: {}, scripts: {} };
  }
};

const toPosixPath = (value: string): string => value.replace(/\\/g, '/');

const safeRelativePath = (value: string): string =>
  toPosixPath(value)
    .replace(/^(\.\.\/)+/g, '')
    .replace(/^\/+/g, '')
    .replace(/[^A-Za-z0-9._/-]/g, '-');

const readTextIfExists = async (filePath: string): Promise<string | undefined> => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return undefined;
  }
};

const collectNpmrcFiles = async (workspaceRoot: string, projectRoot: string): Promise<SourceNpmrcFileInput[]> => {
  const candidates = [...new Set([path.join(workspaceRoot, '.npmrc'), path.join(projectRoot, '.npmrc')])];
  const files: SourceNpmrcFileInput[] = [];
  for (const candidate of candidates) {
    const content = await readTextIfExists(candidate);
    if (content !== undefined) {
      files.push({
        sourcePath: safeRelativePath(path.relative(projectRoot, candidate)) || '.npmrc',
        lines: content.split(/\r?\n/),
      });
    }
  }
  return files.sort((left, right) => left.sourcePath.localeCompare(right.sourcePath));
};

const extractEnvKeys = (content: string): string[] => {
  const keys = new Set<string>();
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (match?.[1]) {
      keys.add(match[1]);
    }
  }
  return [...keys].sort((left, right) => left.localeCompare(right));
};

const collectEnvironmentVariables = async (projectRoot: string, scripts: Record<string, string>): Promise<SourceEnvironmentVariableInput[]> => {
  const variables: SourceEnvironmentVariableInput[] = [];
  const rootEntries = await fs.readdir(projectRoot).catch(() => []);
  for (const entry of rootEntries.filter((value) => /^\.env(?:\.|$)/.test(value)).sort((left, right) => left.localeCompare(right))) {
    const content = await readTextIfExists(path.join(projectRoot, entry));
    if (content) {
      for (const name of extractEnvKeys(content)) {
        variables.push({ name, sourcePath: entry, sourceKind: 'env-file', valuePresent: true });
      }
    }
  }

  for (const [scriptName, command] of Object.entries(scripts)) {
    const matches = command.matchAll(/(?:^|\s)([A-Z_][A-Z0-9_]*)=/g);
    for (const match of matches) {
      if (match[1]) {
        variables.push({ name: match[1], sourcePath: `package.json#scripts.${scriptName}`, sourceKind: 'package-script', valuePresent: true });
      }
    }
  }

  const environmentDir = path.join(projectRoot, 'src', 'environments');
  const environmentFiles = await fs.readdir(environmentDir).catch(() => []);
  for (const entry of environmentFiles.filter((value) => /\.(ts|js)$/.test(value)).sort((left, right) => left.localeCompare(right))) {
    const content = await readTextIfExists(path.join(environmentDir, entry));
    if (!content) continue;
    for (const match of content.matchAll(/\b([A-Z][A-Z0-9_]{2,})\b/g)) {
      if (match[1]) {
        variables.push({ name: match[1], sourcePath: safeRelativePath(path.join('src/environments', entry)), sourceKind: 'angular-environment', valuePresent: false });
      }
    }
  }

  return variables.sort((left, right) => `${left.name}:${left.sourcePath ?? ''}`.localeCompare(`${right.name}:${right.sourcePath ?? ''}`));
};

const exists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const parsePackageManagerField = (value: string | undefined): Pick<SourcePackageManagerInput, 'name' | 'version' | 'packageManagerField'> | undefined => {
  const match = value?.match(/^(npm|pnpm|yarn)@(.+)$/);
  if (!match) {
    return undefined;
  }
  return {
    name: match[1] as SourcePackageManagerInput['name'],
    version: match[2],
    packageManagerField: value,
  };
};

const detectPackageManager = async (projectRoot: string, packageManagerField?: string): Promise<SourcePackageManagerInput> => {
  const parsedField = parsePackageManagerField(packageManagerField);
  const detectedFrom: string[] = [];
  const configFiles: string[] = [];
  const hasYarnLock = await exists(path.join(projectRoot, 'yarn.lock'));
  const hasPnpmLock = await exists(path.join(projectRoot, 'pnpm-lock.yaml'));
  const hasNpmLock = await exists(path.join(projectRoot, 'package-lock.json'));

  for (const config of ['.yarnrc', '.yarnrc.yml', '.npmrc', 'pnpm-workspace.yaml', '.pnpmfile.cjs']) {
    if (await exists(path.join(projectRoot, config))) {
      configFiles.push(config);
    }
  }

  if (parsedField) {
    detectedFrom.push('package.json#packageManager');
  }

  if (hasYarnLock) detectedFrom.push('yarn.lock');
  if (hasPnpmLock) detectedFrom.push('pnpm-lock.yaml');
  if (hasNpmLock) detectedFrom.push('package-lock.json');
  detectedFrom.push(...configFiles);

  const lockCount = [hasYarnLock, hasPnpmLock, hasNpmLock].filter(Boolean).length;
  const selected =
    parsedField ??
    (hasPnpmLock
      ? { name: 'pnpm' as const }
      : hasYarnLock
        ? { name: 'yarn' as const, version: configFiles.includes('.yarnrc.yml') ? undefined : '1.22.22', packageManagerField: configFiles.includes('.yarnrc.yml') ? undefined : 'yarn@1.22.22' }
        : { name: 'npm' as const });
  const lockfile = hasPnpmLock ? 'pnpm-lock.yaml' : hasYarnLock ? 'yarn.lock' : hasNpmLock ? 'package-lock.json' : undefined;

  return {
    ...selected,
    detectedFrom: detectedFrom.length > 0 ? [...new Set(detectedFrom)].sort() : ['default'],
    lockfile,
    configFiles: configFiles.sort(),
    confidence: parsedField || lockfile ? 'high' : 'low',
    manualReviewRequired: lockCount > 1 || (!parsedField && !lockfile),
  };
};

const tryCopyFile = async (sourcePath: string, targetPath: string): Promise<boolean> => {
  try {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
    return true;
  } catch {
    return false;
  }
};

type CssAssetReferenceResolution = {
  sourceStyle: string;
  reference: string;
  classification: 'local-copied' | 'external-dam-or-remote' | 'dynamic-or-package' | 'unresolved-local';
  targetPath?: string;
  note: string;
};

type ProxyConfigEvidence = {
  sourcePath: string;
  sizeBytes: number;
  extension: string;
  note: string;
};

type AngularResourceCopySummary = {
  styles: number;
  assets: number;
  styleCompilationFailures: number;
  cssAssetReferences: number;
  cssAssetsCopied: number;
  cssExternalAssetReferences: number;
  cssUnresolvedAssetReferences: number;
  proxyConfigFiles: number;
  cssAssetResolutions: CssAssetReferenceResolution[];
  proxyConfigs: ProxyConfigEvidence[];
};

type StyleCompilationResult = {
  content: string;
  targetExtension: '.css';
  status: 'copied-css' | 'compiled-less' | 'fallback-css';
  note?: string;
};

const resolveAssetPathCandidates = (projectRoot: string, sourceRoot: string, reference: string): string[] => {
  if (/^(https?:|data:|javascript:)/i.test(reference)) {
    return [];
  }

  const normalized = reference.replace(/^\/+/, '');
  return [
    path.join(projectRoot, normalized),
    path.join(sourceRoot, normalized),
    path.join(sourceRoot, 'assets', normalized.replace(/^assets\//, '')),
  ];
};

const stripCssReferenceQuery = (reference: string): string => reference.trim().replace(/^[ "'`]+|[ "'`]+$/g, '').split(/[?#]/)[0] ?? reference.trim();

const extractCssUrlReferences = (content: string): string[] => {
  const references = new Set<string>();
  const matcher = /url\(\s*(?:"([^"]+)"|'([^']+)'|([^)'"]+))\s*\)/g;
  for (const match of content.matchAll(matcher)) {
    const reference = (match[1] ?? match[2] ?? match[3] ?? '').trim();
    if (reference.length > 0) {
      references.add(reference);
    }
  }
  return [...references].sort((left, right) => left.localeCompare(right));
};

const isIgnoredCssReference = (reference: string): boolean => /^(data:|blob:|javascript:|#)/i.test(reference);

const isDamOrRemoteReference = (reference: string): boolean =>
  /^(https?:)?\/\//i.test(reference) || /(^|\/)(dam|content\/dam)(\/|$)/i.test(reference);

const isDynamicOrPackageReference = (reference: string): boolean =>
  reference.includes('${') || reference.includes('@{') || reference.startsWith('~') || reference.startsWith('$');

const isPathInside = (root: string, candidate: string): boolean => {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};

const toAssetSuffix = (reference: string): string =>
  safeRelativePath(reference.replace(/^(\.\/|\.\.\/)+/g, '').replace(/^\/+/, ''));

const collectAssetSuffixCandidates = async (root: string, suffix: string): Promise<string[]> => {
  const matches: string[] = [];
  const normalizedSuffix = toPosixPath(suffix);
  const ignoredDirectories = new Set(['.angular', '.git', '.next', '.spa-bridge', 'coverage', 'dist', 'build', 'node_modules']);
  const visit = async (directory: string): Promise<void> => {
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          await visit(entryPath);
        }
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      const relative = toPosixPath(path.relative(root, entryPath));
      if (relative.endsWith(normalizedSuffix)) {
        matches.push(entryPath);
      }
    }
  };

  if (normalizedSuffix.length > 0) {
    await visit(root);
  }

  return [...new Set(matches)].sort((left, right) => left.localeCompare(right));
};

const resolveCssAssetSourceCandidates = async (
  filePath: string,
  analysis: AngularAnalysisResult,
  cleanedReference: string,
): Promise<string[]> => {
  if (cleanedReference.startsWith('/')) {
    return resolveAssetPathCandidates(analysis.workspaceProfile.projectRoot, analysis.workspaceProfile.sourceRoot, cleanedReference);
  }

  const suffix = toAssetSuffix(cleanedReference);
  return [
    path.resolve(path.dirname(filePath), cleanedReference),
    path.join(analysis.workspaceProfile.sourceRoot, suffix),
    path.join(analysis.workspaceProfile.projectRoot, suffix),
    ...(await collectAssetSuffixCandidates(analysis.workspaceProfile.sourceRoot, suffix)),
  ];
};

const copyCssAssetReference = async (
  filePath: string,
  targetStylePath: string,
  analysis: AngularAnalysisResult,
  targetRoot: string,
  reference: string,
): Promise<CssAssetReferenceResolution | undefined> => {
  if (isIgnoredCssReference(reference)) {
    return undefined;
  }

  const cleaned = stripCssReferenceQuery(reference);
  const sourceStyle = safeRelativePath(path.relative(analysis.workspaceProfile.projectRoot, filePath));

  if (isDamOrRemoteReference(cleaned)) {
    return {
      sourceStyle,
      reference,
      classification: 'external-dam-or-remote',
      note: 'DAM or remote asset reference requires runtime proxy/CDN/environment configuration review.',
    };
  }

  if (isDynamicOrPackageReference(cleaned)) {
    return {
      sourceStyle,
      reference,
      classification: 'dynamic-or-package',
      note: 'Dynamic, variable, or package-based CSS asset reference cannot be resolved statically.',
    };
  }

  const candidateSources = await resolveCssAssetSourceCandidates(filePath, analysis, cleaned);
  const targetPath = cleaned.startsWith('/')
    ? path.join(targetRoot, 'public', cleaned.replace(/^\/+/, ''))
    : path.resolve(path.dirname(targetStylePath), cleaned);

  if (!isPathInside(targetRoot, targetPath)) {
    return {
      sourceStyle,
      reference,
      classification: 'unresolved-local',
      note: 'Resolved target asset path would escape the generated target root.',
    };
  }

  for (const sourcePath of candidateSources) {
    if (await tryCopyFile(sourcePath, targetPath)) {
      return {
        sourceStyle,
        reference,
        classification: 'local-copied',
        targetPath: safeRelativePath(path.relative(targetRoot, targetPath)),
        note: 'Local CSS asset was copied so the original CSS url() reference can resolve during target build/runtime.',
      };
    }
  }

  return {
    sourceStyle,
    reference,
    classification: 'unresolved-local',
    note: 'Local CSS asset reference was detected, but no matching source file was found.',
  };
};

const cssComment = (value: string): string => value.replace(/\*\//g, '* /');

const buildFallbackCss = (sourceRelativePath: string, reason: string, originalContent: string): string =>
  [
    `/* SPA-Bridge could not compile source style '${cssComment(sourceRelativePath)}'. */`,
    `/* Reason: ${cssComment(reason)} */`,
    '/* Original style content is preserved below as a comment so Next.js can still build. */',
    '/*',
    cssComment(originalContent),
    '*/',
    '',
  ].join('\n');

const compileStyleForTarget = async (filePath: string, relativePath: string, content: string): Promise<StyleCompilationResult> => {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.css') {
    return { content, targetExtension: '.css', status: 'copied-css' };
  }

  if (extension === '.less') {
    try {
      const lessModule = requireOptional('less') as { default?: { render?: unknown }; render?: unknown };
      const render = (lessModule.render ?? lessModule.default?.render) as
        | ((source: string, options: Record<string, unknown>) => Promise<{ css: string }>)
        | undefined;
      if (!render) {
        return {
          content: buildFallbackCss(relativePath, 'The Less renderer did not expose a render function.', content),
          targetExtension: '.css',
          status: 'fallback-css',
          note: 'Less renderer unavailable.',
        };
      }

      const rendered = await render(content, {
        filename: filePath,
        paths: [path.dirname(filePath)],
        javascriptEnabled: true,
      });
      return {
        content: rendered.css.endsWith('\n') ? rendered.css : `${rendered.css}\n`,
        targetExtension: '.css',
        status: 'compiled-less',
      };
    } catch (error) {
      return {
        content: buildFallbackCss(relativePath, error instanceof Error ? error.message : 'Less compilation failed.', content),
        targetExtension: '.css',
        status: 'fallback-css',
        note: error instanceof Error ? error.message : 'Less compilation failed.',
      };
    }
  }

  return {
    content: buildFallbackCss(relativePath, `${extension || 'style'} compilation is not yet available in SPA-Bridge.`, content),
    targetExtension: '.css',
    status: 'fallback-css',
    note: `${extension || 'style'} compilation is not yet available.`,
  };
};

const collectProxyConfigs = async (projectRoot: string): Promise<ProxyConfigEvidence[]> => {
  const configs: ProxyConfigEvidence[] = [];
  const ignoredDirectories = new Set(['.angular', '.git', '.next', 'coverage', 'dist', 'build', 'node_modules']);
  const visit = async (directory: string): Promise<void> => {
    const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          await visit(entryPath);
        }
        continue;
      }
      if (!entry.isFile() || !entry.name.startsWith('proxy.')) {
        continue;
      }
      const stat = await fs.stat(entryPath).catch(() => undefined);
      configs.push({
        sourcePath: safeRelativePath(path.relative(projectRoot, entryPath)),
        sizeBytes: stat?.size ?? 0,
        extension: path.extname(entry.name).replace(/^\./, '') || 'unknown',
        note: 'Proxy configuration evidence was detected. Review it when mapping DAM/API rewrites into next.config.mjs or deployment proxy settings.',
      });
    }
  };

  await visit(projectRoot);
  return configs.sort((left, right) => left.sourcePath.localeCompare(right.sourcePath));
};

const copyAngularResources = async (analysis: AngularAnalysisResult, targetRoot: string): Promise<AngularResourceCopySummary> => {
  const copiedStyleImports: string[] = [];
  const cssAssetResolutions: CssAssetReferenceResolution[] = [];
  let styles = 0;
  let assets = 0;
  let cssAssetsCopied = 0;
  let styleCompilationFailures = 0;

  for (const file of analysis.inventory.files.filter((record) => record.role === 'style' || record.kind === 'style')) {
    const relativePath = safeRelativePath(file.relativePath);
    const content = await readTextIfExists(file.path);
    if (content === undefined) {
      styleCompilationFailures += 1;
      continue;
    }
    const compiled = await compileStyleForTarget(file.path, relativePath, content);
    const targetRelativePath = relativePath.replace(/\.[A-Za-z0-9]+$/i, compiled.targetExtension);
    const targetPath = path.join(targetRoot, 'src', 'styles', 'angular', targetRelativePath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, compiled.content, 'utf8');
    if (compiled.status === 'fallback-css') {
      styleCompilationFailures += 1;
    }
    copiedStyleImports.push(`@import './styles/angular/${targetRelativePath}';`);
    styles += 1;
    const cssReferences = [...new Set([...extractCssUrlReferences(content), ...extractCssUrlReferences(compiled.content)])].sort((left, right) => left.localeCompare(right));
    for (const reference of cssReferences) {
      const resolution = await copyCssAssetReference(file.path, targetPath, analysis, targetRoot, reference);
      if (resolution) {
        cssAssetResolutions.push(resolution);
        if (resolution.classification === 'local-copied') {
          cssAssetsCopied += 1;
        }
      }
    }
  }

  const assetRefs = [...new Set(analysis.templateSummaries.flatMap((template) => template.bindings.externalReferences))];
  for (const reference of assetRefs) {
    const targetRelative = reference.startsWith('assets/')
      ? safeRelativePath(reference)
      : path.join('assets', 'angular', safeRelativePath(reference));
    for (const sourcePath of resolveAssetPathCandidates(analysis.workspaceProfile.projectRoot, analysis.workspaceProfile.sourceRoot, reference)) {
      if (await tryCopyFile(sourcePath, path.join(targetRoot, 'public', targetRelative))) {
        assets += 1;
        break;
      }
    }
  }
  assets += cssAssetsCopied;

  const sourceStylesPath = path.join(targetRoot, 'src', 'source-styles.css');
  await fs.mkdir(path.dirname(sourceStylesPath), { recursive: true });
  await fs.writeFile(
    sourceStylesPath,
    copiedStyleImports.length > 0
      ? `${copiedStyleImports.sort().join('\n')}\n`
      : '/* No Angular source styles were copied for this conversion run. */\n',
    'utf8',
  );

  const proxyConfigs = await collectProxyConfigs(analysis.workspaceProfile.projectRoot);
  return {
    styles,
    assets,
    styleCompilationFailures,
    cssAssetReferences: cssAssetResolutions.length,
    cssAssetsCopied,
    cssExternalAssetReferences: cssAssetResolutions.filter((entry) => entry.classification === 'external-dam-or-remote').length,
    cssUnresolvedAssetReferences: cssAssetResolutions.filter((entry) => entry.classification === 'unresolved-local' || entry.classification === 'dynamic-or-package').length,
    proxyConfigFiles: proxyConfigs.length,
    cssAssetResolutions,
    proxyConfigs,
  };
};

type AiRefinementSummary = {
  enabled: boolean;
  providerMode: ProviderMode;
  localProviderId: string;
  externalProviderConfigured: boolean;
  externalProviderAllowed: boolean;
  totalMappingRequests: number;
  processedMappingRequests: number;
  totalSuggestions: number;
  totalDiagnostics: number;
  results: RefinementResult[];
};

const readBooleanEnv = (name: string, fallback = false): boolean => {
  const value = process.env[name];
  if (value === undefined) {
    return fallback;
  }
  return ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
};

const readProviderMode = (): ProviderMode => {
  const value = process.env.SPA_BRIDGE_AI_PROVIDER_MODE;
  return value === 'external-only' || value === 'auto' || value === 'local-first' ? value : 'local-first';
};

const createProviderDecision = (input: {
  providerMode: ProviderMode;
  externalProviderAllowed: boolean;
  securityReady: boolean;
}): ProviderPolicyDecision => ({
  decision: input.securityReady ? 'allow' : 'block',
  reasonCode: input.securityReady ? 'ALLOW_AI_REFINEMENT' : 'AI_REFINEMENT_BLOCKED',
  reason: createSafeDisplayString(
    input.securityReady
      ? 'AI refinement is permitted for minimized, safe mapping context.'
      : 'AI refinement is blocked because security readiness checks failed.',
  ),
  providerMode: input.providerMode,
  externalProviderAllowed: input.externalProviderAllowed,
  maskingRequired: true,
  auditRequired: true,
  findingsPresent: !input.securityReady,
});

const createProviderDescriptors = (): ProviderDescriptor[] => {
  const externalOptIn = readBooleanEnv('SPA_BRIDGE_EXTERNAL_PROVIDER_OPT_IN');
  const externalEndpoint = process.env.SPA_BRIDGE_EXTERNAL_LLM_ENDPOINT;
  const externalModel = process.env.SPA_BRIDGE_EXTERNAL_LLM_MODEL;

  return [
    {
      providerId: 'ollama-exaone3.5',
      adapterKind: 'local-internal',
      displayName: createSafeDisplayString('Ollama EXAONE 3.5'),
      capabilities: [...defaultCapabilityCatalog],
      priority: 100,
      enabled: true,
      requiresExternalPolicy: false,
      metadata: {
        backend: 'ollama',
        baseUrl: process.env.SPA_BRIDGE_OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434',
        model: process.env.SPA_BRIDGE_OLLAMA_MODEL ?? 'exaone3.5',
      },
    },
    {
      providerId: 'external-openai-compatible',
      adapterKind: 'external',
      displayName: createSafeDisplayString('External OpenAI-compatible LLM'),
      capabilities: [...defaultCapabilityCatalog],
      priority: 50,
      enabled: externalOptIn && !!externalEndpoint && !!externalModel,
      requiresExternalPolicy: true,
      metadata: {
        backend: 'openai-compatible',
        endpoint: externalEndpoint ?? '',
        model: externalModel ?? '',
        apiKeyEnv: process.env.SPA_BRIDGE_EXTERNAL_LLM_API_KEY_ENV ?? 'SPA_BRIDGE_EXTERNAL_LLM_API_KEY',
      },
    },
  ];
};

const runAiRefinement = async (
  targetRoot: string,
  mappingRequests: ProviderNeutralMappingRequest[],
  securityReady: boolean,
): Promise<AiRefinementSummary> => {
  const enabled = !readBooleanEnv('SPA_BRIDGE_AI_DISABLED');
  const providerMode = readProviderMode();
  const externalOptIn = readBooleanEnv('SPA_BRIDGE_EXTERNAL_PROVIDER_OPT_IN');
  const externalAllowed = externalOptIn && readBooleanEnv('SPA_BRIDGE_ALLOW_EXTERNAL_PROVIDER') && securityReady;
  const maxRequests = Number.parseInt(process.env.SPA_BRIDGE_AI_MAX_REQUESTS ?? '20', 10);
  const timeoutMs = Number.parseInt(process.env.SPA_BRIDGE_AI_TIMEOUT_MS ?? '1200', 10);
  const providers = createProviderDescriptors();
  const localProvider = providers[0];
  const externalProviderConfigured = providers.some((provider) => provider.adapterKind === 'external' && provider.enabled);
  const selectedRequests = enabled ? mappingRequests.slice(0, Number.isFinite(maxRequests) && maxRequests > 0 ? maxRequests : 20) : [];
  const results: RefinementResult[] = [];

  for (const mappingRequest of selectedRequests) {
    const localResult = await refineMapping(mappingRequest, {
      providers,
      policyDecision: createProviderDecision({
        providerMode,
        externalProviderAllowed: externalAllowed,
        securityReady,
      }),
      config: {
        providerMode,
        externalProviderOptIn: externalOptIn,
        auditReady: true,
        maskingSatisfied: true,
        timeoutMs,
      },
    });

    if (localResult.ok) {
      results.push(localResult.value);
      if (localResult.value.status === 'succeeded' || !externalAllowed) {
        continue;
      }
    }

    if (externalAllowed) {
      const externalResult = await refineMapping(mappingRequest, {
        providers,
        policyDecision: createProviderDecision({
          providerMode: 'external-only',
          externalProviderAllowed: true,
          securityReady,
        }),
        config: {
          providerMode: 'external-only',
          externalProviderOptIn: true,
          auditReady: true,
          maskingSatisfied: true,
          timeoutMs,
        },
      });
      if (externalResult.ok) {
        results.push(externalResult.value);
      }
    }
  }

  const summary: AiRefinementSummary = {
    enabled,
    providerMode,
    localProviderId: localProvider?.providerId ?? 'unknown',
    externalProviderConfigured,
    externalProviderAllowed: externalAllowed,
    totalMappingRequests: mappingRequests.length,
    processedMappingRequests: selectedRequests.length,
    totalSuggestions: results.reduce((total, result) => total + result.suggestions.length, 0),
    totalDiagnostics: results.reduce((total, result) => total + result.diagnostics.length, 0),
    results,
  };

  await writeJsonArtifact(targetRoot, 'ai-refinement-results.json', summary);
  return summary;
};

export const createDefaultApplicationBridge = (): CliApplicationBridge => ({
  async startConversion(request: CliApplicationRequest): Promise<Result<CliApplicationResponse, CliError>> {
    const analysisService = new SourceAngularAnalysisService();
    const transformationService = createTransformationService();
    const runId = request.resolvedOptions.runId;
    const correlationId = `${runId}:cli`;

    const analysisResult = await analysisService.analyze({
      projectRoot: request.validatedPaths.inputPath,
      outputDir: path.join(request.validatedPaths.outputPath, '.spa-bridge', 'analysis'),
    });
    if (!analysisResult.ok) {
      return { ok: false, error: toCliError('Angular source analysis failed.', analysisResult.error) };
    }

    const transformationResult = transformationService.transform({
      runId,
      correlationId,
      analysis: analysisResult.value,
      targetFramework: 'react',
      targetProjectStrategy: 'nextjs-typescript',
      stateStrategy: 'service',
      enabledRulePacks: ['built-in'],
      outputNamespace: path.join(request.validatedPaths.outputPath, '.spa-bridge', 'transformation'),
    });
    if (!transformationResult.ok) {
      return { ok: false, error: toCliError('Angular-to-React transformation failed.', transformationResult.error) };
    }

    const securityReady = !analysisResult.value.diagnostics.some((diagnostic) => diagnostic.severity === 'security-blocker');
    const sourcePackageDependencies = await readSourcePackageDependencies(analysisResult.value.workspaceProfile.projectRoot);
    const sourcePackageManager = await detectPackageManager(analysisResult.value.workspaceProfile.projectRoot, sourcePackageDependencies.packageManager);
    const sourceNpmrcFiles = await collectNpmrcFiles(request.validatedPaths.workspaceRoot, analysisResult.value.workspaceProfile.projectRoot);
    const sourceEnvironmentVariables = await collectEnvironmentVariables(analysisResult.value.workspaceProfile.projectRoot, sourcePackageDependencies.scripts);
    const aiRefinement = await runAiRefinement(
      request.validatedPaths.outputPath,
      transformationResult.value.mappingRequests,
      securityReady,
    );

    const targetResult = generateReactTarget({
      runId,
      correlationId,
      targetRoot: request.validatedPaths.outputPath,
      draftSet: transformationResult.value.draftSet,
      strategyId: 'nextjs-typescript',
      overwritePolicy: request.resolvedOptions.dryRun ? 'preserve' : 'overwrite',
      projectName: analysisResult.value.workspaceProfile.projectName,
      selectedStateStrategy: 'service',
      sourceModelRef: {
        kind: 'source',
        path: analysisResult.value.sourceModelBoundary.sourceModelRef.projectPath,
      },
      sourceDependencies: sourcePackageDependencies.dependencies,
      sourceDevDependencies: sourcePackageDependencies.devDependencies,
      sourceScripts: sourcePackageDependencies.scripts,
      sourceNpmrcFiles,
      sourceEnvironmentVariables,
      sourcePackageManager,
    });
    if (!targetResult.ok) {
      return { ok: false, error: toCliError('React target generation failed.', targetResult.error) };
    }

    let copiedResources: AngularResourceCopySummary = {
      styles: 0,
      assets: 0,
      styleCompilationFailures: 0,
      cssAssetReferences: 0,
      cssAssetsCopied: 0,
      cssExternalAssetReferences: 0,
      cssUnresolvedAssetReferences: 0,
      proxyConfigFiles: 0,
      cssAssetResolutions: [],
      proxyConfigs: [],
    };
    try {
      await fs.mkdir(request.validatedPaths.outputPath, { recursive: true });
      if (!request.resolvedOptions.dryRun) {
        await writeGeneratedFiles(targetResult.value.writePlan.files);
        copiedResources = await copyAngularResources(analysisResult.value, request.validatedPaths.outputPath);
      }

      await writeJsonArtifact(request.validatedPaths.outputPath, 'analysis-summary.json', analysisResult.value.summary);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'transformation-summary.json', transformationResult.value.summary);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'target-summary.json', targetResult.value.summary);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'self-correction-summary.json', targetResult.value.selfCorrectionResult);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'manual-review-items.json', targetResult.value.manualReviewItems);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'resource-copy-summary.json', copiedResources);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'css-asset-resolution-summary.json', {
        totalReferences: copiedResources.cssAssetReferences,
        copiedLocalAssets: copiedResources.cssAssetsCopied,
        externalDamOrRemoteReferences: copiedResources.cssExternalAssetReferences,
        unresolvedReferences: copiedResources.cssUnresolvedAssetReferences,
        resolutions: copiedResources.cssAssetResolutions,
      });
      await writeJsonArtifact(request.validatedPaths.outputPath, 'proxy-config-summary.json', {
        totalProxyConfigFiles: copiedResources.proxyConfigFiles,
        configs: copiedResources.proxyConfigs,
        note: 'Proxy files are reported as safe metadata only. Review these files when translating DAM/API proxy behavior to Next.js rewrites, middleware, or deployment proxy configuration.',
      });
      await writeJsonArtifact(request.validatedPaths.outputPath, 'registry-migration-summary.json', targetResult.value.enterpriseParity?.registryMigrationPlan);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'script-migration-summary.json', targetResult.value.enterpriseParity?.scriptMigrationPlan);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'environment-contract-summary.json', targetResult.value.enterpriseParity?.environmentContractReport);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'package-manager-parity-summary.json', targetResult.value.enterpriseParity?.packageManagerParityReport);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'alias-mapping-summary.json', {
        source: analysisResult.value.aliasModel.summary,
        generated: {
          totalAliases: targetResult.value.summary.totalGeneratedAliases,
          unresolvedAliases: targetResult.value.summary.unresolvedAliases,
        },
        aliases: analysisResult.value.aliasModel.paths.map((mapping) => ({
          aliasPattern: mapping.aliasPattern,
          status: mapping.status,
          targetCount: mapping.resolvedTargets.length,
        })),
      });
    } catch (error) {
      return { ok: false, error: toCliError('Unable to write generated React target files.', error) };
    }

    const warnings = [
      ...analysisResult.value.diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').map((diagnostic) => diagnostic.message),
      ...(request.resolvedOptions.dryRun ? ['Dry run mode enabled; React target files were not written.'] : []),
      ...(aiRefinement.enabled && aiRefinement.totalDiagnostics > 0 ? [`AI refinement produced ${aiRefinement.totalDiagnostics} diagnostic(s).`] : []),
      ...(!aiRefinement.enabled ? ['AI refinement disabled by SPA_BRIDGE_AI_DISABLED.'] : []),
      ...(targetResult.value.selfCorrectionResult?.status === 'blocked'
        ? ['Generated target self-correction is blocked; review .spa-bridge/quality-gate-results.json.']
        : []),
      ...(copiedResources.cssExternalAssetReferences > 0
        ? [`Detected ${copiedResources.cssExternalAssetReferences} CSS DAM/remote asset reference(s); review .spa-bridge/css-asset-resolution-summary.json and source proxy settings.`]
        : []),
      ...(copiedResources.cssUnresolvedAssetReferences > 0
        ? [`Detected ${copiedResources.cssUnresolvedAssetReferences} unresolved CSS asset reference(s); review .spa-bridge/css-asset-resolution-summary.json.`]
        : []),
      ...(copiedResources.styleCompilationFailures > 0
        ? [`Generated ${copiedResources.styleCompilationFailures} fallback CSS style file(s) because source style compilation was unavailable or failed.`]
        : []),
      ...(copiedResources.proxyConfigFiles > 0
        ? [`Detected ${copiedResources.proxyConfigFiles} proxy.* configuration file(s); review .spa-bridge/proxy-config-summary.json before final runtime parity validation.`]
        : []),
    ];
    const reviewItems = targetResult.value.manualReviewItems.map((item) => item.title);
    const summary = request.resolvedOptions.dryRun
      ? `Dry run generated a React write plan with ${targetResult.value.summary.totalFiles} files for ${request.validatedPaths.inputPath}.`
      : `Converted ${request.validatedPaths.inputPath} into ${request.validatedPaths.outputPath} with ${targetResult.value.summary.totalFiles} generated files.`;

    return ok({
      runId,
      summary,
      warnings,
      reviewItems,
      reportPayload: buildPayload(request, 'Conversion Summary', summary, warnings, reviewItems, [
        {
          title: 'Analysis',
          lines: [
            `Status: ${analysisResult.value.status}`,
            `Files scanned: ${analysisResult.value.summary.totalFiles}`,
            `Symbols discovered: ${analysisResult.value.summary.totalSymbols}`,
            `Routes discovered: ${analysisResult.value.summary.totalRoutes}`,
            `Aliases discovered: ${analysisResult.value.summary.totalAliases}`,
            `Unresolved aliases: ${analysisResult.value.summary.unresolvedAliases}`,
          ],
        },
        {
          title: 'Transformation',
          lines: [
            `Status: ${transformationResult.value.status}`,
            `Components: ${transformationResult.value.summary.totalComponents}`,
            `Services: ${transformationResult.value.summary.totalServices}`,
            `Routes: ${transformationResult.value.summary.totalRoutes}`,
            `Review items: ${transformationResult.value.summary.totalReviewItems}`,
          ],
        },
        {
          title: 'React Target',
          lines: [
            `Status: ${targetResult.value.status}`,
            `Output: ${request.validatedPaths.outputPath}`,
            `Generated files: ${targetResult.value.summary.totalFiles}`,
            `Strategy: ${targetResult.value.summary.strategyId}`,
            `Copied Angular styles: ${copiedResources.styles}`,
            `Copied Angular assets: ${copiedResources.assets}`,
            `Style compilation fallbacks: ${copiedResources.styleCompilationFailures}`,
            `CSS asset references: ${copiedResources.cssAssetReferences}`,
            `CSS local assets copied: ${copiedResources.cssAssetsCopied}`,
            `CSS DAM/remote references: ${copiedResources.cssExternalAssetReferences}`,
            `CSS unresolved references: ${copiedResources.cssUnresolvedAssetReferences}`,
            `Proxy configs detected: ${copiedResources.proxyConfigFiles}`,
            `CSS asset artifact: ${path.join(request.validatedPaths.outputPath, '.spa-bridge', 'css-asset-resolution-summary.json')}`,
            `Proxy artifact: ${path.join(request.validatedPaths.outputPath, '.spa-bridge', 'proxy-config-summary.json')}`,
            `Aliases generated: ${targetResult.value.summary.totalGeneratedAliases}`,
            `Alias summary: ${path.join(request.validatedPaths.outputPath, '.spa-bridge', 'alias-mapping-summary.json')}`,
          ],
        },
        {
          title: 'Enterprise Parity',
          lines: [
            `Registry safe entries: ${targetResult.value.enterpriseParity?.summary.registrySafeEntries ?? 0}`,
            `Registry secret placeholders: ${targetResult.value.enterpriseParity?.summary.registrySecretPlaceholders ?? 0}`,
            `Generated scripts: ${targetResult.value.enterpriseParity?.summary.generatedScripts ?? 0}`,
            `Reviewed scripts: ${targetResult.value.enterpriseParity?.summary.reviewedScripts ?? 0}`,
            `Environment variables: ${targetResult.value.enterpriseParity?.summary.environmentVariables ?? 0}`,
            `Secret environment variables: ${targetResult.value.enterpriseParity?.summary.secretEnvironmentVariables ?? 0}`,
            `Package manager: ${targetResult.value.enterpriseParity?.packageManagerParityReport.targetPackageManagerField ?? 'npm'}`,
            `Install command: ${targetResult.value.enterpriseParity?.packageManagerParityReport.installCommand ?? 'npm install'}`,
            `Registry artifact: ${path.join(request.validatedPaths.outputPath, '.spa-bridge', 'registry-migration-summary.json')}`,
            `Environment artifact: ${path.join(request.validatedPaths.outputPath, '.spa-bridge', 'environment-contract-summary.json')}`,
            `Package manager artifact: ${path.join(request.validatedPaths.outputPath, '.spa-bridge', 'package-manager-parity-summary.json')}`,
          ],
        },
        {
          title: 'Generated Target Self-Correction',
          lines: [
            `Status: ${targetResult.value.selfCorrectionResult?.status ?? 'skipped'}`,
            `Commands planned: ${targetResult.value.selfCorrectionResult?.summary.totalCommands ?? 0}`,
            `Applied fixes: ${targetResult.value.selfCorrectionResult?.summary.appliedFixes ?? 0}`,
            `AI repair requests: ${targetResult.value.selfCorrectionResult?.summary.aiRepairRequests ?? 0}`,
            `Remaining blockers: ${targetResult.value.selfCorrectionResult?.summary.remainingBlockers ?? 0}`,
            `Artifact: ${path.join(request.validatedPaths.outputPath, '.spa-bridge', 'quality-gate-results.json')}`,
          ],
        },
        {
          title: 'AI Refinement',
          lines: [
            `Enabled: ${aiRefinement.enabled}`,
            `Provider mode: ${aiRefinement.providerMode}`,
            `Local provider: ${aiRefinement.localProviderId}`,
            `External provider allowed: ${aiRefinement.externalProviderAllowed}`,
            `Mapping requests processed: ${aiRefinement.processedMappingRequests}/${aiRefinement.totalMappingRequests}`,
            `Suggestions: ${aiRefinement.totalSuggestions}`,
            `Diagnostics: ${aiRefinement.totalDiagnostics}`,
            `Artifact: ${path.join(request.validatedPaths.outputPath, '.spa-bridge', 'ai-refinement-results.json')}`,
          ],
        },
      ]),
    });
  },

  async validateWorkspace(request: CliValidationRequest): Promise<Result<CliValidationResponse, CliError>> {
    return ok({
      runId: request.resolvedOptions.runId,
      summary: `Workspace validated: ${request.validatedPaths.workspaceRoot}`,
      warnings: [],
      reviewItems: [],
    });
  },

  async prepareReport(request: CliApplicationRequest): Promise<Result<CliReportPayload, CliError>> {
    return ok(buildPayload(request, 'CLI Report', `Report prepared for ${request.validatedPaths.workspaceRoot}.`));
  },
});

export type { CliApplicationBridge };
