import { targetDependencyAllowlist } from './target-dependency-allowlist.js';
export class DependencyManifestBuilder {
    build(stateStrategy, includeRouter = true, includeReduxToolkit = stateStrategy === 'store') {
        const dependencies = {
            react: targetDependencyAllowlist.react,
            'react-dom': targetDependencyAllowlist['react-dom'],
        };
        if (includeRouter) {
            dependencies['react-router-dom'] = targetDependencyAllowlist['react-router-dom'];
        }
        const devDependencies = {
            '@types/react': targetDependencyAllowlist['@types/react'],
            '@types/react-dom': targetDependencyAllowlist['@types/react-dom'],
            '@types/node': targetDependencyAllowlist['@types/node'],
            '@vitejs/plugin-react': targetDependencyAllowlist['@vitejs/plugin-react'],
            typescript: targetDependencyAllowlist.typescript,
            vite: targetDependencyAllowlist.vite,
            less: targetDependencyAllowlist.less,
        };
        if (includeReduxToolkit) {
            dependencies['@reduxjs/toolkit'] = targetDependencyAllowlist['@reduxjs/toolkit'];
            dependencies['react-redux'] = targetDependencyAllowlist['react-redux'];
        }
        const rationale = {
            react: 'Core UI runtime for the generated target project.',
            'react-dom': 'Browser rendering for React root mounting.',
            'react-router-dom': includeRouter ? 'Routing support for converted navigation.' : 'Optional routing support not required by the current generation request.',
            '@types/react': 'TypeScript declarations for React components.',
            '@types/react-dom': 'TypeScript declarations for DOM rendering APIs.',
            '@types/node': 'TypeScript declarations for Vite config and Node.js tooling.',
            '@vitejs/plugin-react': 'Vite fast refresh and JSX transform support.',
            typescript: 'TypeScript compiler for the generated target project.',
            vite: 'Deterministic dev-server and build pipeline.',
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
//# sourceMappingURL=dependency-manifest-builder.js.map