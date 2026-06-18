import path from 'node:path';
import { createDiagnostic } from '@spa-bridge/core-model';
import { StableIdFactory } from '../model/stable-id-factory.js';
const sourceRef = (pathValue, symbol) => ({ kind: 'source', path: pathValue, symbol });
const safeTriggerName = (value) => value.replace(/^['"`]|['"`]$/g, '').trim();
const parseDuration = (value) => {
    const ms = value.match(/(\d+(?:\.\d+)?)\s*ms/);
    if (ms?.[1])
        return Math.round(Number(ms[1]));
    const seconds = value.match(/(\d+(?:\.\d+)?)\s*s\b/);
    if (seconds?.[1])
        return Math.round(Number(seconds[1]) * 1000);
    return undefined;
};
const complexityFor = (transitions) => {
    if (transitions.some((transition) => transition.requiresManualReview))
        return 'complex';
    if (transitions.some((transition) => transition.requiresRuntimeHelper))
        return 'moderate';
    return 'simple';
};
const eligibilityFor = (complexity) => {
    if (complexity === 'simple')
        return 'css-transition';
    if (complexity === 'moderate')
        return 'react-helper';
    return 'manual-review';
};
const usageKindFor = (packageName) => {
    if (packageName === 'lottie-web')
        return 'lottie';
    if (packageName === 'gsap')
        return 'gsap';
    if (packageName === 'animejs')
        return 'animejs';
    if (packageName === 'ngx-lottie')
        return 'angular-wrapper';
    return 'unknown';
};
const dependencyDecisionFor = (packageName) => {
    if (packageName === 'lottie-web' || packageName === 'gsap' || packageName === 'animejs')
        return 'carry';
    if (packageName === 'ngx-lottie')
        return 'review';
    return 'review';
};
export class AnimationModelExtractor {
    ids = new StableIdFactory();
    extract(typeScriptSummaries, templateSummaries) {
        const bindings = this.extractTemplateBindings(templateSummaries);
        const declarations = [];
        const thirdPartyUsages = [];
        const diagnostics = [];
        for (const summary of typeScriptSummaries) {
            for (const symbol of summary.symbols) {
                const componentDecorator = symbol.decorators.find((decorator) => decorator.kind === 'Component');
                const animationMetadata = componentDecorator?.metadata.animations;
                if (animationMetadata) {
                    const metadataEntries = Array.isArray(animationMetadata) ? animationMetadata : [String(animationMetadata)];
                    const triggers = metadataEntries.flatMap((entry, index) => this.extractTriggers(summary.sourcePath, symbol.id, symbol.name, entry, index + 1, bindings.filter((binding) => binding.sourceRef.path === summary.sourcePath || templateSummaries.some((template) => template.ownerPath === summary.sourcePath && template.sourcePath === binding.sourceRef.path))));
                    const rawConstructKinds = [...new Set(metadataEntries.flatMap((entry) => [...entry.matchAll(/\b(trigger|state|style|transition|animate|query|stagger|group)\s*\(/g)].map((match) => match[1] ?? 'unknown')))].sort();
                    const declarationDiagnostics = triggers
                        .filter((trigger) => trigger.conversionEligibility === 'manual-review')
                        .map((trigger) => ({
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
            assetKind: assetPath.endsWith('.json') ? 'lottie-json' : 'unknown',
            copyStatus: 'planned',
        }));
        return {
            schemaVersion: 1,
            declarations: declarations.sort((left, right) => left.id.localeCompare(right.id)),
            thirdPartyUsages: thirdPartyUsages.sort((left, right) => left.id.localeCompare(right.id)),
            assetRefs,
            diagnostics: diagnostics.sort((left, right) => left.code.localeCompare(right.code) || left.message.localeCompare(right.message)),
        };
    }
    extractTriggers(sourcePath, componentId, componentName, metadata, ordinal, bindings) {
        const triggerMatches = [...metadata.matchAll(/trigger\s*\(\s*(['"`][^'"`]+['"`])\s*,\s*\[([\s\S]*?)\]\s*\)/g)];
        if (triggerMatches.length === 0 && metadata.includes('trigger(')) {
            const fallbackName = safeTriggerName(metadata.match(/trigger\s*\(\s*(['"`][^'"`]+['"`])/)?.[1] ?? `${componentName}Animation`);
            return [this.createTrigger(sourcePath, componentId, fallbackName, metadata, ordinal, bindings)];
        }
        return triggerMatches.map((match, index) => this.createTrigger(sourcePath, componentId, safeTriggerName(match[1] ?? `animation${index + 1}`), match[2] ?? metadata, ordinal + index, bindings));
    }
    createTrigger(sourcePath, componentId, triggerName, metadata, ordinal, bindings) {
        const states = [...metadata.matchAll(/state\s*\(\s*(['"`][^'"`]+['"`])\s*,\s*style\s*\(\s*\{([\s\S]*?)\}\s*\)/g)]
            .map((match, index) => ({
            id: this.ids.symbolId(sourcePath, 'animation-state', `${triggerName}-${safeTriggerName(match[1] ?? '')}`, index + 1),
            stateName: safeTriggerName(match[1] ?? `state${index + 1}`),
            styleProperties: this.parseStyleProperties(match[2] ?? ''),
            sourceRef: sourceRef(sourcePath, triggerName),
            requiresReview: /\bthis\.|=>|\?/.test(match[2] ?? ''),
        }));
        const transitions = [...metadata.matchAll(/transition\s*\(\s*(['"`][^'"`]+['"`])\s*,\s*\[?([\s\S]*?)\]?\s*\)/g)]
            .map((match, index) => {
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
    extractTemplateBindings(templateSummaries) {
        const bindings = [];
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
    parseStyleProperties(styleText) {
        return Object.fromEntries([...styleText.matchAll(/([A-Za-z_$][\w$-]*)\s*:\s*([^,}]+)/g)]
            .map((match) => [match[1] ?? 'property', (match[2] ?? '').trim().replace(/^['"`]|['"`]$/g, '')])
            .sort(([left], [right]) => left.localeCompare(right)));
    }
    extractAssetRefs(text) {
        return [...text.matchAll(/['"`]([^'"`]+\.(?:json|lottie|png|jpg|jpeg|svg|webp))['"`]/g)]
            .map((match) => match[1] ?? '')
            .filter(Boolean)
            .sort((left, right) => left.localeCompare(right));
    }
    toDiagnostic(diagnostic) {
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
//# sourceMappingURL=animation-model-extractor.js.map