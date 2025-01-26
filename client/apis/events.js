export class APIClientAppEventEmitter {
  constructor() {
    this.listeners = {};
  }

  emit(name, data) {
    if (this.listeners[name]) {
      this.listeners[name].forEach(callback => callback(data));
    }
  }

  on(name, callback) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(callback);
  }

  off(name, callback) {
    if (this.listeners[name]) {
      this.listeners[name] = this.listeners[name].filter(cb => cb !== callback);
    }
  }
}