import type { CliExitCode, CliOutcomeCategory } from '../types.js';

export const EXIT_CODE_TABLE: Record<CliOutcomeCategory, CliExitCode> = {
  success: {
    code: 0,
    category: 'success',
    description: 'Command completed successfully.',
  },
  review: {
    code: 80,
    category: 'review',
    description: 'Command completed with review items.',
  },
  usage: {
    code: 64,
    category: 'usage',
    description: 'Command usage or parsing failed.',
  },
  validation: {
    code: 65,
    category: 'validation',
    description: 'Validation failed before execution.',
  },
  runtime: {
    code: 70,
    category: 'runtime',
    description: 'Runtime failure occurred during execution.',
  },
};

export const mapExitCode = (category: CliOutcomeCategory): CliExitCode => EXIT_CODE_TABLE[category];
