import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Like } from './likeEntity';
import { Comment } from './commentEntity';
import { BookListItem } from './bookListItemEntity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
  login!: string;
  @Column()
  hashedPassword!: string;
  @CreateDateColumn()
  createdAt!: Date;
  @OneToMany(() => Like, (like) => like.user)
  likes!: Like[];
  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];
  @OneToMany(() => BookListItem, (bookListItem) => bookListItem.user)
  bookList!: BookListItem[];
}
