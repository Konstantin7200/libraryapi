import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Like } from './entities/likeEntity';
import { User } from './entities/userEntity';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like)
    private readonly repo: Repository<Like>,
  ) {}
  async addLike(bookOlid: string, user: User) {
    const like: DeepPartial<Like> = {
      bookOlid: bookOlid,
      user: user,
    };
    const likeCreated = await this.repo.save(like);
    return likeCreated;
  }
  async getLike(bookOlid: string, user: User) {
    const likeFound = await this.repo.findOneBy({
      user: user,
      bookOlid: bookOlid,
    });
    return likeFound;
  }
  async removeLike(like: Like) {
    const result = await this.repo.remove(like);
    return result;
  }
  async getLikesByBook(bookOlid: string) {
    const [likes, count] = await this.repo.findAndCountBy({
      bookOlid: bookOlid,
    });
    return count;
  }
}
