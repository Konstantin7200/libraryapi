import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { getEnvConfig } from '../envConfig';

function createRedisClient(configService: ConfigService): Redis {
  const { redisHost, redisPort, redisUsername, redisPassword, redisTls } =
    getEnvConfig(configService);
  const logger = new Logger('Redis');

  const redis = new Redis({
    host: redisHost,
    port: redisPort,
    username: redisPassword ? redisUsername : undefined,
    password: redisPassword || undefined,
    tls: redisTls ? {} : undefined,
    retryStrategy: (times) => Math.min(times * 500, 5000),
  });

  redis.on('connect', () =>
    logger.log(`connected to ${redisHost}:${redisPort}`),
  );
  redis.on('ready', () => logger.log('ready for commands'));
  redis.on('error', (error) => logger.error(error.message));
  redis.on('close', () => logger.warn('connection closed'));
  redis.on('reconnecting', () => logger.warn('reconnecting'));

  return redis;
}

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Redis,
      inject: [ConfigService],
      useFactory: createRedisClient,
    },
  ],
  exports: [Redis],
})
export class RedisModule {}
