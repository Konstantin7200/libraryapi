import { BookType, ExtendedBookType } from '@/types/BookTypes';
import { Paginated } from '@/types/Paginated';
import { apiFetch } from './apiWrapper';

type SearchParam = string | string[] | undefined;

export async function getBooks(
  q: SearchParam,
  page: SearchParam,
): Promise<Paginated<BookType>> {
  const query = new URLSearchParams();
  if (q) query.set('q', String(q));
  if (page) query.set('page', String(page));

  const { data } = await apiFetch<Paginated<BookType>>(
    `/books?${query.toString()}`,
  );
  return data;
}

export async function getBook(olid: string): Promise<ExtendedBookType> {
  const { data } = await apiFetch<ExtendedBookType>(`/books/${olid}`);
  return data;
}
export async function getRandomBooks(
  page: SearchParam,
): Promise<Paginated<BookType>> {
  const query = new URLSearchParams();
  if (page) query.set('page', String(page));
  const { data } = await apiFetch<Paginated<BookType>>(
    `/books/random?${query.toString()}`,
  );
  return data;
}
export async function getFakeBook(olid: string): Promise<ExtendedBookType> {
  const fakeBook: ExtendedBookType = {
    olid: olid,
    coversUrl: 'https://covers.openlibrary.org/b/isbn/9780385533225-L.jpg',
    title: 'Harry potter',
    authors: ['Some dudes'],
    liked: false,
    likes: 12,
    description: 'super puper book',
  };
  return fakeBook;
}