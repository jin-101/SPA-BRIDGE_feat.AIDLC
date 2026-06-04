import { z } from 'zod';
export type RedactedString = string;
export type SafeDisplayString = string;
export declare const REDACTED_VALUE = "[REDACTED]";
export declare const RedactedStringSchema: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
export declare const SafeDisplayStringSchema: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
export declare const createRedactedString: (reason?: string) => RedactedString;
export declare const createSafeDisplayString: (value: string) => SafeDisplayString;
export declare const isRedactedString: (value: string) => value is RedactedString;
//# sourceMappingURL=redaction.d.ts.map