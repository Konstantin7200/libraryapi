import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Book } from './bookEntity';
import { User } from './userEntity';

@Entity()
@Unique(['user', 'book'])
export class BookListItem {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  status!: 'Want to read' | 'Currently reading' | 'Already read';
  @ManyToOne(() => Book, (book) => book.bookList)
  @JoinColumn()
  book!: Book;
  @ManyToOne(() => User, (user) => user.bookList)
  @JoinColumn()
  user!: User;
}
