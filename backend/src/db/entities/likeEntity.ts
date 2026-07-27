import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './userEntity';
import { Book } from './bookEntity';

@Entity()
@Unique(['user', 'book'])
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn()
  user!: User;
  @ManyToOne(() => Book, (book) => book.likes)
  @JoinColumn()
  book!: Book;
}
