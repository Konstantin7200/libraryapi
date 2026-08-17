import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookListItem } from './entities/bookListItemEntity';
import { BookListStatus } from '../bookList/dto/bookList.dto';
import { PaginationOptions } from '../pagination/paginated.dto';

@Injectable()
export class BookListRepository {
  constructor(
    @InjectRepository(BookListItem)
    private readonly repo: Repository<BookListItem>,
  ) {}
  async getByType(
    userId: number,
    type: BookListStatus,
    pagination?: PaginationOptions,
  ): Promise<[BookListItem[], number]> {
    const result = await this.repo.findAndCount({
      where: {
        status: type,
        user: { id: userId },
      },
      skip: pagination?.skip,
      take: pagination?.take,
    });
    return result;
  }
  async getAll(
    userId: number,
    pagination?: PaginationOptions,
  ): Promise<[BookListItem[], number]> {
    const result = await this.repo.findAndCount({
      where: { user: { id: userId } },
      skip: pagination?.skip,
      take: pagination?.take,
    });
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
