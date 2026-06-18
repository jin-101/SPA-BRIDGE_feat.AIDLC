import type {
  GeneratedTargetValidationDiagnostic,
  GeneratedTargetValidationDiagnosticCategory,
  GeneratedTargetValidationResult,
} from '../types.js';

const categoryRules: Array<[GeneratedTargetValidationDiagnosticCategory, RegExp]> = [
  ['dependency-install-failure', /npm ERR|ERESOLVE|peer dep|dependency/i],
  ['next-client-boundary-missing', /use client|client component|useState|useEffect|event handler/i],
  ['typescript-import-resolution', /cannot find module|module not found|import/i],
  ['typescript-helper-missing', /cannot find name|is not defined/i],
  ['typescript-alias-resolution', /paths|baseUrl|alias/i],
  ['next-build-config', /next\.config|app router|layout\.tsx/i],
  ['style-or-asset-reference', /css|less|scss|asset|image|font/i],
  ['lint-or-format', /eslint|prettier|lint/i],
  ['timeout', /timeout|timed out/i],
];

export class ValidationResultClassifier {
  classify(input: {
    commandId: string;
    kind: GeneratedTargetValidationResult['kind'];
    safeOutputSummary: string;
    exitCode?: number;
    durationMs?: number;
  }): GeneratedTargetValidationResult {
    const status = input.exitCode === 0 ? 'passed' : input.safeOutputSummary.toLowerCase().includes('timeout') ? 'timed-out' : 'failed';
    const diagnostics = status === 'passed' ? [] : [this.diagnostic(input.commandId, input.safeOutputSummary)];

    return {
      commandId: input.commandId,
      kind: input.kind,
      status,
      exitCode: input.exitCode,
      durationMs: input.durationMs ?? 0,
      safeOutputSummary: this.sanitize(input.safeOutputSummary),
      diagnostics,
    };
  }

  private diagnostic(commandId: string, summary: string): GeneratedTargetValidationDiagnostic {
    const sanitized = this.sanitize(summary);
    const category = categoryRules.find(([, pattern]) => pattern.test(sanitized))?.[0] ?? 'manual-review-required';

    return {
      id: `${commandId}-${category}`,
      category,
      severity: category === 'manual-review-required' ? 'manual-review' : 'blocking',
      commandId,
      safeMessage: sanitized,
      fixerCandidateIds: this.fixerIdsFor(category),
    };
  }

  private sanitize(value: string): string {
    return value.replace(/\/(?:Users|home|workspace)\/[^\s'"]+/g, '[safe-path]').slice(0, 500);
  }

  private fixerIdsFor(category: GeneratedTargetValidationDiagnosticCategory): string[] {
    const mapping: Partial<Record<GeneratedTargetValidationDiagnosticCategory, string[]>> = {
      'next-client-boundary-missing': ['fix-next-client-boundary'],
      'typescript-import-resolution': ['fix-import-paths'],
      'typescript-helper-missing': ['fix-helper-imports'],
      'typescript-alias-resolution': ['fix-typescript-aliases'],
      'dependency-install-failure': ['fix-package-manifest'],
      'style-or-asset-reference': ['fix-style-asset-refs'],
    };
    return mapping[category] ?? [];
  }
}
