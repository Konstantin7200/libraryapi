import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CasheModule } from '../cashe/cashe.module';

@Module({
  imports: [CasheModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
