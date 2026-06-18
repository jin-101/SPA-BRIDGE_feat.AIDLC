import type { RuntimeParityGeneratedFile, RuntimeParityQualityInput, RuntimeParityQualityScore } from '../types.js';

const nextRequiredFiles = [
  'package.json',
  'next.config.mjs',
  'tsconfig.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/providers.tsx',
];

const viteRequiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'src/main.tsx',
  'src/App.tsx',
];

const normalizePath = (value: string): string => value.replace(/\\/g, '/').replace(/^\/+/, '');

const countMatches = (files: RuntimeParityGeneratedFile[], pattern: RegExp): number =>
  files.reduce((total, file) => total + (file.content.match(pattern)?.length ?? 0), 0);

const looksEmptyComponent = (file: RuntimeParityGeneratedFile): boolean => {
  if (!file.path.endsWith('.tsx') || !/export\s+const\s+[A-Za-z_$][\w$]*\s*=/.test(file.content)) {
    return false;
  }

  const meaningfulSignals = [
    'useState(',
    'useEffect(',
    'useFormControl(',
    'useObservable(',
    'useAppSelector(',
    'onClick=',
    'className=',
    'data-component=',
  ];
  return !meaningfulSignals.some((signal) => file.content.includes(signal));
};

const parsePackageJson = (files: RuntimeParityGeneratedFile[]): Record<string, unknown> | undefined => {
  const packageFile = files.find((file) => normalizePath(file.path) === 'package.json');
  if (!packageFile) return undefined;
  try {
    return JSON.parse(packageFile.content) as Record<string, unknown>;
  } catch {
    return undefined;
  }
};

const hasScript = (packageJson: Record<string, unknown> | undefined, scriptName: string): boolean => {
  const scripts = packageJson?.scripts;
  return Boolean(scripts && typeof scripts === 'object' && scriptName in scripts);
};

const hasAllPaths = (paths: Set<string>, expected: string[]): boolean => expected.every((path) => paths.has(path));

const parseAnimationSummary = (files: RuntimeParityGeneratedFile[]) => {
  const summaryFile = files.find((file) => normalizePath(file.path) === 'src/review/animation-conversion-summary.json');
  if (!summaryFile) {
    return {
      animationTriggerCount: 0,
      convertedAnimationTriggerCount: 0,
      unresolvedAnimationTriggerCount: 0,
      missingAnimationAssetCount: 0,
      animationManualReviewCount: 0,
      animationClientBoundaryCount: 0,
    };
  }
  try {
    const parsed = JSON.parse(summaryFile.content) as {
      totalAnimations?: number;
      manualReviewCount?: number;
      clientBoundaryCount?: number;
      missingAssetCount?: number;
      triggers?: Array<{ conversionKind?: string }>;
    };
    const triggerCount = parsed.totalAnimations ?? parsed.triggers?.length ?? 0;
    const unresolved = parsed.triggers?.filter((trigger) => trigger.conversionKind === 'manual-review').length ?? parsed.manualReviewCount ?? 0;
    return {
      animationTriggerCount: triggerCount,
      convertedAnimationTriggerCount: Math.max(0, triggerCount - unresolved),
      unresolvedAnimationTriggerCount: unresolved,
      missingAnimationAssetCount: parsed.missingAssetCount ?? 0,
      animationManualReviewCount: parsed.manualReviewCount ?? 0,
      animationClientBoundaryCount: parsed.clientBoundaryCount ?? 0,
    };
  } catch {
    return {
      animationTriggerCount: 0,
      convertedAnimationTriggerCount: 0,
      unresolvedAnimationTriggerCount: 1,
      missingAnimationAssetCount: 0,
      animationManualReviewCount: 1,
      animationClientBoundaryCount: 0,
    };
  }
};

export class RuntimeParityQualityGate {
  evaluate(input: RuntimeParityQualityInput): RuntimeParityQualityScore {
    const files = [...input.files].sort((left, right) => normalizePath(left.path).localeCompare(normalizePath(right.path)));
    const paths = new Set(files.map((file) => normalizePath(file.path)));
    const expectedFiles =
      input.expectedFramework === 'nextjs'
        ? nextRequiredFiles
        : input.expectedFramework === 'vite'
          ? viteRequiredFiles
          : ['package.json', 'tsconfig.json'];
    const missingRequiredFiles = expectedFiles.filter((file) => !paths.has(file));
    const requiredFilesPresent = missingRequiredFiles.length === 0;
    const packageJson = parsePackageJson(files);
    const packageInstallReady = Boolean(packageJson && hasScript(packageJson, 'dev') && hasScript(packageJson, 'build'));
    const enterpriseParityArtifactsPresent = hasAllPaths(paths, [
      '.npmrc.example',
      '.env.example',
      'src/review/registry-migration-report.json',
      'src/review/script-migration-report.json',
      'src/review/environment-contract-report.json',
      'src/review/package-manager-parity-report.json',
    ]);
    const enterpriseScriptReady = Boolean(packageJson && hasScript(packageJson, 'dev') && hasScript(packageJson, 'build') && hasScript(packageJson, 'typecheck'));
    const enterpriseEnvironmentReady = paths.has('.env.example');
    const emptyComponentCount = files.filter(looksEmptyComponent).length;
    const manualReviewCount = countMatches(files, /AIDLC_MANUAL_REVIEW/g);
    const todoCount = countMatches(files, /\bTODO\b/g);
    const angularSyntaxResidueCount = countMatches(files, /\*ng[A-Z]|[(]\w+[)]|\[\w+\]|ngOnInit|ngOnDestroy|EventEmitter|@Component/g);
    const animationSignals = parseAnimationSummary(files);
    const selfCorrection = input.selfCorrection;
    const selfCorrectionPenalty =
      selfCorrection?.status === 'blocked'
        ? 20
        : selfCorrection?.status === 'degraded'
          ? 10
          : 0;

    const penalties =
      missingRequiredFiles.length * 15
      + (packageInstallReady ? 0 : 20)
      + (enterpriseParityArtifactsPresent ? 0 : 5)
      + (enterpriseScriptReady ? 0 : 5)
      + (enterpriseEnvironmentReady ? 0 : 5)
      + emptyComponentCount * 10
      + Math.min(manualReviewCount, 40)
      + Math.min(todoCount * 2, 30)
      + Math.min(angularSyntaxResidueCount * 3, 45)
      + Math.min(animationSignals.unresolvedAnimationTriggerCount * 5, 20)
      + Math.min(animationSignals.missingAnimationAssetCount * 5, 20)
      + selfCorrectionPenalty;
    const score = Math.max(0, 100 - penalties);
    const findings = [
      ...missingRequiredFiles.map((file) => `Missing required ${input.expectedFramework} file: ${file}`),
      ...(packageInstallReady ? [] : ['package.json is missing runnable dev/build scripts or could not be parsed.']),
      ...(enterpriseParityArtifactsPresent ? [] : ['Enterprise parity registry/script/environment artifacts are incomplete.']),
      ...(enterpriseScriptReady ? [] : ['package.json is missing generated Next.js dev/build/typecheck script readiness.']),
      ...(enterpriseEnvironmentReady ? [] : ['Generated target is missing .env.example environment contract.']),
      ...(emptyComponentCount > 0 ? [`${emptyComponentCount} component files look structurally empty.`] : []),
      ...(manualReviewCount > 0 ? [`${manualReviewCount} manual review markers remain in generated files.`] : []),
      ...(todoCount > 0 ? [`${todoCount} TODO markers remain in generated files.`] : []),
      ...(angularSyntaxResidueCount > 0 ? [`${angularSyntaxResidueCount} Angular-specific syntax residues remain in generated files.`] : []),
      ...(animationSignals.unresolvedAnimationTriggerCount > 0 ? [`${animationSignals.unresolvedAnimationTriggerCount} animation triggers require manual review.`] : []),
      ...(animationSignals.missingAnimationAssetCount > 0 ? [`${animationSignals.missingAnimationAssetCount} animation assets are missing or unresolved.`] : []),
      ...(selfCorrection && selfCorrection.status !== 'passed'
        ? [`Generated target self-correction status is ${selfCorrection.status} with ${selfCorrection.summary.remainingBlockers} remaining blockers.`]
        : []),
    ];

    return {
      score,
      status: score >= 85 ? 'passed' : score >= 60 ? 'warning' : 'failed',
      requiredFilesPresent,
      packageInstallReady,
      enterpriseParityArtifactsPresent,
      enterpriseScriptReady,
      enterpriseEnvironmentReady,
      emptyComponentCount,
      manualReviewCount,
      todoCount,
      angularSyntaxResidueCount,
      ...animationSignals,
      selfCorrectionStatus: selfCorrection?.status,
      selfCorrectionAttemptCount: selfCorrection?.attempts.length ?? 0,
      selfCorrectionAppliedFixCount: selfCorrection?.summary.appliedFixes ?? 0,
      selfCorrectionAiRepairCount: selfCorrection?.summary.aiRepairRequests ?? 0,
      selfCorrectionRemainingBlockerCount: selfCorrection?.summary.remainingBlockers ?? 0,
      missingRequiredFiles,
      findings,
    };
  }
}
