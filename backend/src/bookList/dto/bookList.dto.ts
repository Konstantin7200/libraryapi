import { IsIn, IsNotEmpty, IsString } from 'class-validator';

type BookListStatus = 'Want to read' | 'Currently reading' | 'Already read';
type BookListStatusWithAll = BookListStatus | 'All';
const BookListStatusValues: BookListStatus[] = [
  'Want to read',
  'Currently reading',
  'Already read',
];
class BookListItemDto {
  @IsIn(BookListStatusValues)
  status!: BookListStatus;
  @IsNotEmpty()
  @IsString()
  bookOlid!: string;
}

export { BookListItemDto };
export type { BookListStatus, BookListStatusWithAll };
