import { Logger } from '@nestjs/common';
import { createApp } from './app';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: ${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
