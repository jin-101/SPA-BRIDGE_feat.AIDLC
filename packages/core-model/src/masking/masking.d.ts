import { z } from 'zod';
import { type ValidationError } from '../validation/validation.js';
import type { Result } from '../result/result.js';
export declare const MaskTokenSchema: z.ZodObject<{
    token: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    category: z.ZodString;
    originalLength: z.ZodNumber;
    restorable: z.ZodDefault<z.ZodBoolean>;
    restorationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
}, "strip", z.ZodTypeAny, {
    token: string;
    category: string;
    originalLength: number;
    restorable: boolean;
    restorationHint?: string | undefined;
}, {
    token: string;
    category: string;
    originalLength: number;
    restorable?: boolean | undefined;
    restorationHint?: string | undefined;
}>;
export type MaskToken = z.infer<typeof MaskTokenSchema>;
export declare const MaskTokenMapSchema: z.ZodObject<{
    schemaVersion: z.ZodNumber;
    tokens: z.ZodArray<z.ZodObject<{
        token: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        category: z.ZodString;
        originalLength: z.ZodNumber;
        restorable: z.ZodDefault<z.ZodBoolean>;
        restorationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        token: string;
        category: string;
        originalLength: number;
        restorable: boolean;
        restorationHint?: string | undefined;
    }, {
        token: string;
        category: string;
        originalLength: number;
        restorable?: boolean | undefined;
        restorationHint?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    schemaVersion: number;
    tokens: {
        token: string;
        category: string;
        originalLength: number;
        restorable: boolean;
        restorationHint?: string | undefined;
    }[];
}, {
    schemaVersion: number;
    tokens: {
        token: string;
        category: string;
        originalLength: number;
        restorable?: boolean | undefined;
        restorationHint?: string | undefined;
    }[];
}>;
export type MaskTokenMap = z.infer<typeof MaskTokenMapSchema>;
export declare const validateMaskTokenMap: (input: unknown) => Result<any, ValidationError>;
export declare const createMaskToken: (token: MaskToken) => MaskToken;
//# sourceMappingURL=masking.d.ts.map