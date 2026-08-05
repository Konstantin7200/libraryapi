import { Injectable } from '@nestjs/common';
import { getAuthor, getBook, searchBooks } from '../api/bookApi';
import { RedisCashe } from '../cashe/redisCashe';
import { MemoryCashe } from '../cashe/memoryCashe';
import { bookDto, extendedBookDto } from './dto/bookDto';

@Injectable()
export class BooksService {
  constructor(
    private readonly redisCashe: RedisCashe,
    private readonly memoryCashe: MemoryCashe,
  ) {}
  async findOne(olid: string) {
    const apiBook = await getBook(olid);
    const authorsName = await getAuthor(apiBook.authors[0].author.key);
    const book: extendedBookDto = {
      title: apiBook.title,
      description: apiBook.description.value,
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
    const data = await searchBooks(page, title, author);
    this.memoryCashe.setBooks(createQuery(page, title, author), data);
    return data;
  }
}
const createQuery = (page: number, title?: string, author?: string) =>
  `${page}|${title || ''}|${author || ''}`;
