import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UserId } from '../auth/userId.decorator';
import type { commentDto } from './dto/comment.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(AuthGuard)
  @Post()
  async addComment(
    @Body() comment: commentDto,
    @UserId() userId: number | null,
  ) {
    if (userId === null) throw Error('Null id from the token');
    await this.commentsService.createComment(comment, userId);
  }
  @UseGuards(AuthGuard)
  @Get('mine')
  async getCommentsByUser(@UserId() userId: number | null) {
    if (userId === null) throw Error('Null id from the token');
    return this.commentsService.getCommentsByUser(userId);
  }
  @Get()
  async getCommentsByBook(@Query('olid') bookOlid: string) {
    return this.commentsService.getCommentsByBook(bookOlid);
  }
}
