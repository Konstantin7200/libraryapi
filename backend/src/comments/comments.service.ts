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
    const comments = await this.commentRepository.findByUser(userId);
    return comments;
  }
  async getCommentsByBook(bookOlid: string) {
    const comments = this.commentRepository.findByBook(bookOlid);
    return comments;
  }
  async createComment(comment: commentDto, userId: number) {
    const created = await this.commentRepository.createOne(comment, userId);
    return created;
  }
}
