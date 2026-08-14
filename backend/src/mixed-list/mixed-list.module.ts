import { Module } from '@nestjs/common';
import { MixedListService } from './mixed-list.service';
import { MixedListController } from './mixed-list.controller';
import { LikesModule } from '../likes/likes.module';
import { BookListModule } from '../bookList/book-list.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LikesModule, BookListModule, AuthModule],
  controllers: [MixedListController],
  providers: [MixedListService],
})
export class MixedListModule {}
