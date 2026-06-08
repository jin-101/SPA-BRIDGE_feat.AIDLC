export const targetDependencyAllowlist = {
    react: '18.2.0',
    'react-dom': '18.2.0',
    'react-router-dom': '6.30.1',
    '@types/react': '18.3.12',
    '@types/react-dom': '18.3.1',
    '@types/node': '22.15.0',
    '@vitejs/plugin-react': '4.3.4',
    typescript: '5.8.3',
    vite: '5.4.11',
    '@reduxjs/toolkit': '2.2.7',
    zustand: '5.0.6',
};
export const targetStateDependencyHints = {
    service: [],
    signals: [],
    store: ['@reduxjs/toolkit'],
    local: [],
    unknown: [],
};
//# sourceMappingURL=target-dependency-allowlist.js.map