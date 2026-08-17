import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { map, merge, Observable, timer } from 'rxjs';
import { UserRepository } from '../db/userRepository';
import { LikeRepository } from '../db/likeRepository';
import { bookDto } from '../books/dto/bookDto';
import { BookApi } from '../api/bookApi';
import { BooksService } from '../books/books.service';
import { PageSize } from '../constants';
import { Paginated, toPaginated } from '../pagination/paginated.dto';

export type LikeEventType = {
  bookOlid: string;
  likes: number;
};

const LIKES_CHANNEL = 'likes';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);
  private readonly likesSubscriber: Redis;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
    private readonly bookApi: BookApi,
    private readonly bookService: BooksService,
    private readonly redis: Redis,
  ) {
    this.likesSubscriber = this.redis.duplicate();
    this.likesSubscriber.subscribe(LIKES_CHANNEL);
  }
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
    const payload = JSON.stringify({ bookOlid: bookOlid, likes: likes });
    try {
      await this.redis.publish(LIKES_CHANNEL, payload);
    } catch (error) {
      this.logger.error(error);
    }
  }
  likesSse(olid: string): Observable<MessageEvent> {
    const likes$ = new Observable<MessageEvent>((subscriber) => {
      const onMessage = (channel: string, message: string) => {
        if (channel !== LIKES_CHANNEL) return;
        const payload = JSON.parse(message) as LikeEventType;
        if (payload.bookOlid === olid) {
          subscriber.next({ data: payload } as MessageEvent);
        }
      };
      this.likesSubscriber.on('message', onMessage);
      return () => this.likesSubscriber.off('message', onMessage);
    });
    const heartbeat$ = timer(0, 20000).pipe(
      map(() => ({ comment: 'ping' }) as unknown as MessageEvent),
    );
    return merge(likes$, heartbeat$);
  }
  async getLikedBooksByUser(
    userId: number,
    page: number | 'All',
  ): Promise<Paginated<bookDto>> {
    const pagination =
      page === 'All' ? {} : { skip: (page - 1) * PageSize, take: PageSize };
    const [likes, total] = await this.likeRepository.getLikesByUser(
      userId,
      pagination,
    );
    const books: bookDto[] = [];
    for (let i = 0; i < likes.length; i++) {
      const like = likes[i];
      const book = await this.bookService.findOne(like.bookOlid);
      book.liked = true;
      books.push(book);
    }
    return toPaginated(books, total);
  }
}
