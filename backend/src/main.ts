import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { initializeDataSource } from './db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await initializeDataSource(configService);
  await app.listen(configService.get('PORT', 3000));
}

bootstrap();
