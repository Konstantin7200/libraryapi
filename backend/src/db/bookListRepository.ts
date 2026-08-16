import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookListItem } from './entities/bookListItemEntity';
import { BookListStatus } from '../bookList/dto/bookList.dto';

@Injectable()
export class BookListRepository {
  constructor(
    @InjectRepository(BookListItem)
    private readonly repo: Repository<BookListItem>,
  ) {}
  async getByType(userId: number, type: BookListStatus) {
    const result = await this.repo.findBy({
      status: type,
      user: { id: userId },
    });
    return result;
  }
  async getAll(userId: number) {
    const result = await this.repo.findBy({ user: { id: userId } });
    return result;
  }
  async upsertBookToList(
    userId: number,
    bookOlid: string,
    status: BookListStatus,
  ) {
    const result = await this.repo.upsert(
      {
        bookOlid: bookOlid,
        userId: userId,
        status: status,
      },
      ['userId', 'bookOlid'],
    );
    return result;
  }
}
