import { Module } from '@nestjs/common';
import { bookApi } from './bookApi';
import { CallQueue } from './callQueue';
import { CasheModule } from '../cashe/cashe.module';

@Module({
  imports: [CasheModule],
  providers: [CallQueue, bookApi],
  exports: [bookApi],
})
export class BookApiModule {}
