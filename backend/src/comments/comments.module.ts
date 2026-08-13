import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DatabaseModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule],
  controllers: [CommentsController],
  providers: [CommentsService, UserService],
})
export class CommentsModule {}
