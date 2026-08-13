import { Injectable } from '@nestjs/common';
import { UserRepository } from '../db/userRepository';
import { hashFunction } from '../utils/hashFunction';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getLogin(userId: number) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw Error('User not found');
    return user?.login;
  }
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw Error('User not found');
    if (user.hashedPassword != hashFunction(currentPassword))
      throw Error('Passwords dont match');
    const updateUser = { id: userId, password: newPassword };
    const result = await this.userRepository.updateOne(updateUser);
  }
  async changeLogin(userId: number, newLogin: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw Error('User not found');
    if (newLogin === user.login) return;
    const userWithNewLogin = this.userRepository.findOne(newLogin);
    if (userWithNewLogin !== null)
      throw Error('User with this login already exists');
    const updateUser = { id: userId, login: newLogin };
    const result = await this.userRepository.updateOne(updateUser);
  }
}
