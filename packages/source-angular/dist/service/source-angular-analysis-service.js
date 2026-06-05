import path from 'node:path';
import fs from 'node:fs/promises';
import { AngularSourceModelBoundarySchema, ok, } from '@spa-bridge/core-model';
import { AnalysisArtifactMapper } from '../model/artifact-mapper.js';
import { GraphBuilder } from '../graph/graph-builder.js';
import { PathGuard } from '../path/path-guard.js';
import { RouteAnalyzer } from '../routes/route-analyzer.js';
import { SafeDiagnosticBuilder } from '../diagnostics/safe-diagnostic-builder.js';
import { SourceInventoryBuilder } from '../scanner/source-inventory-builder.js';
import { TypeScriptParserAdapter } from '../parser/typescript-parser-adapter.js';
import { AngularTemplateParserAdapter } from '../templates/angular-template-parser-adapter.js';
import { WorkspaceProfiler } from '../workspace/workspace-profiler.js';
const isTypeScriptFile = (record) => record.kind === 'typescript' && !record.relativePath.endsWith('.spec.ts');
const isTemplateFile = (record) => record.kind === 'template';
const isStyleFile = (record) => record.kind === 'style';
const toSourceRef = (filePath, symbol) => ({
    kind: 'source',
    path: filePath,
    symbol,
});
export class SourceAngularAnalysisService {
    pathGuard = new PathGuard();
    workspaceProfiler = new WorkspaceProfiler(this.pathGuard);
    inventoryBuilder = new SourceInventoryBuilder();
    tsParser = new TypeScriptParserAdapter();
    templateParser = new AngularTemplateParserAdapter();
    routeAnalyzer = new RouteAnalyzer();
    graphBuilder = new GraphBuilder();
    diagnosticBuilder = new SafeDiagnosticBuilder();
    artifactMapper = new AnalysisArtifactMapper();
    async analyze(request) {
        const rootResult = this.pathGuard.contains(request.projectRoot, request.projectRoot);
        if (!rootResult.ok) {
            return rootResult;
        }
        const profileResult = await this.workspaceProfiler.profile(request.projectRoot, request.sourceRoot);
        if (!profileResult.ok) {
            return profileResult;
        }
        const inventoryResult = await this.inventoryBuilder.build(profileResult.value);
        if (!inventoryResult.ok) {
            return inventoryResult;
        }
        const workspaceProfile = profileResult.value;
        const inventory = inventoryResult.value;
        const typeScriptSummaries = [];
        const templateSummaries = [];
        const routeSummaries = [];
        const diagnostics = [];
        const fileLookup = new Map(inventory.files.map((record) => [record.path, record]));
        for (const record of inventory.files) {
            if (isTypeScriptFile(record)) {
                const sourceText = await fs.readFile(record.path, 'utf8').catch(() => '');
                const parsed = this.tsParser.parse(record.path, sourceText);
                if (!parsed.ok) {
                    diagnostics.push(this.diagnosticBuilder.build({
                        code: parsed.error.code,
                        severity: 'error',
                        message: parsed.error.message,
                        sourcePaths: [record.path],
                        tags: ['typescript', 'fatal'],
                    }));
                    record.parseStatus = 'failed';
                    continue;
                }
                typeScriptSummaries.push(parsed.value);
                record.parseStatus = parsed.value.hasParseErrors ? 'partial' : 'parsed';
                diagnostics.push(...parsed.value.diagnostics);
                const componentSymbol = parsed.value.symbols.find((symbol) => symbol.decorators.some((decorator) => decorator.kind === 'Component'));
                if (componentSymbol) {
                    const componentDecorator = componentSymbol.decorators.find((decorator) => decorator.kind === 'Component');
                    const templateUrl = componentDecorator?.metadata.templateUrl;
                    const inlineTemplate = componentDecorator?.metadata.template;
                    const styleUrls = componentDecorator?.metadata.styleUrls;
                    const componentNode = this.graphBuilder.addNode('symbol', componentSymbol.name, toSourceRef(record.path, componentSymbol.name));
                    const fileNode = this.graphBuilder.addNode('file', record.relativePath, toSourceRef(record.path));
                    this.graphBuilder.addEdge('declares', fileNode.id, componentNode.id, [toSourceRef(record.path, componentSymbol.name)]);
                    if (typeof templateUrl === 'string' && templateUrl.length > 0) {
                        const templatePath = path.resolve(path.dirname(record.path), templateUrl);
                        const templateText = await fs.readFile(templatePath, 'utf8').catch(() => '');
                        const parsedTemplate = await this.templateParser.parse(templatePath, templateText, record.path);
                        if (parsedTemplate.ok) {
                            templateSummaries.push(parsedTemplate.value);
                            diagnostics.push(...parsedTemplate.value.diagnostics);
                            const templateNode = this.graphBuilder.addNode('template', path.basename(templatePath), toSourceRef(templatePath));
                            this.graphBuilder.addEdge('uses-template', componentNode.id, templateNode.id, [toSourceRef(templatePath)]);
                        }
                        else {
                            diagnostics.push(this.diagnosticBuilder.build({
                                code: parsedTemplate.error.code,
                                severity: 'error',
                                message: parsedTemplate.error.message,
                                sourcePaths: [templatePath],
                                tags: ['template', 'fatal'],
                            }));
                        }
                    }
                    else if (typeof inlineTemplate === 'string') {
                        const inlinePath = `${record.path}#inline-template`;
                        const parsedTemplate = await this.templateParser.parse(inlinePath, inlineTemplate, record.path);
                        if (parsedTemplate.ok) {
                            templateSummaries.push(parsedTemplate.value);
                            diagnostics.push(...parsedTemplate.value.diagnostics);
                            const templateNode = this.graphBuilder.addNode('template', `${componentSymbol.name}:inline`, toSourceRef(record.path, componentSymbol.name));
                            this.graphBuilder.addEdge('uses-template', componentNode.id, templateNode.id, [toSourceRef(record.path, componentSymbol.name)]);
                        }
                    }
                    const styleRefs = Array.isArray(styleUrls) ? styleUrls : typeof styleUrls === 'string' ? [styleUrls] : [];
                    for (const styleRef of styleRefs) {
                        const stylePath = path.resolve(path.dirname(record.path), styleRef);
                        const styleNode = this.graphBuilder.addNode('style', path.basename(stylePath), toSourceRef(stylePath));
                        this.graphBuilder.addEdge('uses-style', componentNode.id, styleNode.id, [toSourceRef(stylePath)]);
                    }
                }
                for (const symbol of parsed.value.symbols) {
                    if (symbol.imports.length > 0) {
                        const symbolNode = this.graphBuilder.addNode('symbol', symbol.name, toSourceRef(record.path, symbol.name));
                        for (const importSpecifier of symbol.imports) {
                            const importNode = this.graphBuilder.addNode('external', importSpecifier, {
                                kind: 'source',
                                path: importSpecifier,
                            });
                            this.graphBuilder.addEdge('imports', symbolNode.id, importNode.id, [toSourceRef(record.path, symbol.name)]);
                        }
                    }
                }
                if (record.role === 'route' ||
                    record.relativePath.endsWith('.routes.ts') ||
                    record.relativePath.endsWith('.routing.ts') ||
                    sourceText.includes('routes') ||
                    sourceText.includes('RouterModule')) {
                    const routeResults = this.routeAnalyzer.analyze(record.path, sourceText);
                    routeSummaries.push(...routeResults.routes);
                    diagnostics.push(...routeResults.diagnostics);
                    for (const route of routeResults.routes) {
                        const routeNode = this.graphBuilder.addNode('route', route.path || 'dynamic', toSourceRef(record.path));
                        const routeFileNode = this.graphBuilder.addNode('file', record.relativePath, toSourceRef(record.path));
                        this.graphBuilder.addEdge('contains', routeFileNode.id, routeNode.id, [toSourceRef(record.path)], route.isDynamic ? 0.5 : 1);
                    }
                }
            }
            if (isTemplateFile(record)) {
                const templateText = await fs.readFile(record.path, 'utf8').catch(() => '');
                const parsedTemplate = await this.templateParser.parse(record.path, templateText, record.path);
                if (parsedTemplate.ok) {
                    templateSummaries.push(parsedTemplate.value);
                    diagnostics.push(...parsedTemplate.value.diagnostics);
                }
                else {
                    diagnostics.push(this.diagnosticBuilder.build({
                        code: parsedTemplate.error.code,
                        severity: 'error',
                        message: parsedTemplate.error.message,
                        sourcePaths: [record.path],
                        tags: ['template', 'fatal'],
                    }));
                    record.parseStatus = 'failed';
                }
            }
            if (isStyleFile(record)) {
                const owner = this.findOwningComponent(record.relativePath, fileLookup);
                if (owner) {
                    this.graphBuilder.addNode('style', record.relativePath, toSourceRef(record.path));
                    this.graphBuilder.addEdge('uses-style', this.graphBuilder.addNode('file', owner.relativePath, toSourceRef(owner.path)).id, this.graphBuilder.addNode('style', record.relativePath, toSourceRef(record.path)).id, [toSourceRef(record.path)]);
                }
            }
        }
        const graphResult = this.graphBuilder.finalize();
        diagnostics.push(...graphResult.diagnostics);
        const normalizedDiagnostics = this.diagnosticBuilder.normalize(diagnostics);
        const artifactRefs = this.artifactMapper.buildArtifactRefs(request.outputDir ?? path.join(workspaceProfile.projectRoot, '.spa-bridge', 'analysis'), workspaceProfile);
        const sourceModelBoundary = AngularSourceModelBoundarySchema.parse(this.artifactMapper.buildSourceModelBoundary(workspaceProfile, workspaceProfile.entryFiles[0] ?? path.join(workspaceProfile.sourceRoot, 'main.ts')));
        const blockingDiagnostics = normalizedDiagnostics.filter((diagnostic) => diagnostic.severity === 'error' || diagnostic.severity === 'security-blocker');
        const status = blockingDiagnostics.length > 0
            ? 'failed'
            : normalizedDiagnostics.length > 0
                ? 'partial'
                : 'succeeded';
        return ok({
            status,
            workspaceProfile,
            inventory: {
                ...inventory,
                files: inventory.files.map((record) => ({ ...record })),
            },
            typeScriptSummaries,
            templateSummaries,
            routeSummaries,
            graph: graphResult.graph,
            diagnostics: normalizedDiagnostics,
            sourceModelBoundary,
            artifacts: artifactRefs,
            summary: {
                totalFiles: inventory.files.length,
                totalSymbols: typeScriptSummaries.reduce((total, summary) => total + summary.symbols.length, 0),
                totalRoutes: routeSummaries.length,
                totalDiagnostics: normalizedDiagnostics.length,
            },
        });
    }
    findOwningComponent(relativePath, files) {
        const normalized = relativePath.replace(/\\/g, '/');
        const baseName = path.basename(normalized).split('.')[0] ?? '';
        const componentCandidate = [...files.values()].find((record) => record.role === 'component' && record.relativePath.includes(baseName));
        return componentCandidate;
    }
}
//# sourceMappingURL=source-angular-analysis-service.js.map