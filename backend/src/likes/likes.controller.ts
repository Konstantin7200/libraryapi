import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
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
  async getLikesByUser(@UserId() userId: number, @Query('page') page: number) {
    const result = await this.likesService.getLikedBooksByUser(userId, page);
    return result;
  }
  @Sse('sse/:olid')
  sendLikes(@Param('olid') olid: string) {
    return this.likesService.likesSse(olid);
  }
}
