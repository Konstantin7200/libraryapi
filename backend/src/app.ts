import { NestFactory } from '@nestjs/core';
import 'pg';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AllExeptionFilter } from './AllExeptionFilter';

let cachedApp: NestExpressApplication | undefined;

export async function createApp(): Promise<NestExpressApplication> {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  app.useGlobalFilters(new AllExeptionFilter());
  const server = app.getHttpServer();
  server.headersTimeout = 0;
  server.requestTimeout = 0;
  await app.init();
  cachedApp = app;
  return app;
}
