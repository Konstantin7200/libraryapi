import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
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
  async addBookToList(
    userId: number,
    bookOlid: string,
    status: BookListStatus,
  ) {
    const bookListItem: DeepPartial<BookListItem> = {
      bookOlid: bookOlid,
      user: { id: userId },
      status: status,
    };
    const result = await this.repo.save(bookListItem);
    return result;
  }
}
