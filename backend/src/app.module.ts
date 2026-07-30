import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { BookListModule } from './bookList/book-list.module';

@Module({
  imports: [
    AuthModule,
    BooksModule,
    ConfigModule.forRoot(),
    CommentsModule,
    BookListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
