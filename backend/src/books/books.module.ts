import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CasheModule } from '../cashe/cashe.module';
import { BookApiModule } from '../api/bookApi.module';

@Module({
  imports: [CasheModule, BookApiModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
