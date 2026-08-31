import { Injectable } from '@nestjs/common';
import { QueuedOpenLibraryClient } from './queuedOpenLibraryClient';
import { MemoryCashe } from '../cashe/memoryCashe';
import type { ApiSearchDoc } from './openLibraryClient';

export type { ApiSearchDoc, ApiBookByOlid } from './openLibraryClient';

@Injectable()
export class BookApi {
  private readonly inFlight = new Map<string, Promise<unknown>>();

  constructor(
    private readonly queuedClient: QueuedOpenLibraryClient,
    private readonly memoryCashe: MemoryCashe,
  ) {}

  async searchBooks(page: number, q?: string) {
    return this.getOrRun(`search|${page}|${q || ''}|`, () =>
      this.queuedClient.searchBooks(page, q),
    );
  }

  async getRandomBooks(page: number) {
    return this.getOrRun(`getRandom|${page}`, () =>
      this.queuedClient.getRandomBooks(page),
    );
  }

  async getBook(olid: string) {
    return this.getOrRun(`book|${olid}`, () => this.queuedClient.getBook(olid));
  }

  async getBooksByOlids(
    olids: string[],
  ): Promise<{ docs: ApiSearchDoc[]; numFound: number }> {
    const unique = [...new Set(olids)];
    if (unique.length === 0) return { docs: [], numFound: 0 };
    const key = `booksByOlids|${[...unique].sort().join(',')}`;
    return this.getOrRun(key, () => this.queuedClient.getBooksByOlids(unique));
  }

  private getOrRun<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = this.memoryCashe.getRaw<T>(key);
    if (cached !== null) return Promise.resolve(cached);

    const existing = this.inFlight.get(key);
    if (existing) return existing as Promise<T>;

    const promise = fetchFn()
      .then((result) => {
        this.memoryCashe.setRaw(key, result);
        return result;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });
    this.inFlight.set(key, promise);
    return promise;
  }
}
