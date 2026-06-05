# Build Instructions

## Prerequisites
- **Build Tool**: npm workspaces with TypeScript 5.8.x
- **Dependencies**: Node.js 22 LTS or newer, npm 10+, workspace package dependencies from `packages/core-model/package.json`, `packages/core-application/package.json`, and `packages/source-angular/package.json`
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
- **Expected Output**: TypeScript compilation completes without errors for `@spa-bridge/core-model`, `@spa-bridge/core-application`, and `@spa-bridge/source-angular`
- **Build Artifacts**: `packages/core-model/dist/`, `packages/core-application/dist/`, `packages/source-angular/dist/`, generated declaration files, source maps, and `tsconfig.tsbuildinfo`
- **Common Warnings**: npm workspace notices are acceptable if build output succeeds

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: Missing workspace install, incompatible Node.js version, or stale local cache
- **Solution**: Re-run `npm install`, confirm Node.js 22 LTS+, and retry `npm run build`

### Build Fails with Compilation Errors
- **Cause**: Type mismatches in shared contracts, missing imports, or duplicate declarations
- **Solution**: Fix the reported TypeScript errors in `packages/core-model/src/` or `packages/core-application/src/`, then rerun `npm run build`
