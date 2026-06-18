import path from 'node:path';

import { createDiagnostic, type Diagnostic, type SourceRef } from '@spa-bridge/core-model';

import { StableIdFactory } from '../model/stable-id-factory.js';
import type {
  AngularAnimationConversionDiagnostic,
  AngularAnimationDeclaration,
  AngularAnimationModel,
  AngularAnimationStateModel,
  AngularAnimationTransitionModel,
  AngularAnimationTriggerModel,
  AngularTemplateAnimationBindingModel,
  AngularThirdPartyAnimationUsage,
  TemplateParseSummary,
  TypeScriptParseSummary,
} from '../types.js';

const sourceRef = (pathValue: string, symbol?: string): SourceRef => ({ kind: 'source', path: pathValue, symbol });

const safeTriggerName = (value: string): string => value.replace(/^['"`]|['"`]$/g, '').trim();

const parseDuration = (value: string): number | undefined => {
  const ms = value.match(/(\d+(?:\.\d+)?)\s*ms/);
  if (ms?.[1]) return Math.round(Number(ms[1]));
  const seconds = value.match(/(\d+(?:\.\d+)?)\s*s\b/);
  if (seconds?.[1]) return Math.round(Number(seconds[1]) * 1000);
  return undefined;
};

const complexityFor = (transitions: AngularAnimationTransitionModel[]): AngularAnimationTriggerModel['complexity'] => {
  if (transitions.some((transition) => transition.requiresManualReview)) return 'complex';
  if (transitions.some((transition) => transition.requiresRuntimeHelper)) return 'moderate';
  return 'simple';
};

const eligibilityFor = (complexity: AngularAnimationTriggerModel['complexity']): AngularAnimationTriggerModel['conversionEligibility'] => {
  if (complexity === 'simple') return 'css-transition';
  if (complexity === 'moderate') return 'react-helper';
  return 'manual-review';
};

const usageKindFor = (packageName: string): AngularThirdPartyAnimationUsage['usageKind'] => {
  if (packageName === 'lottie-web') return 'lottie';
  if (packageName === 'gsap') return 'gsap';
  if (packageName === 'animejs') return 'animejs';
  if (packageName === 'ngx-lottie') return 'angular-wrapper';
  return 'unknown';
};

const dependencyDecisionFor = (packageName: string): AngularThirdPartyAnimationUsage['targetDependencyDecision'] => {
  if (packageName === 'lottie-web' || packageName === 'gsap' || packageName === 'animejs') return 'carry';
  if (packageName === 'ngx-lottie') return 'review';
  return 'review';
};

export class AnimationModelExtractor {
  private readonly ids = new StableIdFactory();

  extract(typeScriptSummaries: TypeScriptParseSummary[], templateSummaries: TemplateParseSummary[]): AngularAnimationModel {
    const bindings = this.extractTemplateBindings(templateSummaries);
    const declarations: AngularAnimationDeclaration[] = [];
    const thirdPartyUsages: AngularThirdPartyAnimationUsage[] = [];
    const diagnostics: Diagnostic[] = [];

    for (const summary of typeScriptSummaries) {
      for (const symbol of summary.symbols) {
        const componentDecorator = symbol.decorators.find((decorator) => decorator.kind === 'Component');
        const animationMetadata = componentDecorator?.metadata.animations;
        if (animationMetadata) {
          const metadataEntries = Array.isArray(animationMetadata) ? animationMetadata : [String(animationMetadata)];
          const triggers = metadataEntries.flatMap((entry, index) =>
            this.extractTriggers(summary.sourcePath, symbol.id, symbol.name, entry, index + 1, bindings.filter((binding) => binding.sourceRef.path === summary.sourcePath || templateSummaries.some((template) => template.ownerPath === summary.sourcePath && template.sourcePath === binding.sourceRef.path))),
          );
          const rawConstructKinds = [...new Set(metadataEntries.flatMap((entry) => [...entry.matchAll(/\b(trigger|state|style|transition|animate|query|stagger|group)\s*\(/g)].map((match) => match[1] ?? 'unknown')))].sort();
          const declarationDiagnostics = triggers
            .filter((trigger) => trigger.conversionEligibility === 'manual-review')
            .map((trigger): AngularAnimationConversionDiagnostic => ({
              code: 'ANIMATION-METADATA-REVIEW',
              severity: 'manual-review',
              sourceRef: sourceRef(summary.sourcePath, symbol.name),
              triggerName: trigger.triggerName,
              category: 'metadata',
              runtimeParityImpact: 'medium',
              suggestedTargetApproach: 'Review complex Angular animation DSL and decide whether to implement a React helper or custom animation adapter.',
            }));

          declarations.push({
            id: this.ids.symbolId(summary.sourcePath, 'animation-declaration', symbol.name, declarations.length + 1),
            sourceRef: sourceRef(summary.sourcePath, symbol.name),
            componentId: symbol.id,
            triggers,
            rawConstructKinds,
            diagnostics: declarationDiagnostics,
          });

          for (const diagnostic of declarationDiagnostics) {
            diagnostics.push(this.toDiagnostic(diagnostic));
          }
        }

        for (const importSpecifier of symbol.imports) {
          const kind = usageKindFor(importSpecifier);
          if (kind !== 'unknown') {
            thirdPartyUsages.push({
              id: this.ids.symbolId(summary.sourcePath, 'animation-package', importSpecifier, thirdPartyUsages.length + 1),
              packageName: importSpecifier,
              usageKind: kind,
              importRefs: [sourceRef(summary.sourcePath, symbol.name)],
              assetRefs: this.extractAssetRefs(symbol.references.join('\n')),
              targetDependencyDecision: dependencyDecisionFor(importSpecifier),
              targetAdapterPlan: kind === 'lottie' ? 'react-lottie-wrapper' : kind === 'gsap' || kind === 'animejs' ? 'react-effect-wrapper' : 'manual-review',
            });
          }
        }
      }
    }

    const assetRefs = [...new Set(thirdPartyUsages.flatMap((usage) => usage.assetRefs))]
      .sort((left, right) => left.localeCompare(right))
      .map((assetPath, index) => ({
        id: this.ids.fileId(assetPath, `animation-asset-${index + 1}`),
        sourcePath: assetPath,
        targetPath: `public/animations/${path.basename(assetPath)}`,
        assetKind: assetPath.endsWith('.json') ? 'lottie-json' as const : 'unknown' as const,
        copyStatus: 'planned' as const,
      }));

    return {
      schemaVersion: 1,
      declarations: declarations.sort((left, right) => left.id.localeCompare(right.id)),
      thirdPartyUsages: thirdPartyUsages.sort((left, right) => left.id.localeCompare(right.id)),
      assetRefs,
      diagnostics: diagnostics.sort((left, right) => left.code.localeCompare(right.code) || left.message.localeCompare(right.message)),
    };
  }

  private extractTriggers(sourcePath: string, componentId: string, componentName: string, metadata: string, ordinal: number, bindings: AngularTemplateAnimationBindingModel[]): AngularAnimationTriggerModel[] {
    const triggerMatches = [...metadata.matchAll(/trigger\s*\(\s*(['"`][^'"`]+['"`])\s*,\s*\[([\s\S]*?)\]\s*\)/g)];
    if (triggerMatches.length === 0 && metadata.includes('trigger(')) {
      const fallbackName = safeTriggerName(metadata.match(/trigger\s*\(\s*(['"`][^'"`]+['"`])/)?.[1] ?? `${componentName}Animation`);
      return [this.createTrigger(sourcePath, componentId, fallbackName, metadata, ordinal, bindings)];
    }
    return triggerMatches.map((match, index) => this.createTrigger(sourcePath, componentId, safeTriggerName(match[1] ?? `animation${index + 1}`), match[2] ?? metadata, ordinal + index, bindings));
  }

  private createTrigger(sourcePath: string, componentId: string, triggerName: string, metadata: string, ordinal: number, bindings: AngularTemplateAnimationBindingModel[]): AngularAnimationTriggerModel {
    const states = [...metadata.matchAll(/state\s*\(\s*(['"`][^'"`]+['"`])\s*,\s*style\s*\(\s*\{([\s\S]*?)\}\s*\)/g)]
      .map((match, index): AngularAnimationStateModel => ({
        id: this.ids.symbolId(sourcePath, 'animation-state', `${triggerName}-${safeTriggerName(match[1] ?? '')}`, index + 1),
        stateName: safeTriggerName(match[1] ?? `state${index + 1}`),
        styleProperties: this.parseStyleProperties(match[2] ?? ''),
        sourceRef: sourceRef(sourcePath, triggerName),
        requiresReview: /\bthis\.|=>|\?/.test(match[2] ?? ''),
      }));
    const transitions = [...metadata.matchAll(/transition\s*\(\s*(['"`][^'"`]+['"`])\s*,\s*\[?([\s\S]*?)\]?\s*\)/g)]
      .map((match, index): AngularAnimationTransitionModel => {
        const expression = safeTriggerName(match[1] ?? '* => *');
        const body = match[2] ?? '';
        const usesQuery = /\bquery\s*\(/.test(body);
        const usesStagger = /\bstagger\s*\(/.test(body);
        const usesGroup = /\bgroup\s*\(/.test(body);
        const dynamic = /\$\{|=>|this\.|\?/.test(body);
        return {
          id: this.ids.symbolId(sourcePath, 'animation-transition', `${triggerName}-${expression}`, index + 1),
          expression,
          durationMs: parseDuration(body),
          easing: body.match(/\b(ease-in-out|ease-in|ease-out|linear)\b/)?.[1],
          usesQuery,
          usesStagger,
          usesGroup,
          requiresRuntimeHelper: usesQuery || usesStagger || usesGroup,
          requiresManualReview: dynamic || usesQuery || usesStagger || usesGroup,
        };
      });
    const complexity = complexityFor(transitions);
    return {
      id: this.ids.symbolId(sourcePath, 'animation-trigger', `${componentId}-${triggerName}`, ordinal),
      triggerName,
      states,
      transitions,
      bindings: bindings.filter((binding) => binding.triggerName === triggerName),
      complexity,
      conversionEligibility: eligibilityFor(complexity),
    };
  }

  private extractTemplateBindings(templateSummaries: TemplateParseSummary[]): AngularTemplateAnimationBindingModel[] {
    const bindings: AngularTemplateAnimationBindingModel[] = [];
    for (const template of templateSummaries) {
      const raw = template.rawText ?? '';
      for (const match of raw.matchAll(/\[@([A-Za-z_$][\w$-]*)\](?:\s*=\s*["']([^"']+)["'])?/g)) {
        const triggerName = match[1] ?? 'animation';
        bindings.push({
          id: this.ids.templateId(template.sourcePath, `animation-${triggerName}`, bindings.length + 1),
          triggerName,
          bindingExpression: match[2],
          targetElementRef: template.sourcePath,
          sourceRef: sourceRef(template.sourcePath, triggerName),
          conversionPlan: 'class-binding',
        });
      }
      for (const match of raw.matchAll(/\(@([A-Za-z_$][\w$-]*)\.(start|done)\)\s*=\s*["']([^"']+)["']/g)) {
        const triggerName = match[1] ?? 'animation';
        bindings.push({
          id: this.ids.templateId(template.sourcePath, `animation-${triggerName}-${match[2] ?? 'event'}`, bindings.length + 1),
          triggerName,
          startHandler: match[2] === 'start' ? match[3] : undefined,
          doneHandler: match[2] === 'done' ? match[3] : undefined,
          targetElementRef: template.sourcePath,
          sourceRef: sourceRef(template.sourcePath, triggerName),
          conversionPlan: 'event-callback',
        });
      }
    }
    return bindings.sort((left, right) => left.id.localeCompare(right.id));
  }

  private parseStyleProperties(styleText: string): Record<string, string> {
    return Object.fromEntries(
      [...styleText.matchAll(/([A-Za-z_$][\w$-]*)\s*:\s*([^,}]+)/g)]
        .map((match): [string, string] => [match[1] ?? 'property', (match[2] ?? '').trim().replace(/^['"`]|['"`]$/g, '')])
        .sort(([left], [right]) => left.localeCompare(right)),
    );
  }

  private extractAssetRefs(text: string): string[] {
    return [...text.matchAll(/['"`]([^'"`]+\.(?:json|lottie|png|jpg|jpeg|svg|webp))['"`]/g)]
      .map((match) => match[1] ?? '')
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right));
  }

  private toDiagnostic(diagnostic: AngularAnimationConversionDiagnostic): Diagnostic {
    return createDiagnostic({
      code: diagnostic.code,
      severity: diagnostic.severity,
      message: `${diagnostic.category} animation '${diagnostic.triggerName ?? 'unknown'}' requires review: ${diagnostic.suggestedTargetApproach}`,
      sourceRefs: [diagnostic.sourceRef],
      generatedRefs: [],
      tags: ['animation', diagnostic.category, `impact-${diagnostic.runtimeParityImpact}`],
    });
  }
}
