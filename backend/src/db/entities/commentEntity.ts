import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './userEntity';
import { Book } from './bookEntity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  text!: string;
  @CreateDateColumn()
  createdAt!: string;
  @UpdateDateColumn()
  updatedAt!: string;
  @ManyToOne(() => Book, (book) => book.comments)
  @JoinColumn()
  book!: Book;
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  user!: User;
}
