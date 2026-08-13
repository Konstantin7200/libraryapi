import { BookType, ExtendedBookType } from '@/types/BookTypes';
import { apiFetch } from './apiWrapper';

type SearchParam = string | string[] | undefined;

interface GetBooksParams {
  title?: SearchParam;
  author?: SearchParam;
  page?: SearchParam;
}

export async function getBooks(
  params: GetBooksParams = {},
): Promise<BookType[]> {
  const query = new URLSearchParams();
  if (params.title) query.set('title', String(params.title));
  if (params.author) query.set('author', String(params.author));
  if (params.page) query.set('page', String(params.page));

  const response = await apiFetch(`/books?${query.toString()}`);
  return (await response.json()) as BookType[];
}

export async function getBook(olid: string): Promise<ExtendedBookType> {
  const response = await apiFetch(`/books/${olid}`);
  return (await response.json()) as ExtendedBookType;
}
export async function getFakeBook(olid:string):Promise<ExtendedBookType>{
  const fakeBook:ExtendedBookType={
    olid:olid,
    coversUrl:"https://covers.openlibrary.org/b/isbn/9780385533225-L.jpg",
    title:"Harry potter",
    authors:["Some dudes"],
    liked:false,
    likes:12,
    description:"super puper book"
  }
  return fakeBook;
}