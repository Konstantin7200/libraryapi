import { CommentType } from '@/types/CommentType';
import { apiFetch } from './apiWrapper';

export async function getCommentByOlid(olid: string) {
  const result = await apiFetch(`/comments?olid=${olid}`);
  const data = await result.json();
  return data as CommentType[];
}
export async function updateComment(id: number, text: string) {
  await apiFetch('/comments', {
    method: 'PUT',
    body: {
      id: id,
      text: text,
    },
  });
}
export async function deleteComment(id: number) {
  await apiFetch(`/comments/${id}`, { method: 'DELETE' });
}

export async function createComment(olid: string, text: string) {
  const response=await apiFetch('/comments', {
    method: 'POST',
    body: { bookOlid: olid, text: text },
  });
  console.log(response)
}