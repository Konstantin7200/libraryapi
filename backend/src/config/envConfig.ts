import * as env from 'env-var';
import { ConfigService } from '@nestjs/config';

export function loadEnv(): void {
  env.get('DB_HOST').required().asString();
  env.get('DB_PORT').required().asIntPositive();
  env.get('DB_USERNAME').required().asString();
  env.get('DB_PASSWORD').required().asString();
  env.get('DB_NAME').required().asString();
  env.get('JWT_SECRET').required().asString();
  env.get('CORS_ORIGIN').required().asString();
  env.get('REDIS_HOST').required().asString();
  env.get('REDIS_PORT').required().asIntPositive();
  env.get('REDIS_USERNAME').required().asString();
  env.get('REDIS_PASSWORD').required().asString();
}

export function getEnvConfig(configService: ConfigService) {
  return {
    dbHost: configService.get<string>('DB_HOST')!,
    dbPort: configService.get<number>('DB_PORT')!,
    dbUsername: configService.get<string>('DB_USERNAME')!,
    dbPassword: configService.get<string>('DB_PASSWORD')!,
    dbName: configService.get<string>('DB_NAME')!,
    dbSsl: configService.get<string>('DB_SSL', 'false') === 'true',
    jwtSecret: configService.get<string>('JWT_SECRET')!,
    corsOrigin: configService.get<string>('CORS_ORIGIN')!,
    cookieSecure:
      configService.get<string>('COOKIE_SECURE', 'false') === 'true',
    redisHost: configService.get<string>('REDIS_HOST')!,
    redisPort: configService.get<number>('REDIS_PORT')!,
    redisUsername: configService.get<string>('REDIS_USERNAME')!,
    redisPassword: configService.get<string>('REDIS_PASSWORD')!,
    redisTls: configService.get<string>('REDIS_TLS', 'false') === 'true',
    port: configService.get<number>('PORT', 3000),
  };
}
