type BookType = {
  olid: string;
  coversUrl: string;
  title: string;
  authors: string[];
  liked:boolean;
};
type ExtendedBookType = BookType & {
  description: string;
};

export type { BookType, ExtendedBookType };
