import { Module } from '@nestjs/common';
import { RedisCashe } from './redisCashe';
import { MemoryCashe } from './memoryCashe';
import NodeCache from 'node-cache';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RedisCashe, MemoryCashe, NodeCache],
  exports: [RedisCashe, MemoryCashe],
})
export class CasheModule {}
