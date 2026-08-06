import { Module } from '@nestjs/common';
import { bookApi } from './bookApi';
import { CallQueue } from './callQueue';

@Module({
  providers: [CallQueue, bookApi],
  exports: [bookApi],
})
export class BookApiModule {}
