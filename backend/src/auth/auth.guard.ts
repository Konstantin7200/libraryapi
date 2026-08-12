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
    const req = context.switchToHttp().getRequest<Request>();
    const cookies = req.cookies;
    const accessToken: unknown = cookies[AccessTokenCookie];

    if (typeof accessToken !== 'string') return false;

    const accessPayload = await this.verifyToken(accessToken);
    if (accessPayload === null) return false;
    Object.defineProperty(req, 'userId', { value: accessPayload.id });
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
