import { Controller, Get, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { getBooks } from '../api/bookApi';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get('/')
  async findAll(
    @Query('title') title: string,
    @Query('author') author: string,
  ) {
    const data = await getBooks(title, author);
    console.log(data);
    return data;
  }
  @Get('/:id')
  findOne() {
    return 'id route';
  }
}
