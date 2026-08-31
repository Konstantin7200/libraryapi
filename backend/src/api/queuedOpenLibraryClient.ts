import { Injectable } from '@nestjs/common';
import { CallQueue } from './callQueue';
import {
  OpenLibraryClient,
  ApiSearchDoc,
  ApiBookByOlid,
} from './openLibraryClient';

@Injectable()
export class QueuedOpenLibraryClient {
  constructor(
    private readonly client: OpenLibraryClient,
    private readonly callQueue: CallQueue,
  ) {}

  searchBooks(
    page: number,
    q?: string,
  ): Promise<{ docs: ApiSearchDoc[]; numFound: number }> {
    return this.callQueue.push(() => this.client.searchBooks(page, q));
  }

  getRandomBooks(
    page: number,
  ): Promise<{ docs: ApiSearchDoc[]; numFound: number }> {
    return this.callQueue.push(() => this.client.getRandomBooks(page));
  }

  getBook(olid: string): Promise<ApiBookByOlid> {
    return this.callQueue.push(() => this.client.getBook(olid));
  }

  getBooksByOlids(
    olids: string[],
  ): Promise<{ docs: ApiSearchDoc[]; numFound: number }> {
    return this.callQueue.push(() => this.client.getBooksByOlids(olids));
  }
}
