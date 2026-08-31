export interface CommentDto {
  id: number;
  bookOlid: string;
  login: string;
  text: string;
  mine: boolean;
  updatedAt: string;
}
export interface UserHistoryCommentDto extends CommentDto {
  bookTitle: string;
}
