import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Comment } from './entities/commentEntity';
import { Like } from './entities/likeEntity';
import { User } from './entities/userEntity';
import { BookListItem } from './entities/bookListItemEntity';
import { getEnvConfig } from '../envConfig';

export async function initializeDataSource(configService: ConfigService) {
  const config = getEnvConfig(configService);
  const dataSource = new DataSource({
    type: 'postgres',
    host: config.dbHost,
    port: config.dbPort,
    username: config.dbUsername,
    password: config.dbPassword,
    database: config.dbName,
    entities: [Like, Comment, User, BookListItem],
  });
  await dataSource.initialize();
  return dataSource;
}
