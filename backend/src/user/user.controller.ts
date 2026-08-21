import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserId } from '../auth/userId.decorator';
import { PasswordDto } from './dto/passwordDto';
import { LoginDto } from './dto/loginDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  @UseGuards(AuthGuard)
  async changeLogin(@UserId() userId: number, @Body() login: LoginDto) {
    await this.userService.changeLogin(userId, login.newLogin);
  }
  @Post('password')
  @UseGuards(AuthGuard)
  async changePassword(
    @UserId() userId: number,
    @Body() password: PasswordDto,
  ) {
    await this.userService.changePassword(
      userId,
      password.currentPassword,
      password.newPassword,
    );
  }
  @Get('login')
  @UseGuards(AuthGuard)
  async getLogin(@UserId() userId: number) {
    const result = await this.userService.getLogin(userId);
    return result;
  }
}
