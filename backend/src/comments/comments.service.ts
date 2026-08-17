import { Injectable } from '@nestjs/common';
import { createCommentDto } from './dto/createComment.dto';
import { CommentRepository } from '../db/commentRepository';
import { commentDto } from './dto/comment.dto';
import { Comment } from '../db/entities/commentEntity';
import { UserService } from '../user/user.service';
import { PageSize } from '../constants';
import { Paginated, toPaginated } from '../pagination/paginated.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
  ) {}
  async getCommentsByUser(
    userId: number,
    page: number,
  ): Promise<Paginated<commentDto>> {
    const [dbComments, total] = await this.commentRepository.findByUser(
      userId,
      { skip: (page - 1) * PageSize, take: PageSize },
    );
    const login = await this.userService.getLogin(userId);
    const comments = this.dbCommentsToComments(dbComments, userId, login);
    return toPaginated(comments, total);
  }
  async getCommentsByBook(
    bookOlid: string,
    userId: number | null,
    page: number,
  ): Promise<Paginated<commentDto>> {
    const [dbComments, total] = await this.commentRepository.findByBook(
      bookOlid,
      { skip: (page - 1) * PageSize, take: PageSize },
    );
    const comments = this.dbCommentsToComments(dbComments, userId);
    return toPaginated(comments, total);
  }
  async createComment(comment: createCommentDto, userId: number) {
    const created = await this.commentRepository.createOne(comment, userId);
    return created;
  }
  async updateComment(commentText: string, commentId: number, userId: number) {
    const comments = await this.commentRepository.findById(commentId);
    const comment = comments[0];
    if (comment === null) throw Error('Comment not found');
    if (comment.user.id !== userId) throw Error('Access denied');
    const result = await this.commentRepository.updateOne(
      commentText,
      commentId,
    );
    return result;
  }
  async deleteComment(id: number, userId: number) {
    const comments = await this.commentRepository.findById(id);
    const comment = comments[0];
    if (comment === null) throw Error('Comment not found');
    if (comment.user.id !== userId) throw Error('Access denied');
    const result = await this.commentRepository.deleteOne(comment);
    return result;
  }
  private dbCommentsToComments(
    dbComments: Comment[],
    userId: number | null,
    optionalLogin?: string,
  ): commentDto[] {
    const comments: commentDto[] = [];
    for (let i = 0; i < dbComments.length; i++) {
      const comment = dbComments[i];
      const login = optionalLogin ? optionalLogin : comment.user.login;
      comments.push({
        id: comment.id,
        bookOlid: comment.bookOlid,
        updatedAt: comment.updatedAt,
        text: comment.text,
        mine: comment.user.id === userId,
        login: login,
      });
    }
    return comments;
  }
}
