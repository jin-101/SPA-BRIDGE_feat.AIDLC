import type { WebAccessState, WebReviewTab } from '../types.js';
export declare const isTabVisible: (access: WebAccessState, tab: WebReviewTab) => boolean;
export declare const isActionAllowed: (access: WebAccessState, actionId: string) => boolean;
export declare const hasReviewAccess: (access: WebAccessState) => boolean;
//# sourceMappingURL=access-gate.d.ts.map