import { z } from 'zod';
import { type Result } from '../result/result.js';
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
export declare const createValidationError: (issues: ValidationIssue[]) => ValidationError;
export declare const validateSchema: <T>(schema: z.ZodType<T>, input: unknown) => Result<T, ValidationError>;
export declare const parseSchema: <T>(schema: z.ZodType<T>, input: unknown) => Result<T, ValidationError>;
//# sourceMappingURL=validation.d.ts.map