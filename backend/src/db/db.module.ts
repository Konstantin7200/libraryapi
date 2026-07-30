import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './userRepository';
import { User } from './entities/userEntity';
import { Comment } from './entities/commentEntity';
import { Like } from './entities/likeEntity';
import { BookListItem } from './entities/bookListItemEntity';
import { getEnvConfig } from '../envConfig';
import { CommentRepository } from './commentRepository';
import { BookListRepository } from './bookListRepository';

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
          entities: [Like, Comment, User, BookListItem],
        };
      },
    }),
    TypeOrmModule.forFeature([User, Comment, BookListItem]),
  ],
  providers: [UserRepository, CommentRepository, BookListRepository],
  exports: [UserRepository, CommentRepository, BookListRepository],
})
export class DatabaseModule {}
