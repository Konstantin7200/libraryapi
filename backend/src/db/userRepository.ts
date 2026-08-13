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
  async findOneById(userId: number) {
    const result = await this.repo.findOneBy({ id: userId });
    return result;
  }
  async updateOne(user: DeepPartial<User>) {
    const result = await this.repo.update({ id: user.id }, user);
    return result;
  }
  async createOne(login: string, hashedPassword: string) {
    const user: DeepPartial<User> = {
      login: login,
      hashedPassword: hashedPassword,
    };
    const result = await this.repo.save(user);
    return result;
  }
}
