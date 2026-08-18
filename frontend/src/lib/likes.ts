'use server';

import { apiFetch } from './apiWrapper';
import { BookType } from '@/types/BookTypes';
import { Paginated } from '@/types/Paginated';

export async function toggleLike(olid: string) {
  await apiFetch('/likes', {
    method: 'POST',
    body: { bookOlid: olid },
  });
}
export async function getLikedBooks(page = 1): Promise<Paginated<BookType>> {
  const result = await apiFetch(`/likes?page=${page}`);
  const data = (await result.json()) as Paginated<BookType>;
  return data;
}
