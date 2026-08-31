import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './userRepository';
import { User } from './entities/userEntity';
import { Comment } from './entities/commentEntity';
import { Like } from './entities/likeEntity';
import { BookListItem } from './entities/bookListItemEntity';
import { getEnvConfig } from '../config/envConfig';
import { CommentRepository } from './commentRepository';
import { BookListRepository } from './bookListRepository';
import { LikeRepository } from './likeRepository';
import { MixedListRepository } from './mixedListRepository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = getEnvConfig(configService);
        return {
          type: 'postgres',
          host: config.dbHost,
          port: config.dbPort,
          username: config.dbUsername,
          password: config.dbPassword,
          database: config.dbName,
          ssl: config.dbSsl ? { rejectUnauthorized: false } : undefined,
          entities: [Like, Comment, User, BookListItem],
          synchronize: true,
          retryAttempts: 1,
          retryDelay: 1000,
          connectTimeoutMS: 10000,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Comment, BookListItem, Like]),
  ],
  providers: [
    UserRepository,
    CommentRepository,
    BookListRepository,
    LikeRepository,
    MixedListRepository,
  ],
  exports: [
    UserRepository,
    CommentRepository,
    BookListRepository,
    LikeRepository,
    MixedListRepository,
  ],
})
export class DatabaseModule {}
