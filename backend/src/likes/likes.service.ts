import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { UserRepository } from '../db/userRepository';
import { LikeRepository } from '../db/likeRepository';
import { bookDto } from '../books/dto/bookDto';
import { RedisCashe } from '../cashe/redisCashe';
import { BookApi } from '../api/bookApi';
import { BooksService } from '../books/books.service';

export type LikeEventType = {
  bookOlid: string;
  likes: number;
};
@Injectable()
export class LikesService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
    private readonly redisCache: RedisCashe,
    private readonly bookApi: BookApi,
    private readonly bookService: BooksService,
  ) {}
  private likeEvents = new Subject<LikeEventType>();
  readonly likes = this.likeEvents.asObservable();
  async toggleLike(bookOlid: string, userId: number) {
    const likeFound = await this.likeRepository.getLike(bookOlid, userId);
    if (likeFound === null) {
      const result = await this.likeRepository.addLike(bookOlid, userId);
      return result;
    }
    const result = await this.likeRepository.removeLike(likeFound);
    return result;
  }
  async likesChanged(bookOlid: string) {
    const likes = await this.likeRepository.getLikesByBook(bookOlid);
    this.likeEvents.next({ bookOlid: bookOlid, likes: likes });
  }
  async getLikedBooksByUser(userId: number): Promise<bookDto[]> {
    const likes = await this.likeRepository.getLikesByUser(userId);
    const books: bookDto[] = [];
    for (let i = 0; i < likes.length; i++) {
      const like = likes[i];
      const redisBook = await this.redisCache.getBook(like.bookOlid);
      if (redisBook !== null) {
        const { expirationDate, ...book } = redisBook;
        book.liked = true;
        books.push(book);
        continue;
      }
      const book = await this.bookService.findOne(like.bookOlid);
      book.liked = true;
      books.push(book);
      continue;
    }
    return books;
  }
}
