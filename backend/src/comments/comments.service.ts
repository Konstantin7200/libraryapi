import { Injectable } from '@nestjs/common';
import { commentDto } from './dto/comment.dto';
import { UserRepository } from '../db/userRepository';
import { CommentRepository } from '../db/commentRepository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
  ) {}
  async getCommentsByUser(userId: number) {
    const user = await this.userRepository.findOneById(userId);
    if (user === null) throw Error('User is null');
    const comments = await this.commentRepository.findByUser(user);
    return comments;
  }
  async getCommentsByBook(bookOlid: string) {
    const comments = this.commentRepository.findByBook(bookOlid);
    return comments;
  }
  async createComment(comment: commentDto, userId: number) {
    const user = await this.userRepository.findOneById(userId);
    if (user === null) throw Error('User is null');
    const created = await this.commentRepository.createOne(comment, user);
    return created;
  }
}
