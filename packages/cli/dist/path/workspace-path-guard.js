import path from 'node:path';
import { err, ok } from '@spa-bridge/core-model';
import { createCliError } from '../shared-errors.js';
const isWithin = (root, target) => {
    const relative = path.relative(root, target);
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};
const normalizeAbsolute = (cwd, input) => path.isAbsolute(input) ? path.normalize(input) : path.normalize(path.resolve(cwd, input));
export const validateWorkspacePaths = (resolved, cwd) => {
    const workspaceRoot = normalizeAbsolute(cwd, resolved.workspacePath);
    const inputPath = normalizeAbsolute(workspaceRoot, resolved.inputPath);
    const outputPath = normalizeAbsolute(workspaceRoot, resolved.outputPath);
    const configPath = resolved.configPath ? normalizeAbsolute(workspaceRoot, resolved.configPath) : undefined;
    const inputs = [
        ['workspace', workspaceRoot],
        ['input', inputPath],
        ['output', outputPath],
        ...(configPath ? [['config', configPath]] : []),
    ];
    for (const [, value] of inputs) {
        if (!isWithin(workspaceRoot, value)) {
            return err(createCliError('PATH_INVALID', `Path is outside the workspace root: ${value}`, undefined, 'Use workspace-relative paths only.'));
        }
    }
    const reportPath = path.extname(outputPath) ? outputPath : path.join(outputPath, `report.${resolved.reportFormat}`);
    return ok({
        workspaceRoot,
        inputPath,
        outputPath,
        configPath,
        reportPath,
        isContained: true,
    });
};
//# sourceMappingURL=workspace-path-guard.js.map