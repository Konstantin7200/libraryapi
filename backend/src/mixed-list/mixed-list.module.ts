import { Module } from '@nestjs/common';
import { MixedListService } from './mixed-list.service';
import { MixedListController } from './mixed-list.controller';
import { DatabaseModule } from '../db/db.module';
import { BooksModule } from '../books/books.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, BooksModule, AuthModule],
  controllers: [MixedListController],
  providers: [MixedListService],
})
export class MixedListModule {}
