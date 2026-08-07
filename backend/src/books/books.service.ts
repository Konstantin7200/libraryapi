import { Injectable } from '@nestjs/common';
import { bookApi } from '../api/bookApi';
import { bookDto, extendedBookDto } from './dto/bookDto';
import { UserRepository } from '../db/userRepository';
import { LikeRepository } from '../db/likeRepository';

@Injectable()
export class BooksService {
  constructor(
    private readonly bookApi: bookApi,
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
  ) {}
  async findOne(olid: string, userId?: number | null) {
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

const mapToBookList = (docs: object[]): bookDto[] =>
  docs.map((book) => {
    const validatedBook = validateData(book);
    if (validatedBook === null) {
      throw Error('Bad api response');
    }
    const { title, author_name, cover_i, key } = validatedBook;
    const coversUrl = cover_i
      ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`
      : null;
    return {
      title: title,
      authors: author_name,
      olid: key.substring('/works/'.length),
      coversUrl: coversUrl,
      liked: false,
    };
  });

type ApiBook = {
  title: string;
  author_name: string[];
  cover_i: string | null;
  key: string;
};

function validateData(data: object): ApiBook | null {
  if (
    Object.hasOwn(data, 'title') &&
    Object.hasOwn(data, 'author_name') &&
    Object.hasOwn(data, 'key')
  ) {
    if (Object.hasOwn(data, 'cover_i')) return data as ApiBook;
    else {
      return {
        ...(data as ApiBook),
        cover_i: null,
      };
    }
  } else {
    return null;
  }
}
