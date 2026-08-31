import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { getEnvConfig } from '../config/envConfig';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const config = getEnvConfig(this.configService);
    cors({
      origin: config.corsOrigin.split(',').map((o) => o.trim()),
      credentials: true,
    })(req, res, next);
  }
}
