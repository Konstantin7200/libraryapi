import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentRepository } from '../db/commentRepository';
import { CommentDto, UserHistoryCommentDto } from './dto/comment.types';
import { Comment } from '../db/entities/commentEntity';
import { UserService } from '../user/user.service';
import { PageSize } from '../constants';
import { Paginated, toPaginated } from '../pagination/paginated.dto';
import { BooksService } from '../books/books.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
    private readonly bookService: BooksService,
  ) {}
  async getCommentsByUser(
    userId: number,
    page: number,
  ): Promise<Paginated<UserHistoryCommentDto>> {
    const [dbComments, total] = await this.commentRepository.findByUser(
      userId,
      { skip: (page - 1) * PageSize, take: PageSize },
    );
    const login = await this.userService.getLogin(userId);
    const comments = this.dbCommentsToComments(dbComments, userId, login);
    const commentsWithBookTitle = await this.addBookTitleToComments(comments);
    return toPaginated(commentsWithBookTitle, total);
  }
  async getCommentsByBook(
    bookOlid: string,
    userId: number | null,
    page: number,
  ): Promise<Paginated<CommentDto>> {
    const [dbComments, total] = await this.commentRepository.findByBook(
      bookOlid,
      { skip: (page - 1) * PageSize, take: PageSize },
    );
    const comments = this.dbCommentsToComments(dbComments, userId);
    return toPaginated(comments, total);
  }
  async createComment(comment: CreateCommentDto, userId: number) {
    const created = await this.commentRepository.createOne(comment, userId);
    return created;
  }
  async updateComment(commentText: string, commentId: number, userId: number) {
    const comments = await this.commentRepository.findById(commentId);
    const comment = comments[0];
    if (comment === null) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId)
      throw new ForbiddenException('Access denied');
    const result = await this.commentRepository.updateOne(
      commentText,
      commentId,
    );
    return result;
  }
  async deleteComment(id: number, userId: number) {
    const comments = await this.commentRepository.findById(id);
    const comment = comments[0];
    if (comment === null) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId)
      throw new ForbiddenException('Access denied');
    const result = await this.commentRepository.deleteOne(comment);
    return result;
  }
  private dbCommentsToComments(
    dbComments: Comment[],
    userId: number | null,
    optionalLogin?: string,
  ): CommentDto[] {
    const comments: CommentDto[] = [];
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
  private async addBookTitleToComments(
    comments: CommentDto[],
  ): Promise<UserHistoryCommentDto[]> {
    const books = await this.bookService.findManyByOlids(
      comments.map((comment) => comment.bookOlid),
    );
    const commentsWithTitles: UserHistoryCommentDto[] = [];
    for (let i = 0; i < comments.length; i++) {
      commentsWithTitles.push({
        ...comments[i],
        bookTitle: books[i].title,
      });
    }
    return commentsWithTitles;
  }
}
