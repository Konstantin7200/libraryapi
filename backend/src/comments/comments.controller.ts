import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UserId } from '../auth/userId.decorator';
import type { commentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Post()
  async addComment(
    @Body() comment: commentDto,
    @UserId() userId: number | null,
  ) {
    if (userId === null) throw Error('Null id from the token');
    await this.commentsService.createComment(comment, userId);
  }
  @Get()
  async getCommentsByUser(@UserId() userId: number | null) {
    if (userId === null) throw Error('Null id from the token');
    await this.commentsService.getCommentsByUser(userId);
  }
  @Get()
  async getCommentsByBook(@Query('book') bookOlid: string) {
    await this.commentsService.getCommentsByBook(bookOlid);
  }
}
