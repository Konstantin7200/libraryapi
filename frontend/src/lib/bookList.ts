'use server';

import { bookListItemType } from '@/types/BookListTypes';
import { apiFetch } from './apiWrapper';
import { BookType } from '@/types/BookTypes';
import { Paginated } from '@/types/Paginated';

export async function addToBookList(olid: string, bookList: bookListItemType) {
  const response = await apiFetch('/book-list', {
    method: 'POST',
    body: { status: bookList, bookOlid: olid },
  });
}

export async function getBookList(
  bookList: bookListItemType,
  page = 1,
): Promise<Paginated<BookType>> {
  const searchString = `?type=${bookList}&page=${page}`;
  const response = await apiFetch(`/book-list${searchString}`);
  const data: Paginated<BookType> = await response.json();
  return data;
}
