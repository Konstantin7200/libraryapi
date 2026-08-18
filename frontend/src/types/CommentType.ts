type CommentType = {
  text: string;
  bookOlid: string;
  updatedAt: string;
  login: string;
  mine: boolean;
  id: number;
};
type CommentTypeWithTitle = CommentType & {
  bookTitle: string;
};

export type { CommentType, CommentTypeWithTitle };
