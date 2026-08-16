'use server'

import { apiFetch } from './apiWrapper';
import { BookType } from '@/types/BookTypes';

export async function toggleLike(olid: string) {
  await apiFetch('/likes', {
    method: 'POST',
    body: { bookOlid: olid },
  });
}
export async function getLikedBooks() {
  const result=await apiFetch('/likes'); 
  const data=await result.json() as BookType[]
  return data
}