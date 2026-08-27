import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../db/userRepository';
import { comparePassword, hashPassword } from '../utils/hashFunction';
import { DeepPartial } from 'typeorm';
import { User } from '../db/entities/userEntity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getLogin(userId: number) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user.login;
  }
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!(await comparePassword(currentPassword, user.hashedPassword)))
      throw new BadRequestException('Passwords dont match');
    const updateUser: DeepPartial<User> = {
      id: userId,
      hashedPassword: await hashPassword(newPassword),
    };
    const result = await this.userRepository.updateOne(updateUser);
  }
  async changeLogin(userId: number, newLogin: string) {
    const login = await this.getLogin(userId);
    if (newLogin === login) return;
    const userWithNewLogin = await this.userRepository.findOne(newLogin);
    if (userWithNewLogin !== null && userWithNewLogin.id !== userId)
      throw new BadRequestException('User with this login already exists');
    const updateUser = { id: userId, login: newLogin };
    const result = await this.userRepository.updateOne(updateUser);
  }
}
