'use server';

import { bookListItemType } from '@/types/BookListTypes';
import { apiFetch } from './apiWrapper';
import { BookType } from '@/types/BookTypes';
import { Paginated } from '@/types/Paginated';

export async function addToBookList(olid: string, bookList: bookListItemType) {
  await apiFetch('/book-list', {
    method: 'POST',
    body: { status: bookList, bookOlid: olid },
  });
}

export async function getBookList(
  bookList: bookListItemType,
  page = 1,
): Promise<Paginated<BookType>> {
  const searchString = `?type=${bookList}&page=${page}`;
  const { data } = await apiFetch<Paginated<BookType>>(
    `/book-list${searchString}`,
  );
  return data;
}