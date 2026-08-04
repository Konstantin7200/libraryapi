import { Injectable } from '@nestjs/common';
import { searchBooks } from '../api/bookApi';
import { RedisCashe } from '../cashe/redisCashe';
import { MemoryCashe } from '../cashe/memoryCashe';

@Injectable()
export class BooksService {
  constructor(
    private readonly redisCashe: RedisCashe,
    private readonly memoryCashe: MemoryCashe,
  ) {}
  async findOne(olid: string) {
    const result = await this.redisCashe.getBook(olid);
    return result;
  }
  async findMany(
    page: number,
    title?: string,
    author?: string,
  ): Promise<object> {
    const cachedData = this.memoryCashe.getBooks(
      createQuery(page, title, author),
    );
    console.log(createQuery(page, title, author));
    if (cachedData !== null) return cachedData;
    const data = await searchBooks(page, title, author);
    this.memoryCashe.setBooks(createQuery(page, title, author), data);
    return data;
  }
}
const createQuery = (page: number, title?: string, author?: string) =>
  `${page}|${title || ''}|${author || ''}`;
