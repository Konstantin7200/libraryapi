import { Controller, Post, Body, Res, Req, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
import {
  AccessTokenCookie,
  ACCESS_TOKEN_MAX_AGE_SEC,
  RefreshTokenCookie,
  REFRESH_TOKEN_MAX_AGE_SEC,
} from '../constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(authDto);
    setCookies({
      res,
      ...tokens,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
    });
    res.status(HttpStatus.OK).send('OK');
  }

  @Post('/signup')
  async signUp(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signUp(authDto);
    setCookies({
      res,
      ...tokens,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
    });
    res.status(HttpStatus.OK).send('OK');
  }
  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[RefreshTokenCookie] as string | undefined;
    const accessToken = await this.authService.createAccessToken(refreshToken!);
    setCookies({
      res,
      refreshToken: refreshToken!,
      accessToken,
      secure: this.configService.get<boolean>('COOKIE_SECURE', false),
    });
    res.status(HttpStatus.OK).send('OK');
  }
}
type setCookiesParams = {
  res: Response;
  accessToken: string;
  refreshToken: string;
  secure: boolean;
};
function setCookies({
  res,
  accessToken,
  refreshToken,
  secure,
}: setCookiesParams) {
  res.cookie(AccessTokenCookie, accessToken, {
    maxAge: ACCESS_TOKEN_MAX_AGE_SEC * 1000,
    httpOnly: true,
    sameSite: true,
    secure,
  });
  res.cookie(RefreshTokenCookie, refreshToken, {
    maxAge: REFRESH_TOKEN_MAX_AGE_SEC * 1000,
    httpOnly: true,
    sameSite: true,
    secure,
  });
}
