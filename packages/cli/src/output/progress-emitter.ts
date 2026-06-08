import type { CliProgressEvent } from '../types.js';

export class ProgressEmitter {
  private readonly events: CliProgressEvent[] = [];

  emit(event: CliProgressEvent): void {
    this.events.push(event);
  }

  snapshot(): CliProgressEvent[] {
    return [...this.events];
  }
}
