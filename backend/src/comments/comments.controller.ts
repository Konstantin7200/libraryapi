import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UserId } from '../auth/userId.decorator';
import { CreateCommentDto } from './dto/createComment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CommentUpdateDto } from './dto/commentUpdate.dto';
import { AttachUserIdGuard } from '../auth/attachUserId.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(AuthGuard)
  @Post()
  async addComment(
    @Body() comment: CreateCommentDto,
    @UserId() userId: number,
  ) {
    await this.commentsService.createComment(comment, userId);
  }
  @UseGuards(AuthGuard)
  @Get('mine')
  async getCommentsByUser(
    @UserId() userId: number,
    @Query('page', new ParseIntPipe()) page: number,
  ) {
    const result = await this.commentsService.getCommentsByUser(userId, page);
    return result;
  }
  @Get()
  @UseGuards(AttachUserIdGuard)
  async getCommentsByBook(
    @Query('olid') bookOlid: string,
    @UserId() userId: number | null,
    @Query('page', new ParseIntPipe()) page: number,
  ) {
    return this.commentsService.getCommentsByBook(bookOlid, userId, page);
  }
  @Put()
  @UseGuards(AuthGuard)
  async updateComment(
    @Body() comment: CommentUpdateDto,
    @UserId() userId: number,
  ) {
    await this.commentsService.updateComment(comment.text, comment.id, userId);
  }
  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteComment(
    @Param('id', new ParseIntPipe()) id: number,
    @UserId() userId: number,
  ) {
    await this.commentsService.deleteComment(id, userId);
  }
}
