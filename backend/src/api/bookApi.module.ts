import { Module } from '@nestjs/common';
import { BookApi } from './bookApi';
import { CallQueue } from './callQueue';
import { OpenLibraryClient } from './openLibraryClient';
import { QueuedOpenLibraryClient } from './queuedOpenLibraryClient';
import { CasheModule } from '../cashe/cashe.module';

@Module({
  imports: [CasheModule],
  providers: [CallQueue, OpenLibraryClient, QueuedOpenLibraryClient, BookApi],
  exports: [BookApi],
})
export class BookApiModule {}
