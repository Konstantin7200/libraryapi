import { DataSource } from 'typeorm';
import { Book } from './entities/bookEntity';
import { Comment } from './entities/commentEntity';
import { Like } from './entities/likeEntity';
import { User } from './entities/userEntity';
import { BookListItem } from './entities/bookListItemEntity';
import { EnvConfig } from '../EnvConfig';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: EnvConfig.dbHost,
  port: EnvConfig.dbPort,
  username: EnvConfig.dbUsername,
  password: EnvConfig.dbPassword,
  database: EnvConfig.dbName,
  entities: [Book, Like, Comment, User, BookListItem],
});

export { AppDataSource };
