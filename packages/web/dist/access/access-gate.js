export const isTabVisible = (access, tab) => access.allowedTabs.includes(tab);
export const isActionAllowed = (access, actionId) => access.allowedActions.includes(actionId);
export const hasReviewAccess = (access) => access.decision.decision === 'allow';
//# sourceMappingURL=access-gate.js.map