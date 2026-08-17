import { Injectable } from '@nestjs/common';
import { PageSize } from '../constants';
import { CallQueue } from './callQueue';
import { MemoryCashe } from '../cashe/memoryCashe';

const API_BASE = 'https://openlibrary.org/';

@Injectable()
export class BookApi {
  private readonly inFlight = new Map<string, Promise<unknown>>();

  constructor(
    private callQueue: CallQueue,
    private memoryCashe: MemoryCashe,
  ) {}

  async searchBooks(page: number, q?: string) {
    return this.getOrRun(`search|${page}|${q || ''}|`, () =>
      this._searchBooks(page, q),
    );
  }

  async getBook(olid: string) {
    return this.getOrRun(`book|${olid}`, () => this._getBook(olid));
  }

  async getAuthor(authorKey: string) {
    return this.getOrRun(
      `author|${authorKey}`,
      () => this._getAuthor(authorKey),
      true,
    );
  }

  private getOrRun<T>(
    key: string,
    fetchFn: () => Promise<T>,
    bypass?: true,
  ): Promise<T> {
    const cached = this.memoryCashe.getRaw<T>(key);
    if (cached !== null) return Promise.resolve(cached);

    const existing = this.inFlight.get(key);
    if (existing) return existing as Promise<T>;

    const promise = this.callQueue
      .push(fetchFn, bypass)
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

  private async _searchBooks(page: number, q?: string) {
    const params = new URLSearchParams();
    addParamIfNotEmpty(params, 'q', q?.toString());
    addParamIfNotEmpty(params, 'page', page.toString());
    addParamIfNotEmpty(params, 'limit', PageSize.toString());
    const response = await fetch(
      `${API_BASE}/search.json?${params.toString()}`,
    );
    const data = (await response.json()) as RawSearchResult;
    return data;
  }

  private async _getBook(olid: string) {
    const response = await fetch(`${API_BASE}/works/${olid}.json`);
    const data = (await response.json()) as ApiBookByOlid;
    return data;
  }

  private async _getAuthor(authorKey: string) {
    const response = await fetch(`${API_BASE}/authors/${authorKey}.json`);
    const data = (await response.json()) as ApiAuthor;
    return data;
  }
}

type RawSearchResult = {
  docs: object[];
};
type ApiBookByOlid = {
  description: {
    value: string;
  };
  title: string;
  authors: [
    {
      author: {
        key: string;
      };
    },
  ];
  covers: number[];
};
type ApiAuthor = {
  personal_name: string;
};

function addParamIfNotEmpty(
  params: URLSearchParams,
  property: string,
  value: string | undefined,
) {
  if (value != undefined && value !== '') params.append(property, value);
}
