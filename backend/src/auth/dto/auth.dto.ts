import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  login: string;
  @IsNotEmpty()
  @IsString()
  password: string;

  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }
}
