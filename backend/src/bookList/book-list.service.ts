import { Injectable } from '@nestjs/common';
import { BookListStatus } from './dto/bookList.dto';
import { UserRepository } from '../db/userRepository';
import { BookListRepository } from '../db/bookListRepository';

@Injectable()
export class BookListService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bookListRepository: BookListRepository,
  ) {}
  async getBookList(userId: number, type: BookListStatus | undefined) {
    const user = await this.userRepository.findOneById(userId);
    if (user === null) throw new Error('User is null');
    if (type === undefined) {
      const result = await this.bookListRepository.getAll(user);
      return result;
    } else {
      const result = await this.bookListRepository.getByType(user, type);
      return result;
    }
  }
  async addBookToList(userId: number, bookOlid: string, type: BookListStatus) {
    const user = await this.userRepository.findOneById(userId);
    if (user === null) throw new Error('User is null');
    const result = await this.bookListRepository.addBookToList(
      user,
      bookOlid,
      type,
    );
    return result;
  }
}
