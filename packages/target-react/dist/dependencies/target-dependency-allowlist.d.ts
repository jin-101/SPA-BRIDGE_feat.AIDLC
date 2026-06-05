import type { TargetStateStrategy } from '../types.js';
export declare const targetDependencyAllowlist: {
    readonly react: "18.2.0";
    readonly 'react-dom': "18.2.0";
    readonly 'react-router-dom': "6.30.1";
    readonly '@types/react': "18.3.12";
    readonly '@types/react-dom': "18.3.1";
    readonly '@vitejs/plugin-react': "4.3.4";
    readonly typescript: "5.8.3";
    readonly vite: "5.4.11";
    readonly '@reduxjs/toolkit': "2.2.7";
    readonly zustand: "5.0.6";
};
export declare const targetStateDependencyHints: Record<TargetStateStrategy, readonly string[]>;
//# sourceMappingURL=target-dependency-allowlist.d.ts.map