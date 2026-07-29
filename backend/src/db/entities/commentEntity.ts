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
  @Column()
  bookOlid!: string;
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  user!: User;
}
