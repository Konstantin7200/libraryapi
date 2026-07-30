import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/userEntity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}
  async findOne(login: string) {
    const result = await this.repo.findOneBy({ login: login });
    return result;
  }
  createOne(login: string, hashedPassword: string) {
    const user: DeepPartial<User> = {
      login: login,
      hashedPassword: hashedPassword,
    };
    const result = this.repo.save(user);
    return result;
  }
}
