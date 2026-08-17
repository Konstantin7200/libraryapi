import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { Like } from './entities/likeEntity';
import { PaginationOptions } from '../pagination/paginated.dto';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like)
    private readonly repo: Repository<Like>,
  ) {}
  async addLike(bookOlid: string, userId: number) {
    const like: DeepPartial<Like> = {
      bookOlid: bookOlid,
      user: { id: userId },
    };
    const likeCreated = await this.repo.save(like);
    return likeCreated;
  }
  async getLike(bookOlid: string, userId: number) {
    const likeFound = await this.repo.findOneBy({
      user: { id: userId },
      bookOlid: bookOlid,
    });
    return likeFound;
  }
  async removeLike(like: Like) {
    const result = await this.repo.remove(like);
    return result;
  }
  async getLikesByBook(bookOlid: string) {
    const [, count] = await this.repo.findAndCountBy({
      bookOlid: bookOlid,
    });
    return count;
  }
  async getLikedOlids(userId: number, olids: string[]): Promise<Set<string>> {
    if (olids.length === 0) return new Set();
    const likes = await this.repo.findBy({
      user: { id: userId },
      bookOlid: In(olids),
    });
    return new Set(likes.map((l) => l.bookOlid));
  }
  async getLikesByUser(
    userId: number,
    pagination?: PaginationOptions,
  ): Promise<[Like[], number]> {
    const result = await this.repo.findAndCount({
      where: { user: { id: userId } },
      skip: pagination?.skip,
      take: pagination?.take,
    });
    return result;
  }
}
