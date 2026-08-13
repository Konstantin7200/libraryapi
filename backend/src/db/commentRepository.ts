import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Comment } from './entities/commentEntity';
import { createCommentDto } from '../comments/dto/createComment.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}
  async findByBook(bookOlid: string) {
    const result = await this.repo.find({
      where: { bookOlid },
      relations: { user: true },
    });
    return result;
  }
  async findByUser(userId: number) {
    const result = await this.repo.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    return result;
  }
  async findById(commentId: number) {
    const result = await this.repo.findOneBy({ id: commentId });
    return result;
  }
  async createOne(comment: createCommentDto, userId: number) {
    const commentToSave: DeepPartial<Comment> = {
      text: comment.text,
      bookOlid: comment.bookOlid,
      user: { id: userId },
    };
    const result = await this.repo.save(commentToSave);
    return result;
  }
  async updateOne(commentText: string, commentId: number) {
    const result = await this.repo.update(
      { id: commentId },
      { text: commentText },
    );
    return result;
  }
  async deleteOne(comment: Comment) {
    const result = await this.repo.remove([comment]);
    return result;
  }
}
