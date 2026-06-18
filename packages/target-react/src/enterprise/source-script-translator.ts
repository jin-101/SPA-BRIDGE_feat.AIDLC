import type { ScriptMigrationDecision, ScriptMigrationPlan, SourceScriptIntent } from '../types.js';

const DEFAULT_NEXT_SCRIPTS: Record<string, string> = {
  dev: 'next dev',
  build: 'next build',
  start: 'next dev',
  serve: 'next start',
  lint: 'next lint',
  typecheck: 'tsc --noEmit',
};

const UNSAFE_SCRIPT_PATTERN = /\brm\s+-rf\b|\bdel\s+\/[fsq]\b|\bcurl\b.*\|\s*sh|\bwget\b.*\|\s*sh|\bsudo\b/i;

const classifyIntent = (name: string, command: string): SourceScriptIntent => {
  const normalized = `${name} ${command}`.toLowerCase();
  if (UNSAFE_SCRIPT_PATTERN.test(command)) return 'unsafe';
  if (/\bng\s+serve\b/.test(normalized)) return 'dev';
  if (/\bng\s+build\b/.test(normalized)) return 'build';
  if (/\bng\s+test\b|\bkarma\b/.test(normalized)) return 'test';
  if (/\bng\s+lint\b|\beslint\b/.test(normalized)) return 'lint';
  if (/\btsc\b/.test(normalized)) return 'typecheck';
  if (/\bwebpack-bundle-analyzer\b|\banaly[sz]e\b/.test(normalized)) return 'analyze';
  if (/\bdeploy\b|\bpublish\b|\bupload\b/.test(normalized)) return 'deploy';
  if (/\bng\b|\bangular\b/.test(normalized)) return 'angular-only';
  if (name === 'start') return 'start';
  return 'unknown';
};

const targetFor = (name: string, intent: SourceScriptIntent): Pick<ScriptMigrationDecision, 'targetName' | 'targetCommand' | 'status' | 'reasonCode' | 'manualReviewRequired'> => {
  switch (intent) {
    case 'dev':
    case 'build':
    case 'start':
    case 'lint':
    case 'typecheck':
      return {
        targetName: intent,
        targetCommand: DEFAULT_NEXT_SCRIPTS[intent],
        status: 'defaulted',
        reasonCode: 'NEXTJS_DEFAULT_SCRIPT',
        manualReviewRequired: false,
      };
    case 'test':
      return {
        targetName: 'test',
        targetCommand: 'tsc --noEmit',
        status: 'generated',
        reasonCode: 'SOURCE_TEST_SCRIPT_REQUIRES_TARGET_TEST_REVIEW',
        manualReviewRequired: true,
      };
    case 'analyze':
      return {
        targetName: name === 'analyze' ? 'analyze' : `source-${name}`,
        targetCommand: 'ANALYZE=true next build',
        status: 'generated',
        reasonCode: 'NEXTJS_ANALYZE_SCRIPT',
        manualReviewRequired: false,
      };
    case 'deploy':
      return { status: 'review', reasonCode: 'SOURCE_DEPLOY_SCRIPT_REVIEW_REQUIRED', manualReviewRequired: true };
    case 'angular-only':
      return { status: 'removed', reasonCode: 'ANGULAR_ONLY_SCRIPT_REMOVED', manualReviewRequired: true };
    case 'unsafe':
      return { status: 'removed', reasonCode: 'UNSAFE_SCRIPT_NOT_COPIED', manualReviewRequired: true };
    default:
      return { status: 'review', reasonCode: 'UNKNOWN_SOURCE_SCRIPT_REVIEW_REQUIRED', manualReviewRequired: true };
  }
};

export class SourceScriptTranslator {
  translate(sourceScripts: Record<string, string> = {}): ScriptMigrationPlan {
    const decisions = Object.entries(sourceScripts)
      .map(([sourceName, sourceCommand]): ScriptMigrationDecision => {
        const intent = classifyIntent(sourceName, sourceCommand);
        return {
          sourceName,
          sourceCommand,
          intent,
          ...targetFor(sourceName, intent),
        };
      })
      .sort((left, right) => left.sourceName.localeCompare(right.sourceName));

    const targetScripts = { ...DEFAULT_NEXT_SCRIPTS };
    for (const decision of decisions) {
      if (decision.targetName && decision.targetCommand && decision.status !== 'review' && decision.status !== 'removed') {
        targetScripts[decision.targetName] = decision.targetCommand;
      }
    }

    return {
      schemaVersion: 1,
      targetScripts: Object.fromEntries(Object.entries(targetScripts).sort(([left], [right]) => left.localeCompare(right))),
      decisions,
      manualReviewCount: decisions.filter((decision) => decision.manualReviewRequired).length,
    };
  }
}
