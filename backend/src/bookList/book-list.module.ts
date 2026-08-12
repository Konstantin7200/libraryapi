import { Module } from '@nestjs/common';
import { BookListService } from './book-list.service';
import { BookListController } from './book-list.controller';
import { DatabaseModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { BooksModule } from '../books/books.module';
import { BookApiModule } from '../api/bookApi.module';
import { BooksService } from '../books/books.service';
import { CasheModule } from '../cashe/cashe.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    BooksModule,
    BookApiModule,
    CasheModule,
  ],
  controllers: [BookListController],
  providers: [BookListService, BooksService],
})
export class BookListModule {}
