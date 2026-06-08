#!/usr/bin/env node
import { renderTerminalOutput, runCli } from '../index.js';
const result = await runCli(process.argv.slice(2));
if (result.ok) {
    const output = renderTerminalOutput(result.value.renderModel, 'normal');
    if (output.trim().length > 0) {
        console.log(output);
    }
    process.exitCode = result.value.exitCode.code;
}
else {
    console.error(result.error.message);
    if (result.error.hint) {
        console.error(result.error.hint);
    }
    process.exitCode = result.error.code === 'PARSE_ERROR' ? 64 : 70;
}
//# sourceMappingURL=spa-bridge.js.map