import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './userEntity';
import { Book } from './bookEntity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  text!: string;
  @Column()
  createdAt!: string;
  @Column()
  updatedAt!: string;
  @ManyToOne(() => Book, (book) => book.comments)
  @JoinColumn()
  book!: Book;
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  user!: User;
}
