export const resolveResponsiveLayout = (viewportWidth) => {
    const normalizedWidth = Number.isFinite(viewportWidth) ? Math.max(0, Math.floor(viewportWidth)) : 0;
    const mode = normalizedWidth < 720 ? 'compact' : normalizedWidth < 1200 ? 'standard' : 'wide';
    return {
        mode,
        columns: mode === 'compact' ? 1 : mode === 'standard' ? 2 : 3,
        showSidebar: mode !== 'compact',
        showDetailPane: mode === 'wide',
    };
};
//# sourceMappingURL=responsive-layout.js.map