import type { CliExecutionMode } from '../types.js';

export class ConfirmationCoordinator {
  constructor(private readonly confirm?: (message: string) => Promise<boolean>) {}

  shouldPrompt(mode: CliExecutionMode, destructive: boolean, ambiguous: boolean): boolean {
    return mode === 'interactive' && (destructive || ambiguous);
  }

  async requestConfirmation(mode: CliExecutionMode, message: string, destructive = false, ambiguous = false): Promise<boolean> {
    if (!this.shouldPrompt(mode, destructive, ambiguous)) {
      return true;
    }

    if (!this.confirm) {
      return false;
    }

    return this.confirm(message);
  }
}
