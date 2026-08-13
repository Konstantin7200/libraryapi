import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { BookListModule } from './bookList/book-list.module';
import { LikesModule } from './likes/likes.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    BooksModule,
    ConfigModule.forRoot(),
    CommentsModule,
    BookListModule,
    LikesModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
