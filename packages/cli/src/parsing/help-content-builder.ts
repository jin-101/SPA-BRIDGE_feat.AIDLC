import type { CliHelpContent } from '../types.js';

export const buildHelpContent = (): CliHelpContent => ({
  usage: [
    'spa-bridge <command> [options]',
    '',
    'Commands:',
    '  convert   Run a conversion workflow',
    '  validate  Validate workspace and configuration',
    '  report    Generate or export a report',
    '  help      Show usage and command information',
  ].join('\n'),
  commands: [
    { name: 'convert', summary: 'Run a conversion workflow.' },
    { name: 'validate', summary: 'Validate workspace and configuration.' },
    { name: 'report', summary: 'Generate or export a report.' },
    { name: 'help', summary: 'Show help and usage information.' },
  ],
  flags: [
    { flag: '--workspace <path>', description: 'Set the workspace root.' },
    { flag: '--input <path>', description: 'Set the input source path.' },
    { flag: '--output <path>', description: 'Set the output path.' },
    { flag: '--config <path>', description: 'Set the configuration file path.' },
    { flag: '--report-format <json|markdown|html>', description: 'Choose the export format.' },
    { flag: '--quiet', description: 'Reduce terminal output.' },
    { flag: '--verbose', description: 'Increase terminal output.' },
    { flag: '--interactive', description: 'Enable confirmations for ambiguous operations.' },
    { flag: '--non-interactive', description: 'Disable confirmations for automation.' },
  ],
  examples: [
    'spa-bridge convert --workspace . --input src --output dist',
    'spa-bridge validate --workspace .',
    'spa-bridge report --workspace . --report-format markdown --output reports/report.md',
  ],
});
