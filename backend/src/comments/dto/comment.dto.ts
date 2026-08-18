type commentDto = {
  id: number;
  bookOlid: string;
  login: string;
  text: string;
  mine: boolean;
  updatedAt: string;
};
type UserHistoryCommentDto = commentDto & {
  bookTitle: string;
};
export type { commentDto, UserHistoryCommentDto };
