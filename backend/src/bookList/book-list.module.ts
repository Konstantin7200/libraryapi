import { Module } from '@nestjs/common';
import { BookListService } from './book-list.service';
import { BookListController } from './book-list.controller';

@Module({
  controllers: [BookListController],
  providers: [BookListService],
})
export class BookListModule {}
