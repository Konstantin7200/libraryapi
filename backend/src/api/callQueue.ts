import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OPEN_LIBRARY_QUEUE_LIMIT, OPEN_LIBRARY_GAP_MS } from '../constants';

interface QueuedTask {
  fn: () => unknown;
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

@Injectable()
export class CallQueue {
  private callQueue: QueuedTask[] = [];
  private running = false;

  push<T>(fn: () => T | Promise<T>, bypasss?: true): Promise<T> {
    if (this.callQueue.length > OPEN_LIBRARY_QUEUE_LIMIT && !bypasss) {
      throw new HttpException(
        'Service temporarily unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    return new Promise<T>((resolve, reject) => {
      this.callQueue.push({
        fn,
        resolve: (value: unknown) => resolve(value as T),
        reject,
      });
      void this.execute();
    });
  }

  execute() {
    if (this.running || this.callQueue.length === 0) return;
    this.running = true;

    const { fn, resolve, reject } = this.callQueue.shift()!;
    void Promise.resolve(fn()).then(resolve, reject);

    setTimeout(() => {
      this.running = false;
      void this.execute();
    }, OPEN_LIBRARY_GAP_MS);
  }
}
