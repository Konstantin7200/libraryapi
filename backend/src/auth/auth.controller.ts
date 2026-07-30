import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { Response } from 'express';
import {
  AccessTokenCookie,
  AccessTokenMaxAge,
  RefreshTokenCookie,
  RefreshTokenMaxAge,
} from '../constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() authDto: AuthDto, @Res() res: Response) {
    const tokens = await this.authService.login(authDto);
    setCookies({ res, ...tokens });
    res.status(200).json(tokens);
  }

  @Post('/signup')
  async signUp(@Body() authDto: AuthDto, @Res() res: Response) {
    const tokens = await this.authService.signUp(authDto);
    setCookies({ res, ...tokens });
    res.status(200).json(tokens);
  }
  @Post('/refresh')
  async refresh(@Res() res: Response) {
    const refreshToken: unknown = (
      res.req.cookies as { [RefreshTokenCookie]: any }
    )[RefreshTokenCookie];
    if (typeof refreshToken === 'string') {
      const accessToken =
        await this.authService.createAccessToken(refreshToken);
      if (accessToken === null) return res.status(401).send('Unauthorized');
      setCookies({ res, refreshToken, accessToken });
      return res.status(200).send('OK');
    }
    return res.status(401).send('Unauthorized');
  }
}
type setCookiesParams = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};
function setCookies({ res, accessToken, refreshToken }: setCookiesParams) {
  res.cookie(AccessTokenCookie, accessToken, {
    maxAge: AccessTokenMaxAge,
    httpOnly: true,
    sameSite: true,
    secure: true,
  });
  res.cookie(RefreshTokenCookie, refreshToken, {
    maxAge: RefreshTokenMaxAge,
    httpOnly: true,
    sameSite: true,
    secure: true,
  });
}
