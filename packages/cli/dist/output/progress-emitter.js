export class ProgressEmitter {
    events = [];
    emit(event) {
        this.events.push(event);
    }
    snapshot() {
        return [...this.events];
    }
}
//# sourceMappingURL=progress-emitter.js.map