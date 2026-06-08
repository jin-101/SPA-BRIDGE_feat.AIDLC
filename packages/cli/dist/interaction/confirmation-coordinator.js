export class ConfirmationCoordinator {
    confirm;
    constructor(confirm) {
        this.confirm = confirm;
    }
    shouldPrompt(mode, destructive, ambiguous) {
        return mode === 'interactive' && (destructive || ambiguous);
    }
    async requestConfirmation(mode, message, destructive = false, ambiguous = false) {
        if (!this.shouldPrompt(mode, destructive, ambiguous)) {
            return true;
        }
        if (!this.confirm) {
            return false;
        }
        return this.confirm(message);
    }
}
//# sourceMappingURL=confirmation-coordinator.js.map