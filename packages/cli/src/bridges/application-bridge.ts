import fs from 'node:fs/promises';
import path from 'node:path';

import { createSafeDisplayString, ok, type Result } from '@spa-bridge/core-model';
import { SourceAngularAnalysisService } from '@spa-bridge/source-angular';
import type { AngularAnalysisResult } from '@spa-bridge/source-angular';
import { createTransformationService, type ProviderNeutralMappingRequest } from '@spa-bridge/transform-angular-react';
import { defaultCapabilityCatalog, refineMapping, type ProviderDescriptor, type ProviderMode, type RefinementResult } from '@spa-bridge/adapters-ai';
import type { ProviderPolicyDecision } from '@spa-bridge/core-security';
import { generateReactTarget, type GeneratedFileSpec } from '@spa-bridge/target-react';

import type { CliApplicationBridge, CliApplicationRequest, CliApplicationResponse, CliReportPayload, CliValidationRequest, CliValidationResponse } from '../types.js';
import type { CliError } from '../shared-errors.js';
import { createCliError } from '../shared-errors.js';

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
): Promise<{ dependencies: Record<string, string>; devDependencies: Record<string, string> }> => {
  try {
    const packageJsonText = await fs.readFile(path.join(projectRoot, 'package.json'), 'utf8');
    const packageJson = JSON.parse(packageJsonText) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    return {
      dependencies: packageJson.dependencies ?? {},
      devDependencies: packageJson.devDependencies ?? {},
    };
  } catch {
    return { dependencies: {}, devDependencies: {} };
  }
};

const toPosixPath = (value: string): string => value.replace(/\\/g, '/');

const safeRelativePath = (value: string): string =>
  toPosixPath(value)
    .replace(/^(\.\.\/)+/g, '')
    .replace(/^\/+/g, '')
    .replace(/[^A-Za-z0-9._/-]/g, '-');

const tryCopyFile = async (sourcePath: string, targetPath: string): Promise<boolean> => {
  try {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
    return true;
  } catch {
    return false;
  }
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

const copyAngularResources = async (analysis: AngularAnalysisResult, targetRoot: string): Promise<{ styles: number; assets: number }> => {
  const copiedStyleImports: string[] = [];
  let styles = 0;
  let assets = 0;

  for (const file of analysis.inventory.files.filter((record) => record.role === 'style' || record.kind === 'style')) {
    const relativePath = safeRelativePath(file.relativePath);
    const targetPath = path.join(targetRoot, 'src', 'styles', 'angular', relativePath);
    if (await tryCopyFile(file.path, targetPath)) {
      copiedStyleImports.push(`import './styles/angular/${relativePath}';`);
      styles += 1;
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

  const sourceStylesPath = path.join(targetRoot, 'src', 'source-styles.ts');
  await fs.mkdir(path.dirname(sourceStylesPath), { recursive: true });
  await fs.writeFile(
    sourceStylesPath,
    copiedStyleImports.length > 0
      ? `${copiedStyleImports.sort().join('\n')}\n`
      : '/* No Angular source styles were copied for this conversion run. */\n',
    'utf8',
  );

  return { styles, assets };
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
      targetProjectStrategy: 'vite-react-typescript',
      stateStrategy: 'service',
      enabledRulePacks: ['built-in'],
      outputNamespace: path.join(request.validatedPaths.outputPath, '.spa-bridge', 'transformation'),
    });
    if (!transformationResult.ok) {
      return { ok: false, error: toCliError('Angular-to-React transformation failed.', transformationResult.error) };
    }

    const securityReady = !analysisResult.value.diagnostics.some((diagnostic) => diagnostic.severity === 'security-blocker');
    const sourcePackageDependencies = await readSourcePackageDependencies(analysisResult.value.workspaceProfile.projectRoot);
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
      strategyId: 'vite-react-typescript',
      overwritePolicy: request.resolvedOptions.dryRun ? 'preserve' : 'overwrite',
      projectName: analysisResult.value.workspaceProfile.projectName,
      selectedStateStrategy: 'service',
      sourceModelRef: {
        kind: 'source',
        path: analysisResult.value.sourceModelBoundary.sourceModelRef.projectPath,
      },
      sourceDependencies: sourcePackageDependencies.dependencies,
      sourceDevDependencies: sourcePackageDependencies.devDependencies,
    });
    if (!targetResult.ok) {
      return { ok: false, error: toCliError('React target generation failed.', targetResult.error) };
    }

    let copiedResources = { styles: 0, assets: 0 };
    try {
      await fs.mkdir(request.validatedPaths.outputPath, { recursive: true });
      if (!request.resolvedOptions.dryRun) {
        await writeGeneratedFiles(targetResult.value.writePlan.files);
        copiedResources = await copyAngularResources(analysisResult.value, request.validatedPaths.outputPath);
      }

      await writeJsonArtifact(request.validatedPaths.outputPath, 'analysis-summary.json', analysisResult.value.summary);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'transformation-summary.json', transformationResult.value.summary);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'target-summary.json', targetResult.value.summary);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'manual-review-items.json', targetResult.value.manualReviewItems);
      await writeJsonArtifact(request.validatedPaths.outputPath, 'resource-copy-summary.json', copiedResources);
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
            `Aliases generated: ${targetResult.value.summary.totalGeneratedAliases}`,
            `Alias summary: ${path.join(request.validatedPaths.outputPath, '.spa-bridge', 'alias-mapping-summary.json')}`,
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
