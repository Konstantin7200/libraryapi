import { ConfigService } from '@nestjs/config';

export function getEnvConfig(configService: ConfigService) {
  return {
    dbUsername: configService.get<string>('DB_USERNAME')!,
    dbHost: configService.get<string>('DB_HOST')!,
    dbPort: configService.get<number>('DB_PORT')!,
    dbPassword: configService.get<string>('DB_PASSWORD')!,
    dbName: configService.get<string>('DB_NAME')!,
    jwtSecret: configService.get<string>('JWT_SECRET')!,
  };
}
