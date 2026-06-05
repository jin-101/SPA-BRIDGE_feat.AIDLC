import type { Result } from '@spa-bridge/core-model';

import type { QualityError } from '../shared-errors.js';
import type { QualityRequest } from '../types.js';
import { QualityRequestValidator } from './quality-request-validator.js';

export class ValidationGuard {
  constructor(private readonly validator = new QualityRequestValidator()) {}

  validate(input: unknown): Result<QualityRequest, QualityError> {
    return this.validator.validate(input);
  }
}

