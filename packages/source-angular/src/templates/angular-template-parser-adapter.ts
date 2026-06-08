import { createDiagnostic, err, ok, type Result } from '@spa-bridge/core-model';

import type { AnalysisError, TemplateParseSummary } from '../types.js';

const heuristicParse = (templateText: string) => {
  const propertyBindings = [...templateText.matchAll(/\[([^\]]+)\]=/g)].map((match) => match[1] ?? '').filter(Boolean);
  const eventBindings = [...templateText.matchAll(/\(([^)]+)\)=/g)].map((match) => match[1] ?? '').filter(Boolean);
  const structuralDirectives = [...templateText.matchAll(/\*([A-Za-z0-9_]+)/g)].map((match) => match[1] ?? '').filter(Boolean);
  const templateRefs = [...templateText.matchAll(/#([A-Za-z0-9_]+)/g)].map((match) => match[1] ?? '').filter(Boolean);
  const pipes = [...templateText.matchAll(/\|\s*([A-Za-z0-9_]+)/g)].map((match) => match[1] ?? '').filter(Boolean);
  const externalReferences = [...templateText.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map((match) => match[1] ?? '').filter(Boolean);
  return {
    propertyBindings,
    eventBindings,
    structuralDirectives,
    templateRefs,
    pipes,
    externalReferences,
  };
};

export class AngularTemplateParserAdapter {
  async parse(sourcePath: string, templateText: string, ownerPath?: string): Promise<Result<TemplateParseSummary, AnalysisError>> {
    if (!templateText.trim()) {
      return err({
        code: 'VALIDATION_FAILED',
        message: `Template source '${sourcePath}' is empty.`,
      });
    }

    const bindings = heuristicParse(templateText);
    const diagnostics = templateText.includes('{{') && !templateText.includes('}}')
      ? [
          createDiagnostic({
            code: 'TEMPLATE-PARSE-002',
            severity: 'warning',
            message: `Potentially malformed interpolation in '${sourcePath}'.`,
            sourceRefs: [
              {
                kind: 'source',
                path: sourcePath,
                location: '0:0',
              },
            ],
            generatedRefs: [],
            tags: ['template', 'heuristic'],
          }),
        ]
      : [];

    return ok({
      sourcePath,
      ownerPath,
      bindings,
      rawText: templateText.slice(0, 4_000),
      diagnostics,
      parserMode: 'heuristic',
    });
  }
}
