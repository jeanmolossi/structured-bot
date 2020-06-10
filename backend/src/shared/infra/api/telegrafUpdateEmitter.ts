class TelegrafUpdateEmitter {
  private observers: object;

  constructor() {
    this.observers = {};
  }

  public on(events: string, callback: Function): object {
    events.split(' ').forEach(event => {
      this.observers[event] = this.observers[events] || [];
      this.observers[event].push(callback);
    });
    return this;
  }

  public off(event: string, listener?: Function): void {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }

    this.observers[event] = this.observers[event].filter(
      (observerListener: Function) => observerListener !== listener,
    );
  }

  public emit(event: string, ...args): void {
    // eslint-disable-next-line no-console
    console.log(
      `EMITTER SAYS >> ${event} >>  shared/infra/api/telegrafUpdateEmitter`,
    );
    if (this.observers[event]) {
      const cloned = [].concat(this.observers[event]);
      cloned.forEach(observer => observer(...args));
    }

    if (this.observers['*']) {
      const cloned = [].concat(this.observers['*']);
      cloned.forEach(observer => observer.apply(observer, [event, ...args]));
    }
  }
}

export default new TelegrafUpdateEmitter();
