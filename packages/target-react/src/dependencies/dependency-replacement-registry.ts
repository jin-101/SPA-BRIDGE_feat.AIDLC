import type { DependencyReplacementRule, DependencySourceCategory } from '../types.js';

export type DependencyPatternRule = {
  pattern: RegExp;
  category: DependencySourceCategory;
  rationale: string;
};

export const dependencyReplacementRules: DependencyReplacementRule[] = [
  {
    sourcePackage: '@wds/wc-angular-lib',
    targetPackage: '@wds/wc-react-lib',
    versionPolicy: 'preserve',
    rationale:
      'Custom WDS Angular package has a React package counterpart. Package replacement is deterministic, but usage-site API compatibility must be reviewed.',
    usageSiteReviewPolicy: 'when-unverified',
  },
];

export const dependencyRemovalRules: DependencyPatternRule[] = [
  {
    pattern: /^@angular\//,
    category: 'angular-core',
    rationale: 'Angular framework packages are not installed in the generated React target.',
  },
  {
    pattern: /^@ngrx\//,
    category: 'ngrx',
    rationale: 'NgRx packages are converted to React state strategy outputs rather than installed directly.',
  },
  {
    pattern: /^@angular-devkit\//,
    category: 'build-tool',
    rationale: 'Angular build tooling is replaced by the generated React/Vite toolchain.',
  },
  {
    pattern: /^@schematics\//,
    category: 'build-tool',
    rationale: 'Angular schematic tooling is not required by the generated React target.',
  },
  {
    pattern: /^zone\.js$/,
    category: 'angular-core',
    rationale: 'zone.js is Angular runtime infrastructure and is not required by React.',
  },
  {
    pattern: /^webpack$/,
    category: 'build-tool',
    rationale: 'The generated target uses Vite as the deterministic build tool.',
  },
  {
    pattern: /^webpack-bundle-analyzer$/,
    category: 'build-tool',
    rationale: 'Angular build analysis tooling is excluded from the generated React runtime manifest.',
  },
  {
    pattern: /^typescript$/,
    category: 'build-tool',
    rationale: 'TypeScript is pinned by the generated React target dev dependency policy.',
  },
];

export const highRiskWrapperRules: DependencyPatternRule[] = [
  {
    pattern: /^ngx-/,
    category: 'angular-wrapper',
    rationale: 'ngx-* packages are Angular wrapper packages and require an explicit React replacement before installation.',
  },
  {
    pattern: /^@ngx-/,
    category: 'angular-wrapper',
    rationale: '@ngx-* packages are Angular wrapper packages and require an explicit React replacement before installation.',
  },
  {
    pattern: /^angularx-/,
    category: 'angular-wrapper',
    rationale: 'angularx-* packages are Angular wrapper packages and require an explicit React replacement before installation.',
  },
  {
    pattern: /^ngrx-store-localstorage$/,
    category: 'ngrx',
    rationale: 'NgRx local-storage integration is Angular/NgRx-specific and must be mapped through target state strategy code.',
  },
];

export const frameworkNeutralCarryPackages = new Set([
  '@turf/along',
  '@turf/bearing',
  '@turf/helpers',
  '@turf/line-distance',
  '@types/geojson',
  '@types/mapbox-gl',
  '@zumer/snapdom',
  'animejs',
  'browser-image-compression',
  'bwip-js',
  'copyfiles',
  'cross-var',
  'dayjs',
  'decode-uri-component-charset',
  'deepmerge',
  'fflate',
  'focus-trap',
  'gsap',
  'html-to-image',
  'html2canvas',
  'js-cookie',
  'jsbarcode',
  'localstorage-ttl',
  'lottie-web',
  'mapbox-gl',
  'react',
  'react-dom',
  'rxjs',
  'spltjs',
  'tslib',
  'uuid',
  'zoom-level',
]);

