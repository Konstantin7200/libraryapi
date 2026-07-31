import { Body, Controller, Post, Sse, UseGuards } from '@nestjs/common';
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
  @Sse('manual')
  sendLikes() {
    return this.likesService.likes;
  }
}
