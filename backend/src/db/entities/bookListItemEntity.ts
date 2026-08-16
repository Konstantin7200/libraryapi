import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './userEntity';

@Entity()
@Unique(['user', 'bookOlid'])
export class BookListItem {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  status!: 'Want to read' | 'Currently reading' | 'Already read';
  @Column()
  bookOlid!: string;
  @Column()
  userId!: number;
  @ManyToOne(() => User, (user) => user.bookList)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
