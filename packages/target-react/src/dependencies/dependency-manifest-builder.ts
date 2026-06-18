import type { TargetDependencyManifest, TargetStateStrategy } from '../types.js';
import { targetDependencyAllowlist, targetStateDependencyHints } from './target-dependency-allowlist.js';

export class DependencyManifestBuilder {
  build(stateStrategy: TargetStateStrategy, includeRouter = true, includeReduxToolkit = stateStrategy === 'store', framework: 'nextjs' | 'vite' = 'nextjs'): TargetDependencyManifest {
    const dependencies: TargetDependencyManifest['dependencies'] = {
      react: targetDependencyAllowlist.react,
      'react-dom': targetDependencyAllowlist['react-dom'],
    };

    if (framework === 'nextjs') {
      dependencies.next = targetDependencyAllowlist.next;
    }

    if (includeRouter && framework !== 'nextjs') {
      dependencies['react-router-dom'] = targetDependencyAllowlist['react-router-dom'];
    }

    const devDependencies: TargetDependencyManifest['devDependencies'] = {
      '@types/react': targetDependencyAllowlist['@types/react'],
      '@types/react-dom': targetDependencyAllowlist['@types/react-dom'],
      '@types/node': targetDependencyAllowlist['@types/node'],
      typescript: targetDependencyAllowlist.typescript,
      less: targetDependencyAllowlist.less,
    };

    if (framework !== 'nextjs') {
      devDependencies['@vitejs/plugin-react'] = targetDependencyAllowlist['@vitejs/plugin-react'];
      devDependencies.vite = targetDependencyAllowlist.vite;
    }

    if (includeReduxToolkit) {
      dependencies['@reduxjs/toolkit'] = targetDependencyAllowlist['@reduxjs/toolkit'];
      dependencies['react-redux'] = targetDependencyAllowlist['react-redux'];
    }

    const rationale: TargetDependencyManifest['rationale'] = {
      react: 'Core UI runtime for the generated target project.',
      'react-dom': 'Browser rendering for React root mounting.',
      next: framework === 'nextjs' ? 'Next.js application framework for generated routing, page layout, and dev/build/runtime commands.' : 'Not used by this non-Next.js target strategy.',
      'react-router-dom': includeRouter && framework !== 'nextjs' ? 'Routing support for converted navigation.' : 'Next.js App Router handles generated routing for the default target.',
    '@types/react': 'TypeScript declarations for React components.',
    '@types/react-dom': 'TypeScript declarations for DOM rendering APIs.',
    '@types/node': 'TypeScript declarations for target config and Node.js tooling.',
    '@vitejs/plugin-react': framework !== 'nextjs' ? 'Vite fast refresh and JSX transform support.' : 'Not used by this Next.js target strategy.',
      typescript: 'TypeScript compiler for the generated target project.',
      vite: framework !== 'nextjs' ? 'Deterministic dev-server and build pipeline.' : 'Not used by this Next.js target strategy.',
      less: 'LESS preprocessing support for Angular component styles carried into the React target.',
    };

    if (includeReduxToolkit) {
      rationale['@reduxjs/toolkit'] = 'Redux Toolkit runtime for converted NgRx actions, reducers, selectors, effects, and entity adapters.';
      rationale['react-redux'] = 'Typed React hooks and Provider integration for converted NgRx store usage.';
    }

    return {
      dependencies,
      devDependencies,
      rationale,
    };
  }
}
