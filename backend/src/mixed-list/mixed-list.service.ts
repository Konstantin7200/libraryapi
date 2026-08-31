import { Injectable } from '@nestjs/common';
import { BookListStatusWithAll } from '../bookList/dto/bookList.dto';
import { MixedListRepository } from '../db/mixedListRepository';
import { BooksService } from '../books/books.service';
import { BookDto } from '../books/dto/bookDto';
import { PageSize } from '../constants';
import { Paginated, toPaginated } from '../pagination/paginated.dto';

@Injectable()
export class MixedListService {
  constructor(
    private readonly mixedListRepository: MixedListRepository,
    private readonly booksService: BooksService,
  ) {}
  async getMixedList(
    userId: number,
    page: number,
    type: BookListStatusWithAll = 'All',
    liked?: boolean,
    query?: string,
  ): Promise<Paginated<BookDto>> {
    if (query === undefined) {
      const { olids, total } = await this.mixedListRepository.getMixedOlids(
        userId,
        {
          type,
          liked,
          pagination: {
            skip: (page - 1) * PageSize,
            take: PageSize,
          },
        },
      );
      const books = await this.booksService.findManyByOlids(olids);
      return toPaginated(books, total);
    }

    const { olids } = await this.mixedListRepository.getMixedOlids(userId, {
      type,
      liked,
    });
    const allBooks = await this.booksService.findManyByOlids(olids);
    const lowerQuery = query.toLowerCase();
    const filteredBooks = allBooks.filter((book) =>
      this.filterBook(book, lowerQuery),
    );
    return toPaginated(
      filteredBooks.slice((page - 1) * PageSize, page * PageSize),
      filteredBooks.length,
    );
  }
  private filterBook(book: BookDto, query: string): boolean {
    if (book.authors.find((author) => author.toLowerCase().includes(query)))
      return true;
    if (book.title.toLowerCase().includes(query)) return true;
    return false;
  }
}
