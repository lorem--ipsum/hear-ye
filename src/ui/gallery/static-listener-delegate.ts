type Listener<T> = (value: T) => void;

export class StaticListenerDelegate<T> {
  private listeners: Listener<T>[] = [];

  add(listener: Listener<T>) {
    this.listeners.push(listener);
  }

  remove(listener: Listener<T>) {
    const index = this.listeners.indexOf(listener);

    if (index === -1) return;

    this.listeners = this.listeners.filter((_w, i) => i !== index);
  }

  dispatch(value: T) {
    this.listeners.forEach(cb => cb(value));
  }
}
