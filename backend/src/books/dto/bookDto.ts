type bookDto = {
  olid: string;
  title: string;
  authors: string[];
  coversUrl: string | null;
  liked: boolean;
};
type extendedBookDto = bookDto & {
  description: string;
  likes: number;
};
export type { bookDto, extendedBookDto };

/*import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Like } from './likeEntity';
import { Comment } from './commentEntity';
import { BookListItem } from './bookListItemEntity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
  olid!: string;
  @Column()
  title!: string;
  @Column({ type: 'simple-array' })
  authors!: string[];
  @Column()
  coversUrl!: string;
  @OneToMany(() => Like, (like) => like.book)
  likes!: Like[];
  @OneToMany(() => Comment, (comment) => comment.book)
  comments!: Comment[];
  @OneToMany(() => BookListItem, (bookListItem) => bookListItem.book)
  bookList!: BookListItem[];
}
*/
