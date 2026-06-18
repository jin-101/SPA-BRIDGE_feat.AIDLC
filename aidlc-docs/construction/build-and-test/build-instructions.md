# Build Instructions

## Prerequisites
- **Build Tool**: npm workspaces with TypeScript 5.8.x
- **Dependencies**: Node.js 22 LTS or newer, npm 10+, workspace package dependencies from `packages/core-model/package.json`, `packages/core-security/package.json`, `packages/core-application/package.json`, `packages/core-quality/package.json`, `packages/core-reporting/package.json`, `packages/source-angular/package.json`, `packages/adapters-ai/package.json`, `packages/transform-angular-react/package.json`, `packages/target-react/package.json`, `packages/cli/package.json`, and `packages/web/package.json`
- **Environment Variables**: None required for the current workspace
- **System Requirements**: macOS/Linux/Windows with Node.js installed, at least 2 GB free disk space

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# No environment variables are required for this workspace.
# Optional: confirm the active Node.js version.
node --version
```

### 3. Build All Units
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: TypeScript compilation completes without errors for `@spa-bridge/core-model`, `@spa-bridge/core-security`, `@spa-bridge/core-application`, `@spa-bridge/core-quality`, `@spa-bridge/core-reporting`, `@spa-bridge/source-angular`, `@spa-bridge/adapters-ai`, `@spa-bridge/transform-angular-react`, `@spa-bridge/target-react`, `@spa-bridge/cli`, and `@spa-bridge/web`
- **Build Artifacts**: `packages/core-model/dist/`, `packages/core-security/dist/`, `packages/core-application/dist/`, `packages/core-quality/dist/`, `packages/core-reporting/dist/`, `packages/source-angular/dist/`, `packages/adapters-ai/dist/`, `packages/transform-angular-react/dist/`, `packages/target-react/dist/`, `packages/cli/dist/`, `packages/web/dist/`, generated declaration files, source maps, and `tsconfig.tsbuildinfo`
- **Common Warnings**: npm workspace notices are acceptable if build output succeeds

## V2 Gap Generated Target Validation

After building SPA-Bridge, use the CLI to generate a Next.js target from an Angular repository and then validate the output:

```bash
node packages/cli/dist/bin/spa-bridge.js convert \
  --workspace /path/to/workspace \
  --input frontend-app \
  --output react-output \
  --report-format json \
  --non-interactive \
  --confirm
```

Expected generated quality artifacts:
- `.spa-bridge/quality-gate-results.json`
- `.spa-bridge/self-correction-summary.json`
- `src/review/runtime-parity-quality.json`

Expected generated enterprise parity artifacts:
- `.npmrc`
- `.npmrc.example`
- `.env.example`
- `.spa-bridge/registry-migration-summary.json`
- `.spa-bridge/script-migration-summary.json`
- `.spa-bridge/environment-contract-summary.json`
- `.spa-bridge/package-manager-parity-summary.json`
- `src/review/registry-migration-report.json`
- `src/review/script-migration-report.json`
- `src/review/environment-contract-report.json`
- `src/review/package-manager-parity-report.json`

Manual generated target validation:

```bash
cd /path/to/workspace/react-output
npm install
npm run dev
```

Use the generated package manager parity report when the source repository is not npm-based:

```bash
yarn install
yarn dev

pnpm install
pnpm dev
```

If the source project uses private Nexus/npm registries, fill the placeholders from `.npmrc.example` through local or CI secret management before running `npm install`. Do not commit raw registry credentials.

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: Missing workspace install, incompatible Node.js version, or stale local cache
- **Solution**: Re-run `npm install`, confirm Node.js 22 LTS+, and retry `npm run build`

### Build Fails with Compilation Errors
- **Cause**: Type mismatches in shared contracts, missing imports, or duplicate declarations
- **Solution**: Fix the reported TypeScript errors in the affected package `src/` tree, then rerun `npm run build`
