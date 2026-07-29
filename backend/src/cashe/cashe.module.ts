import { Module } from '@nestjs/common';
import { RedisCashe } from './redisCashe';
import { Redis } from 'ioredis';

@Module({
  imports: [],
  providers: [
    {
      provide: Redis,
      useFactory: () => new Redis(),
    },
    RedisCashe,
  ],
  exports: [RedisCashe],
})
export class CasheModule {}
