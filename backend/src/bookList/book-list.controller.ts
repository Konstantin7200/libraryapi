import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BookListService } from './book-list.service';
import { UserId } from '../auth/userId.decorator';
import type { BookListItemDto, BookListStatus } from './dto/bookList.dto';

@Controller('book-list')
export class BookListController {
  constructor(private readonly bookListService: BookListService) {}
  @Get()
  async getBookList(@UserId() userId: number, @Query() type?: BookListStatus) {
    await this.bookListService.getBookList(userId, type);
  }
  @Post()
  async addBookToList(
    @Body() bookListItem: BookListItemDto,
    @UserId() userId: number,
  ) {
    await this.bookListService.addBookToList(
      userId,
      bookListItem.bookOlid,
      bookListItem.status,
    );
  }
}
