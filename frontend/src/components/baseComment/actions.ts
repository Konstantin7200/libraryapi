'use server';

import { refresh } from 'next/cache';
import {
  deleteComment as deleteCommentInLib,
  updateComment as updateCommentInLib,
} from '@/lib/comments';
import { ApiError } from '@/lib/ApiError';

type ActionResult = { error: string } | { success: true };

export async function updateComment(id: number, formData: FormData): Promise<ActionResult> {
  const text = formData.get('text');
  if (typeof text !== 'string' || !text.trim()) {
    return { error: 'Comment text is required' };
  }
  try {
    await updateCommentInLib(id, text);
    refresh();
    return { success: true };
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    return { error: 'Failed to update comment' };
  }
}

export async function deleteComment(id: number): Promise<ActionResult> {
  try {
    await deleteCommentInLib(id);
    refresh();
    return { success: true };
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    return { error: 'Failed to delete comment' };
  }
}
