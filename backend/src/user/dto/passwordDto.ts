import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;
  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}
