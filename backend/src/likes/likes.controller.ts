import { Body, Controller, Get, Post, Sse, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import type { LikeDto } from './dto/like.dto';
import { UserId } from '../auth/userId.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @Post()
  @UseGuards(AuthGuard)
  async toggleLike(@Body() like: LikeDto, @UserId() userId) {
    const result = await this.likesService.toggleLike(like.bookOlid, userId);
    await this.likesService.likesChanged(like.bookOlid);
    return result;
  }
  @Get()
  @UseGuards(AuthGuard)
  async getLikesByUser(@UserId() userId: number) {
    const result = await this.likesService.getLikedBooksByUser(userId);
    return result;
  }
  @Sse('manual')
  sendLikes() {
    return this.likesService.likes;
  }
}
