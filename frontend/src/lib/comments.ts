import { CommentType, CommentTypeWithTitle } from '@/types/CommentType';
import { Paginated } from '@/types/Paginated';
import { apiFetch } from './apiWrapper';

export async function getCommentByOlid(
  olid: string,
  page = 1,
): Promise<Paginated<CommentType>> {
  const { data } = await apiFetch<Paginated<CommentType>>(
    `/comments?olid=${olid}&page=${page}`,
  );
  return data;
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
export async function getMyComments(
  page = 1,
): Promise<Paginated<CommentTypeWithTitle>> {
  const { data } = await apiFetch<Paginated<CommentTypeWithTitle>>(
    `/comments/mine?page=${page}`,
  );
  return data;
}
export async function deleteComment(id: number) {
  await apiFetch(`/comments/${id}`, { method: 'DELETE' });
}

export async function createComment(olid: string, text: string) {
  await apiFetch('/comments', {
    method: 'POST',
    body: { bookOlid: olid, text: text },
  });
}