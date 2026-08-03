import { Injectable } from '@nestjs/common';
import { searchBooks } from '../api/bookApi';
import { RedisCashe } from '../cashe/redisCashe';

@Injectable()
export class BooksService {
  constructor(private readonly redisCashe: RedisCashe) {}
  async findOne(olid: string) {
    const result = await this.redisCashe.getBook(olid);
    return result;
  }
  async findMany(
    page: number,
    title?: string,
    author?: string,
  ): Promise<object> {
    const data = await searchBooks(page, title, author);
    this.redisCashe.setBook('1', data[0]);
    return data;
  }
}
