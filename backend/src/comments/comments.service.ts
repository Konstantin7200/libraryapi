import { Injectable } from '@nestjs/common';
import { createCommentDto } from './dto/createComment.dto';
import { CommentRepository } from '../db/commentRepository';
import { commentDto } from './dto/comment.dto';
import { Comment } from '../db/entities/commentEntity';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
  ) {}
  async getCommentsByUser(userId: number): Promise<commentDto[]> {
    const dbComments = await this.commentRepository.findByUser(userId);
    const login = await this.userService.getLogin(userId);
    const comments = this.dbCommentsToComments(dbComments, userId, login);
    return comments;
  }
  async getCommentsByBook(
    bookOlid: string,
    userId: number | null,
  ): Promise<commentDto[]> {
    const dbComments = await this.commentRepository.findByBook(bookOlid);
    const comments = this.dbCommentsToComments(dbComments, userId);
    return comments;
  }
  async createComment(comment: createCommentDto, userId: number) {
    const created = await this.commentRepository.createOne(comment, userId);
    return created;
  }
  async updateComment(commentText: string, commentId: number) {
    const result = await this.commentRepository.updateOne(
      commentText,
      commentId,
    );
    return result;
  }
  async deleteComment(id: number) {
    const comment = await this.commentRepository.findById(id);
    if (comment === null) throw Error('Comment not found');
    const result = await this.commentRepository.deleteOne(comment);
    return result;
  }
  private async dbCommentsToComments(
    dbComments: Comment[],
    userId: number | null,
    optionalLogin?: string,
  ): Promise<commentDto[]> {
    const comments: commentDto[] = [];
    for (let i = 0; i < dbComments.length; i++) {
      const comment = dbComments[i];
      const login = optionalLogin
        ? optionalLogin
        : comment.user.login
      comments.push({
        id: comment.id,
        updatedAt: comment.updatedAt,
        text: comment.text,
        mine: comment.user.id === userId,
        login: login,
      });
    }
    return comments;
  }
}
