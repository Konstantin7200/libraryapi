import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { UserRepository } from '../db/userRepository';
import { LikeRepository } from '../db/likeRepository';

export type LikeEventType = {
  bookOlid: string;
  likes: number;
};
@Injectable()
export class LikesService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
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
}
