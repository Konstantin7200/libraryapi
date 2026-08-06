import { Injectable } from '@nestjs/common';
import NodeCache from 'node-cache';
import { bookDto } from '../books/dto/bookDto';
import { MemoryCacheTtl } from '../constants';

@Injectable()
export class MemoryCashe {
  constructor(private readonly cache: NodeCache) {}
  setBooks(query: string, books: bookDto[]) {
    this.cache.set(query, books, MemoryCacheTtl);
  }
  getBooks(query: string) {
    const result = this.cache.get(query);
    if (unknownIsBookArray(result)) return result;
    return null;
  }
}

function unknownIsBook(raw: unknown): raw is bookDto {
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
function unknownIsBookArray(raw: unknown): raw is bookDto[] {
  if (Array.isArray(raw)) return unknownIsBook(raw[0]);
  return false;
}
