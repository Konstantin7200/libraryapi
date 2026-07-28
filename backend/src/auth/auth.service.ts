import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../db/userRepository';
import { hashFunction } from '../utils/hashFunction';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}
  async login(authDto: AuthDto) {
    const user = await this.userRepository.findOne(authDto.login);
    if (user === null) throw Error('Incorrect login or password');
    if (user.hashedPassword != hashFunction(authDto.password))
      throw Error('Incorrect login or password');
    const payload = {
      id: user.id,
    };
    const result = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return result;
  }
  async signUp(authDto: AuthDto) {
    const user = await this.userRepository.findOne(authDto.login);
    if (user !== null) throw Error('User with this login already exists');
    const createdUser = this.userRepository.createOne(
      authDto.login,
      hashFunction(authDto.password),
    );
    const payload = {
      id: createdUser.id,
    };
    const result = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return result;
  }
}
