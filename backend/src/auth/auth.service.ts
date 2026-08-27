import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../db/userRepository';
import { comparePassword, hashPassword } from '../utils/hashFunction';
import { AccessTokenMaxAge, RefreshTokenMaxAge } from '../constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}
  async login(authDto: AuthDto) {
    const user = await this.userRepository.findOne(authDto.login);
    if (user === null) {
      throw new BadRequestException('Incorrect login or password');
    }
    if (!(await comparePassword(authDto.password, user.hashedPassword)))
      throw new BadRequestException('Incorrect login or password');
    const result = await this.createTokens(user.id);
    return result;
  }
  async signUp(authDto: AuthDto) {
    const user = await this.userRepository.findOne(authDto.login);
    if (user !== null)
      throw new BadRequestException('User with this login already exists');
    const createdUser = await this.userRepository.createOne(
      authDto.login,
      await hashPassword(authDto.password),
    );
    const result = await this.createTokens(createdUser.id);
    return result;
  }
  private async createTokens(id: number) {
    const accessPayload: JwtPayload = {
      id: id,
      exp: Math.floor(Date.now() / 1000) + AccessTokenMaxAge,
    };
    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const refreshPayload: JwtPayload = {
      id: id,
      exp: Math.floor(Date.now() / 1000) + RefreshTokenMaxAge,
    };
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
  async createAccessToken(refreshToken: string) {
    const refreshPayload = await this.verifyToken(refreshToken);
    if (refreshPayload === null) return null;
    const accessPayload: JwtPayload = {
      id: refreshPayload.id,
      exp: Math.floor(Date.now() / 1000) + AccessTokenMaxAge,
    };
    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return accessToken;
  }
  private async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload;
    } catch (err) {
      this.logger.warn(err);
      return null;
    }
  }
}
export type JwtPayload = {
  id: number;
  exp: number;
};
