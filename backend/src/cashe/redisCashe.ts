import { Redis } from 'ioredis';
import { BookDto } from '../books/dto/bookDto';
import { Injectable } from '@nestjs/common';
import { REDIS_TTL_SEC } from '../constants';

type RedisBook = BookDto & {
  expirationDate: Date;
};
function unknownIsRedisBook(raw: unknown): raw is RedisBook {
  if (typeof raw != 'object' || raw === null) return false;
  if (
    Object.hasOwn(raw, 'olid') &&
    Object.hasOwn(raw, 'title') &&
    Object.hasOwn(raw, 'authors') &&
    Object.hasOwn(raw, 'coversUrl') &&
    Object.hasOwn(raw, 'expirationDate')
  )
    return true;
  return false;
}
@Injectable()
export class RedisCashe {
  constructor(private readonly redis: Redis) {}
  async setBook(olid: string, book: BookDto) {
    const redisBook: RedisBook = {
      ...book,
      expirationDate: new Date(Date.now() + REDIS_TTL_SEC * 1000),
    };
    await this.redis.set(olid, JSON.stringify(redisBook));
  }
  async getBook(olid: string): Promise<BookDto | null> {
    const str = await this.redis.get(olid);
    if (str === null) return null;
    const raw: unknown = JSON.parse(str);
    if (unknownIsRedisBook(raw)) {
      if (raw.expirationDate < new Date()) {
        await this.redis.del(olid);
        return null;
      }
      const { expirationDate, ...book } = raw;
      return book;
    }
    return null;
  }
}
