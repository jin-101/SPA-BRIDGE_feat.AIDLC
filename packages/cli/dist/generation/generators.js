import fc from 'fast-check';
const commandNameArbitrary = fc.constantFrom('convert', 'validate', 'report', 'help');
const verbosityArbitrary = fc.constantFrom('quiet', 'normal', 'verbose');
const reportFormatArbitrary = fc.constantFrom('json', 'markdown', 'html');
export const argvArbitrary = fc.array(fc.string(), { minLength: 0, maxLength: 12 });
export const commandRequestArbitrary = fc.record({
    commandName: commandNameArbitrary,
    rawArgv: argvArbitrary,
    args: fc.array(fc.string(), { maxLength: 6 }),
    options: fc.record({
        workspacePath: fc.option(fc.string({ minLength: 1, maxLength: 32 }), { nil: undefined }),
        inputPath: fc.option(fc.string({ minLength: 1, maxLength: 32 }), { nil: undefined }),
        outputPath: fc.option(fc.string({ minLength: 1, maxLength: 32 }), { nil: undefined }),
        configPath: fc.option(fc.string({ minLength: 1, maxLength: 32 }), { nil: undefined }),
        reportFormat: fc.option(reportFormatArbitrary, { nil: undefined }),
        verbosity: fc.option(verbosityArbitrary, { nil: undefined }),
        interactive: fc.option(fc.boolean(), { nil: undefined }),
        dryRun: fc.option(fc.boolean(), { nil: undefined }),
        runId: fc.option(fc.string({ minLength: 1, maxLength: 32 }), { nil: undefined }),
        confirm: fc.option(fc.boolean(), { nil: undefined }),
    }),
});
export const workspacePathArbitrary = fc
    .tuple(fc.stringMatching(/^[a-zA-Z0-9_-]{1,12}$/), fc.stringMatching(/^[a-zA-Z0-9_-]{1,12}$/))
    .map(([root, child]) => ({ root, child }));
export const outputModeArbitrary = verbosityArbitrary;
export const exitOutcomeArbitrary = fc.constantFrom('success', 'review', 'usage', 'validation', 'runtime');
//# sourceMappingURL=generators.js.map