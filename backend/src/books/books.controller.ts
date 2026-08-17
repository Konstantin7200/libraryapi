import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { AttachUserIdGuard } from '../auth/attachUserId.guard';
import { UserId } from '../auth/userId.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @UseGuards(AttachUserIdGuard)
  @Get('/')
  async findMany(
    @Query('page') page: number,
    @Query('q') q?: string,
    @UserId() userId?: number | null,
  ) {
    const response = await this.booksService.findMany(page, q, userId);
    return response;
  }
  @UseGuards(AttachUserIdGuard)
  @Get('/:olid')
  async findOne(@Param('olid') olid: string, @UserId() userId?: number | null) {
    const response = await this.booksService.findOneDetailed(olid, userId);
    return response;
  }
}
