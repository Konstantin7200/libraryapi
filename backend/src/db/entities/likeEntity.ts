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
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn()
  user!: User;
  @Column()
  bookOlid!: string;
}
