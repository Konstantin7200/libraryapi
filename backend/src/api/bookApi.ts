import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BookBatchSize, PageSize } from '../constants';
import { CallQueue } from './callQueue';
import { MemoryCashe } from '../cashe/memoryCashe';

const API_BASE = 'https://openlibrary.org/';
const openLibrary = axios.create({ baseURL: API_BASE });

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
  async getRandomBooks(page: number) {
    return this.getOrRun(`getRandom|${page}`, () => this._getRandomBooks(page));
  }

  async getBook(olid: string) {
    return this.getOrRun(`book|${olid}`, () => this._getBook(olid));
  }

  async getBooksByOlids(olids: string[]): Promise<RawSearchResult> {
    const unique = [...new Set(olids)];
    if (unique.length === 0) return { docs: [], numFound: 0 };
    const key = `booksByOlids|${[...unique].sort().join(',')}`;
    return this.getOrRun(key, () => this._getBooksByOlids(unique));
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
    const params: Record<string, string> = {
      page: page.toString(),
      limit: PageSize.toString(),
    };
    if (q != undefined && q !== '') params['q'] = q;
    const { data } = await openLibrary.get<RawSearchResult>('/search.json', {
      params,
    });
    return data;
  }
  private async _getRandomBooks(page: number) {
    const { data } = await openLibrary.get<RawSearchResult>('/search.json', {
      params: {
        q: 'book',
        sort: 'random',
        page: page.toString(),
        limit: PageSize.toString(),
        fields: 'key,title,author_name,cover_i',
      },
    });
    return data;
  }

  private async _getBook(olid: string) {
    const { data } = await openLibrary.get<RawSearchResult>('/search.json', {
      params: {
        q: `key:("/works/${olid}")`,
        fields: 'key,title,author_name,cover_i,description',
        limit: '1',
      },
    });
    const book = data.docs.find((doc) => apiSearchDocIsConvertible(doc));
    if (!book) throw new Error(`Book with olid ${olid} not found`);
    return book as ApiBookByOlid;
  }

  private async _getBooksByOlids(olids: string[]) {
    const docs: ApiSearchDoc[] = [];
    for (let i = 0; i < olids.length; i += BookBatchSize) {
      const chunk = olids.slice(i, i + BookBatchSize);
      const query = chunk.map((olid) => `"/works/${olid}"`).join(' OR ');
      const { data } = await openLibrary.get<RawSearchResult>('/search.json', {
        params: {
          q: `key:(${query})`,
          fields: 'key,title,author_name,cover_i',
          limit: chunk.length.toString(),
        },
      });
      docs.push(...data.docs);
    }
    const filtered = docs.filter(apiSearchDocIsConvertible);
    return { docs: filtered, numFound: filtered.length };
  }
}

type RawSearchResult = {
  docs: ApiSearchDoc[];
  numFound: number;
};
type ApiSearchDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: string | null;
};
type ApiBookByOlid = {
  title: string;
  description?: string | { value: string };
  author_name?: string[];
  cover_i?: number | string | null;
};

function apiSearchDocIsConvertible(doc: ApiSearchDoc): boolean {
  return Object.hasOwn(doc, 'key') && Object.hasOwn(doc, 'title');
}
