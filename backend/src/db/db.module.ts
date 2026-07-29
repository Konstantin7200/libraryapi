import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './userRepository';
import { User } from './entities/userEntity';
import { Comment } from './entities/commentEntity';
import { Like } from './entities/likeEntity';
import { BookListItem } from './entities/bookListItemEntity';
import { getEnvConfig } from '../envConfig';

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
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class DatabaseModule {}
