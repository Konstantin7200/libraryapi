'use server'

import { refresh } from 'next/cache';
import {
  deleteComment as deleteCommentInLib,
  updateComment as updateCommentInLib,
} from '@/lib/comments';

export async function updateComment(id: number, formData: FormData) {
  const text = formData.get('text');
  if (typeof text === 'string' && text.trim()) {
    await updateCommentInLib(id, text);
    refresh();
  }
}

export async function deleteComment(id: number) {
  await deleteCommentInLib(id);
  refresh();
}