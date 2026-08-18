import { BookType, ExtendedBookType } from '@/types/BookTypes';
import { apiFetch } from './apiWrapper';

type SearchParam = string | string[] | undefined;



export async function getBooks(
  q:SearchParam,
  page:SearchParam
): Promise<BookType[]> {
  const query = new URLSearchParams();
  if (q) query.set('q', String(q));
  if (page) query.set('page', String(page));

  const response = await apiFetch(`/books?${query.toString()}`);
  return (await response.json()) as BookType[];
}

export async function getBook(olid: string): Promise<ExtendedBookType> {
  const response = await apiFetch(`/books/${olid}`);
  return (await response.json()) as ExtendedBookType;
}
export async function getRandomBooks(page:SearchParam):Promise<BookType[]> {
  const query = new URLSearchParams();
  if (page) query.set('page', String(page));
  const response = await apiFetch(`/books/random?${query.toString()}`);
  return (await response.json()) as BookType[];
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