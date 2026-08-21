import {
  Controller,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MixedListService } from './mixed-list.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserId } from '../auth/userId.decorator';
import type { BookListStatusWithAll } from '../bookList/dto/bookList.dto';

@Controller('mixed-list')
export class MixedListController {
  constructor(private readonly mixedListService: MixedListService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getMixedList(
    @UserId() userId: number,
    @Query('page', new ParseIntPipe()) page: number,
    @Query('type') type?: BookListStatusWithAll,
    @Query('query') query?: string,
    @Query('liked', new ParseBoolPipe({ optional: true })) liked?: boolean,
  ) {
    const result = await this.mixedListService.getMixedList(
      userId,
      page,
      type,
      liked,
      query,
    );
    return result;
  }
}
