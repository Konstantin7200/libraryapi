import { Injectable } from '@nestjs/common';
import {
  BookListItemDto,
  BookListStatus,
  BookListStatusWithAll,
} from './dto/bookList.dto';
import { BookListRepository } from '../db/bookListRepository';
import { bookDto } from '../books/dto/bookDto';
import { BooksService } from '../books/books.service';

@Injectable()
export class BookListService {
  constructor(
    private readonly bookService: BooksService,
    private readonly bookListRepository: BookListRepository,
  ) {}
  async getBookList(
    userId: number,
    type: BookListStatusWithAll,
  ): Promise<bookDto[]> {
    let bookList: BookListItemDto[] = [];
    if (type === 'All') {
      bookList = await this.bookListRepository.getAll(userId);
    } else {
      bookList = await this.bookListRepository.getByType(userId, type);
    }
    const books: bookDto[] = [];
    for (let i = 0; i < bookList.length; i++) {
      const book = await this.bookService.findOne(bookList[i].bookOlid);
      books.push(book);
    }
    return books;
  }
  async addBookToList(userId: number, bookOlid: string, type: BookListStatus) {
    const result = await this.bookListRepository.addBookToList(
      userId,
      bookOlid,
      type,
    );
    return result;
  }
}
