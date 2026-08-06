type BookType = {
  olid: string;
  coversUrl: string;
  title: string;
  authors: string[];
};
type ExtendedBookType=BookType&{
  description:string
}

export type { BookType,ExtendedBookType };
