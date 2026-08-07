'use server'

import { refresh } from 'next/cache';
import { apiFetch } from './apiWrapper';

export async function toggleLike(olid: string) {
  await apiFetch('/likes', {
    method: 'POST',
    body: { bookOlid: olid },
  });
  refresh();
}