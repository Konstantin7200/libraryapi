import { CommentType, CommentTypeWithTitle } from '@/types/CommentType';
import { Paginated } from '@/types/Paginated';
import { apiFetch } from './apiWrapper';

export async function getCommentByOlid(olid: string, page = 1): Promise<Paginated<CommentType>> {
  const result = await apiFetch(`/comments?olid=${olid}&page=${page}`);
  const data = await result.json();
  return data as Paginated<CommentType>;
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
export async function getMyComments(page=1): Promise<Paginated<CommentTypeWithTitle>>{
  const result=await apiFetch(`/comments/mine?page=${page}`)
  const data= await result.json();
  return data as Paginated<CommentTypeWithTitle>;
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