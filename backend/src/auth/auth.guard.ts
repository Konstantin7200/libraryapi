import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenCookie } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const cookies = context.switchToHttp().getRequest<Request>().cookies;
    const accessToken: unknown = cookies[AccessTokenCookie];

    if (typeof accessToken !== 'string') throw new Error('Access denied');

    const accessPayload = await this.verifyToken(accessToken);
    if (accessPayload === null) return false;
    return true;
  }
  private async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
