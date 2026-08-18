type BookType = {
  olid: string;
  coversUrl: string | null;
  title: string;
  authors: string[];
  liked: boolean;
};
type ExtendedBookType = BookType & {
  description: string;
  likes: number;
};

export type { BookType, ExtendedBookType };
