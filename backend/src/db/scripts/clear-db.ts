import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

async function clearDb() {
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
  console.log('Connected to database');

  await dataSource.query(
    'TRUNCATE TABLE "like", "comment", "book_list_item", "user" CASCADE',
  );
  console.log('All tables cleared');

  await dataSource.destroy();
  console.log('Done');
}

clearDb().catch((err) => {
  console.error('Failed to clear database:', err);
  process.exit(1);
});
