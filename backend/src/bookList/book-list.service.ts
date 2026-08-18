import { Injectable } from '@nestjs/common';
import { BookListStatus, BookListStatusWithAll } from './dto/bookList.dto';
import { BookListRepository } from '../db/bookListRepository';
import { bookDto } from '../books/dto/bookDto';
import { BooksService } from '../books/books.service';
import { PageSize } from '../constants';
import { Paginated, toPaginated } from '../pagination/paginated.dto';

@Injectable()
export class BookListService {
  constructor(
    private readonly bookService: BooksService,
    private readonly bookListRepository: BookListRepository,
  ) {}
  async getBookList(
    userId: number,
    type: BookListStatusWithAll,
    page: number | 'All',
  ): Promise<Paginated<bookDto>> {
    const pagination =
      page === 'All' ? {} : { skip: (page - 1) * PageSize, take: PageSize };
    const [bookList, total] =
      type === 'All'
        ? await this.bookListRepository.getAll(userId, pagination)
        : await this.bookListRepository.getByType(userId, type, pagination);
    const books = await this.bookService.findManyByOlids(
      bookList.map((bookItem) => bookItem.bookOlid),
    );
    return toPaginated(books, total);
  }
  async addBookToList(userId: number, bookOlid: string, type: BookListStatus) {
    const result = await this.bookListRepository.upsertBookToList(
      userId,
      bookOlid,
      type,
    );
    return result;
  }
}
