import fc from 'fast-check';
import type { CliCommandName, CliReportFormat, CliVerbosity } from '../types.js';
export declare const argvArbitrary: fc.Arbitrary<string[]>;
export declare const commandRequestArbitrary: fc.Arbitrary<{
    commandName: CliCommandName;
    rawArgv: string[];
    args: string[];
    options: {
        workspacePath: string | undefined;
        inputPath: string | undefined;
        outputPath: string | undefined;
        configPath: string | undefined;
        reportFormat: CliReportFormat | undefined;
        verbosity: CliVerbosity | undefined;
        interactive: boolean | undefined;
        dryRun: boolean | undefined;
        runId: string | undefined;
        confirm: boolean | undefined;
    };
}>;
export declare const workspacePathArbitrary: fc.Arbitrary<{
    root: string;
    child: string;
}>;
export declare const outputModeArbitrary: fc.Arbitrary<CliVerbosity>;
export declare const exitOutcomeArbitrary: fc.Arbitrary<"success" | "review" | "usage" | "validation" | "runtime">;
//# sourceMappingURL=generators.d.ts.map