import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { DatabaseModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { CasheModule } from '../cashe/cashe.module';
import { BookApiModule } from '../api/bookApi.module';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CasheModule,
    BookApiModule,
    BooksModule,
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
