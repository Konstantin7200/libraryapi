import { Injectable } from '@nestjs/common';
import { BookBatchSize, PageSize } from '../constants';
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

  async getBooksByOlids(olids: string[]): Promise<RawSearchResult> {
    const unique = [...new Set(olids)];
    if (unique.length === 0) return { docs: [] };
    const key = `booksByOlids|${[...unique].sort().join(',')}`;
    return this.getOrRun(key, () => this._getBooksByOlids(unique));
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

  private async _getBooksByOlids(olids: string[]) {
    const docs: ApiSearchDoc[] = [];
    for (let i = 0; i < olids.length; i += BookBatchSize) {
      const chunk = olids.slice(i, i + BookBatchSize);
      const query = chunk.map((olid) => `"/works/${olid}"`).join(' OR ');
      const params = new URLSearchParams();
      params.append('q', `key:(${query})`);
      params.append('fields', 'key,title,author_name,cover_i');
      params.append('limit', chunk.length.toString());
      const response = await fetch(
        `${API_BASE}/search.json?${params.toString()}`,
      );
      const data = (await response.json()) as RawSearchResult;
      docs.push(...data.docs);
    }
    return { docs: docs.filter(apiSearchDocIsConvertible) };
  }

  private async _getAuthor(authorKey: string) {
    const response = await fetch(`${API_BASE}/authors/${authorKey}.json`);
    const data = (await response.json()) as ApiAuthor;
    return data;
  }
}

type RawSearchResult = {
  docs: ApiSearchDoc[];
};
type ApiSearchDoc = {
  key: string;
  title: string;
  author_name: string[];
  cover_i?: string | null;
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

function apiSearchDocIsConvertible(doc: ApiSearchDoc): boolean {
  return (
    Object.hasOwn(doc, 'key') &&
    Object.hasOwn(doc, 'title') &&
    Object.hasOwn(doc, 'author_name')
  );
}
