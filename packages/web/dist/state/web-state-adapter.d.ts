import { type Result } from '@spa-bridge/core-model';
import type { WebReviewInput, WebReviewState, WebAccessState } from '../types.js';
import { type WebUiError } from '../shared-errors.js';
export declare const buildWebReviewState: (input: WebReviewInput) => Result<WebReviewState, WebUiError>;
export declare const createWebReviewStateOrThrow: (input: WebReviewInput) => WebReviewState;
export declare const buildWebReviewAccess: (input: WebReviewInput) => Result<WebAccessState, WebUiError>;
//# sourceMappingURL=web-state-adapter.d.ts.map