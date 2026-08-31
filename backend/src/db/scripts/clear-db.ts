import { loadEnv } from '../../config/envConfig';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

const logger = new Logger('ClearDb');

async function clearDb() {
  loadEnv();
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl:
      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    connectTimeoutMS: 10000,
  });

  await dataSource.initialize();
  logger.log('Connected to database');

  await dataSource.query(
    'TRUNCATE TABLE "like", "comment", "book_list_item", "user" CASCADE',
  );
  logger.log('All tables cleared');

  await dataSource.destroy();
  logger.log('Done');
}

clearDb().catch((err) => {
  logger.error('Failed to clear database:', err);
  process.exit(1);
});
