import { Module } from '@nestjs/common';
import { BookApi } from './bookApi';
import { CallQueue } from './callQueue';
import { CasheModule } from '../cashe/cashe.module';

@Module({
  imports: [CasheModule],
  providers: [CallQueue, BookApi],
  exports: [BookApi],
})
export class BookApiModule {}
