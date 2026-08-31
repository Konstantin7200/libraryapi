import { Injectable } from '@nestjs/common';
import NodeCache from 'node-cache';
import { BookDto, ExtendedBookDto } from '../books/dto/bookDto';
import { MEMORY_CACHE_TTL_SEC } from '../constants';

@Injectable()
export class MemoryCashe {
  constructor(private readonly cache: NodeCache) {}
  setBooks(query: string, books: BookDto[]) {
    this.cache.set(query, books, MEMORY_CACHE_TTL_SEC);
  }
  getBooks(query: string) {
    const result = this.cache.get(query);
    if (unknownIsBookArray(result)) return result;
    return null;
  }
  getBook(query: string) {
    const result: ExtendedBookDto | null | undefined = this.cache.get(query);
    return result;
  }
  setBook(query: string, book: ExtendedBookDto) {
    this.cache.set(query, book, MEMORY_CACHE_TTL_SEC);
  }
  getRaw<T>(key: string): T | null {
    const result = this.cache.get<T>(key);
    if (result === undefined) return null;
    return result;
  }
  setRaw<T>(key: string, value: T) {
    this.cache.set(key, value, MEMORY_CACHE_TTL_SEC);
  }
}

function unknownIsBook(raw: unknown): raw is BookDto {
  if (typeof raw != 'object' || raw === null) return false;
  if (
    Object.hasOwn(raw, 'olid') &&
    Object.hasOwn(raw, 'title') &&
    Object.hasOwn(raw, 'authors') &&
    Object.hasOwn(raw, 'coversUrl')
  )
    return true;
  return false;
}
function unknownIsBookArray(raw: unknown): raw is BookDto[] {
  if (Array.isArray(raw)) return unknownIsBook(raw[0]);
  return false;
}
