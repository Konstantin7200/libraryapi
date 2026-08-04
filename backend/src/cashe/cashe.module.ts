import { Module } from '@nestjs/common';
import { RedisCashe } from './redisCashe';
import { Redis } from 'ioredis';
import { MemoryCashe } from './memoryCashe';
import NodeCache from 'node-cache';

@Module({
  imports: [],
  providers: [
    {
      provide: Redis,
      useFactory: () => new Redis(),
    },
    RedisCashe,
    MemoryCashe,
    NodeCache,
  ],
  exports: [RedisCashe, MemoryCashe],
})
export class CasheModule {}
