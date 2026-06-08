import * as ts from 'typescript';
import { createDiagnostic, err, ok } from '@spa-bridge/core-model';
import { createStableIdFactory } from '../model/stable-id-factory.js';
const lifecycleHooks = new Set(['ngOnInit', 'ngOnChanges', 'ngOnDestroy', 'ngAfterViewInit', 'ngAfterContentInit']);
const sanitizeBodyText = (bodyText) => bodyText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .slice(0, 2_000);
const parseDecorator = (decorator, sourceFile) => {
    const result = {};
    const expression = decorator.expression;
    if (!ts.isCallExpression(expression)) {
        return result;
    }
    const firstArg = expression.arguments[0];
    if (!firstArg || !ts.isObjectLiteralExpression(firstArg)) {
        return result;
    }
    for (const prop of firstArg.properties) {
        if (!ts.isPropertyAssignment(prop)) {
            continue;
        }
        const key = ts.isIdentifier(prop.name) ? prop.name.text : prop.name.getText(sourceFile);
        const value = prop.initializer;
        if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
            result[key] = value.text;
        }
        else if (value.kind === ts.SyntaxKind.TrueKeyword) {
            result[key] = true;
        }
        else if (value.kind === ts.SyntaxKind.FalseKeyword) {
            result[key] = false;
        }
        else if (ts.isArrayLiteralExpression(value)) {
            result[key] = value.elements.map((element) => element.getText()).filter((text) => text.length > 0);
        }
        else {
            result[key] = value.getText();
        }
    }
    return result;
};
export class TypeScriptParserAdapter {
    ids = createStableIdFactory();
    parse(sourcePath, sourceText) {
        if (!sourceText.trim()) {
            return err({
                code: 'VALIDATION_FAILED',
                message: `TypeScript source '${sourcePath}' is empty.`,
            });
        }
        const sourceFile = ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        const parseDiagnostics = (sourceFile.parseDiagnostics ?? []);
        const diagnostics = parseDiagnostics.map((issue, index) => createDiagnostic({
            code: 'TS-PARSE-001',
            severity: 'warning',
            message: `TypeScript parse issue at ${issue.start ?? 0}.`,
            sourceRefs: [
                {
                    kind: 'source',
                    path: sourcePath,
                    location: `${issue.start ?? 0}:${issue.length ?? 0}`,
                },
            ],
            generatedRefs: [],
            tags: ['typescript', 'parse', `issue-${index}`],
        }));
        const symbols = [];
        const visit = (node) => {
            if (ts.isClassDeclaration(node) && node.name) {
                const decorators = ts.getDecorators(node)?.map((decorator) => {
                    const metadata = parseDecorator(decorator, sourceFile);
                    return {
                        kind: decorator.getText(sourceFile).replace(/^@/, '').split('(')[0] ?? 'Unknown',
                        metadata,
                        rawMetadataKeys: Object.keys(metadata),
                    };
                }) ?? [];
                const members = node.members.map((member) => member.name && ts.isIdentifier(member.name) ? member.name.text : member.getText(sourceFile));
                const constructorDependencies = node.members.flatMap((member) => {
                    if (!ts.isConstructorDeclaration(member)) {
                        return [];
                    }
                    return member.parameters.map((parameter) => parameter.name.getText(sourceFile));
                });
                const lifecycle = node.members
                    .filter((member) => ts.isMethodDeclaration(member) && !!member.name && ts.isIdentifier(member.name))
                    .map((member) => member.name.getText(sourceFile))
                    .filter((name) => lifecycleHooks.has(name));
                const references = node.members.map((member) => member.getText(sourceFile).slice(0, 80));
                const propertyInitializers = node.members
                    .filter((member) => ts.isPropertyDeclaration(member) && !!member.name)
                    .map((member) => ({
                    name: member.name.getText(sourceFile),
                    initializer: member.initializer?.getText(sourceFile),
                    readonly: member.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ReadonlyKeyword) ?? false,
                }));
                const methods = node.members
                    .filter((member) => ts.isMethodDeclaration(member) && !!member.name)
                    .map((member) => ({
                    name: member.name.getText(sourceFile),
                    parameters: member.parameters.map((parameter) => parameter.getText(sourceFile)),
                    bodyText: sanitizeBodyText(member.body?.getText(sourceFile).replace(/^\{|\}$/g, '') ?? ''),
                    isAsync: member.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword) ?? false,
                }));
                symbols.push({
                    id: this.ids.symbolId(sourcePath, 'class', node.name.text, symbols.length),
                    path: sourcePath,
                    name: node.name.text,
                    symbolKind: 'class',
                    decorators,
                    members,
                    imports: [],
                    exports: [],
                    constructorDependencies,
                    lifecycleHooks: lifecycle,
                    references,
                    propertyInitializers,
                    methods,
                });
            }
            if (ts.isFunctionDeclaration(node) && node.name) {
                symbols.push({
                    id: this.ids.symbolId(sourcePath, 'function', node.name.text, symbols.length),
                    path: sourcePath,
                    name: node.name.text,
                    symbolKind: 'function',
                    decorators: [],
                    members: [],
                    imports: [],
                    exports: [],
                    constructorDependencies: [],
                    lifecycleHooks: [],
                    references: [node.getText(sourceFile).slice(0, 80)],
                    propertyInitializers: [],
                    methods: [],
                });
            }
            if (ts.isVariableStatement(node)) {
                const declarationNames = node.declarationList.declarations
                    .map((declaration) => declaration.name.getText(sourceFile))
                    .filter((name) => name.length > 0);
                if (declarationNames.length > 0) {
                    symbols.push({
                        id: this.ids.symbolId(sourcePath, 'const', declarationNames[0] ?? 'value', symbols.length),
                        path: sourcePath,
                        name: declarationNames[0] ?? 'value',
                        symbolKind: 'const',
                        decorators: [],
                        members: declarationNames,
                        imports: [],
                        exports: [],
                        constructorDependencies: [],
                        lifecycleHooks: [],
                        references: declarationNames,
                        propertyInitializers: [],
                        methods: [],
                    });
                }
            }
            ts.forEachChild(node, visit);
        };
        visit(sourceFile);
        const importStatements = sourceFile.statements
            .filter(ts.isImportDeclaration)
            .map((statement) => statement.moduleSpecifier.getText(sourceFile).replace(/^['"]|['"]$/g, ''));
        const exportStatements = sourceFile.statements
            .filter((statement) => ts.isExportDeclaration(statement))
            .map((statement) => statement.moduleSpecifier?.getText(sourceFile).replace(/^['"]|['"]$/g, '') ?? statement.getText(sourceFile));
        for (const symbol of symbols) {
            symbol.imports = importStatements;
            symbol.exports = exportStatements;
        }
        return ok({
            sourcePath,
            symbols,
            diagnostics,
            hasParseErrors: parseDiagnostics.length > 0,
        });
    }
}
//# sourceMappingURL=typescript-parser-adapter.js.map