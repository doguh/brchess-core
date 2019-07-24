export interface IStateHistory<T> {
  numPrev: number;
  numNext: number;
  push(state: T): void;
  goPrev(): T;
  goNext(): T;
  goLast(): T;
  get(i: number): T;
}

type StateHistorySubscriber<T> = (state: T) => void;

export interface IStateHistoryEmitter<T> extends IStateHistory<T> {
  subscribe: (callback: StateHistorySubscriber<T>) => void;
  unsubscribe: (callback: StateHistorySubscriber<T>) => void;
}

export default class StateHistory<T> implements IStateHistory<T> {
  public maxLength: number;

  private past: T[] = [];
  private present: T = null;
  private future: T[] = [];

  constructor(maxLength: number = 50) {
    this.maxLength = maxLength;
  }

  get numPrev(): number {
    return this.past.length;
  }

  get numNext(): number {
    return this.future.length;
  }

  push(state: T): void {
    if (this.present) this.past.push(this.present);
    this.present = state;
    if (this.future.length) this.future = [];
    if (this.past.length > this.maxLength) {
      this.past.splice(0, this.past.length - this.maxLength);
    }
  }

  goPrev(): T {
    const newPresent = this.past.pop();
    this.future.splice(0, 0, this.present);
    this.present = newPresent;
    return this.present;
  }

  goNext(): T {
    const newPresent = this.future.shift();
    this.past.push(this.present);
    this.present = newPresent;
    return this.present;
  }

  goLast(): T {
    const newPresent = this.future.pop();
    this.past.push(...this.future);
    this.present = newPresent;
    return this.present;
  }

  get(i: number): T {
    if (i === 0) {
      return this.present;
    }
    if (i > 0) {
      return this.future[i - 1];
    } else {
      return this.past[this.past.length + i];
    }
  }
}

export class StateHistoryEmitter<T> extends StateHistory<T>
  implements IStateHistoryEmitter<T> {
  private subscribers: StateHistorySubscriber<T>[] = [];

  subscribe(callback: StateHistorySubscriber<T>): void {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: StateHistorySubscriber<T>): void {
    const index: number = this.subscribers.indexOf(callback);
    if (~index) {
      this.subscribers.splice(index, 1);
    }
  }

  private emit(state: T): void {
    this.subscribers.forEach(callback => callback(state));
  }

  push(state: T): void {
    super.push(state);
    this.emit(state);
  }

  goPrev(): T {
    const state = super.goPrev();
    this.emit(state);
    return state;
  }

  goNext(): T {
    const state = super.goNext();
    this.emit(state);
    return state;
  }

  goLast(): T {
    const state = super.goLast();
    this.emit(state);
    return state;
  }
}
