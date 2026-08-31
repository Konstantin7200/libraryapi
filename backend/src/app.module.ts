import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { BookListModule } from './bookList/book-list.module';
import { LikesModule } from './likes/likes.module';
import { UserModule } from './user/user.module';
import { MixedListModule } from './mixed-list/mixed-list.module';
import { loadEnv } from './config/envConfig';
import { CorsMiddleware } from './middleware/cors.middleware';
import { CookieParserMiddleware } from './middleware/cookie-parser.middleware';

@Module({
  imports: [
    AuthModule,
    BooksModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CommentsModule,
    BookListModule,
    LikesModule,
    UserModule,
    MixedListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    loadEnv();
    consumer.apply(CorsMiddleware, CookieParserMiddleware).forRoutes('*');
  }
}
