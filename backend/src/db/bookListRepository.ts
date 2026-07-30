import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BookListItem } from './entities/bookListItemEntity';
import { User } from './entities/userEntity';
import { BookListStatus } from '../bookList/dto/bookList.dto';

@Injectable()
export class BookListRepository {
  constructor(
    @InjectRepository(BookListItem)
    private readonly repo: Repository<BookListItem>,
  ) {}
  async getByType(user: User, type: BookListStatus) {
    const result = await this.repo.findBy({ status: type, user: user });
    return result;
  }
  async getAll(user: User) {
    const result = await this.repo.findBy({ user: user });
    return result;
  }
  async addBookToList(user: User, bookOlid: string, status: BookListStatus) {
    const bookListItem: DeepPartial<BookListItem> = {
      bookOlid: bookOlid,
      user: user,
      status: status,
    };
    const result = await this.repo.save(bookListItem);
    return result;
  }
}
