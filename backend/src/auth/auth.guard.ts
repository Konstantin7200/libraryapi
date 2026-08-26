import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenCookie } from '../constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const cookies = req.cookies;
    const accessToken: unknown = cookies[AccessTokenCookie];

    if (typeof accessToken !== 'string') throw new UnauthorizedException();

    const accessPayload = await this.verifyToken(accessToken);
    if (accessPayload === null) throw new UnauthorizedException();
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
      this.logger.warn(err);
      return null;
    }
  }
}
