import { NestFactory } from '@nestjs/core';
import 'pg';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

let cachedApp: NestExpressApplication | undefined;
const logger = new Logger('Bootstrap');

async function createApp(): Promise<NestExpressApplication> {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService
      .get<string>('CORS_ORIGIN', 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim()),
    credentials: true,
  });
  const server = app.getHttpServer();
  server.headersTimeout = 0;
  server.requestTimeout = 0;
  await app.init();
  cachedApp = app;
  return app;
}

export default async function handler(req: Request, res: Response) {
  const app = await createApp();
  const expressInstance = app.getHttpAdapter().getInstance() as (
    request: Request,
    response: Response,
  ) => void | Promise<void>;
  expressInstance(req, res);
}

async function bootstrap() {
  const app = await createApp();
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT', 3000));
  logger.log(
    `Application is running on: ${configService.get<string>('PORT', '3000')}`,
  );
}

if (require.main === module) {
  bootstrap();
}
