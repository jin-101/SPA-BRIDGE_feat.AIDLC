# V2 Runtime Parity Target Update Summary

## Purpose

This supplemental brownfield change aligns the generator with the runtime parity direction: Angular repositories should produce a Next.js repository that can be installed and started with `npm run dev` as the default path.

## Completed Changes

- Added `nextjs-typescript` as the default target strategy.
- Preserved `vite-react-typescript` as an explicit legacy strategy.
- Added deterministic Next.js App Router scaffold generation:
  - `package.json`
  - `next.config.mjs`
  - `tsconfig.json`
  - `next-env.d.ts`
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/providers.tsx`
  - `src/app/globals.css`
- Updated CLI and core application defaults to request Next.js output.
- Added Next.js-aware dependency manifest generation.
- Added runtime parity quality scoring through `@spa-bridge/core-quality`.
- Added generated output artifact `src/review/runtime-parity-quality.json`.
- Updated tests for Next.js default output and explicit legacy Vite output.

## Verification

- `npm run build` passed.
- `npm test` passed.

## Notes

The package name `@spa-bridge/target-react` remains unchanged for API compatibility. Its default target strategy is now Next.js App Router.
