import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { AttachUserIdGuard } from '../auth/attachUserId.guard';
import { UserId } from '../auth/userId.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @UseGuards(AttachUserIdGuard)
  @Get('/')
  async findMany(
    @Query('page', new ParseIntPipe()) page: number,
    @Query('q') q?: string,
    @UserId() userId?: number | null,
  ) {
    const response = await this.booksService.findMany(page, q, userId);
    return response;
  }
  @UseGuards(AttachUserIdGuard)
  @Get('/random')
  async findRandom(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @UserId() userId?: number | null,
  ) {
    if (page === undefined) page = 1;
    const response = await this.booksService.getRandom(page, userId);
    return response;
  }
  @UseGuards(AttachUserIdGuard)
  @Get('/:olid')
  async findOne(@Param('olid') olid: string, @UserId() userId?: number | null) {
    const response = await this.booksService.findOneDetailed(olid, userId);
    return response;
  }
}
