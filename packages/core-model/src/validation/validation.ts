import { z } from 'zod';

import { err, ok, type Result } from '../result/result.js';

export type ValidationIssue = {
  path: Array<string | number>;
  code: string;
  message: string;
};

export type ValidationError = {
  name: 'ValidationError';
  message: string;
  issues: ValidationIssue[];
};

export const createValidationError = (issues: ValidationIssue[]): ValidationError => ({
  name: 'ValidationError',
  message: 'Validation failed',
  issues,
});

export const validateSchema = <T>(schema: z.ZodType<T>, input: unknown): Result<T, ValidationError> => {
  const result = schema.safeParse(input);

  if (result.success) {
    return ok(result.data);
  }

  return err(
    createValidationError(
      result.error.issues.map((issue) => ({
        path: issue.path,
        code: issue.code,
        message: issue.message,
      })),
    ),
  );
};

export const parseSchema = <T>(schema: z.ZodType<T>, input: unknown): Result<T, ValidationError> =>
  validateSchema(schema, input);
