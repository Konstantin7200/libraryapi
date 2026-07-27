import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  login(authDto: AuthDto) {
    return 'This action adds a new auth';
  }
  signUp(authDto: AuthDto) {
    return 'This action adds a new auth';
  }
}
