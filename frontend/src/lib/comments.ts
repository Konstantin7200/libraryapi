import { EnvConfig } from '@/constants';
import { CommentType } from '@/types/CommentType';
import { cookies } from 'next/headers';

export async function getCommentByOlid(olid: string) {
  const cookieHeader = (await cookies()).toString();
  const result = await fetch(`${EnvConfig.API_BASE}/comments?olid=${olid}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });
  const data = await result.json();
  return data as CommentType[];
}

export async function createComment(olid: string, text: string) {
  const cookieHeader = (await cookies()).toString();
  const result = await fetch(`${EnvConfig.API_BASE}/comments`, {
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({ bookOlid: olid, text: text }),
    method: 'POST',
  });
}
