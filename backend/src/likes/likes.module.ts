import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { DatabaseModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { BookApiModule } from '../api/bookApi.module';
import { BooksModule } from '../books/books.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    BookApiModule,
    BooksModule,
    RedisModule,
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
