import { Injectable } from '@nestjs/common';
import { BookListStatusWithAll } from '../bookList/dto/bookList.dto';
import { LikesService } from '../likes/likes.service';
import { BookListService } from '../bookList/book-list.service';
import { bookDto } from '../books/dto/bookDto';
import { PageSize } from '../constants';
import { Paginated, toPaginated } from '../pagination/paginated.dto';

@Injectable()
export class MixedListService {
  constructor(
    private readonly likesService: LikesService,
    private readonly bookListService: BookListService,
  ) {}
  async getMixedList(
    userId: number,
    page: number,
    type?: BookListStatusWithAll,
    liked?: boolean,
    query?: string,
  ): Promise<Paginated<bookDto>> {
    const books = await this.getBooks(userId, type, liked);
    if (query === undefined) {
      return toPaginated(
        books.slice((page - 1) * PageSize, page * PageSize),
        books.length,
      );
    }
    query = query.toLowerCase();
    const filteredBooks = books.filter((book) => this.filterBook(book, query));
    return toPaginated(
      filteredBooks.slice((page - 1) * PageSize, page * PageSize),
      filteredBooks.length,
    );
  }
  private filterBook(book: bookDto, query: string): boolean {
    if (book.authors.find((author) => author.toLowerCase().includes(query)))
      return true;
    if (book.title.toLowerCase().includes(query)) return true;
    return false;
  }
  private async getBooks(
    userId: number,
    type: BookListStatusWithAll = 'All',
    liked?: boolean,
  ): Promise<bookDto[]> {
    const likedBooks = (
      await this.likesService.getLikedBooksByUser(userId, 'All')
    ).items;
    const booksFromList = (
      await this.bookListService.getBookList(userId, type, 'All')
    ).items;
    const books =
      type === 'All'
        ? this.getAllBooks(likedBooks, booksFromList)
        : booksFromList;

    switch (liked) {
      case undefined: {
        return books;
      }
      case true: {
        return books.filter((book) => likedBooks.includes(book));
      }
      case false: {
        return books.filter((book) => !likedBooks.includes(book));
      }
    }
  }
  private getAllBooks(likedBooks: bookDto[], booksFromList: bookDto[]) {
    const books = booksFromList;
    likedBooks.forEach((likedBook) => {
      if (books.find((book) => book.olid === likedBook.olid) === undefined)
        books.push(likedBook);
    });
    return books;
  }
}
