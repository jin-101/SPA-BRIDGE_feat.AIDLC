import { type Result } from '@spa-bridge/core-model';
import type { WebComponentRenderModel, WebReviewInput, WebReviewState, WebRenderDocument } from '../types.js';
import { type WebUiError } from '../shared-errors.js';
export type WebUiGenerationResult = {
    state: WebReviewState;
    renderDocument: WebRenderDocument;
    panels: WebComponentRenderModel[];
};
export declare const generateWebUiReviewWorkflow: (input: WebReviewInput) => Result<WebUiGenerationResult, WebUiError>;
export declare const createRenderDocument: (state: WebReviewState, panels: WebComponentRenderModel[]) => WebRenderDocument;
export declare const createWebReviewFailure: (message: string, detail?: string) => WebUiError;
//# sourceMappingURL=web-ui-service.d.ts.map