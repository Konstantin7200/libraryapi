import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Comment } from './entities/commentEntity';
import { CreateCommentDto } from '../comments/dto/createComment.dto';
import { PaginationOptions } from '../pagination/paginated.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}
  async findByBook(
    bookOlid: string,
    pagination?: PaginationOptions,
  ): Promise<[Comment[], number]> {
    const result = await this.repo.findAndCount({
      where: { bookOlid },
      relations: { user: true },
      skip: pagination?.skip,
      take: pagination?.take,
    });
    return result;
  }
  async findByUser(
    userId: number,
    pagination?: PaginationOptions,
  ): Promise<[Comment[], number]> {
    const result = await this.repo.findAndCount({
      where: { user: { id: userId } },
      relations: { user: true },
      skip: pagination?.skip,
      take: pagination?.take,
    });
    return result;
  }
  async findById(commentId: number) {
    const result = await this.repo.find({
      where: { id: commentId },
      relations: { user: true },
    });
    return result;
  }
  async createOne(comment: CreateCommentDto, userId: number) {
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
