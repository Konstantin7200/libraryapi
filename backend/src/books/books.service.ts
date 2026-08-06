import { Injectable } from '@nestjs/common';
import { bookApi } from '../api/bookApi';
import { RedisCashe } from '../cashe/redisCashe';
import { MemoryCashe } from '../cashe/memoryCashe';
import { extendedBookDto } from './dto/bookDto';

@Injectable()
export class BooksService {
  constructor(
    private readonly redisCashe: RedisCashe,
    private readonly memoryCashe: MemoryCashe,
    private readonly bookApi: bookApi,
  ) {}
  async findOne(olid: string) {
    const apiBook = await this.bookApi.getBook(olid);
    const authorsName = await this.bookApi.getAuthor(
      apiBook.authors[0].author.key.substring('/authors/'.length),
    );
    const stringEnd =
      apiBook.description.value.indexOf('----------') !== -1
        ? apiBook.description.value.indexOf('----------')
        : apiBook.description.value.length;
    const description = apiBook.description.value.substring(0, stringEnd);
    const book: extendedBookDto = {
      title: apiBook.title,
      description: description,
      authors: [authorsName.personal_name],
      coversUrl: `https://covers.openlibrary.org/b/id/${apiBook.covers[0]}-L.jpg`,
      liked: false,
      olid: olid,
    };
    return book;
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
    const data = await this.bookApi.searchBooks(page, title, author);
    this.memoryCashe.setBooks(createQuery(page, title, author), data);
    return data;
  }
}
const createQuery = (page: number, title?: string, author?: string) =>
  `${page}|${title || ''}|${author || ''}`;
