type BookListItem = BookListItemDto & {
  userId: number;
};
type BookListItemDto = {
  status: BookListStatus;
  bookOlid: string;
};
type BookListStatus = 'Want to read' | 'Currently reading' | 'Already read';
type BookListStatusWithAll = BookListStatus | 'All';
export type {
  BookListItem,
  BookListItemDto,
  BookListStatus,
  BookListStatusWithAll,
};
