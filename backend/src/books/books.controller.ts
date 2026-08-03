import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get('/')
  async findMany(
    @Query('page') page: number,
    @Query('title') title?: string,
    @Query('author') author?: string,
  ) {
    const response = await this.booksService.findMany(page, title, author);
    return response;
  }
  @Get('/:olid')
  async findOne(@Param('olid') olid: string) {
    const response = await this.booksService.findOne(olid);
    return response;
  }
}
