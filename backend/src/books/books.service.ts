import { Injectable } from '@nestjs/common';
import { BookApi } from '../api/bookApi';
import { bookDto, extendedBookDto } from './dto/bookDto';
import { UserRepository } from '../db/userRepository';
import { LikeRepository } from '../db/likeRepository';
import { mapToBookList } from '../utils/mapToBookList';
import { RedisCashe } from '../cashe/redisCashe';

@Injectable()
export class BooksService {
  constructor(
    private readonly bookApi: BookApi,
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
    private readonly redisCashe: RedisCashe,
  ) {}
  async findOneDetailed(olid: string, userId?: number | null) {
    const apiBook = await this.bookApi.getBook(olid);
    const authorsName = await this.bookApi.getAuthor(
      apiBook.authors[0].author.key.substring('/authors/'.length),
    );
    const stringEnd =
      apiBook.description.value.indexOf('----------') !== -1
        ? apiBook.description.value.indexOf('----------')
        : apiBook.description.value.length;
    const description = apiBook.description.value.substring(0, stringEnd);
    const liked = await this.isLiked(olid, userId);
    const likes = await this.likeRepository.getLikesByBook(olid);
    const book: extendedBookDto = {
      title: apiBook.title,
      description: description,
      authors: [authorsName.personal_name],
      coversUrl: `https://covers.openlibrary.org/b/id/${apiBook.covers[0]}-L.jpg`,
      liked: liked,
      likes: likes,
      olid: olid,
    };
    return book;
  }
  async findOne(olid: string): Promise<bookDto> {
    const redisBook = await this.redisCashe.getBook(olid);
    if (redisBook !== null) return redisBook;
    const apiBook = await this.bookApi.getBook(olid);
    const authorsName = await this.bookApi.getAuthor(
      apiBook.authors[0].author.key.substring('/authors/'.length),
    );
    const book: bookDto = {
      title: apiBook.title,
      authors: [authorsName.personal_name],
      coversUrl: `https://covers.openlibrary.org/b/id/${apiBook.covers[0]}-L.jpg`,
      liked: false,
      olid: olid,
    };
    await this.redisCashe.setBook(olid, book);
    return book;
  }
  async findMany(
    page: number,
    title?: string,
    author?: string,
    userId?: number | null,
  ): Promise<bookDto[]> {
    const data = await this.bookApi.searchBooks(page, title, author);
    const books = mapToBookList(data.docs);
    if (userId == null) return books;
    const likedOlids = await this.likeRepository.getLikedOlids(
      userId,
      books.map((b) => b.olid),
    );
    return books.map((b) => ({ ...b, liked: likedOlids.has(b.olid) }));
  }
  private async isLiked(olid: string, userId?: number | null) {
    if (userId == null) return false;
    const like = await this.likeRepository.getLike(olid, userId);
    return like !== null;
  }
}
