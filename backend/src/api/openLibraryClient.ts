import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { BookBatchSize, PageSize } from '../constants';

const API_BASE = 'https://openlibrary.org/';
const openLibrary = axios.create({ baseURL: API_BASE });

type RawSearchResult = {
  docs: RawApiSearchDoc[];
  numFound: number;
};
type RawApiSearchDoc = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: string | null;
};
type RawApiBookByOlid = {
  title: string;
  description?: string | { value: string };
  author_name?: string[];
  cover_i?: number | string | null;
};

export type ApiSearchDoc = {
  key: string;
  title: string;
  authorName?: string[];
  coverId?: string | null;
};
export type ApiBookByOlid = {
  title: string;
  description?: string | { value: string };
  authorName?: string[];
  coverId?: number | string | null;
};

function mapSearchDoc(doc: RawApiSearchDoc): ApiSearchDoc {
  return {
    key: doc.key,
    title: doc.title,
    authorName: doc.author_name,
    coverId: doc.cover_i,
  };
}

function mapBookByOlid(doc: RawApiBookByOlid): ApiBookByOlid {
  return {
    title: doc.title,
    description: doc.description,
    authorName: doc.author_name,
    coverId: doc.cover_i,
  };
}

function apiSearchDocIsConvertible(doc: ApiSearchDoc): boolean {
  return Object.hasOwn(doc, 'key') && Object.hasOwn(doc, 'title');
}

@Injectable()
export class OpenLibraryClient {
  async searchBooks(
    page: number,
    q?: string,
  ): Promise<{ docs: ApiSearchDoc[]; numFound: number }> {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: PageSize.toString(),
    };
    if (q != undefined && q !== '') params['q'] = q;
    const { data } = await openLibrary.get<RawSearchResult>('/search.json', {
      params,
    });
    return {
      docs: data.docs.map(mapSearchDoc),
      numFound: data.numFound,
    };
  }

  async getRandomBooks(
    page: number,
  ): Promise<{ docs: ApiSearchDoc[]; numFound: number }> {
    const { data } = await openLibrary.get<RawSearchResult>('/search.json', {
      params: {
        q: 'book',
        sort: 'random',
        page: page.toString(),
        limit: PageSize.toString(),
        fields: 'key,title,author_name,cover_i',
      },
    });
    return {
      docs: data.docs.map(mapSearchDoc),
      numFound: data.numFound,
    };
  }

  async getBook(olid: string): Promise<ApiBookByOlid> {
    const { data } = await openLibrary.get<RawSearchResult>('/search.json', {
      params: {
        q: `key:("/works/${olid}")`,
        fields: 'key,title,author_name,cover_i,description',
        limit: '1',
      },
    });
    const book = data.docs.find((doc) => apiSearchDocIsConvertible(doc));
    if (!book) {
      throw new NotFoundException(`Book with olid ${olid} was not found`);
    }
    return mapBookByOlid(book);
  }

  async getBooksByOlids(
    olids: string[],
  ): Promise<{ docs: ApiSearchDoc[]; numFound: number }> {
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
      docs.push(...data.docs.map(mapSearchDoc));
    }
    const filtered = docs.filter(apiSearchDocIsConvertible);
    return { docs: filtered, numFound: filtered.length };
  }
}
