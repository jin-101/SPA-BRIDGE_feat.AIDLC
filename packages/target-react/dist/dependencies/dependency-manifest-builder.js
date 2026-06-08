import { targetDependencyAllowlist } from './target-dependency-allowlist.js';
export class DependencyManifestBuilder {
    build(stateStrategy, includeRouter = true) {
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
        };
        if (stateStrategy === 'store') {
            dependencies['@reduxjs/toolkit'] = targetDependencyAllowlist['@reduxjs/toolkit'];
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
        };
        if (stateStrategy === 'store') {
            rationale['@reduxjs/toolkit'] = 'Optional store support for state conversions that require an explicit centralized store.';
        }
        return {
            dependencies,
            devDependencies,
            rationale,
        };
    }
}
//# sourceMappingURL=dependency-manifest-builder.js.map