import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Comment } from './entities/commentEntity';
import { commentDto } from '../comments/dto/comment.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}
  async findByBook(bookOlid: string) {
    const result = await this.repo.findBy({ bookOlid: bookOlid });
    return result;
  }
  async findByUser(userId: number) {
    const result = await this.repo.findBy({ user: { id: userId } });
    return result;
  }
  async createOne(comment: commentDto, userId: number) {
    const commentToSave: DeepPartial<Comment> = {
      id: 1,
      text: comment.text,
      bookOlid: comment.bookOlid,
      user: { id: userId },
    };
    const result = await this.repo.save(commentToSave);
    return result;
  }
}
