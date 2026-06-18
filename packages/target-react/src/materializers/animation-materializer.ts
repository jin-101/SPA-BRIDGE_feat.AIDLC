import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactAnimationDraft } from '@spa-bridge/transform-angular-react';

import type { GeneratedFileSpec } from '../types.js';
import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';

const renderCss = (animation: ReactAnimationDraft): string[] => {
  const lines = [`/* Animation trigger: ${animation.triggerName.replace(/\*\//g, '* /')} */`];
  const stateEntries = Object.entries(animation.stateClassNames).sort(([left], [right]) => left.localeCompare(right));
  if (stateEntries.length === 0) {
    lines.push(`.${animation.cssClassPrefix} { transition: all 200ms ease-in-out; }`);
    return lines;
  }
  for (const [stateName, className] of stateEntries) {
    lines.push(`.${className} {`);
    lines.push('  transition: all 200ms ease-in-out;');
    lines.push(`  /* Angular animation state: ${stateName.replace(/\*\//g, '* /')} */`);
    lines.push('}');
  }
  return lines;
};

const renderHelper = (animation: ReactAnimationDraft): string => {
  const classMap = JSON.stringify(animation.stateClassNames, null, 2);
  return [
    animation.requiresClientComponent ? '"use client";' : '',
    '',
    `export const ${animation.triggerName.replace(/[^A-Za-z0-9_$]/g, '') || 'animation'}AnimationClasses = ${classMap} as const;`,
    '',
    `export const resolve${animation.triggerName.replace(/[^A-Za-z0-9_$]/g, '') || 'Animation'}Class = (state: string | undefined): string => {`,
    `  return state && state in ${animation.triggerName.replace(/[^A-Za-z0-9_$]/g, '') || 'animation'}AnimationClasses`,
    `    ? ${animation.triggerName.replace(/[^A-Za-z0-9_$]/g, '') || 'animation'}AnimationClasses[state as keyof typeof ${animation.triggerName.replace(/[^A-Za-z0-9_$]/g, '') || 'animation'}AnimationClasses]`,
    `    : ${JSON.stringify(Object.values(animation.stateClassNames)[0] ?? animation.cssClassPrefix)};`,
    '};',
    '',
    ...animation.reviewComments.map((comment) => `// ${comment.replace(/\*\//g, '* /')}`),
    '',
  ].filter((line, index) => line.length > 0 || index > 0).join('\n');
};

export class AnimationMaterializer {
  materialize(animations: ReactAnimationDraft[], sourceRefs: SourceRef[] = []): GeneratedFileSpec[] {
    if (animations.length === 0) {
      return [];
    }

    const cssContent = [
      '/* Generated animation parity helpers. */',
      ...animations.flatMap((animation) => [...renderCss(animation), '']),
    ].join('\n');
    const cssFile = createFileSpec({
      path: 'src/animations/animations.css',
      kind: 'scaffold',
      content: cssContent,
      sourceRefs,
      overwrite: true,
    });
    const helperFiles = animations.map((animation) =>
      createFileSpec({
        path: animation.generatedRefs[0]?.path ?? `src/animations/${animation.id}.ts`,
        kind: 'component',
        content: renderHelper(animation),
        sourceRefs: animation.sourceRef ? [animation.sourceRef] : sourceRefs,
        overwrite: true,
      }),
    );
    const reviewFile = createFileSpec({
      path: 'src/review/animation-conversion-summary.json',
      kind: 'review',
      content: JSON.stringify({
        schemaVersion: 1,
        totalAnimations: animations.length,
        manualReviewCount: animations.filter((animation) => animation.reviewComments.length > 0 || animation.conversionKind === 'manual-review').length,
        clientBoundaryCount: animations.filter((animation) => animation.requiresClientComponent).length,
        missingAssetCount: animations.flatMap((animation) => animation.assetRefs).filter((asset) => asset.copyStatus === 'missing').length,
        triggers: animations.map((animation) => ({
          id: animation.id,
          triggerName: animation.triggerName,
          conversionKind: animation.conversionKind,
          requiresClientComponent: animation.requiresClientComponent,
          reviewComments: animation.reviewComments,
        })),
      }, null, 2) + '\n',
      sourceRefs,
      overwrite: true,
      status: 'review',
    });

    return [cssFile, ...helperFiles, reviewFile];
  }
}
